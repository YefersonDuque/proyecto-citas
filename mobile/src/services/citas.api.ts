import { API_URL } from "../config/api";
import { Cita } from "../types/Cita";

export const consultarCitasUsuario = async (
  documento: string,
): Promise<Cita[]> => {
  try {
    const respuesta = await fetch(`${API_URL}/usuarios/${documento}/citas`);

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(datos.message || "Error al consultar las citas");
    }

    return datos;
  } catch (error) {
    console.error("Error al consultar citas:", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Error al consultar las citas");
  }
};

export const crearCita = async (
  documento: string,
  profesional_oid: number,
  fecha: string,
  hora: string,
  motivo: string,
) => {
  try {
    const respuesta = await fetch(`${API_URL}/citas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        documento,
        profesional_oid,
        fecha,
        hora,
        motivo,
      }),
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(datos.message || "No fue posible crear la cita.");
    }

    return datos;
  } catch (error) {
    console.error("Error al crear la cita:", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Error al conectar con el servidor.");
  }
};

export const actualizarEstadoCita = async (oid: number, estado: number) => {
  try {
    const respuesta = await fetch(`${API_URL}/citas/${oid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        estado,
      }),
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(
        datos.message || "No fue posible actualizar el estado de la cita.",
      );
    }

    return datos;
  } catch (error) {
    console.error("Error al actualizar estado de la cita:", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Error al actualizar el estado de la cita.");
  }
};
