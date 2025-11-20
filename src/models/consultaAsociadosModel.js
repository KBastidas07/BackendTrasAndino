import db from "../Conf/dbTasandino.js";

class ConsultaAsociado {
  static async buscarPorPlacaYCedula(placa, cedula) {
    // 1. Datos del asociado + vehículo
    const [vehiculo] = await db.execute(
      `
      SELECT 
        v.idVehiculo,
        v.placa,
        v.motor,
        v.chasis,
        v.modelo,
        v.marca,
        v.linea,
        v.combustible,
        v.cilindraje,
        v.movil,
        p.idPersona,
        p.nombreCompleto,
        p.apellidoCompleto,
        p.direccion,
        p.cedula,
        p.telefono,
        p.correo

      FROM Vehiculo v
      INNER JOIN Persona p ON p.idPersona = v.idPersona
      WHERE v.placa = ? AND p.cedula = ?
      `,
      [placa, cedula]
    );

    if (vehiculo.length === 0) return null;

    const info = vehiculo[0];
    const idVehiculo = info.idVehiculo;

    // 2. Traer todos los mantenimientos
    const [mantenimientos] = await db.execute(
      `
  SELECT 

    m.fechaMantenimiento,
    m.observaciones,
    tm.nombre AS tipoMantenimiento,
    ee.NombreEncargado AS empresaExternaNombre,
    ee.Celular AS empresaExternaCelular,
    ee.Direccion AS empresaExternaDireccion,
    ee.Correo AS empresaExternaCorreo
  FROM Mantenimiento m
  INNER JOIN TipoMantenimiento tm 
    ON tm.idTipoMantenimiento = m.idTipoMantenimiento
  INNER JOIN EmpresaExterna ee 
    ON ee.idEmpresaExterna = m.idEmpresaExterna
  WHERE m.idVehiculo = ?
  ORDER BY m.fechaMantenimiento DESC
  `,
      [idVehiculo]
    );

    // 3. Traer todos los documentos del vehículo
    const [documentos] = await db.execute(
      `
      SELECT 
        d.fechaEmision,
        d.fechaVencimiento,
        d.estadoDocVehiculo,
        td.nombre AS tipoDocumento
      FROM DocumentoVehiculo d
      INNER JOIN TipoDocumentoVehiculo td 
        ON td.idTipoDocumento = d.idTipoDocumento
      WHERE d.placa = ?
      ORDER BY d.fechaVencimiento DESC
      `,
      [placa]
    );

    // 4. traer todos los conductores relacionados al vehículo
    const [conductores] = await db.execute(
      `
      SELECT 
        cv.EstadoConductor,
        cv.jornada,
        cv.fechaInicio,
        cv.fechaFin,
        p.nombreCompleto,
        p.apellidoCompleto,
        p.cedula
      FROM ConductorVehiculo cv
      INNER JOIN Persona p ON p.idPersona = cv.idPersona
      WHERE cv.idVehiculo = ?
      ORDER BY cv.fechaInicio DESC
      `,
      [idVehiculo]
    );

    // 5. Estructura final del JSON limpio y agrupado
    return {
      asociado: {
        nombreCompleto: info.nombreCompleto,
        apellidoCompleto: info.apellidoCompleto,
        cedula: info.cedula,
        direccion: info.direccion,
        telefono: info.telefono,
        correo: info.correo,
      },
      vehiculo: {
        placa: info.placa,
        motor: info.motor,
        chasis: info.chasis,
        modelo: info.modelo,
        marca: info.marca,
        linea: info.linea,
        combustible: info.combustible,
        cilindraje: info.cilindraje,
        movil: info.movil,
      },
      conductores,
      mantenimientos,
      documentos,
    };
  }
}

export default ConsultaAsociado;
