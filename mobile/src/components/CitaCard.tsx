import { View, Text, Pressable } from "react-native";
import { StyleSheet } from "react-native";
import { ESTADOS_CITA } from "@/constants/estados";

import { Cita } from "../types/Cita";
import {
  capitalizarTexto,
  capitalizarPrimeraLetra,
  formatearFecha,
  formatearHora,
} from "../utils/formato";

type CitaCardProps = {
  cita: Cita;
  actualizarEstadoCita: (oid: number, estado: number) => void;
};

export default function CitaCard({
  cita,
  actualizarEstadoCita,
}: CitaCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.fieldLabel}>Profesional</Text>
        <Text>{capitalizarTexto(cita.profesional)}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.fieldLabel}>Especialidad</Text>
        <Text>{capitalizarPrimeraLetra(cita.especialidad)}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.fieldLabel}>Motivo</Text>
        <Text>{capitalizarPrimeraLetra(cita.motivo)}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.fieldLabel}>Fecha</Text>
        <Text>{formatearFecha(cita.fecha_cita)}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.fieldLabel}>Hora</Text>
        <Text>{formatearHora(cita.hora_cita)}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.fieldLabel}>Estado</Text>

        <Text
          style={
            cita.estado_cita === "CONFIRMADO"
              ? styles.estadoConfirmado
              : cita.estado_cita === "ATENDIDO"
                ? styles.estadoAtendido
                : cita.estado_cita === "CANCELADO"
                  ? styles.estadoCancelado
                  : styles.estadoPendiente
          }
        >
          {capitalizarPrimeraLetra(cita.estado_cita)}
        </Text>
      </View>

      {cita.estado_cita.toUpperCase() === "PENDIENTE" && (
        <View style={styles.actions}>
          <Pressable
            style={styles.confirmButton}
            onPress={() =>
              actualizarEstadoCita(cita.oid, ESTADOS_CITA.CONFIRMADO)
            }
          >
            <Text style={styles.buttonText}>Confirmar</Text>
          </Pressable>

          <Pressable
            style={styles.cancelButton}
            onPress={() =>
              actualizarEstadoCita(cita.oid, ESTADOS_CITA.CANCELADO)
            }
          >
            <Text style={styles.buttonText}>Cancelar</Text>
          </Pressable>
        </View>
      )}

      {cita.estado_cita.toUpperCase() === "CONFIRMADO" && (
        <View style={styles.actions}>
          <Pressable
            style={styles.completedButton}
            onPress={() =>
              actualizarEstadoCita(cita.oid, ESTADOS_CITA.ATENDIDO)
            }
          >
            <Text style={styles.buttonText}>Atendido</Text>
          </Pressable>
          <Pressable
            style={styles.cancelButton}
            onPress={() =>
              actualizarEstadoCita(cita.oid, ESTADOS_CITA.CANCELADO)
            }
          >
            <Text style={styles.buttonText}>Cancelar</Text>
          </Pressable>
        </View>
      )}

      {cita.estado_cita.toUpperCase() === "CANCELADO" && (
        <Text style={styles.cancelledText}>X Cita cancelada</Text>
      )}
      {cita.estado_cita.toUpperCase() === "ATENDIDO" && (
        <Text style={styles.completedText}>✓ Atención realizada</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  estadoConfirmado: {
    fontWeight: "bold",
    color: "#2563EB",
  },

  estadoAtendido: {
    fontWeight: "bold",
    color: "#16A34A",
  },

  estadoCancelado: {
    fontWeight: "bold",
    color: "#DC2626",
  },

  estadoPendiente: {
    fontWeight: "bold",
    color: "#CA8A04",
  },
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

  completedText: {
    marginTop: 15,
    fontWeight: "bold",
    color: "#059669",
  },

  fieldLabel: {
    fontWeight: "bold",
    width: 100,
  },

  row: {
    flexDirection: "row",
  },

  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 15,
  },

  confirmButton: {
    flex: 1,
    backgroundColor: "#16A34A",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  completedButton: {
    flex: 1,
    backgroundColor: "#059669",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  cancelButton: {
    flex: 1,
    backgroundColor: "#DC2626",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  cancelledText: {
    marginTop: 15,
    fontWeight: "bold",
    color: "#DC2626",
  },
});
