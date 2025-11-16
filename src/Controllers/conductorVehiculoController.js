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

// Obtener un registro de ConductorVehiculo por su Cedula
export const getConductorVehiculoByCedula = async (req, res, next) => {
  try {
    const conductor = await ConductorVehiculo.findByCedula(req.params.cedula);
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

// Obtener conductores por placa
export const getConductoresByPlaca = async (req, res, next) => {
  try {
    const { placa } = req.params;

    const conductores = await ConductorVehiculo.findByPlaca(placa);

    if (!conductores || conductores.length === 0) {
      throw errorTypes.NotFoundError(
        `No se encontraron conductores asociados al vehículo con placa ${placa}`
      );
    }

    res.status(200).json({
      status: "success",
      total: conductores.length,
      data: conductores,
    });

  } catch (error) {
    console.error("Error al obtener conductores por placa:", error);
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
    if (error && error.statusCode) {
      return next(error);
    }
    return next(error);
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
    if (error && error.statusCode) {
      return next(error);
    }
    return next(error);
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
    if (error && error.statusCode) {
      return next(error);
    }
    return next(error);
  }
};
