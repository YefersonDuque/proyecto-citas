import { View, Text } from "react-native";
import { StyleSheet } from "react-native";
import { formatearFecha } from "@/utils/formato";
import { Usuario } from "../types/Usuario";

type UsuarioCardProps = {
  usuario: Usuario;
};

export default function UsuarioCard({ usuario }: UsuarioCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Información del usuario</Text>

      <View style={styles.row}>
        <Text style={styles.fieldLabel}>Documento</Text>
        <Text>{usuario.documento}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.fieldLabel}>Nombre</Text>
        <Text>
          {usuario.nombre} {usuario.apellido}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.fieldLabel}>Teléfono</Text>
        <Text>{usuario.telefono}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.fieldLabel}>Correo</Text>
        <Text>{usuario.correo}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.fieldLabel}>Fecha nacimiento</Text>
        <Text>{formatearFecha(usuario.fecha_nacimiento)}</Text>
      </View>
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

  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },

  row: {
    flexDirection: "row",
    marginBottom: 8,
  },

  fieldLabel: {
    fontWeight: "bold",
    width: 120,
  },
});
