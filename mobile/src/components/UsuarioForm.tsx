import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { Usuario } from "../types/Usuario";

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
  const [nombre, setNombre] = useState(usuario?.nombre ?? "");
  const [apellido, setApellido] = useState(usuario?.apellido ?? "");
  const [telefono, setTelefono] = useState(usuario?.telefono ?? "");
  const [correo, setCorreo] = useState(usuario?.correo ?? "");
  const [fecha_nacimiento, setFecha_nacimiento] = useState(
    usuario?.fecha_nacimiento ?? "",
  );

  const crearUsuario = async () => {
    try {
      const respuesta = await fetch(`http://localhost:3000/usuarios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documento,
          nombre,
          apellido,
          telefono,
          correo,
          fecha_nacimiento,
        }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        console.error("Error al crear usuario:", datos);
        return;
      }

      console.log("Usuario creado:", datos);

      onUsuarioGuardado(datos);
    } catch (error) {
      console.error("Error al crear usuario:", error);
    }
  };

  const modificarUsuario = async () => {
    try {
      const respuesta = await fetch(
        `http://localhost:3000/usuarios/${documento}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre,
            apellido,
            telefono,
            correo,
            fecha_nacimiento,
          }),
        },
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        console.error("Error al modificar usuario:", datos);
        return;
      }

      console.log("Usuario modificado:", datos);

      onUsuarioGuardado(datos);
    } catch (error) {
      console.error("Error al modificar usuario:", error);
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
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Fecha de nacimiento</Text>

        <TextInput
          style={styles.input}
          value={fecha_nacimiento}
          onChangeText={setFecha_nacimiento}
        />
      </View>

      <Pressable
        style={styles.button}
        onPress={usuario ? modificarUsuario : crearUsuario}
      >
        <Text style={styles.buttonText}>
          {usuario ? "Guardar cambios" : "Crear usuario"}
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
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
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
