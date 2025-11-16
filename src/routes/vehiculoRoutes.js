import express from "express";
import validarToken from "../middlewares/validarToken.js";
import {
  getAllVehiculos,
  getVehiculoByPlaca,
  createVehiculo,
  updateVehiculo,
  deleteVehiculo,
} from "../Controllers/vehiculoController.js";

const router = express.Router();

router.use(validarToken);

// Obtener todos los vehículos
router.get("/listarVehiculos", getAllVehiculos);

// Obtener un vehículo por placa
router.get("/obtenerVehiculos/:placa", getVehiculoByPlaca);

// Crear un nuevo vehículo
router.post("/crearVehiculos", createVehiculo);

// Actualizar un vehículo por placa
router.put("/actualzarVehiculos/:placa", updateVehiculo);

// Eliminar un vehículo por placa
router.delete("/eliminarVehiculos/:placa", deleteVehiculo);

export default router;
