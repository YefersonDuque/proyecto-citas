const esFechaValida = (fecha) => {
  const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (!fechaRegex.test(fecha)) {
    return false;
  }

  const [anio, mes, dia] = fecha.split("-").map(Number);

  const fechaObjeto = new Date(anio, mes - 1, dia);

  return (
    fechaObjeto.getFullYear() === anio &&
    fechaObjeto.getMonth() === mes - 1 &&
    fechaObjeto.getDate() === dia
  );
};

const esHoraValida = (hora) => {
  const horaRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

  return horaRegex.test(hora);
};

const validarDatosCita = ({
  documento,
  profesional_oid,
  fecha,
  hora,
  motivo,
}) => {
  if (!documento || !profesional_oid || !fecha || !hora || !motivo) {
    return "Todos los campos son obligatorios";
  }

  if (documento.length > 20) {
    return "El documento no puede superar los 20 caracteres";
  }

  if (!Number.isInteger(Number(profesional_oid))) {
    return "El profesional no es válido";
  }

  if (!esFechaValida(fecha)) {
    return "La fecha de la cita no es válida";
  }

  if (!esHoraValida(hora)) {
    return "La hora de la cita no es válida";
  }

  if (motivo.length > 200) {
    return "El motivo no puede superar los 200 caracteres";
  }

  return null;
};

module.exports = {
  validarDatosCita,
  esFechaValida,
  esHoraValida,
};
