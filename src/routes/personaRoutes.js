import express from "express";
import {
  getAllPersonas,
  getPersonaById,
  getPersonaByCedula,
  createPersona,
  updatePersona,
  deletePersona,
  getPersonasByRol,
  updateRolesPersona
} from "../Controllers/personaController.js";

const router = express.Router();

// 🔹 Obtener todas las personas
router.get("/listarPersonas", getAllPersonas);

// 🔹 Obtener persona por ID
router.get("/buscarPorId/:id", getPersonaById);

// 🔹 Obtener persona por cédula
router.get("/buscarPorCedula/:cedula", getPersonaByCedula);

// 🔹 Crear nueva persona
router.post("/crearPersona", createPersona);

// 🔹 Actualizar persona
router.put("/actualizarPersona/:id", updatePersona);

// 🔹 Eliminar persona
router.delete("/eliminarPersona/:id", deletePersona);

// 🔹 Obtener personas por nombre de rol
router.get("/buscarPorRol/:nombreRol", getPersonasByRol);

// 🔹 Actualizar roles de una persona
router.put("/actualizarRoles/:id", updateRolesPersona);

export default router;
