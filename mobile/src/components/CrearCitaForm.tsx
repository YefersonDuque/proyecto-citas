import { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";

import { Profesional } from "../types/Profesional";
import { consultarProfesionales } from "@/services/profesionales.api";
import { crearCita as crearCitaApi } from "@/services/citas.api";

type Props = {
  documento: string;
  onCitaAgendada: () => void;
};

export default function CrearCitaForm({ documento, onCitaAgendada }: Props) {
  const [profesionales, setProfesionales] = useState<Profesional[]>([]);
  const [cargandoProfesionales, setCargandoProfesionales] = useState(true);
  const [profesionalSeleccionado, setProfesionalSeleccionado] = useState<
    number | null
  >(null);
  const [selectorAbierto, setSelectorAbierto] = useState(false);
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [motivo, setMotivo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState<"exito" | "error" | "">("");
  const [guardando, setGuardando] = useState(false);

  const cargarProfesionales = async () => {
    try {
      setCargandoProfesionales(true);

      const datos = await consultarProfesionales();
      setProfesionales(datos);
    } catch (error) {
      console.error("Error al cargar profesionales:", error);

      setMensaje(
        error instanceof Error
          ? error.message
          : "No fue posible cargar los profesionales.",
      );
      setTipoMensaje("error");
    } finally {
      setCargandoProfesionales(false);
    }
  };

  useEffect(() => {
    cargarProfesionales();
  }, []);

  const crearCita = async () => {
    setMensaje("");
    setTipoMensaje("");

    if (!documento.trim()) {
      setMensaje("No se encontró el documento del usuario.");
      setTipoMensaje("error");
      return;
    }

    if (profesionalSeleccionado === null) {
      setMensaje("Por favor, seleccione un profesional.");
      setTipoMensaje("error");
      return;
    }

    if (!fecha.trim()) {
      setMensaje("Por favor, ingrese una fecha.");
      setTipoMensaje("error");
      return;
    }

    const formatoFecha = /^\d{4}-\d{2}-\d{2}$/;

    if (!formatoFecha.test(fecha)) {
      setMensaje(
        "La fecha debe tener el formato YYYY-MM-DD. Ejemplo: 2026-08-20",
      );
      setTipoMensaje("error");
      return;
    }

    const [anio, mes, dia] = fecha.split("-").map(Number);

    const fechaIngresada = new Date(anio, mes - 1, dia);

    if (
      fechaIngresada.getFullYear() !== anio ||
      fechaIngresada.getMonth() !== mes - 1 ||
      fechaIngresada.getDate() !== dia
    ) {
      setMensaje("La fecha ingresada no es válida.");
      setTipoMensaje("error");
      return;
    }

    if (!hora.trim()) {
      setMensaje("Por favor, ingrese una hora.");
      setTipoMensaje("error");
      return;
    }

    const formatoHora = /^([01]\d|2[0-3]):([0-5]\d)$/;

    if (!formatoHora.test(hora)) {
      setMensaje("La hora debe tener formato HH:MM. Ejemplo: 10:00");
      setTipoMensaje("error");
      return;
    }

    const [horas, minutos] = hora.split(":").map(Number);

    fechaIngresada.setHours(horas, minutos, 0, 0);

    const ahora = new Date();

    if (fechaIngresada <= ahora) {
      setMensaje(
        "La fecha y hora de la cita no pueden ser anteriores a la actual.",
      );
      setTipoMensaje("error");
      return;
    }

    if (!motivo.trim()) {
      setMensaje("Por favor, ingrese el motivo de la cita.");
      setTipoMensaje("error");
      return;
    }

    try {
      setGuardando(true);

      await crearCitaApi({
        documento,
        profesional_oid: profesionalSeleccionado,
        fecha,
        hora,
        motivo: motivo.trim(),
      });

      setMensaje("¡Cita agendada correctamente!");
      setTipoMensaje("exito");

      setProfesionalSeleccionado(null);
      setSelectorAbierto(false);
      setFecha("");
      setHora("");
      setMotivo("");

      onCitaAgendada();
    } catch (error) {
      console.error("Error al crear la cita:", error);

      if (error instanceof Error) {
        setMensaje(error.message);
      } else {
        setMensaje("Error al crear la cita.");
      }

      setTipoMensaje("error");
    } finally {
      setGuardando(false);
    }
  };

  const profesionalActual = profesionales.find(
    (profesional) => profesional.oid === profesionalSeleccionado,
  );

  return (
    <View style={styles.container}>
      {/* PROFESIONAL */}

      <Text style={styles.label}>Profesional</Text>

      <Pressable
        style={styles.selector}
        onPress={() => setSelectorAbierto(!selectorAbierto)}
        disabled={cargandoProfesionales}
      >
        <Text style={styles.placeholderTexto}>
          {cargandoProfesionales
            ? "Cargando profesionales..."
            : profesionalActual
              ? profesionalActual.profesional
              : "Seleccione un profesional"}
        </Text>

        <Text style={styles.flecha}>{selectorAbierto ? "▲" : "▼"}</Text>
      </Pressable>

      {selectorAbierto && (
        <View style={styles.opciones}>
          {cargandoProfesionales ? (
            <Text style={styles.sinProfesionales}>
              Cargando profesionales...
            </Text>
          ) : profesionales.length === 0 ? (
            <Text style={styles.sinProfesionales}>
              No hay profesionales disponibles.
            </Text>
          ) : (
            profesionales.map((profesional) => (
              <Pressable
                key={profesional.oid}
                style={styles.opcion}
                onPress={() => {
                  setProfesionalSeleccionado(profesional.oid);
                  setSelectorAbierto(false);
                }}
              >
                <Text style={styles.opcionTexto}>
                  {profesional.profesional}
                </Text>
              </Pressable>
            ))
          )}
        </View>
      )}

      {/* FECHA Y HORA */}

      <View style={styles.fechaHoraContainer}>
        <View style={styles.campoFecha}>
          <Text style={styles.label}>Fecha</Text>

          <TextInput
            style={styles.input}
            value={fecha}
            onChangeText={setFecha}
            placeholder="YYYY-MM-DD"
            keyboardType="numeric"
            maxLength={10}
          />
        </View>

        <View style={styles.campoHora}>
          <Text style={styles.label}>Hora</Text>

          <TextInput
            style={styles.input}
            value={hora}
            onChangeText={setHora}
            placeholder="HH:MM"
            keyboardType="numeric"
            maxLength={5}
          />
        </View>
      </View>

      {/* MOTIVO */}

      <Text style={styles.label}>Motivo</Text>

      <TextInput
        style={styles.inputMotivo}
        value={motivo}
        onChangeText={setMotivo}
        placeholder="Describe brevemente el motivo de la cita..."
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />

      {/* MENSAJE */}

      {mensaje !== "" && (
        <Text
          style={
            tipoMensaje === "exito" ? styles.mensajeExito : styles.mensajeError
          }
        >
          {mensaje}
        </Text>
      )}

      {/* BOTÓN */}

      <Pressable
        style={[
          styles.crearButton,
          guardando && styles.crearButtonDeshabilitado,
        ]}
        onPress={crearCita}
        disabled={guardando}
      >
        <Text style={styles.crearButtonText}>
          {guardando ? "Agendando..." : "Crear cita"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
  },

  label: {
    fontSize: 17,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
    marginTop: 15,
  },

  selector: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.85)",
  },

  placeholderTexto: {
    fontSize: 16,
    color: "#374151",
    flex: 1,
  },

  flecha: {
    fontSize: 14,
    marginLeft: 10,
    color: "#374151",
  },

  opciones: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    marginTop: 4,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    overflow: "hidden",
  },

  opcion: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  opcionTexto: {
    fontSize: 16,
    color: "#374151",
  },

  sinProfesionales: {
    padding: 14,
    fontSize: 16,
    color: "#6B7280",
  },

  fechaHoraContainer: {
    flexDirection: "row",
    gap: 10,
  },

  campoFecha: {
    flex: 1,
  },

  campoHora: {
    flex: 1,
  },

  input: {
    width: "100%",
    minHeight: 48,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    fontSize: 16,
  },

  inputMotivo: {
    width: "100%",
    minHeight: 100,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    fontSize: 16,
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

  crearButton: {
    width: "100%",
    backgroundColor: "#2563EB",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },

  crearButtonDeshabilitado: {
    opacity: 0.6,
  },

  crearButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
