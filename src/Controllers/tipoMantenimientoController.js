import { errorTypes } from "../middlewares/errorHandler.js";
import TipoMantenimiento from "../models/tipoMantenimientoModel.js";

// Obtener todos los tipos de mantenimiento
export const getAllTipoMantenimiento = async (req, res, next) => {
    try {
        const tipos = await TipoMantenimiento.findAll();
        console.log(`📊 Enviando respuesta con ${tipos.length} tipos de mantenimiento`);
        res.status(200).json({
            status: "success",
            count: tipos.length,
            data: tipos
        });
    } catch (error) {
        console.error('❌ Error en getAllTipoMantenimiento:', error);
        next(errorTypes.ServerError("Error al obtener los tipos de mantenimiento"));
    }
};

// Obtener un tipo de mantenimiento por ID
export const getTipoMantenimientoById = async (req, res, next) => {
    try {
        const tipo = await TipoMantenimiento.findById(req.params.id);
        if (!tipo) {
            throw errorTypes.NotFoundError("Tipo de mantenimiento no encontrado");
        }
        res.status(200).json({
            status: "success",
            data: tipo
        });
    } catch (error) {
        console.error('❌ Error en getTipoMantenimientoById:', error);
        next(error);
    }
};

// Crear un nuevo tipo de mantenimiento
export const createTipoMantenimiento = async (req, res, next) => {
    try {
        // Validar campos requeridos
        if (!req.body.nombre) {
            throw errorTypes.ValidationError("El campo nombre es requerido");
        }

        const result = await TipoMantenimiento.create(req.body);
        res.status(201).json({
            status: "success",
            message: "Tipo de mantenimiento creado exitosamente",
            data: {
                id: result
            }
        });
    } catch (error) {
        console.error('❌ Error en createTipoMantenimiento:', error);
        next(error);
    }
};

// Actualizar un tipo de mantenimiento existente
export const updateTipoMantenimiento = async (req, res, next) => {
    try {
        if (!req.body.nombre) {
            throw errorTypes.ValidationError("El campo nombre es requerido");
        }

        const result = await TipoMantenimiento.update(req.params.id, req.body);
        if (result === 0) {
            throw errorTypes.NotFoundError("Tipo de mantenimiento no encontrado");
        }

        res.status(200).json({
            status: "success",
            message: "Tipo de mantenimiento actualizado exitosamente"
        });
    } catch (error) {
        console.error('❌ Error en updateTipoMantenimiento:', error);
        next(error);
    }
};

// Eliminar un tipo de mantenimiento
export const deleteTipoMantenimiento = async (req, res, next) => {
    try {
        const result = await TipoMantenimiento.delete(req.params.id);
        if (result === 0) {
            throw errorTypes.NotFoundError("Tipo de mantenimiento no encontrado");
        }

        res.status(200).json({
            status: "success",
            message: "Tipo de mantenimiento eliminado exitosamente"
        });
    } catch (error) {
        console.error('❌ Error en deleteTipoMantenimiento:', error);
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            next(errorTypes.ConflictError("No se puede eliminar el tipo de mantenimiento porque está siendo utilizado"));
        } else {
            next(error);
        }
    }
};