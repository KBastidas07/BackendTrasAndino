import express from "express";
import {
    getAllTipoDocumentoVehiculo,
    getTipoDocumentoVehiculoById,
    createTipoDocumentoVehiculo,
    updateTipoDocumentoVehiculo,
    deleteTipoDocumentoVehiculo
} from '../Controllers/tipoDocumentoVehiculoController.js';

const router = express.Router();

// Ruta para obtener todos los tipos de documento de vehículo
router.get('/listaTipoDocumentoVehiculo', getAllTipoDocumentoVehiculo);

// Ruta para obtener un tipo de documento de vehículo por ID
router.get('/buscarTipoDocumentoVehiculo/:id', getTipoDocumentoVehiculoById);

// Ruta para crear un nuevo tipo de documento de vehículo
router.post('/crearTipoDocumentoVehiculo', createTipoDocumentoVehiculo);

// Ruta para actualizar un tipo de documento de vehículo existente
router.put('/actualizarTipoDocumentoVehiculo/:id', updateTipoDocumentoVehiculo);

// Ruta para eliminar un tipo de documento de vehículo
router.delete('/eliminarTipoDocumentoVehiculo/:id', deleteTipoDocumentoVehiculo);

export default router;