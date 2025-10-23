import { errorTypes } from "../middlewares/errorHandler.js";
import EmpresaExterna from "../models/empresaExternaModel.js";

// Obtener todos los registros
export const getAllEmpresaExterna = async (req, res, next) => {
  try {
    const empresas = await EmpresaExterna.findAll();
    res.status(200).json({
      status: "success",
      count: empresas.length,
      data: empresas,
    });
  } catch (error) {
    console.error("Error en getAllEmpresaExterna:", error);
    next(errorTypes.ServerError("Error al obtener las empresas externas"));
  }
};

// Obtener un registro por ID
export const getEmpresaExternaById = async (req, res, next) => {
  try {
    const empresa = await EmpresaExterna.findById(req.params.id);
    if (!empresa) throw errorTypes.NotFoundError("Empresa externa no encontrada");
    res.status(200).json({ status: "success", data: empresa });
  } catch (error) {
    console.error("Error al obtener empresa externa:", error);
    next(error);
  }
};

// Crear un nuevo registro
export const createEmpresaExterna = async (req, res, next) => {
  try {
    const { NombreEncargado } = req.body;
    if (!NombreEncargado) throw errorTypes.ValidationError("El nombre del encargado es obligatorio");

    const newId = await EmpresaExterna.create(req.body);
    res.status(201).json({
      status: "success",
      message: "Empresa externa creada exitosamente",
      data: { id: newId },
    });
  } catch (error) {
    console.error("Error al crear empresa externa:", error);
    next(error);
  }
};

// Actualizar un registro existente
export const updateEmpresaExterna = async (req, res, next) => {
  try {
    const updated = await EmpresaExterna.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: "Empresa externa no encontrada" });
    res.json({ message: "Empresa externa actualizada exitosamente" });
  } catch (error) {
    console.error("Error al actualizar empresa externa:", error);
    next(error);
  }
};

// Eliminar un registro
export const deleteEmpresaExterna = async (req, res, next) => {
  try {
    const deleted = await EmpresaExterna.delete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Empresa externa no encontrada" });
    res.json({ message: "Empresa externa eliminada exitosamente" });
  } catch (error) {
    console.error("Error al eliminar empresa externa:", error);
    next(error);
  }
};
