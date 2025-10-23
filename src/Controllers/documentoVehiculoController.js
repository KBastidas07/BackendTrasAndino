import { errorTypes } from "../middlewares/errorHandler.js";
import DocumentoVehiculo from "../models/documentoVehiculoModel.js";

//VALIDACIONES

// Validar fecha de emisión
const validarFechaEmision = (fechaEmision) => {
    const fecha = new Date(fechaEmision);
    const hoy = new Date();

    if (isNaN(fecha.getTime())) {
        throw errorTypes.ValidationError("La fecha de emisión no es válida");
    }

    if (fecha > hoy) {
        throw errorTypes.ValidationError("La fecha de emisión no puede ser futura");
    }

    return true;
};

// Validar fecha de vencimiento
const validarFechaVencimiento = (fechaEmision, fechaVencimiento) => {
    const emision = new Date(fechaEmision);
    const vencimiento = new Date(fechaVencimiento);

    if (isNaN(vencimiento.getTime())) {
        throw errorTypes.ValidationError("La fecha de vencimiento no es válida");
    }

    if (vencimiento <= emision) {
        throw errorTypes.ValidationError("La fecha de vencimiento debe ser posterior a la de emisión");
    }

    return true;
};

// Validar estado
const validarEstado = (estado) => {
    const estadosValidos = ["Vigente", "Vencido", "Pendiente"];

    if (!estado) return true; // campo opcional

    const estadoNormalizado = estado.trim().toLowerCase();
    const valido = estadosValidos.some(e => e.toLowerCase() === estadoNormalizado);

    if (!valido) {
        throw errorTypes.ValidationError(
            "El estado debe ser uno de los siguientes: Vigente, Vencido o Pendiente"
        );
    }

    return true;
};

// Obtener todos los documentos de vehículos
export const getAllDocumentoVehiculo = async (req, res, next) => {
    try {
        const documentos = await DocumentoVehiculo.findAll();
        console.log(`Enviando respuesta con ${documentos.length} documentos de vehículo`);
        res.status(200).json({
            status: "success",
            count: documentos.length,
            data: documentos
        });
    } catch (error) {
        console.error("Error en getAllDocumentoVehiculo:", error);
        next(errorTypes.ServerError("Error al obtener los documentos de vehículos"));
    }
};

// Obtener un documento de vehículo por ID
/*export const getDocumentoVehiculoById = async (req, res, next) => {
    try {
        const documento = await DocumentoVehiculo.findById(req.params.id);
        if (!documento) {
            throw errorTypes.NotFoundError("Documento de vehículo no encontrado");
        }
        res.status(200).json({
            status: "success",
            data: documento
        });
    } catch (error) {
        console.error("  Error en getDocumentoVehiculoById:", error);
        next(error);
    }
};
*/
// Obtener todos los documentos asociados a una placa
export const getDocumentosByPlaca = async (req, res, next) => {
    try {
        const { placa } = req.params;
        const documentos = await DocumentoVehiculo.findByPlaca(placa);

        if (!documentos.length) {
            throw errorTypes.NotFoundError("No se encontraron documentos para esta placa");
        }

        res.status(200).json({
            status: "success",
            count: documentos.length,
            data: documentos
        });
    } catch (error) {
        console.error("Error en getDocumentosByPlaca:", error);
        next(error);
    }
};

// Crear un nuevo documento de vehículo
export const createDocumentoVehiculo = async (req, res, next) => {
    try {
        // Validar campos requeridos
        const requiredFields = ["placa", "idTipoDocumento", "fechaEmision", "fechaVencimiento"];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                throw errorTypes.ValidationError(`El campo ${field} es requerido`);
            }
        }
        //Aplicamos las validaciones
        validarFechaEmision(req.body.fechaEmision);
        validarFechaVencimiento(req.body.fechaEmision, req.body.fechaVencimiento);
        if (req.body.estado) validarEstado(req.body.estado);

        const newId = await DocumentoVehiculo.create(req.body);
        res.status(201).json({
            status: "success",
            message: "Documento de vehículo creado exitosamente",
            data: { id: newId }
        });
    } catch (error) {
        console.error("  Error en createDocumentoVehiculo:", error);
        if (error.code === "ER_NO_REFERENCED_ROW_2") {
            next(errorTypes.ValidationError("El vehículo o tipo de documento no existe"));
        } else {
            next(error);
        }
    }
};

// Actualizar un documento de vehículo existente
export const updateDocumentoVehiculo = async (req, res, next) => {
    try {
        const { id } = req.params;

        //Aplicamos las validaciones
        if (req.body.fecha_emision) validarFechaEmision(req.body.fecha_emision);
        if (req.body.fecha_vencimiento && req.body.fecha_emision)
            validarFechaVencimiento(req.body.fecha_emision, req.body.fecha_vencimiento);
        if (req.body.estado) validarEstado(req.body.estado);
        const updated = await DocumentoVehiculo.update(id, req.body);

        if (!updated) {
            throw errorTypes.NotFoundError("Documento de vehículo no encontrado");
        }

        res.status(200).json({
            status: "success",
            message: "Documento de vehículo actualizado exitosamente"
        });
    } catch (error) {
        console.error("  Error en updateDocumentoVehiculo:", error);
        if (error.code === "ER_NO_REFERENCED_ROW_2") {
            next(errorTypes.ValidationError("El vehículo o tipo de documento no existe"));
        } else {
            next(error);
        }
    }
};

// Eliminar un documento de vehículo
export const deleteDocumentoVehiculo = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleted = await DocumentoVehiculo.delete(id);

        if (!deleted) {
            throw errorTypes.NotFoundError("Documento de vehículo no encontrado");
        }

        res.status(200).json({
            status: "success",
            message: "Documento de vehículo eliminado exitosamente"
        });
    } catch (error) {
        console.error("Error en deleteDocumentoVehiculo:", error);
        next(error);
    }
};
