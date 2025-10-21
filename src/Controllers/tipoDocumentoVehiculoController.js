import { errorTypes } from "../middlewares/errorHandler.js";
import TipoDocumentoVehiculo from "../models/tipoDocumentoVehiculoModel.js";

// Obtener todos los tipos de documento de vehículo
export const getAllTipoDocumentoVehiculo = async (req, res, next) => {
    try {
        const tipos = await TipoDocumentoVehiculo.findAll();
        console.log(`📊 Enviando respuesta con ${tipos.length} tipos de documento de vehículo`);
        res.status(200).json({
            status: "success",
            count: tipos.length,
            data: tipos
        });
    } catch (error) {
        console.error('❌ Error en getAllTipoDocumentoVehiculo:', error);
        next(errorTypes.ServerError("Error al obtener los tipos de documento de vehículo"));
    }
};

// Obtener un tipo de documento de vehículo por ID
export const getTipoDocumentoVehiculoById = async (req, res, next) => {
    try {
        const tipo = await TipoDocumentoVehiculo.findById(req.params.id);
        if (!tipo) {
            throw errorTypes.NotFoundError("Tipo de documento de vehículo no encontrado");
        }
        res.status(200).json({
            status: "success",
            data: tipo
        });
    } catch (error) {
        console.error('❌ Error en getTipoDocumentoVehiculoById:', error);
        next(error);
    }
};

// Crear un nuevo tipo de documento de vehículo
export const createTipoDocumentoVehiculo = async (req, res, next) => {
    try {
        // Validar campos requeridos
        if (!req.body.nombre) {
            throw errorTypes.ValidationError("El campo nombre es requerido");
        }

        const result = await TipoDocumentoVehiculo.create(req.body);
        res.status(201).json({
            status: "success",
            message: "Tipo de documento de vehículo creado exitosamente",
            data: {
                id: result
            }
        });
    } catch (error) {
        console.error('❌ Error en createTipoDocumentoVehiculo:', error);
        next(error);
    }
};

// Actualizar un tipo de documento de vehículo existente
export const updateTipoDocumentoVehiculo = async (req, res, next) => {
    try {
        if (!req.body.nombre) {
            throw errorTypes.ValidationError("El campo nombre es requerido");
        }

        const result = await TipoDocumentoVehiculo.update(req.params.id, req.body);
        if (result === 0) {
            throw errorTypes.NotFoundError("Tipo de documento de vehículo no encontrado");
        }

        res.status(200).json({
            status: "success",
            message: "Tipo de documento de vehículo actualizado exitosamente"
        });
    } catch (error) {
        console.error('❌ Error en updateTipoDocumentoVehiculo:', error);
        next(error);
    }
};

// Eliminar un tipo de documento de vehículo
export const deleteTipoDocumentoVehiculo = async (req, res, next) => {
    try {
        const result = await TipoDocumentoVehiculo.delete(req.params.id);
        if (result === 0) {
            throw errorTypes.NotFoundError("Tipo de documento de vehículo no encontrado");
        }

        res.status(200).json({
            status: "success",
            message: "Tipo de documento de vehículo eliminado exitosamente"
        });
    } catch (error) {
        console.error('❌ Error en deleteTipoDocumentoVehiculo:', error);
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            next(errorTypes.ConflictError("No se puede eliminar el tipo de documento de vehículo porque está siendo utilizado"));
        } else {
            next(error);
        }
    }
};
