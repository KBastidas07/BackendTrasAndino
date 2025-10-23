import { errorTypes } from "../middlewares/errorHandler.js";
import Mantenimiento from "../models/mantenimientoModel.js";

// Obtener todos los mantenimientos
export const getAllMantenimiento = async (req, res, next) => {
  try {
    const mantenimientos = await Mantenimiento.findAll();
    console.log(`  Enviando respuesta con ${mantenimientos.length} mantenimientos`);
    res.status(200).json({
      status: "success",
      count: mantenimientos.length,
      data: mantenimientos
    });
  } catch (error) {
    console.error("Error en getAllMantenimiento:", error);
    next(errorTypes.ServerError("Error al obtener los mantenimientos"));
  }
};

// Obtener mantenimientos por placa
export const getMantenimientosByPlaca = async (req, res, next) => {
  try {
    const { placa } = req.params;
    const mantenimientos = await Mantenimiento.findByPlaca(placa);

    if (!mantenimientos.length) {
      throw errorTypes.NotFoundError("No se encontraron mantenimientos para esta placa");
    }

    res.status(200).json({
      status: "success",
      count: mantenimientos.length,
      data: mantenimientos
    });
  } catch (error) {
    console.error("Error en getMantenimientosByPlaca:", error);
    next(error);
  }
};

// Crear un nuevo mantenimiento
export const createMantenimiento = async (req, res, next) => {
  try {
    const requiredFields = ["idVehiculo", "idTipoMantenimiento", "idEmpresaExterna", "fechaMantenimiento"];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        throw errorTypes.ValidationError(`El campo ${field} es requerido`);
      }
    }

    const newId = await Mantenimiento.create(req.body);
    res.status(201).json({
      status: "success",
      message: "Mantenimiento creado exitosamente",
      data: { id: newId }
    });
  } catch (error) {
    console.error("  Error en createMantenimiento:", error);
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      next(errorTypes.ValidationError("El vehículo, tipo de mantenimiento o empresa externa no existe"));
    } else {
      next(error);
    }
  }
};

// Actualizar un mantenimiento existente
export const updateMantenimiento = async (req, res, next) => {
  try {
    const { id } = req.params;

    const requiredFields = ["idVehiculo", "idTipoMantenimiento", "idEmpresaExterna", "fechaMantenimiento"];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        throw errorTypes.ValidationError(`El campo ${field} es requerido`);
      }
    }

    const updated = await Mantenimiento.update(id, req.body);
    if (!updated) {
      throw errorTypes.NotFoundError("Mantenimiento no encontrado");
    }

    res.status(200).json({
      status: "success",
      message: "Mantenimiento actualizado exitosamente"
    });
  } catch (error) {
    console.error("  Error en updateMantenimiento:", error);
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      next(errorTypes.ValidationError("El vehículo, tipo de mantenimiento o empresa externa no existe"));
    } else {
      next(error);
    }
  }
};

// Eliminar un mantenimiento por ID
export const deleteMantenimiento = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Mantenimiento.delete(id);

    if (!deleted) {
      throw errorTypes.NotFoundError("Mantenimiento no encontrado");
    }

    res.status(200).json({
      status: "success",
      message: "Mantenimiento eliminado exitosamente"
    });
  } catch (error) {
    console.error("  Error en deleteMantenimiento:", error);
    next(error);
  }
};
