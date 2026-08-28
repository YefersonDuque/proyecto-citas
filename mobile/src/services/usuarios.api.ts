import { API_URL } from "../config/api";
import { Usuario } from "../types/Usuario";

export const ConsultarUsuario = async (
  documento: string,
): Promise<Usuario | null> => {
  try {
    const respuesta = await fetch(`${API_URL}/usuarios/${documento}`);
    const datos = await respuesta.json();
    console.log("Respuesta de consultar usuario:", datos);
    if (!respuesta.ok) {
      const error = new Error(datos.msg || "Error al consutlar el usuario.");

      (error as Error & { status?: number }).status = respuesta.status;
      throw error;
    }

    //back, devuelve msg:0 cuando no encuentra el usuario
    if (datos.msg === 0) {
      return null;
    }

    //back, encia los resultados dentro de msg como un erreglo.
    return datos.msg[0] ?? null;
  } catch (error) {
    console.error("Error al consultar usuario:", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Error desconocido al consultar el usuario.");
  }
};

export type DatosUsuario = Pick<
  Usuario,
  | "documento"
  | "nombre"
  | "apellido"
  | "telefono"
  | "correo"
  | "fecha_nacimiento"
>;

export const crearUsuario = async (usuario: DatosUsuario): Promise<string> => {
  const respuesta = await fetch(`${API_URL}/usuarios`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(usuario),
  });

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(datos.msg || "No fue posible crear el usuario.");
  }

  return datos.msg;
};

export const actualizarUsuario = async (
  documento: string,
  datosUsuario: Omit<DatosUsuario, "documento">,
): Promise<string> => {
  const respuesta = await fetch(`${API_URL}/usuarios/${documento}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datosUsuario),
  });

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(datos.msg || "No fue posible actualizar el usuario.");
  }

  return datos.msg;
};
