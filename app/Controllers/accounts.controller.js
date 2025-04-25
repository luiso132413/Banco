const db = require('../config/db.config.js');
const Account = db.Account;
const Customer = db.Customer;
const { validationResult } = require('express-validator');

exports.createAccount = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { customer_id, account_type } = req.body;
    
    // Convertir a número (por si acaso)
    const customerId = parseInt(customer_id);

    // Depuración
    console.log(`Buscando cliente con ID: ${customerId}`);

    const customer = await Customer.findByPk(customerId);
    if (!customer) {
      console.error(`Cliente no encontrado para ID: ${customerId}`);
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    const account_number = await Account.generateAccountNumber();
    const account = await Account.create({
      customer_id: customerId,
      account_number,
      account_type,
      balance: 0.00,
      status: 'activa'
    });

    console.log('Cuenta creada:', account);
    res.status(201).json(account);
  } catch (error) {
    console.error('Error al crear cuenta:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
exports.suspendAccount = async (req, res) => {
  try {
    const { id } = req.params;
    
    const account = await Account.findByPk(id);
    if (!account) {
      return res.status(404).json({ error: 'Cuenta no encontrada' });
    }

    if (account.status === 'suspendida') {
      return res.status(400).json({ error: 'La cuenta ya está suspendida' });
    }

    account.status = 'suspendida';
    await account.save();

    res.json({ message: 'Cuenta suspendida exitosamente', account });
  } catch (error) {
    console.error('Error al suspender cuenta:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.getAccountDetails = async (req, res) => {
  try {
    const { accountNumber } = req.params;
    
    const account = await Account.findOne({ 
      where: { account_number: accountNumber },
      include: [{
        model: Customer,
        attributes: ['name', 'identification']
      }]
    });

    if (!account) {
      return res.status(404).json({ error: 'Cuenta no encontrada' });
    }

    res.json(account);
  } catch (error) {
    console.error('Error al obtener cuenta:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};