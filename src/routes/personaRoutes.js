import express from 'express';
import {
  getAllPersonas,
  getPersonaById,
  getPersonaByCedula,
  createPersona,
  updatePersona,
  deletePersona,
  getPersonasByRol,

} from '../Controllers/personaController.js';

const router = express.Router();

// Ruta para obtener todas las personas
router.get('/listaPersonas', getAllPersonas);

//Lista de personas con el rol especificado
router.get('/listaPersonas/:rol', getPersonasByRol);

//Busca una persona por su número de cédula
router.get('/buscarCedulaPersona/:cedula', getPersonaByCedula);

//Busca una persona por su ID
router.get('/buscarIdPersona/:id', getPersonaById);

// Ruta para crear una nueva persona
router.post('/crearPersona', createPersona);

// Ruta para actualizar una persona existente
router.put('/actualizarPersona/:id', updatePersona);


// Ruta para eliminar una persona
router.delete('/eliminarPersona/:id', deletePersona);

export default router;