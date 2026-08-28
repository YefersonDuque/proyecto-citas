export const ESTADOS_CITA = {
  PENDIENTE: 3,
  CONFIRMADO: 4,
  CANCELADO: 5,
  ATENDIDO: 6,
};

export const NOMBRES_ESTADOS_CITA: Record<number, string> = {
  [ESTADOS_CITA.PENDIENTE]: "Pendiente",
  [ESTADOS_CITA.CONFIRMADO]: "Confirmado",
  [ESTADOS_CITA.CANCELADO]: "Cancelado",
  [ESTADOS_CITA.ATENDIDO]: "Atendido",
};
