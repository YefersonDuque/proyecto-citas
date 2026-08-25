import { API_URL } from "../config/api";
import { Profesional } from "../types/Profesional";

export const consultarProfesionales = async () => {
  try {
    const respuesta = await fetch(`${API_URL}/profesionales`);

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(datos.message || "Error consultando profesionales");
    }

    return datos;
  } catch (error) {
    console.error("Error al consultar profesionales:", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Error al consultar profesionales");
  }
};
