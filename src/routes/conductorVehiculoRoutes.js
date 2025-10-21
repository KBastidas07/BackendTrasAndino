import express from 'express';
import {
  getAllConductorVehiculo,
  getConductorVehiculoById,
  createConductorVehiculo,
  updateConductorVehiculo,
  deleteConductorVehiculo,

} from '../Controllers/conductorVehiculoController.js';

const router = express.Router();

//Ruta para obtener todos los registros de conductoresVehiculos
router.get('/listaConductorvehiculo', getAllConductorVehiculo);

//Ruta para buscar un conductorVehiculo por su ID
router.get('/buscarConductorVehiculo/:id', getConductorVehiculoById);

//Ruta para crear un nuevo conductorVehiculo
router.post('/crearConductorVehiculo', createConductorVehiculo);

//Ruta para actualizar un conductorVehiculo existente
router.put('/actualizarConductorVehiculo/:id', updateConductorVehiculo);

//Ruta para eliminar un conductorVehiculo
router.delete('/eliminarConductorVehiculo/:id', deleteConductorVehiculo);

export default router;