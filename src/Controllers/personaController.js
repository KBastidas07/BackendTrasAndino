// Controlador para la gestión de personas


import Persona from "../models/personaModel.js";
import { errorTypes } from "../middlewares/errorHandler.js";

// Constantes
const ROLES_VALIDOS = ["ASOCIADO", "CONDUCTOR", "EMPLEADO"];

// Funciones de validación

//validacion de cedula
const validarCedula = (cedula) => {
    const cedulaRegex = /^\d{8,12}$/;
    if (!cedulaRegex.test(cedula)) {
        throw errorTypes.ValidationError("La cédula debe contener solo números y tener entre 8 y 12 dígitos");
    }
    return true;
};

//validacion de telefono
const validarTelefono = (telefono) => {
    if (!telefono) return true; // Campo opcional
    const telefonoRegex = /^\d{10}$/;
    if (!telefonoRegex.test(telefono)) {
        throw errorTypes.ValidationError("El teléfono debe contener exactamente 10 dígitos numéricos");
    }
    return true;
};

//validacion de correo
const validarCorreo = (correo) => {
    if (!correo) return true; // Campo opcional
    const correoRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!correoRegex.test(correo)) {
        throw errorTypes.ValidationError("El correo electrónico no tiene un formato válido");
    }
    return true;
};

//validacion de nombre
const validarNombre = (nombre, campo) => {
    if (!nombre || nombre.trim().length < 2) {
        throw errorTypes.ValidationError(`El ${campo} debe tener al menos 2 caracteres`);
    }
    const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!nombreRegex.test(nombre)) {
        throw errorTypes.ValidationError(`El ${campo} solo debe contener letras y espacios`);
    }
    return true;
};

//validacion de fecha de cumpleaños
const validarFechaCumpleanos = (fecha) => {
    if (!fecha) return true; // Campo opcional
    const fechaObj = new Date(fecha);
    const hoy = new Date();
    
    if (isNaN(fechaObj.getTime())) {
        throw errorTypes.ValidationError("La fecha de cumpleaños no es válida");
    }
    
    if (fechaObj > hoy) {
        throw errorTypes.ValidationError("La fecha de cumpleaños no puede ser futura");
    }
    
    const edad = hoy.getFullYear() - fechaObj.getFullYear();
    if (edad > 100) {
        throw errorTypes.ValidationError("La edad no puede ser mayor a 100 años");
    }
    
    return true;
};


//Obtiene todas las personas
export const getAllPersonas = async (req, res, next) => {
    try {
        const personas = await Persona.findAll();
        console.log(`  Enviando respuesta con ${personas.length} personas`);
        res.status(200).json({
            status: "success",
            count: personas.length,
            data: personas,
        });
    } catch (error) {
        console.error('  Error en getAllPersonas:', error);
        next(errorTypes.ServerError("Error al obtener las personas"));
    }
};

//Busca una persona por su ID
export const getPersonaById = async (req, res, next) => {
    try {
        const persona = await Persona.findById(req.params.id);
        if (!persona) {
            throw errorTypes.NotFoundError("Persona no encontrada");
        }
        res.status(200).json({
            status: "success",
            data: persona,
        });
    } catch (error) {
        next(error);
    }
};

//Busca una persona por su número de cédula
export const getPersonaByCedula = async (req, res, next) => {
    try {
        const persona = await Persona.findByCedula(req.params.cedula);
        if (!persona) {
            throw errorTypes.NotFoundError("Persona no encontrada");
        }
        res.status(200).json({
            status: "success",
            data: persona,
        });
    } catch (error) {
        next(error);
    }
};

//Crea una nueva persona
export const createPersona = async (req, res, next) => {
    console.log("📩 Datos recibidos en createPersona:", req.body);
    try {
        const { 
            nombre_completo, 
            apellido_completo, 
            cedula, 
            rol,
            telefono,
            correo,
            fecha_cumpleanos 
        } = req.body;

        // Validar campos requeridos
        if (!nombre_completo || !apellido_completo || !cedula) {
            throw errorTypes.ValidationError("Nombre completo, apellido completo y cédula son campos requeridos");
        }

        // Validaciones de formato
        validarNombre(nombre_completo, "nombre completo");
        validarNombre(apellido_completo, "apellido completo");
        validarCedula(cedula);
        
        // Validaciones de campos opcionales
        if (rol) {
            if (!ROLES_VALIDOS.includes(rol)) {
                throw errorTypes.ValidationError("Rol no válido. Debe ser ASOCIADO, CONDUCTOR o EMPLEADO");
            }
        }
        
        if (telefono) validarTelefono(telefono);
        if (correo) validarCorreo(correo);
        if (fecha_cumpleanos) validarFechaCumpleanos(fecha_cumpleanos);

        const result = await Persona.create(req.body);
        res.status(201).json({
            status: "success",
            message: "Persona creada exitosamente",
            data: {
                id: result.insertId,
            },
        });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            next(errorTypes.ConflictError("Ya existe una persona con esta cédula"));
        } else {
            next(error);
        }
    }
};

//Actualiza una persona existente
export const updatePersona = async (req, res, next) => {
    try {
        const { 
            nombre_completo, 
            apellido_completo, 
            cedula, 
            rol,
            telefono,
            correo,
            fecha_cumpleanos 
        } = req.body;

        // Validaciones de campos si están presentes en la actualización
        if (nombre_completo) validarNombre(nombre_completo, "nombre completo");
        if (apellido_completo) validarNombre(apellido_completo, "apellido completo");
        if (cedula) validarCedula(cedula);
        if (rol) {
            if (!ROLES_VALIDOS.includes(rol)) {
                throw errorTypes.ValidationError("Rol no válido. Debe ser ASOCIADO, CONDUCTOR o EMPLEADO");
            }
        }
        if (telefono) validarTelefono(telefono);
        if (correo) validarCorreo(correo);
        if (fecha_cumpleanos) validarFechaCumpleanos(fecha_cumpleanos);

        const result = await Persona.update(req.params.id, req.body);
        if (result.affectedRows === 0) {
            throw errorTypes.NotFoundError("Persona no encontrada");
        }

        res.status(200).json({
            status: "success",
            message: "Persona actualizada exitosamente",
        });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            next(errorTypes.ConflictError("Ya existe una persona con esta cédula"));
        } else {
            next(error);
        }
    }
};



export const deletePersona = async (req, res, next) => {
    try {
        const result = await Persona.delete(req.params.id);
        if (result.affectedRows === 0) {
            throw errorTypes.NotFoundError("Persona no encontrada");
        }

        res.status(200).json({
            status: "success",
            message: "Persona eliminada exitosamente",
        });
    } catch (error) {
        if (error.code === "ER_ROW_IS_REFERENCED_2") {
            next(
                errorTypes.ConflictError(
                    "No se puede eliminar la persona porque tiene registros asociados"
                )
            );
        } else {
            next(error);
        }
    }
};

//Obtiene todas las personas que tienen un rol específico
export const getPersonasByRol = async (req, res, next) => {
    try {
        if (!ROLES_VALIDOS.includes(req.params.rol)) {
            throw errorTypes.ValidationError(
                "Rol no válido. Debe ser ASOCIADO, CONDUCTOR o EMPLEADO"
            );
        }

        const personas = await Persona.findByRol(req.params.rol);
        res.status(200).json({
            status: "success",
            data: personas,
        });
    } catch (error) {
        next(error);
    }
};