import { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { StyleSheet } from "react-native";

type Cita = {
  oid: number;
  paciente: string;
  profesional: string;
  especialidad: string;
  motivo: string;
  fecha_cita: string;
  hora_cita: string;
  estado_cita: string;
};

function capitalizarTexto(texto: string) {
  return texto
    .toLowerCase()
    .split(" ")
    .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(" ");
}

function capitalizarPrimeraLetra(texto: string) {
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
}

function formatearFecha(fecha: string) {
  const fechaSinHora = fecha.split("T")[0];
  const partes = fechaSinHora.split("-");
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function formatearHora(hora: string) {
  const partes = hora.split(":");
  return `${partes[0]}:${partes[1]}`;
}

export default function HomeScreen() {
  const [documento, setDocumento] = useState("");
  const [citas, setCitas] = useState<Cita[]>([]);
  const [mensaje, setMensaje] = useState("");

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
    <View style={styles.container}>
      <Text style={styles.title}>Citas Médicas</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Documento</Text>

        <TextInput
          style={styles.input}
          value={documento}
          onChangeText={setDocumento}
        />
        <Pressable style={styles.button} onPress={buscarCitas}>
          <Text style={styles.buttonText}>Buscar citas</Text>
        </Pressable>
      </View>

      {mensaje !== "" && <Text>{mensaje}</Text>}
      {citas.map((cita) => (
        <View style={styles.card} key={cita.oid}>
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
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
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

  card: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
  },

  fieldLabel: {
    fontWeight: "bold",
    width: 100,
  },

  row: {
    flexDirection: "row",
  },
});
