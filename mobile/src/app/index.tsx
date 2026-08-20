import { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { StyleSheet } from "react-native";

import UsuarioForm from "@/components/UsuarioForm";
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
  const [editandoUsuario, setEditandoUsuario] = useState(false);
  const [mensajeCitas, setMensajeCitas] = useState("");

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
    setEditandoUsuario(false);

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
    setEditandoUsuario(true);
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

      {/* MENSAJE DE USUARIO */}
      {mensaje !== "" && usuario === null && (
        <Text style={styles.message}>{mensaje}</Text>
      )}

      {/* USUARIO EXISTENTE */}
      {usuario !== null && !editandoUsuario && (
        <>
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
      {usuario !== null && editandoUsuario && (
        <UsuarioForm
          documento={usuario.documento}
          usuario={usuario}
          onUsuarioGuardado={(usuarioActualizado) => {
            setUsuario(usuarioActualizado);
            setEditandoUsuario(false);
          }}
        />
      )}

      {/* CREAR USUARIO */}
      {busquedarealizada && usuario === null && (
        <UsuarioForm
          documento={documento}
          onUsuarioGuardado={(usuarioCreado) => {
            setUsuario(usuarioCreado);
            setMensaje("");
          }}
        />
      )}

      {/* MENSAJE DE CITAS */}
      {mensajeCitas !== "" && (
        <Text style={styles.message}>{mensajeCitas}</Text>
      )}

      {/* CITAS */}
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
    marginBottom: 10,
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
