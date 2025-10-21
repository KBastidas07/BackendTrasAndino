import { errorTypes } from "../middlewares/errorHandler.js";
import Vehiculo from "../models/vehiculoModel.js";

//Validaciones

//validacion de placa
const validarPlaca = (placa) => {
  const placaRegex = /^[A-Z]{3}\d{3,4}$/;
  // Ejemplo: ABC123 o ABC1234
  if (!placaRegex.test(placa)) {
    throw errorTypes.ValidationError(
      "La placa debe tener el formato válido (Ej: ABC123 o ABC1234, solo mayúsculas)"
    );
  }
  return true;
};

//validacion de año del modelo
const validarAnioModelo = (anio) => {
  const anioActual = new Date().getFullYear();

  if (!anio || isNaN(anio)) {
    throw errorTypes.ValidationError(
      "El año del modelo es obligatorio y debe ser un número válido"
    );
  }

  if (anio < 1950) {
    throw errorTypes.ValidationError(
      "El año del modelo no puede ser menor a 1950"
    );
  }

  if (anio > anioActual + 1) {
    throw errorTypes.ValidationError(
      "El año del modelo no puede ser mayor al próximo año"
    );
  }

  return true;
};

//Obtiene todos los vehiculos
export const getAllVehiculos = async (req, res, next) => {
  try {
    const vehiculos = await Vehiculo.findAll();
    console.log(`  Enviando respuesta con ${vehiculos.length} vehiculos`);
    res.status(200).json({
      status: "success",
      count: vehiculos.length,
      data: vehiculos,
    });
  } catch (error) {
    console.error("  Error en getAllVehiculos:", error);
    next(errorTypes.ServerError("Error al obtener los vehiculos"));
  }
};

//Busca un vehiculo por su placa
export const getVehiculoByPlaca = async (req, res, next) => {
  try {
    const placa = req.params.placa;
    console.log("📩 Parámetro recibido (placa):", placa);

    const vehiculo = await Vehiculo.findByPlaca(placa);

    // No existe la placa
    if (!vehiculo) {
      throw errorTypes.NotFoundError("Vehiculo no encontrado");
    }

    // Si el dueño no es ASOCIADO, tratamos como no encontrado (por seguridad)
    if (vehiculo.rol !== "ASOCIADO") {
      console.log(
        `🔒 Vehículo encontrado pero dueño con rol '${vehiculo.rol}' — acceso denegado`
      );
      throw errorTypes.NotFoundError("Vehiculo no encontrado");
    }

    // OK — devolver vehículo
    res.status(200).json({
      status: "success",
      data: vehiculo,
    });
  } catch (error) {
    next(error);
  }
};

//Crea un nuevo vehiculo
export const createVehiculo = async (req, res, next) => {
  console.log("📩 Datos recibidos en createVehiculo:", req.body);
  try {
    // Validar campos requeridos
    const requiredFields = ["placa", "id_persona"];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        throw errorTypes.ValidationError(`El campo ${field} es requerido`);
      }
    }
    //Aplicamos las validaciones
    validarPlaca(req.body.placa);
    if (req.body.modelo) validarAnioModelo(req.body.modelo);



    const result = await Vehiculo.create(req.body);
    res.status(201).json({
      status: "success",
      message: "Vehiculo creado exitosamente",
      data: result,
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      next(errorTypes.ConflictError("Ya existe un vehiculo con esta placa"));
    } else {
      next(error);
    }
  }
};

//Actualiza un vehiculo existente
export const updateVehiculo = async (req, res, next) => {
  try {
    const placa = req.params.placa;

    // Evitar que se cambie la placa
    if (req.body.placa && req.body.placa !== placa) {
      return next(
        errorTypes.ConflictError("No se puede cambiar la placa de un vehículo")
      );
    }

    const vehiculoExistente = await Vehiculo.findByPlaca(placa);
    if (!vehiculoExistente) {
      throw errorTypes.NotFoundError("Vehiculo no encontrado");
    }

    // Validar el año del modelo del carro
    if (req.body.modelo) validarAnioModelo(req.body.modelo);

    const result = await Vehiculo.update(placa, req.body);

    res.status(200).json({
      status: "success",
      message: "Vehiculo actualizado exitosamente",
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      next(errorTypes.ConflictError("Ya existe un vehiculo con esta placa"));
    } else {
      next(error);
    }
  }
};

//Elimina un vehiculo

export const deleteVehiculo = async (req, res, next) => {
  try {
    const result = await Vehiculo.delete(req.params.placa);
    if (result.affectedRows === 0) {
      throw errorTypes.NotFoundError("Vehiculo no encontrado");
    }

    res.status(200).json({
      status: "success",
      message: "Vehiculo eliminado exitosamente",
    });
  } catch (error) {
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      next(
        errorTypes.ConflictError(
          "No se puede eliminar el vehiculo porque tiene registros asociados"
        )
      );
    } else {
      next(error);
    }
  }
};
