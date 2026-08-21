export function capitalizarTexto(texto: string) {
  return texto
    .toLowerCase()
    .split(" ")
    .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(" ");
}

export function capitalizarPrimeraLetra(texto: string) {
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
}

export function formatearFecha(fecha: string) {
  if (!fecha) {
    return "";
  }
  const fechaSinHora = fecha.split("T")[0];
  const partes = fechaSinHora.split("-");

  return `${partes[2]}-${partes[1]}-${partes[0]}`;
}

export function formatearHora(hora: string) {
  const partes = hora.split(":");

  return `${partes[0]}:${partes[1]}`;
}
