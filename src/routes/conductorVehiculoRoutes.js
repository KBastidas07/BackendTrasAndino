import express from 'express';
import validarToken from "../middlewares/validarToken.js";
import {
  getAllConductorVehiculo,
  getConductorVehiculoById,
  createConductorVehiculo,
  updateConductorVehiculo,
  deleteConductorVehiculo,
} from '../Controllers/conductorVehiculoController.js';

const router = express.Router();

router.use(validarToken);

// Obtener todos los registros de conductorVehiculo
router.get('/listarconductorVehiculos', getAllConductorVehiculo);

// Obtener un registro de conductorVehiculo por su ID
router.get('/obtenerConductorVehiculos/:id' ,getConductorVehiculoById);

// Crear un nuevo registro de conductorVehiculo
router.post('/crearConductorVehiculo' ,createConductorVehiculo);

// Actualizar un registro existente de conductorVehiculo
router.put('/actualizarConductorVehiculo/:id', updateConductorVehiculo);

// Eliminar un registro de conductorVehiculo
router.delete('/eliminarConductorVehiculos/:id', deleteConductorVehiculo);

export default router;
