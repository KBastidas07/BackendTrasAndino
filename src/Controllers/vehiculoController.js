import { errorTypes } from "../middlewares/errorHandler.js";
import Vehiculo from "../models/vehiculoModel.js";

// Validaciones
const validarPlaca = (placa) => {
  const placaRegex = /^[A-Z]{3}\d{3,4}$/;
  if (!placaRegex.test(placa)) {
    throw errorTypes.ValidationError(
      "La placa debe tener el formato válido (Ej: ABC123 o ABC1234, solo mayúsculas)"
    );
  }
  return true;
};

const validarAnioModelo = (anio) => {
  const anioActual = new Date().getFullYear();
  if (!anio || isNaN(anio)) {
    throw errorTypes.ValidationError(
      "El año del modelo es obligatorio y debe ser un número válido"
    );
  }
  if (anio < 1950) throw errorTypes.ValidationError("El año del modelo no puede ser menor a 1950");
  if (anio > anioActual + 1) throw errorTypes.ValidationError("El año del modelo no puede ser mayor al próximo año");
  return true;
};

// Obtener todos los vehículos
export const getAllVehiculos = async (req, res, next) => {
  try {
    const vehiculos = await Vehiculo.findAll();
    res.status(200).json({
      status: "success",
      count: vehiculos.length,
      data: vehiculos,
    });
  } catch (error) {
    next(errorTypes.ServerError("Error al obtener los vehículos"));
  }
};

// Obtener vehículo por placa
export const getVehiculoByPlaca = async (req, res, next) => {
  try {
    const placa = req.params.placa.toUpperCase();
    validarPlaca(placa);

    const vehiculo = await Vehiculo.findByPlaca(placa);
    if (!vehiculo) throw errorTypes.NotFoundError("Vehículo no encontrado");

    res.status(200).json({
      status: "success",
      data: vehiculo,
    });
  } catch (error) {
    next(error);
  }
};

// Crear un vehículo
export const createVehiculo = async (req, res, next) => {
  try {
    const { placa, idPersona } = req.body;
    if (!placa || !idPersona) throw errorTypes.ValidationError("Los campos placa e idPersona son obligatorios");

    validarPlaca(placa);
    if (req.body.modelo) validarAnioModelo(req.body.modelo);

    const result = await Vehiculo.create(req.body);
    res.status(201).json({
      status: "success",
      message: "Vehículo creado exitosamente",
      data: result,
    });
  } catch (error) {
    if (error.message.includes("Ya existe un vehículo")) {
      next(errorTypes.ConflictError(error.message));
    } else {
      next(error);
    }
  }
};

// Actualizar vehículo por placa
export const updateVehiculo = async (req, res, next) => {
  try {
    const placa = req.params.placa.toUpperCase();
    validarPlaca(placa);

    if (req.body.placa && req.body.placa !== placa) {
      return next(errorTypes.ConflictError("No se puede cambiar la placa de un vehículo"));
    }

    if (req.body.modelo) validarAnioModelo(req.body.modelo);

    const vehiculoExistente = await Vehiculo.findByPlaca(placa);
    if (!vehiculoExistente) throw errorTypes.NotFoundError("Vehículo no encontrado");

    await Vehiculo.update(placa, req.body);
    res.status(200).json({
      status: "success",
      message: "Vehículo actualizado exitosamente",
    });
  } catch (error) {
    next(error);
  }
};

// Eliminar vehículo por placa
export const deleteVehiculo = async (req, res, next) => {
  try {
    const placa = req.params.placa.toUpperCase();
    validarPlaca(placa);

    await Vehiculo.delete(placa);
    res.status(200).json({
      status: "success",
      message: "Vehículo eliminado exitosamente",
    });
  } catch (error) {
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      next(errorTypes.ConflictError("No se puede eliminar el vehículo porque tiene registros asociados"));
    } else {
      next(error);
    }
  }
};
