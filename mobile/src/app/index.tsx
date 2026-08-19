import { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { StyleSheet } from "react-native";

import { Cita } from "../types/Cita";
import CitaCard from "../components/CitaCard";
import { Usuario } from "../types/Usuario";
import UsuarioCard from "../components/UsuarioCard";

export default function HomeScreen() {
  const [documento, setDocumento] = useState("");
  const [citas, setCitas] = useState<Cita[]>([]);
  const [mensaje, setMensaje] = useState("");
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [busquedarealizada, setBusquedaRealizada] = useState(false);

  const actualizarEstadoCita = async (oid: number, estado: number) => {
    try {
      const respuesta = await fetch(`http://localhost:3000/citas/${oid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          estado: estado,
        }),
      });

      const datos = await respuesta.json();

      setCitas((citasActuales) =>
        citasActuales.map((cita) =>
          cita.oid === oid
            ? {
                ...cita,
                estado_cita: estado === 4 ? "CONFIRMADO" : "CANCELADO",
              }
            : cita,
        ),
      );

      console.log("Respuesta:", datos);
    } catch (error) {
      console.error("Error al actualizar estado de la cita:", error);
    }
  };

  const buscarUsuario = async () => {
    setMensaje("");
    setUsuario(null);
    setCitas([]);

    if (!documento) {
      setMensaje("Por favor, ingresa tu documento");
      return;
    }
    setBusquedaRealizada(true);
    try {
      const respuesta = await fetch(
        `http://localhost:3000/usuarios/${documento}`,
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        setMensaje(datos.message);
        return;
      }

      setUsuario(datos);
    } catch (error) {
      console.error("Error al consultar usuario:", error);
      setMensaje("Error al consultar el usuario");
    }
  };

  const buscarCitas = async () => {
    setMensaje("");
    setCitas([]);

    if (!documento) {
      setMensaje("Por favor, ingresa tu documento");
      return;
    }

    const respuesta = await fetch(
      `http://localhost:3000/usuarios/${documento}/citas`,
    );

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      setMensaje(datos.message);
      setCitas([]);
      return;
    }

    if (!Array.isArray(datos)) {
      setMensaje(datos.message);
      setCitas([]);
      return;
    }

    setMensaje("");
    setCitas(datos);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Citas Médicas</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Documento</Text>

        <TextInput
          style={styles.input}
          value={documento}
          onChangeText={setDocumento}
        />

        {/* <Pressable style={styles.button} onPress={buscarCitas}>
          <Text style={styles.buttonText}>Buscar citas</Text>
        </Pressable> */}
        <Pressable style={styles.button} onPress={buscarUsuario}>
          <Text style={styles.buttonText}>Buscar usuario</Text>
        </Pressable>
      </View>

      {/* {mensaje !== "" && <Text>{mensaje}</Text>}

      {citas.map((cita) => (
        <CitaCard
          key={cita.oid}
          cita={cita}
          actualizarEstadoCita={actualizarEstadoCita}
        />
      ))} */}
      {mensaje !== "" && <Text>{mensaje}</Text>}

      {usuario !== null && <UsuarioCard usuario={usuario} />}

      {citas.map((cita) => (
        <CitaCard
          key={cita.oid}
          cita={cita}
          actualizarEstadoCita={actualizarEstadoCita}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },

  form: {
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
  },

  label: {
    fontSize: 16,
    marginBottom: 8,
  },

  input: {
    width: "100%",
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },

  button: {
    width: "100%",
    backgroundColor: "#2563EB",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
