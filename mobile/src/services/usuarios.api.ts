import { API_URL } from "../config/api";
import { Usuario } from "../types/Usuario";

export const consultarUsuario = async (documento: string): Promise<Usuario> => {
  try {
    const respuesta = await fetch(`${API_URL}/usuarios/${documento}`);

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      const error = new Error(datos.message || "Error al consultar el usuario");

      (error as Error & { status?: number }).status = respuesta.status;

      throw error;
    }

    return datos;
  } catch (error) {
    console.error("Error al consultar usuario:", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Error al consultar el usuario");
  }
};
