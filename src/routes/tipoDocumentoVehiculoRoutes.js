import express from "express";
import {
    getAllTipoDocumentoVehiculo,
    getTipoDocumentoVehiculoById,
    createTipoDocumentoVehiculo,
    updateTipoDocumentoVehiculo,
    deleteTipoDocumentoVehiculo
} from '../Controllers/tipoDocumentoVehiculoController.js';

const router = express.Router();

// Obtener todos los tipos de documento de vehículo
router.get('/listaTipoDocumentoVehiculo', getAllTipoDocumentoVehiculo);

// Obtener un tipo de documento de vehículo por ID
router.get('/buscarTipoDocumentoVehiculo/:id', getTipoDocumentoVehiculoById);

// Crear un nuevo tipo de documento de vehículo
// Body requerido: { nombre, idEmpresaExterna }
router.post('/crearTipoDocumentoVehiculo', createTipoDocumentoVehiculo);

// Actualizar un tipo de documento de vehículo existente
// Body requerido: { nombre, idEmpresaExterna }
router.put('/actualizarTipoDocumentoVehiculo/:id', updateTipoDocumentoVehiculo);

// Eliminar un tipo de documento de vehículo
router.delete('/eliminarTipoDocumentoVehiculo/:id', deleteTipoDocumentoVehiculo);

export default router;
