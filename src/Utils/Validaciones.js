import { errorTypes } from "../middlewares/errorHandler.js";

//Validaciones Para Persona
export class validacionesGenerales {
  static validarCedula(cedula) {
    const regex = /^[0-9]{6,10}$/;
    if (!cedula) throw errorTypes.ValidationError("La cédula es obligatoria");
    if (!regex.test(cedula))
      throw errorTypes.ValidationError(
        "La cédula debe tener entre 6 y 10 dígitos numéricos"
      );
    return true;
  }

  static validarCorreo(correo) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correo) throw errorTypes.ValidationError("El correo es obligatorio");
    if (!regex.test(correo))
      throw errorTypes.ValidationError(
        "El formato del correo electrónico no es válido"
      );
    return true;
  }

  static validarTelefono(telefono) {
    const regex = /^[0-9]{10}$/;
    if (!telefono)
      throw errorTypes.ValidationError(
        "El teléfono debe tener 10 dígitos numéricos"
      );
    if (!regex.test(telefono))
      throw errorTypes.ValidationError("Formato de teléfono inválido");
    return true;
  }
}

//Validaciones Para DocumentoVehiculo
export class ValidacionDocumentoVehiculo {

  static validarFechaEmision(fechaEmision) {
    const fecha = new Date(fechaEmision);
    const hoy = new Date();

    if (isNaN(fecha.getTime())) {
      throw errorTypes.ValidationError("La fecha de emisión no es válida");
    }
    if (fecha > hoy) {
      throw errorTypes.ValidationError(
        "La fecha de emisión no puede ser futura"
      );
    }
    return true;
  }

  static validarFechaVencimiento(fechaEmision, fechaVencimiento) {
    const emision = new Date(fechaEmision);
    const vencimiento = new Date(fechaVencimiento);

    if (isNaN(vencimiento.getTime())) {
      throw errorTypes.ValidationError("La fecha de vencimiento no es válida");
    }
    if (vencimiento <= emision) {
      throw errorTypes.ValidationError(
        "La fecha de vencimiento debe ser posterior a la de emisión"
      );
    }
    return true;
  }

  static validarEstado = (estado) => {
    const estadosValidos = ["Vigente", "Vencido", "Pendiente"];

    if (!estado) return true; // campo opcional

    const estadoNormalizado = estado.trim().toLowerCase();
    const valido = estadosValidos.some(
      (e) => e.toLowerCase() === estadoNormalizado
    );

    if (!valido) {
      throw errorTypes.ValidationError(
        "El estado debe ser uno de los siguientes: Vigente, Vencido o Pendiente"
      );
    }

    return true;
  };
}

export class ValidacionVehiculo {
  static validarPlaca = (placa) => {
    const placaRegex = /^[A-Z]{3}\d{3,4}$/;
    if (!placaRegex.test(placa)) {
      throw errorTypes.ValidationError(
        "La placa debe tener el formato válido (Ej: ABC123 o ABC1234, solo mayúsculas)"
      );
    }
    return true;
  };

  static validarModelo = (modelo) => {
    const modeloActual = new Date().getFullYear();
    if (!modelo || isNaN(modelo)) {
      throw errorTypes.ValidationError(
        "El año del modelo es obligatorio y debe ser un número válido"
      );
    }
    if (modelo < 1950)
      throw errorTypes.ValidationError(
        "El año del modelo no puede ser menor a 1950"
      );
    if (modelo > modeloActual + 1)
      throw errorTypes.ValidationError(
        "El año del modelo no puede ser mayor al próximo año"
      );
    return true;
  };
}

export class ValidacionLogin {
  static validarUsername(username) {
    if (!username || typeof username !== 'string' || username.trim() === '') {
      throw errorTypes.ValidationError("El nombre de usuario es obligatorio y debe ser una cadena válida");
    }
    return true;
  }

  static validarPassword(password) {
    if (!password || typeof password !== 'string' || password.trim() === '') {
      throw errorTypes.ValidationError("La contraseña es obligatoria y debe ser una cadena válida");
    }
    return true;
  }
}
