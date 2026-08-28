import { API_URL } from "../config/api";
import { Cita } from "../types/Cita";

export const consultarCitasUsuario = async (
  documento: string,
): Promise<Cita[]> => {
  try {
    const respuesta = await fetch(`${API_URL}/usuarios/${documento}/citas`);

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(
        datos.msg || datos.message || "Error al consultar las citas.",
      );
    }

    if (!Array.isArray(datos.msg)) {
      throw new Error("La respuesta del servidor no es un arreglo de citas.");
    }

    return datos.msg;
  } catch (error) {
    console.error("Error al consultar citas:", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Error al consultar las citas");
  }
};

export type DatosCita = {
  documento: string;
  profesional_oid: number;
  fecha: string;
  hora: string;
  motivo: string;
};

export const crearCita = async (cita: DatosCita): Promise<void> => {
  try {
    const respuesta = await fetch(`${API_URL}/citas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cita),
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(
        datos.msg || datos.message || "No fue posible crear la cita.",
      );
    }
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
        datos.msg ||
          datos.message ||
          "No fue posible actualizar el estado de la cita.",
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
