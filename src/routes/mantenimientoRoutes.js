import express from 'express';

import {
  getAllMantenimiento,
  //getMantenimientoById,
  getMantenimientosByPlaca,
  createMantenimiento,
  updateMantenimiento,
  deleteMantenimiento


} from '../Controllers/mantenimientoController.js';

const router = express.Router();

//Ruta para obtener todos los mantenimientos
router.get('/listaMantenimientos', getAllMantenimiento);

//Ruta para obtener un mantenimiento por ID
//router.get('/buscarMantenimiento/:id', getMantenimientoById);

//Ruta para obtener todos los mantenimientos asociados a una placa
router.get('/buscarMantenimientosPorPlaca/:placa', getMantenimientosByPlaca);

//Ruta para crear un nuevo mantenimiento
router.post('/crearMantenimiento', createMantenimiento);

//Ruta para actualizar un mantenimiento existente
router.put('/actualizarMantenimiento/:id', updateMantenimiento);

//Ruta para eliminar un mantenimiento
router.delete('/eliminarMantenimiento/:id', deleteMantenimiento);

export default router;