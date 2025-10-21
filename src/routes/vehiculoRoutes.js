import express from "express";
import {
  getAllVehiculos,
  getVehiculoByPlaca,
  createVehiculo,
  updateVehiculo,
  deleteVehiculo,
} from "../Controllers/vehiculoController.js";

const router = express.Router();

//Ruta para obtener todos los vehiculos
router.get("/listaVehiculos", getAllVehiculos);

//Ruta para buscar un vehiculo por su placa
router.get("/buscarPlacaVehiculo/:placa", getVehiculoByPlaca);

//Ruta para crear un nuevo vehiculo
router.post("/crearVehiculo", createVehiculo);

//Ruta para actualizar un vehiculo existente
router.put("/actualizarVehiculo/:placa", updateVehiculo);

//Ruta para eliminar un vehiculo
router.delete("/eliminarVehiculo/:placa", deleteVehiculo);

export default router;
