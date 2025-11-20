import ConsultaAsociado from "../models/consultaAsociadosModel.js";
import { errorTypes } from "../middlewares/errorHandler.js";

export const buscarInfoAsociado = async (req, res, next) => {
  try {
    const { placa, cedula } = req.params;

    const data = await ConsultaAsociado.buscarPorPlacaYCedula(placa, cedula);

    if (!data || data.length === 0) {
      return res.status(404).json({
        status: "not_found",
        message: "No se encontró información del asociado",
      });
    }

    res.status(200).json({
      status: "success",
      count: data.length,
      data,
    });

  } catch (error) {
    console.error("Error en buscarInfoAsociado:", error);
    next(
      errorTypes.ServerError(
        "Error al obtener la información del asociado"
      )
    );
  }
};
