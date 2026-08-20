import { useState, useEffect } from "react";

import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";

import { Profesional } from "../types/Profesional";

type Props = {
  documento: string;
  onCitaAgendada: () => void;
};

export default function AgregarCitaForm({ documento, onCitaAgendada }: Props) {
  const [profesionales, setProfesionales] = useState<Profesional[]>([]);
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

  const consultarProfesionales = async () => {
    try {
      const respuesta = await fetch("http://localhost:3000/profesionales");

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        console.error(datos.message);
        return;
      }

      setProfesionales(datos);
    } catch (error) {
      console.error("Error al consultar profesionales:", error);
    }
  };

  useEffect(() => {
    consultarProfesionales();
  }, []);

  const agendarCita = async () => {
    setMensaje("");
    setTipoMensaje("");

    if (!documento) {
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

      const respuesta = await fetch("http://localhost:3000/citas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documento: documento,
          profesional_oid: profesionalSeleccionado,
          fecha: fecha,
          hora: hora,
          motivo: motivo,
        }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        setMensaje(datos.message || "No fue posible agendar la cita.");
        setTipoMensaje("error");
        return;
      }

      setMensaje("¡Cita agendada correctamente!");
      setTipoMensaje("exito");

      setProfesionalSeleccionado(null);
      setFecha("");
      setHora("");
      setMotivo("");
      onCitaAgendada();
    } catch (error) {
      console.error("Error al agendar la cita:", error);

      setMensaje("Error al conectar con el servidor.");
      setTipoMensaje("error");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* PROFESIONAL */}
      <Text style={styles.label}>Profesional</Text>

      <Pressable
        style={styles.selector}
        onPress={() => setSelectorAbierto(!selectorAbierto)}
      >
        <Text style={styles.placeholderTexto}>
          {profesionalSeleccionado === null
            ? "Seleccione un profesional"
            : profesionales.find(
                (profesional) => profesional.oid === profesionalSeleccionado,
              )?.profesional}
        </Text>

        <Text style={styles.flecha}>{selectorAbierto ? "▲" : "▼"}</Text>
      </Pressable>

      {selectorAbierto && (
        <View style={styles.opciones}>
          {profesionales.map((profesional) => (
            <Pressable
              key={profesional.oid}
              style={styles.opcion}
              onPress={() => {
                setProfesionalSeleccionado(profesional.oid);
                setSelectorAbierto(false);
              }}
            >
              <Text style={styles.opcionTexto}>{profesional.profesional}</Text>
            </Pressable>
          ))}
        </View>
      )}

      {/* FECHA Y HORA */}
      <View style={styles.fechaHoraContainer}>
        {/* FECHA */}
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

        {/* HORA */}
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
          styles.agendarButton,
          guardando && styles.agendarButtonDeshabilitado,
        ]}
        onPress={agendarCita}
        disabled={guardando}
      >
        <Text style={styles.agendarButtonText}>
          {guardando ? "Agendando..." : "Agendar cita"}
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
    backgroundColor: "rgba(255, 255, 255, 0.85)",
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

  agendarButton: {
    width: "100%",
    backgroundColor: "#2563EB",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },

  agendarButtonDeshabilitado: {
    opacity: 0.6,
  },

  agendarButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
