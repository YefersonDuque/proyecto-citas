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

const validarDatosUsuario = ({
  documento,
  nombre,
  apellido,
  telefono,
  correo,
  fecha_nacimiento,
}) => {
  if (
    !documento ||
    !nombre ||
    !apellido ||
    !telefono ||
    !correo ||
    !fecha_nacimiento
  ) {
    return "Todos los campos son obligatorios";
  }

  if (documento.length > 20) {
    return "El documento no puede superar los 20 caracteres";
  }

  const telefonoRegex = /^[0-9]{10}$/;

  if (!telefonoRegex.test(telefono)) {
    return "El teléfono debe contener exactamente 10 dígitos";
  }

  const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!correoRegex.test(correo)) {
    return "El correo electrónico no tiene un formato válido";
  }

  if (!esFechaValida(fecha_nacimiento)) {
    return "La fecha de nacimiento no es válida";
  }

  return null;
};

module.exports = {
  validarDatosUsuario,
  esFechaValida,
};
