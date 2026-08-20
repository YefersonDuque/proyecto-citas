import { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { StyleSheet } from "react-native";

import UsuarioForm from "@/components/UsuarioForm";
import { Cita } from "../types/Cita";
import CitaCard from "../components/CitaCard";
import { Usuario } from "../types/Usuario";
import UsuarioCard from "../components/UsuarioCard";

type Modo = "usuario" | "editar" | "citas" | "agendar";

export default function HomeScreen() {
  const [documento, setDocumento] = useState("");
  const [citas, setCitas] = useState<Cita[]>([]);
  const [mensaje, setMensaje] = useState("");
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);
  const [mensajeCitas, setMensajeCitas] = useState("");
  const [modo, setModo] = useState<Modo>("usuario");

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
    setMensajeCitas("");
    setUsuario(null);
    setCitas([]);
    setBusquedaRealizada(false);
    setModo("usuario");

    if (!documento) {
      setMensaje("Por favor, ingresa tu documento");
      return;
    }

    try {
      const respuesta = await fetch(
        `http://localhost:3000/usuarios/${documento}`,
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        setMensaje(datos.message);
        setBusquedaRealizada(true);
        return;
      }

      setBusquedaRealizada(true);
      setUsuario(datos);
    } catch (error) {
      console.error("Error al consultar usuario:", error);
      setMensaje("Error al consultar el usuario");
    }
  };

  const editarUsuario = () => {
    setModo("editar");
  };

  const agendarCitas = () => {
    setModo("agendar");
  };

  const buscarCitas = async () => {
    setMensajeCitas("");
    setCitas([]);

    if (!documento) {
      setMensajeCitas("Por favor, ingresa tu documento");
      return;
    }

    try {
      const respuesta = await fetch(
        `http://localhost:3000/usuarios/${documento}/citas`,
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        setMensajeCitas(datos.message);
        return;
      }

      if (!Array.isArray(datos)) {
        setMensajeCitas(datos.message);
        return;
      }

      setModo("citas");

      if (datos.length === 0) {
        setMensajeCitas("No tienes citas registradas.");
        return;
      }

      setCitas(datos);
    } catch (error) {
      console.error("Error al consultar citas:", error);
      setMensajeCitas("Error al consultar las citas");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Citas Médicas</Text>

      {modo === "usuario" && !busquedaRealizada && (
        <View style={styles.form}>
          <Text style={styles.label}>Documento</Text>

          <TextInput
            style={styles.input}
            value={documento}
            onChangeText={setDocumento}
          />

          <Pressable style={styles.button} onPress={buscarUsuario}>
            <Text style={styles.buttonText}>Buscar usuario</Text>
          </Pressable>
        </View>
      )}

      {/* MENSAJE DE USUARIO */}
      {mensaje !== "" && usuario === null && (
        <Text style={styles.message}>{mensaje}</Text>
      )}

      {/* USUARIO EXISTENTE */}
      {usuario !== null && modo === "usuario" && (
        <>
          <View style={styles.volverContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.volver,
                pressed && styles.volverPresionado,
              ]}
              onPress={() => {
                setUsuario(null);
                setBusquedaRealizada(false);
                setModo("usuario");
              }}
            >
              <Text style={styles.textoVolver}>← Volver</Text>
            </Pressable>
          </View>
          <UsuarioCard usuario={usuario} />

          <View style={styles.actions}>
            <Pressable style={styles.actionButton} onPress={editarUsuario}>
              <Text style={styles.buttonText}>Editar datos</Text>
            </Pressable>

            <Pressable style={styles.actionButton} onPress={buscarCitas}>
              <Text style={styles.buttonText}>Consultar citas</Text>
            </Pressable>
          </View>
        </>
      )}

      {/* EDITAR USUARIO */}
      {usuario !== null && modo === "editar" && (
        <>
          <View style={styles.volverContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.volver,
                pressed && styles.volverPresionado,
              ]}
              onPress={() => setModo("usuario")}
            >
              <Text style={styles.textoVolver}> ← Volver </Text>
            </Pressable>
          </View>
          <UsuarioForm
            documento={usuario.documento}
            usuario={usuario}
            onUsuarioGuardado={(usuarioActualizado) => {
              setUsuario(usuarioActualizado);
              setModo("usuario");
            }}
          />
        </>
      )}

      {/* CREAR USUARIO */}
      {busquedaRealizada && usuario === null && (
        <>
          <View style={styles.volverContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.volver,
                pressed && styles.volverPresionado,
              ]}
              onPress={() => setModo("usuario")}
            >
              <Text style={styles.textoVolver}>← Volver</Text>
            </Pressable>
          </View>
          <UsuarioForm
            documento={documento}
            onUsuarioGuardado={(usuarioCreado) => {
              setUsuario(usuarioCreado);
              setMensaje("");
            }}
          />
        </>
      )}

      {modo === "citas" && (
        <>
          <View style={styles.volverContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.volver,
                pressed && styles.volverPresionado,
              ]}
              onPress={() => setModo("usuario")}
            >
              <Text style={styles.textoVolver}> ← Volver </Text>
            </Pressable>
          </View>
          <View>
            {mensajeCitas !== "" && (
              <Text style={styles.message}>{mensajeCitas}</Text>
            )}

            {citas.map((cita) => (
              <CitaCard
                key={cita.oid}
                cita={cita}
                actualizarEstadoCita={actualizarEstadoCita}
              />
            ))}

            <Pressable style={styles.agendarCita} onPress={agendarCitas}>
              <Text style={styles.buttonText}>+ Agendar cita</Text>
            </Pressable>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  agendarCita: {
    maxWidth: 500,
    alignSelf: "center",
    width: "100%",
    backgroundColor: "#2563EB",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
    marginTop: 15,
  },

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
    textAlign: "center",
  },

  label: {
    fontSize: 25,
    marginBottom: 8,
    fontWeight: "bold",
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
    marginBottom: 10,
  },

  volverContainer: {
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
    marginBottom: 10,
  },

  volver: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginBottom: 10,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 15.55,
    shadowRadius: 14,
    elevation: 1,
  },

  volverPresionado: {
    opacity: 0.85,
    transform: [{ scale: 0.94 }],
    shadowOpacity: 0.05,
    elevation: 1,
  },

  textoVolver: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
  },

  actions: {
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
    marginTop: 10,
    flexDirection: "row",
    gap: 10,
  },

  actionButton: {
    flex: 1,
    backgroundColor: "#2563EB",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  message: {
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 10,
    fontSize: 16,
  },
});
