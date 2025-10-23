import Persona from "../models/personaModel.js";
import RolPersona from "../models/rolPersonaModel.js";
import Rol from "../models/rolModel.js";
import { errorTypes } from "../middlewares/errorHandler.js";

// Obtener todas las personas
export const getAllPersonas = async (req, res, next) => {
    try {
        const personas = await Persona.findAll();
        console.log(`  Enviando respuesta con ${personas.length} personas`);
        res.status(200).json({
            status: "success",
            count: personas.length,
            data: personas
        });
    } catch (error) {
        console.error("  Error en getAllPersonas:", error);
        next(errorTypes.ServerError("Error al obtener la lista de personas"));
    }
};

// Obtener persona por ID
export const getPersonaById = async (req, res, next) => {
    try {
        const persona = await Persona.findById(req.params.id);
        if (!persona) {
            throw errorTypes.NotFoundError("Persona no encontrada");
        }
        res.status(200).json({
            status: "success",
            data: persona
        });
    } catch (error) {
        console.error("  Error en getPersonaById:", error);
        next(error);
    }
};

// Obtener persona por cédula
export const getPersonaByCedula = async (req, res, next) => {
    try {
        const persona = await Persona.findByCedula(req.params.cedula);
        if (!persona) {
            throw errorTypes.NotFoundError("Persona no encontrada por cédula");
        }
        res.status(200).json({
            status: "success",
            data: persona
        });
    } catch (error) {
        console.error("Error en getPersonaByCedula:", error);
        next(error);
    }
};


import db from "../Conf/dbTasandino.js";

