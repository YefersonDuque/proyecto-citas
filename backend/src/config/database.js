const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});
module.exports = pool;

// ALTER TABLE CITAS
// DROP CONSTRAINT citas_profesional_fecha_hora_unique;

// CREATE UNIQUE INDEX uq_cita_profesional_fecha_hora_activa
// ON CITAS (PROFESIONAL_OID, FECHA, HORA)
// WHERE ESTADO IN (3, 4);

// ALTER TABLE CITAS
// DROP CONSTRAINT citas_estado_check;

// ALTER TABLE CITAS
// ADD CONSTRAINT citas_estado_check
// CHECK (ESTADO IN (3, 4, 5, 6));

// ╔══════════════════════════════════════════════════════════════╗
// ║                    PM2 - PROYECTO CITAS                     ║
// ╚══════════════════════════════════════════════════════════════╝

// 📌 UBICACIÓN
// Desde la carpeta backend:

// cd C:\Users\Usuario\OneDrive\Documentos\react\proyecto-citas\backend

// ▶️ INICIAR / LEVANTAR LA API
// ──────────────────────────────────────────────────────────────
// npx pm2 start ecosystem.config.js

// 📋 VER ESTADO DE LA APLICACIÓN
// ──────────────────────────────────────────────────────────────
// npx pm2 list

// 🔄 REINICIAR LA API
// ──────────────────────────────────────────────────────────────
// npx pm2 restart proyecto-citas

// ⏹️ DETENER LA API
// ──────────────────────────────────────────────────────────────
// npx pm2 stop proyecto-citas

// 🗑️ ELIMINAR LA APLICACIÓN DE PM2
// ──────────────────────────────────────────────────────────────
// npx pm2 delete proyecto-citas

// 📜 VER LOGS DE PM2
// ──────────────────────────────────────────────────────────────
// npx pm2 logs proyecto-citas

// 📜 VER SOLO LAS ÚLTIMAS 100 LÍNEAS
// ──────────────────────────────────────────────────────────────
// npx pm2 logs proyecto-citas --lines 100

// 🧹 LIMPIAR LOS LOGS DE PM2
// ──────────────────────────────────────────────────────────────
// npx pm2 flush

// 📊 MONITOREAR CPU / RAM / PROCESO
// ──────────────────────────────────────────────────────────────
// npx pm2 monit

// 💾 GUARDAR LA CONFIGURACIÓN ACTUAL DE PM2
// ──────────────────────────────────────────────────────────────
// npx pm2 save

// 🚀 CONFIGURAR INICIO AUTOMÁTICO CON WINDOWS
// ──────────────────────────────────────────────────────────────
// npx pm2 startup

// ⚠️ IMPORTANTE:
// El comando "pm2 startup" mostrará un comando adicional.
// Ese comando DEBES copiarlo y ejecutarlo tal como PM2 lo indique.

// 🔎 VER VERSIÓN DE PM2
// ──────────────────────────────────────────────────────────────
// npx pm2 --version

// ══════════════════════════════════════════════════════════════
//                  WINSTON vs PM2
// ══════════════════════════════════════════════════════════════

// Winston:
// → Logs de la aplicación
// → info
// → warn
// → error
// → logs/proyecto-citas-YYYY-MM-DD.log

// PM2:
// → Mantiene Node.js ejecutándose
// → Reinicia la aplicación si se cae
// → Estado del proceso
// → CPU / memoria
// → Logs de salida del proceso
// → Inicio automático

// ⭐ COMANDO QUE MÁS USARÁS

// Después de modificar código:

// npx pm2 restart proyecto-citas

// Para revisar:

// npx pm2 list

// Para ver qué está pasando:

// npx pm2 logs proyecto-citas
