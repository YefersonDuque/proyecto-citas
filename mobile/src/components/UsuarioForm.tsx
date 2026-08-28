import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { Usuario } from "../types/Usuario";
import { formatearFecha } from "@/utils/formato";
import {
  crearUsuario as crearUsuarioApi,
  actualizarUsuario as actualizarUsuarioApi,
  type DatosUsuario,
} from "@/services/usuarios.api";
type UsuarioFormProps = {
  documento: string;
  usuario?: Usuario;
  onUsuarioGuardado: (usuario: Usuario) => void;
};

export default function UsuarioForm({
  documento,
  usuario,
  onUsuarioGuardado,
}: UsuarioFormProps) {
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState<"exito" | "error" | "">("");
  const [guardando, setGuardando] = useState(false);
  const [nombre, setNombre] = useState(usuario?.nombre ?? "");
  const [apellido, setApellido] = useState(usuario?.apellido ?? "");
  const [telefono, setTelefono] = useState(usuario?.telefono ?? "");
  const [correo, setCorreo] = useState(usuario?.correo ?? "");
  const [fecha_nacimiento, setFecha_nacimiento] = useState(
    usuario?.fecha_nacimiento ? usuario.fecha_nacimiento.split("T")[0] : "",
  );

  const obtenerDatosFormulario = (): Omit<DatosUsuario, "documento"> => ({
    nombre,
    apellido,
    telefono,
    correo,
    fecha_nacimiento,
  });

  const validarFormulario = () => {
    setMensaje("");
    setTipoMensaje("");

    if (
      !documento.trim() ||
      !nombre.trim() ||
      !apellido.trim() ||
      !telefono.trim() ||
      !correo.trim() ||
      !fecha_nacimiento.trim()
    ) {
      setMensaje("Todos los campos son obligatorios.");
      setTipoMensaje("error");
      return false;
    }

    if (!documento) {
      setMensaje("Por favor ingrese el documento");
      setTipoMensaje("error");
      return false;
    }

    if (documento.length < 9) {
      setMensaje("Documento invaido, debe tener 10 digitos");
      setTipoMensaje("error");
      return false;
    }

    const telefonoValido = /^[0-9]{10}$/;

    if (!telefonoValido.test(telefono.trim())) {
      setMensaje("El teléfono debe tener 10 dígitos.");
      setTipoMensaje("error");
      return false;
    }

    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!correoValido.test(correo.trim())) {
      setMensaje("Ingresa un correo electrónico válido.");
      setTipoMensaje("error");
      return false;
    }

    const fechaValida = /^\d{4}-\d{2}-\d{2}$/;

    if (!fechaValida.test(fecha_nacimiento.trim())) {
      setMensaje(
        "La fecha debe tener el formato YYYY-MM-DD. Ejemplo: 2026-08-20",
      );
      setTipoMensaje("error");
      return false;
    }

    const [anio, mes, dia] = fecha_nacimiento.split("-").map(Number);

    const fechaIngresada = new Date(anio, mes - 1, dia);

    if (
      fechaIngresada.getFullYear() !== anio ||
      fechaIngresada.getMonth() !== mes - 1 ||
      fechaIngresada.getDate() !== dia
    ) {
      setMensaje("La fecha ingresada no es válida.");
      setTipoMensaje("error");
      return false;
    }

    return true;
  };

  const crearUsuario = async () => {
    if (!validarFormulario()) {
      return;
    }

    try {
      setGuardando(true);
      const datosFormulario = obtenerDatosFormulario();
      const mensajeRespuesta = await crearUsuarioApi({
        documento,
        ...datosFormulario,
        nombre,
        apellido,
        telefono,
        correo,
        fecha_nacimiento,
      });

      setMensaje(mensajeRespuesta || "¡Usuario creado correctamente!");
      setTipoMensaje("exito");

      // el back confirma la creacion con un mensaje pero no devuelve el usuario. creamos el objeto para actualizar la interface local
      const usuarioCreado: Usuario = {
        oid: 0,
        documento,
        ...datosFormulario,
        estado: 1,
      };

      onUsuarioGuardado(usuarioCreado);
    } catch (error) {
      console.error("Error al crear usuario:", error);

      setMensaje(
        error instanceof Error
          ? error.message
          : "Error desconocido al crear el usuario.",
      );
      setTipoMensaje("error");
    } finally {
      setGuardando(false);
    }
  };
  const actualizarUsuario = async () => {
    if (!validarFormulario()) {
      return;
    }

    try {
      setGuardando(true);
      const datosFormulario = obtenerDatosFormulario();
      const mensajeRespuesta = await actualizarUsuarioApi(
        documento,
        datosFormulario,
      );

      setMensaje(mensajeRespuesta || "¡Usuario modificado correctamente!");
      setTipoMensaje("exito");

      // Conservamos los campos que no edita el formulario.
      const usuarioActualizado: Usuario = {
        oid: usuario?.oid ?? 0,
        documento,
        ...datosFormulario,
        estado: usuario?.estado ?? 1,
      };

      onUsuarioGuardado(usuarioActualizado);
    } catch (error) {
      console.error("Error al actualizar usuario:", error);

      setMensaje(
        error instanceof Error
          ? error.message
          : "Error al conectar con el servidor.",
      );
      setTipoMensaje("error");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        {usuario ? "Editar usuario" : "Registrar usuario"}
      </Text>

      <View style={styles.row}>
        <Text style={styles.fieldLabel}>Documento</Text>
        <Text>{documento}</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Nombre</Text>

        <TextInput
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Apellido</Text>

        <TextInput
          style={styles.input}
          value={apellido}
          onChangeText={setApellido}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Teléfono</Text>

        <TextInput
          style={styles.input}
          value={telefono}
          onChangeText={setTelefono}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Correo</Text>

        <TextInput
          style={styles.input}
          value={correo}
          onChangeText={setCorreo}
          placeholder="tucorreo@gmail.com"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Fecha de nacimiento</Text>

        <TextInput
          style={styles.input}
          value={fecha_nacimiento}
          onChangeText={setFecha_nacimiento}
          placeholder="YYYY-MM-DD"
        />
      </View>

      {mensaje !== "" && (
        <Text
          style={
            tipoMensaje === "exito" ? styles.mensajeExito : styles.mensajeError
          }
        >
          {mensaje}
        </Text>
      )}

      <Pressable
        style={[styles.button, guardando && styles.buttonDeshabilitado]}
        onPress={usuario ? actualizarUsuario : crearUsuario}
        disabled={guardando}
      >
        <Text style={styles.buttonText}>
          {guardando
            ? usuario
              ? "Guardando..."
              : "Creando..."
            : usuario
              ? "Guardar cambios"
              : "Crear usuario"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
    backgroundColor: "rgba(255, 255, 255, 0.85)",
  },
  mensajeExito: {
    marginTop: 15,
    padding: 10,
    fontSize: 16,
    fontWeight: "600",
    color: "#166534",
    backgroundColor: "#DCFCE7",
    borderRadius: 8,
  },

  mensajeError: {
    marginTop: 15,
    padding: 10,
    fontSize: 16,
    fontWeight: "600",
    color: "#B91C1C",
    backgroundColor: "#FEE2E2",
    borderRadius: 8,
  },
  buttonDeshabilitado: {
    opacity: 0.6,
  },

  message: {
    color: "red",
    textAlign: "center",
    marginBottom: 15,
    fontWeight: "bold",
  },

  title: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

  fieldLabel: {
    fontWeight: "bold",
    width: 120,
  },

  inputContainer: {
    marginBottom: 15,
  },

  inputLabel: {
    fontWeight: "bold",
    marginBottom: 6,
  },

  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    width: "100%",
  },

  button: {
    backgroundColor: "#2563EB",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 5,
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