//  Crear persona y asignar rol
export const createPersona = async (req, res, next) => {
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();
        const personaData = req.body;

        console.log('Datos recibidos:', personaData);

       // Validación de campos obligatorios
        if (!personaData.nombreCompleto || !personaData.apellidoCompleto || !personaData.cedula) {
            throw errorTypes.ValidationError("Los campos nombreCompleto, apellidoCompleto y cedula son obligatorios");
        }

        // Insertar persona
        const insertPersonaQuery = `
            INSERT INTO Persona (
                nombreCompleto, apellidoCompleto, direccion, cedula,
                telefono, correo, fechaNacimiento
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        console.log('Ejecutando query de inserción...');
        
        const [result] = await connection.execute(insertPersonaQuery, [
            personaData.nombreCompleto,
            personaData.apellidoCompleto,
            personaData.direccion || null,
            personaData.cedula,
            personaData.telefono || null,
            personaData.correo || null,
            personaData.fechaNacimiento || null
        ]);

        if (!result.insertId) {
            throw errorTypes.ServerError("No se pudo crear la persona");
        }

        console.log('Persona creada con ID:', result.insertId);

        // Insertar rol si se proporciona
        if (personaData.roles) {
            console.log("Buscando rol:", personaData.roles);
            
            const rolObj = await Rol.findByNombre(personaData.roles);
            if (!rolObj) {
                throw errorTypes.ValidationError(`El rol "${personaData.roles}" no existe`);
            }
            
            console.log("Rol encontrado:", rolObj);
            await RolPersona.create(result.insertId, rolObj.idRol, connection);
            console.log("Rol asignado correctamente");
        }

        await connection.commit();
        console.log("Transacción completada");

        // Devolver persona creada con roles
        const [personas] = await connection.execute(`
            SELECT 
                p.*,
                GROUP_CONCAT(r.nombre SEPARATOR ', ') as roles
            FROM Persona p
            LEFT JOIN RolPersona rp ON p.idPersona = rp.idPersona
            LEFT JOIN Rol r ON rp.idRol = r.idRol
            WHERE p.idPersona = ?
            GROUP BY p.idPersona
        `, [result.insertId]);

        const personaCreada = personas[0] || {};
        
        console.log("Persona recuperada:", personaCreada);

        res.status(201).json({
            status: "success",
            message: "Persona creada exitosamente",
            data: personaCreada
        });
    } catch (error) {
        console.error("Error en createPersona:", error);
        
        if (connection) {
            try {
                await connection.rollback();
                console.log("Rollback completado");
            } catch (rollbackError) {
                console.error("Error en rollback:", rollbackError);
            }
        }

        if (error.code === "ER_DUP_ENTRY") {
            return next(errorTypes.ConflictError("Ya existe una persona con esta cédula"));
        } 
        
        if (error.name === 'ValidationError') {
            return next(error);
        }

        return next(errorTypes.ServerError(error.message || "Error al crear la persona"));
    } finally {
        if (connection) {
            try {
                connection.release();
                console.log("Conexión liberada");
            } catch (releaseError) {
                console.error("Error al liberar la conexión:", releaseError);
            }
        }
    }
};

// Actualizar persona
export const updatePersona = async (req, res, next) => {
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        const { id } = req.params;
        const { nombreCompleto, apellidoCompleto, cedula, roles, ...otherData } = req.body;

        // Validar campos requeridos
        if (!nombreCompleto || !apellidoCompleto || !cedula) {
            throw errorTypes.ValidationError("Los campos nombreCompleto, apellidoCompleto y cedula son requeridos");
        }

        // Actualizar datos básicos de la persona
        const personaData = {
            nombreCompleto,
            apellidoCompleto,
            cedula,
            ...otherData
        };

        const [updateResult] = await connection.query(
            "UPDATE Persona SET ? WHERE idPersona = ?",
            [personaData, id]
        );

        if (updateResult.affectedRows === 0) {
            throw errorTypes.NotFoundError("Persona no encontrada");
        }

        // Si se proporciona un nuevo rol, actualizar la relación en RolPersona
        if (roles) {
            console.log("Iniciando actualización de rol para persona:", id);
            
            // Primero, verificar si el rol existe
            const rolObj = await Rol.findByNombre(roles);
            if (!rolObj) {
                throw errorTypes.ValidationError(`El rol "${roles}" no existe`);
            }
            console.log("Rol encontrado:", rolObj);

            // Obtener todas las relaciones actuales de rol-persona para diagnóstico
            const [currentRoles] = await connection.execute(
                "SELECT idRolPersona, idRol FROM RolPersona WHERE idPersona = ?",
                [id]
            );
            console.log("Roles actuales encontrados:", currentRoles);

            if (currentRoles.length > 0) {
                // Actualizar usando el idRolPersona específico
                const idRolPersona = currentRoles[0].idRolPersona;
                console.log(`Actualizando rol existente. idRolPersona: ${idRolPersona}, nuevo idRol: ${rolObj.idRol}`);
                
                await connection.execute(
                    "UPDATE RolPersona SET idRol = ? WHERE idRolPersona = ?",
                    [rolObj.idRol, idRolPersona]
                );
            } else {
                console.log("No se encontraron roles existentes, creando nuevo registro");
                await connection.execute(
                    "INSERT INTO RolPersona (idPersona, idRol) VALUES (?, ?)",
                    [id, rolObj.idRol]
                );
            }

            // Verificar el resultado después de la actualización
            const [updatedRoles] = await connection.execute(
                "SELECT idRolPersona, idRol FROM RolPersona WHERE idPersona = ?",
                [id]
            );
            console.log("Estado final de roles:", updatedRoles);
        }

        await connection.commit();

        // Obtener la persona actualizada con sus roles
        const [personas] = await connection.execute(`
            SELECT 
                p.*,
                GROUP_CONCAT(r.nombre SEPARATOR ', ') as roles
            FROM Persona p
            LEFT JOIN RolPersona rp ON p.idPersona = rp.idPersona
            LEFT JOIN Rol r ON rp.idRol = r.idRol
            WHERE p.idPersona = ?
            GROUP BY p.idPersona
        `, [id]);

        res.status(200).json({
            status: "success",
            message: "Persona actualizada exitosamente",
            data: personas[0]
        });
    } catch (error) {
        console.error("Error en updatePersona:", error);
        if (connection) {
            try {
                await connection.rollback();
                console.log("Rollback completado");
            } catch (rollbackError) {
                console.error("Error en rollback:", rollbackError);
            }
        }

        if (error.code === "ER_DUP_ENTRY") {
            return next(errorTypes.ConflictError("Ya existe una persona con esta cédula"));
        }
        
        next(error);
    } finally {
        if (connection) {
            try {
                connection.release();
                console.log("Conexión liberada");
            } catch (releaseError) {
                console.error("Error al liberar la conexión:", releaseError);
            }
        }
    }
};

// Eliminar persona
export const deletePersona = async (req, res, next) => {
    try {
        const result = await Persona.delete(req.params.id);
        if (result === 0) {
            throw errorTypes.NotFoundError("Persona no encontrada");
        }

        res.status(200).json({
            status: "success",
            message: "Persona eliminada exitosamente"
        });
    } catch (error) {
        console.error("  Error en deletePersona:", error);
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            next(errorTypes.ConflictError("No se puede eliminar la persona porque está siendo utilizada en otra tabla"));
        } else {
            next(error);
        }
    }
};

// Buscar personas por nombre de rol
export const getPersonasByRol = async (req, res, next) => {
    try {
        const personas = await Persona.findByRol(req.params.nombreRol);
        if (!personas || personas.length === 0) {
            throw errorTypes.NotFoundError("No se encontraron personas con ese rol");
        }

        res.status(200).json({
            status: "success",
            count: personas.length,
            data: personas
        });
    } catch (error) {
        console.error("  Error en getPersonasByRol:", error);
        next(error);
    }
};

// Actualizar roles de una persona
export const updateRolesPersona = async (req, res, next) => {
    try {
        const { roles } = req.body;

        if (!Array.isArray(roles) || roles.length === 0) {
            throw errorTypes.ValidationError("Debes enviar un arreglo de roles válidos");
        }

        const result = await Persona.updateRoles(req.params.id, roles);

        res.status(200).json({
            status: "success",
            message: "Roles de la persona actualizados correctamente",
            data: result
        });
    } catch (error) {
        console.error("  Error en updateRolesPersona:", error);
        next(error);
    }
};
