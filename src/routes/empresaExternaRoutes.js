import express from 'express';
import validarToken from "../middlewares/validarToken.js";
import {
  getAllEmpresaExterna,
  getEmpresaExternaById,
  createEmpresaExterna,
  updateEmpresaExterna,
  deleteEmpresaExterna
} from '../Controllers/empresaExternaController.js';

const router = express.Router();

router.use(validarToken);

// ruta para listar todas las empresas externas
router.get('/listaEmpresaExterna', getAllEmpresaExterna);

// ruta para obtener una empresa por su ID
router.get('/buscarEmpresaExterna/:id', getEmpresaExternaById);

//Ruta para crear una empresa externa
router.post('/crearEmpresaExterna', createEmpresaExterna);

//ruta para actualizar una empresa externa
router.put('/actualizarEmpresaExterna/:id', updateEmpresaExterna);

//ruta para eliminar una empresa externa
router.delete('/eliminarEmpresaExterna/:id', deleteEmpresaExterna);

export default router;
