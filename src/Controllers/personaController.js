import Persona from "../models/personaModel.js";
import { errorTypes } from "../middlewares/errorHandler.js";
import { validacionesGenerales } from "../Utils/Validaciones.js";


// Obtener todas las personas
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
      data: persona,
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
      data: persona,
    });
  } catch (error) {
    console.error("Error en getPersonaByCedula:", error);
    next(error);
  }
};

// Crear persona y asignar rol
export const createPersona = async (req, res, next) => {
  try {
    const personaData = req.body;

    console.log("Datos recibidos:", personaData);

    // Validación de campos obligatorios
    if (
      !personaData.nombreCompleto ||
      !personaData.apellidoCompleto ||
      !personaData.cedula
    ) {
      throw new Error("Faltan campos obligatorios");
    }

    // Validaciones específicas
    validacionesGenerales.validarCedula(personaData.cedula);

    if (personaData.correo) {
      validacionesGenerales.validarCorreo(personaData.correo);
    }

    if (personaData.telefono) {
      validacionesGenerales.validarTelefono(personaData.telefono);
    }

    // Crear persona con transacción
    const idPersona = await Persona.createPersonaWithTransaction(personaData);

    // Devolver persona creada con roles
    const personaCreada = await Persona.findByIdWithRoles(idPersona);
    console.log("Persona recuperada:", personaCreada);

    res.status(201).json({
      status: "success",
      message: "Persona creada exitosamente",
      data: personaCreada,
    });
  } catch (error) {
    console.error("Error en createPersona:", error);
    // Pasar errores operacionales (p. ej. duplicados) tal cual al middleware
    if (error && error.statusCode) {
      return next(error);
    }

    return next(
      errorTypes.ServerError(error.message || "Error al crear la persona")
    );
  }
};

// Actualizar persona
export const updatePersona = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombreCompleto, apellidoCompleto, cedula, roles, ...otherData } =
      req.body;

    // Validar campos requeridos
    if (!nombreCompleto || !apellidoCompleto || !cedula) {
      throw errorTypes.ValidationError(
        "Los campos nombreCompleto, apellidoCompleto y cedula son requeridos"
      );
    }

    // Validaciones específicas
    validacionesGenerales.validarCedula(cedula);

    if (otherData.correo) {
      validacionesGenerales.validarCorreo(otherData.correo);
    }

    if (otherData.telefono) {
      validacionesGenerales.validarTelefono(otherData.telefono);
    }

    const personaData = { nombreCompleto, apellidoCompleto, cedula, ...otherData, roles };

    const updatedPersona = await Persona.updateWithRoles(id, personaData);

    res.status(200).json({
      status: "success",
      message: "Persona actualizada exitosamente",
      data: updatedPersona,
    });
  } catch (error) {
    console.error("Error en updatePersona:", error);
    // Si el modelo ya devolvió un error operacional (con statusCode), reenviarlo
    if (error && error.statusCode) {
      return next(error);
    }
    // Si es un mensaje específico de not found, devolver 404
    if (error && error.message && error.message.includes("Persona no encontrada")) {
      return next(errorTypes.NotFoundError(error.message));
    }
    next(error);
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
      message: "Persona eliminada exitosamente",
    });
  } catch (error) {
    console.error("  Error en deletePersona:", error);
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      next(
        errorTypes.ConflictError(
          "No se puede eliminar la persona porque está siendo utilizada en otra tabla"
        )
      );
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
      data: personas,
    });
  } catch (error) {
    console.error("  Error en getPersonasByRol:", error);
    next(error);
  }
};

/*
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
*/