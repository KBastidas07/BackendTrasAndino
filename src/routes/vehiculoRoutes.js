import express from "express";
import {
  getAllVehiculos,
  getVehiculoByPlaca,
  createVehiculo,
  updateVehiculo,
  deleteVehiculo,
} from "../Controllers/vehiculoController.js";

const router = express.Router();

// Obtener todos los vehículos
router.get("/vehiculos", getAllVehiculos);

// Obtener un vehículo por placa
router.get("/vehiculos/:placa", getVehiculoByPlaca);

// Crear un nuevo vehículo
router.post("/vehiculos", createVehiculo);

// Actualizar un vehículo por placa
router.put("/vehiculos/:placa", updateVehiculo);

// Eliminar un vehículo por placa
router.delete("/vehiculos/:placa", deleteVehiculo);

export default router;
