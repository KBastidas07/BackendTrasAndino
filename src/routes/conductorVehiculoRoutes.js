import express from 'express';
import {
  getAllConductorVehiculo,
  getConductorVehiculoById,
  createConductorVehiculo,
  updateConductorVehiculo,
  deleteConductorVehiculo,
} from '../Controllers/conductorVehiculoController.js';

const router = express.Router();

// Obtener todos los registros de conductorVehiculo
router.get('/conductor_vehiculos', getAllConductorVehiculo);

// Obtener un registro de conductorVehiculo por su ID
router.get('/conductor_vehiculos/:id', getConductorVehiculoById);

// Crear un nuevo registro de conductorVehiculo
router.post('/conductor_vehiculos', createConductorVehiculo);

// Actualizar un registro existente de conductorVehiculo
router.put('/conductor_vehiculos/:id', updateConductorVehiculo);

// Eliminar un registro de conductorVehiculo
router.delete('/conductor_vehiculos/:id', deleteConductorVehiculo);

export default router;
