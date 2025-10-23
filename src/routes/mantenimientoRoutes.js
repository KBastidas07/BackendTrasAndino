import express from 'express';
import {
  getAllMantenimiento,
  getMantenimientosByPlaca,
  createMantenimiento,
  updateMantenimiento,
  deleteMantenimiento
} from '../Controllers/mantenimientoController.js';

const router = express.Router();

// Obtener todos los mantenimientos
router.get('/listaMantenimientos', getAllMantenimiento);

// Obtener todos los mantenimientos asociados a una placa
router.get('/buscarMantenimientosPorPlaca/:placa', getMantenimientosByPlaca);

// Crear un nuevo mantenimiento
// Body requerido: { placa, idTipoMantenimiento, idEmpresaExterna, fechaMantenimiento, observaciones (opcional) }
router.post('/crearMantenimiento', createMantenimiento);

// Actualizar un mantenimiento existente
// Body requerido: { placa, idTipoMantenimiento, idEmpresaExterna, fechaMantenimiento, observaciones (opcional) }
router.put('/actualizarMantenimiento/:id', updateMantenimiento);

// Eliminar un mantenimiento
router.delete('/eliminarMantenimiento/:id', deleteMantenimiento);

export default router;
