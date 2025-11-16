import { errorTypes } from "../middlewares/errorHandler.js";
import ConductorVehiculo from "../models/conductorVehiculoModel.js";

// Obtener todos los registros de ConductorVehiculo
export const getAllConductorVehiculo = async (req, res, next) => {
  try {
    const conductores = await ConductorVehiculo.findAll();
    console.log(
      `Enviando respuesta con ${conductores.length} conductores-vehículos`
    );
    res.status(200).json({
      status: "success",
      count: conductores.length,
      data: conductores,
    });
  } catch (error) {
    console.error("Error en getAllConductoresVehiculos:", error);
    next(errorTypes.ServerError("Error al obtener los conductores-vehículos"));
  }
};

// Obtener un registro de ConductorVehiculo por su ID
export const getConductorVehiculoById = async (req, res, next) => {
  try {
    const conductor = await ConductorVehiculo.findById(req.params.id);
    if (!conductor) {
      throw errorTypes.NotFoundError("Conductor-Vehículo no encontrado");
    }
    res.status(200).json({
      status: "success",
      data: conductor,
    });
  } catch (error) {
    console.error("Error al obtener el conductor:", error);
    next(error);
  }
};

// Crear un nuevo registro de ConductorVehiculo
export const createConductorVehiculo = async (req, res, next) => {
  try {
    // Validar campos obligatorios
    const { idPersona, idVehiculo, jornada, fechaInicio } = req.body;
    if (!idPersona || !idVehiculo || !jornada || !fechaInicio) {
      throw errorTypes.ValidationError(
        "Los campos idPersona, idVehiculo, jornada y fechaInicio son obligatorios"
      );
    }

    // Crear el registro usando el modelo
    const newRecord = await ConductorVehiculo.create(req.body);

    res.status(201).json({
      status: "success",
      message: "ConductorVehiculo creado exitosamente",
      data: newRecord,
    });
  } catch (error) {
    console.error("Error al crear conductor-vehículo:", error);
    next(error);
  }
};

// Actualizar un registro existente de ConductorVehiculo
export const updateConductorVehiculo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await ConductorVehiculo.update(id, req.body);

    if (!updated) {
      return next(errorTypes.NotFoundError("Conductor-Vehículo no encontrado"));
    }

    res.json({
      status: "success",
      message: "ConductorVehiculo actualizado exitosamente",
    });
  } catch (error) {
    console.error("Error al actualizar:", error);
    next(error);
  }
};

// Eliminar un registro de ConductorVehiculo
export const deleteConductorVehiculo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await ConductorVehiculo.delete(id);

    if (!deleted) {
      return next(errorTypes.NotFoundError("Conductor-Vehículo no encontrado"));
    }

    res.json({
      status: "success",
      message: "ConductorVehiculo eliminado exitosamente",
    });
  } catch (error) {
    console.error("Error al eliminar:", error);
    next(error);
  }
};
