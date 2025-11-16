import express from 'express';
import validarToken from "../middlewares/validarToken.js";
import {
  getAllConductorVehiculo,
  getConductorVehiculoByCedula,
  getConductoresByPlaca,
  createConductorVehiculo,
  updateConductorVehiculo,
  deleteConductorVehiculo,
} from '../Controllers/conductorVehiculoController.js';

const router = express.Router();

router.use(validarToken);

// Obtener todos los registros de conductorVehiculo
router.get('/listarconductorVehiculos', getAllConductorVehiculo);

// Obtener un registro de conductorVehiculo por su cedula
router.get('/obtenerConductorVehiculos/:cedula' ,getConductorVehiculoByCedula);

// Obtener todos los conductores asociados a una placa
router.get('/obtenerConductorVehiculosPorPlaca/:placa', getConductoresByPlaca);


// Crear un nuevo registro de conductorVehiculo
router.post('/crearConductorVehiculo' ,createConductorVehiculo);

// Actualizar un registro existente de conductorVehiculo
router.put('/actualizarConductorVehiculo/:id', updateConductorVehiculo);

// Eliminar un registro de conductorVehiculo
router.delete('/eliminarConductorVehiculos/:id', deleteConductorVehiculo);

export default router;
