const express = require('express');
const cors = require('cors');
const db = require('./config/db.config.js');

// Importar rutas
const customerRoutes = require('./routes/customerService.routes');
const cashierRoutes = require('./routes/cashier.routes');
const accountRoutes = require('./routes/accounts.routes');
const transactionRoutes = require('./routes/transactions.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test DB connection
db.sequelize.authenticate()
  .then(() => console.log('Conexión a la base de datos establecida'))
  .catch(err => console.error('Error al conectar a la base de datos:', err));

// Sincronizar modelos
db.sequelize.sync({ alter: true })
  .then(() => console.log('Modelos sincronizados'))
  .catch(err => console.error('Error al sincronizar modelos:', err));

// Rutas
app.use('/api', customerRoutes);
app.use('/api', cashierRoutes);
app.use('/api', accountRoutes);
app.use('/api', transactionRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Sistema Bancario API');
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

module.exports = app;