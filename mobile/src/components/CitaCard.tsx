import { View, Text, Pressable } from "react-native";
import { StyleSheet } from "react-native";

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
        <Text>{capitalizarPrimeraLetra(cita.estado_cita)}</Text>
      </View>

      {cita.estado_cita === "PENDIENTE" && (
        <View style={styles.actions}>
          <Pressable
            style={styles.confirmButton}
            onPress={() => actualizarEstadoCita(cita.oid, 4)}
          >
            <Text style={styles.buttonText}>Confirmar</Text>
          </Pressable>

          <Pressable
            style={styles.cancelButton}
            onPress={() => actualizarEstadoCita(cita.oid, 5)}
          >
            <Text style={styles.buttonText}>Cancelar</Text>
          </Pressable>
        </View>
      )}

      {cita.estado_cita === "CONFIRMADO" && (
        <View style={styles.actions}>
          <Pressable
            style={styles.cancelButton}
            onPress={() => actualizarEstadoCita(cita.oid, 5)}
          >
            <Text style={styles.buttonText}>Cancelar</Text>
          </Pressable>
        </View>
      )}

      {cita.estado_cita === "CANCELADO" && (
        <Text style={styles.cancelledText}>Cita cancelada</Text>
      )}
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
  },
});
