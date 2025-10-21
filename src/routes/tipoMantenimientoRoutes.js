import express from "express";
import {
    getAllTipoMantenimiento,
    getTipoMantenimientoById,
    createTipoMantenimiento,
    updateTipoMantenimiento,
    deleteTipoMantenimiento
} from '../Controllers/tipoMantenimientoController.js';

const router = express.Router();

// Ruta para obtener todos los tipos de mantenimiento
router.get('/listaTipoMantenimiento', getAllTipoMantenimiento);

// Ruta para obtener un tipo de mantenimiento por ID
router.get('/buscarTipoMantenimiento/:id', getTipoMantenimientoById);

// Ruta para crear un nuevo tipo de mantenimiento
router.post('/crearTipoMantenimiento', createTipoMantenimiento);    

// Ruta para actualizar un tipo de mantenimiento existente
router.put('/actualizarTipoMantenimiento/:id', updateTipoMantenimiento);

// Ruta para eliminar un tipo de mantenimiento
router.delete('/eliminarTipoMantenimiento/:id', deleteTipoMantenimiento);

export default router;