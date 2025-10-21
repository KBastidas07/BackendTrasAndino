import { errorTypes } from "../middlewares/errorHandler.js";
import ConductorVehiculo from "../models/conductorVehiculoModel.js";
import Persona from "../models/personaModel.js";

//Obtener todos los registros de conductorVehiculo
export const getAllConductorVehiculo = async (req, res, next) => {
  try {
    const conductores = await ConductorVehiculo.findAll();
    console.log(
      `📊 Enviando respuesta con ${conductores.length} conductores-vehículos`
    );
    res.status(200).json({
      status: "success",
      count: conductores.length,
      data: conductores,
    });
  } catch (error) {
    console.error("❌ Error en getAllConductoresVehiculos:", error);
    next(errorTypes.ServerError("Error al obtener los conductores-vehículos"));
  }
};

//Obtener un registro de conductorVehiculo por su ID
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
    console.error("❌ Error al obtener el conductor:", error);
    res.status(500).json({ error: "Error al obtener el registro" });
  }
};

//crear un nuevo registro de conductorVehiculo
export const createConductorVehiculo = async (req, res, next) => {
  try {
    const { id_persona } = req.body;

    // Verificar que la persona existe y obtener sus datos
    const persona = await Persona.findById(id_persona);
    if (!persona) {
      throw errorTypes.NotFoundError("La persona no existe");
    }

    // Verificar que la persona no sea un ASOCIADO
    if (persona.rol === "ASOCIADO") {
      throw errorTypes.ValidationError("Un ASOCIADO no puede ser asignado como conductor");
    }

    // Verificar que la persona sea un CONDUCTOR
    if (persona.rol !== "CONDUCTOR") {
      throw errorTypes.ValidationError("Solo se pueden asignar personas con rol CONDUCTOR");
    }

    const newId = await ConductorVehiculo.create(req.body);
    res.status(201).json({
      status: "success",
      message: "ConductorVehiculo creado exitosamente",
      data: { id: newId }
    });
  } catch (error) {
    console.error("❌ Error al crear conductor-vehículo:", error);
    next(error);
  }
};

//Actualizar un registro existente de conductorVehiculo
export const updateConductorVehiculo = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await ConductorVehiculo.update(id, req.body);

    if (!updated) return res.status(404).json({ error: "No encontrado" });

    res.json({ message: "ConductorVehiculo actualizado" });
  } catch (error) {
    console.error("❌ Error al actualizar:", error);
    res.status(500).json({ error: "Error al actualizar el registro" });
  }
};

//eliminar un registro de conductorVehiculo
export const deleteConductorVehiculo = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ConductorVehiculo.delete(id);

    if (!deleted) return res.status(404).json({ error: "No encontrado" });

    res.json({ message: "ConductorVehiculo eliminado" });
  } catch (error) {
    console.error("❌ Error al eliminar:", error);
    res.status(500).json({ error: "Error al eliminar el registro" });
  }
};
