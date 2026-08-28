import { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ImageBackground,
  StyleSheet,
} from "react-native";

import CrearCitaForm from "@/components/CrearCitaForm";
import UsuarioForm from "@/components/UsuarioForm";
import CitaCard from "../components/CitaCard";
import UsuarioCard from "../components/UsuarioCard";

import { Cita } from "../types/Cita";
import { Usuario } from "../types/Usuario";

import {
  consultarCitasUsuario,
  actualizarEstadoCita as actualizarEstadoCitaApi,
} from "@/services/citas.api";

import { ConsultarUsuario } from "@/services/usuarios.api";

type Modo = "usuario" | "editar" | "citas" | "crear";

export default function HomeScreen() {
  const [documento, setDocumento] = useState("");
  const [citas, setCitas] = useState<Cita[]>([]);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);
  const [mensajeCitas, setMensajeCitas] = useState("");
  const [modo, setModo] = useState<Modo>("usuario");
  const nombresEstados: Record<number, string> = {
    3: "PENDIENTE",
    4: "CONFIRMADO",
    5: "CANCELADO",
    6: "ATENDIDO",
  };

  const citasFiltradas = citas.filter((cita) => {
    return estadoSeleccionado === "" || cita.estado_cita === estadoSeleccionado;
  });

  const editarUsuario = () => {
    setModo("editar");
  };

  const crearCitas = () => {
    setModo("crear");
  };

  const actualizarEstadoCita = async (oid: number, estado: number) => {
    try {
      await actualizarEstadoCitaApi(oid, estado);

      setCitas((citasActuales) =>
        citasActuales.map((cita) =>
          cita.oid === oid
            ? {
                ...cita,
                estado_cita: nombresEstados[estado],
              }
            : cita,
        ),
      );
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
    setEstadoSeleccionado("");

    const documentoLimpio = documento.trim();

    if (!documentoLimpio) {
      setMensaje("Por favor, ingresa tu documento");
      return;
    }

    if (documento.length !== 10) {
      setMensaje(
        "No es un documento válido, el documento debe tener 10 dígitos",
      );
      return;
    }

    try {
      const usuarioConsultado = await ConsultarUsuario(documentoLimpio);

      setBusquedaRealizada(true);
      setUsuario(usuarioConsultado);
    } catch (error) {
      console.error("Error al consultar usuario:", error);

      // Cualquier otro error
      if (error instanceof Error) {
        setMensaje(error.message);
      } else {
        setMensaje("Error al consultar el usuario");
      }
    }
  };

  const buscarCitas = async () => {
    setMensajeCitas("");
    setCitas([]);
    setEstadoSeleccionado("");

    if (!documento.trim()) {
      setMensajeCitas("Por favor, ingresa tu documento");
      return;
    }

    try {
      const datos = await consultarCitasUsuario(documento);

      setModo("citas");

      // if (datos.length === 0) {
      //   setMensajeCitas("No tienes citas registradas.");
      //   return;
      // }

      setCitas(datos);
    } catch (error) {
      console.error("Error al consultar citas:", error);

      setModo("citas");

      if (error instanceof Error) {
        setMensajeCitas(error.message);
      } else {
        setMensajeCitas("Error al consultar las citas");
      }
    }
  };

  return (
    <View style={styles.background}>
      <ImageBackground
        source={require("../../assets/images/fondo-medico.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Citas Médicas</Text>

          {/* BUSCAR USUARIO */}

          {modo === "usuario" && !busquedaRealizada && (
            <View style={styles.form}>
              <Text style={styles.label}>Documento</Text>

              <TextInput
                style={styles.input}
                value={documento}
                onChangeText={setDocumento}
                keyboardType="numeric"
                maxLength={10}
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
                  <Text style={styles.textoVolver}>← Volver</Text>
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
                  onPress={() => {
                    setBusquedaRealizada(false);
                    setMensaje("");
                    setModo("usuario");
                  }}
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

          {/* CITAS */}

          {modo === "citas" && (
            <>
              <View style={styles.volverContainer}>
                <Pressable
                  style={({ pressed }) => [
                    styles.volver,
                    pressed && styles.volverPresionado,
                  ]}
                  onPress={() => {
                    setModo("usuario");
                    setEstadoSeleccionado("");
                  }}
                >
                  <Text style={styles.textoVolver}>← Volver</Text>
                </Pressable>
              </View>
              <View style={styles.filtroContainer}>
                <Text style={styles.filtroTitulo}>
                  Filtre por estados de la cita
                </Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={estadoSeleccionado}
                    onValueChange={(value) => {
                      setEstadoSeleccionado(value);
                    }}
                  >
                    <Picker.Item label="Seleccione un estado" value={""} />
                    <Picker.Item label="Pendiente" value={"PENDIENTE"} />
                    <Picker.Item label="Confirmado" value={"CONFIRMADO"} />
                    <Picker.Item label="Cancelado" value={"CANCELADO"} />
                    <Picker.Item label="Atendido" value={"ATENDIDO"} />
                  </Picker>
                </View>
              </View>

              <View style={styles.volverContainer}>
                {mensajeCitas !== "" && (
                  <Text style={styles.message}>{mensajeCitas}</Text>
                )}

                {citasFiltradas.length === 0 ? (
                  <Text style={styles.textoVolver}>
                    No tiene citas registradas con el estado seleccionado.
                  </Text>
                ) : (
                  citasFiltradas.map((cita) => (
                    <CitaCard
                      key={cita.oid}
                      cita={cita}
                      actualizarEstadoCita={actualizarEstadoCita}
                    />
                  ))
                )}

                <Pressable style={styles.crearCita} onPress={crearCitas}>
                  <Text style={styles.buttonText}>+ Crear cita</Text>
                </Pressable>
              </View>
            </>
          )}

          {/* CREAR CITA */}

          {modo === "crear" && (
            <>
              <View style={styles.volverContainer}>
                <Pressable
                  style={styles.volver}
                  onPress={() => setModo("citas")}
                >
                  <Text style={styles.textoVolver}>← Volver</Text>
                </Pressable>
              </View>

              {usuario && (
                <CrearCitaForm
                  documento={usuario.documento}
                  onCitaAgendada={buscarCitas}
                />
              )}
            </>
          )}
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  filtroContainer: {
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },

  filtroTitulo: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 10,
  },

  pickerContainer: {
    borderWidth: 2,
    borderColor: "#D1D5DB",
    borderRadius: 18,
    backgroundColor: "#F9FAFB",
    overflow: "hidden",
  },
  crearCita: {
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

  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  background: {
    flex: 1,
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
    backgroundColor: "rgba(255, 255, 255, 0.85)",
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
    shadowOpacity: 0.15,
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
