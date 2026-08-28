import { API_URL } from "../config/api";
import { Profesional } from "../types/Profesional";

export const consultarProfesionales = async (): Promise<Profesional[]> => {
  try {
    const respuesta = await fetch(`${API_URL}/profesionales`);

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(datos.msg || "Error consultando profesionales");
    }

    if(!Array.isArray(datos.msg)) {
      throw new Error("La respuesta del servidor no es un arreglo de profesionales");
    }

    return datos.msg;
  } catch (error) {
    console.error("Error al consultar profesionales:", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Error al consultar profesionales");
  }
};
