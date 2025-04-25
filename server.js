

// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('../Banco/app/config/db.config.js'); // Asegúrate que esta ruta sea correcta
let mainRouter = require('../Banco/app/routers/router.js'); // Ruta del router principal

const app = express();

// CORS config
const corsOptions = {
  origin: 'http://localhost:4200', // O ajusta si usas otro frontend
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Middlewares
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Conexión a la base de datos
db.sequelize.authenticate()
  .then(() => console.log(' Conexión a la base de datos establecida'))
  .catch(err => console.error(' Error al conectar a la base de datos:', err));

// Sincronización de modelos (usa `alter: true` para evitar perder datos)
db.sequelize.sync({ alter: true })
  .then(() => console.log(' Modelos sincronizados'))
  .catch(err => console.error(' Error al sincronizar modelos:', err));

// Rutas
app.use('/api', mainRouter); // Todas las rutas van bajo /api
app.get('/', (req, res) => {
  res.json({ mensaje: 'Bienvenido Estudiantes de UMG' });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar servidor
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;
