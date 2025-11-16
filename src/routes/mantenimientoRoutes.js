import express from 'express';
import validarToken from "../middlewares/validarToken.js";
import {
  getAllMantenimiento,
  getMantenimientosByPlaca,
  createMantenimiento,
  updateMantenimiento,
  deleteMantenimiento
} from '../Controllers/mantenimientoController.js';

const router = express.Router();

router.use(validarToken);

// Obtener todos los mantenimientos
router.get('/listaMantenimientos', getAllMantenimiento);

// Obtener todos los mantenimientos asociados a una placa
router.get('/buscarMantenimientosPorPlaca/:placa', getMantenimientosByPlaca);

// Crear un nuevo mantenimiento
router.post('/crearMantenimiento', createMantenimiento);

// Actualizar un mantenimiento existente
router.put('/actualizarMantenimiento/:id', updateMantenimiento);

// Eliminar un mantenimiento
router.delete('/eliminarMantenimiento/:id', deleteMantenimiento);

export default router;
