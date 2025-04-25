const Customer = require('../models/customer.model');
const Account = require('../models/account.model');
const { validationResult } = require('express-validator');

exports.createCustomer = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, identification, email, phone, address } = req.body;
    
    const customer = await Customer.create({
      name,
      identification,
      email,
      phone,
      address
    });

    res.status(201).json(customer);
  } catch (error) {
    console.error('Error al crear cliente:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.getCustomerAccounts = async (req, res) => {
  try {
    const { customerId } = req.params;
    
    const accounts = await Account.findAll({
      where: { customer_id: customerId },
      order: [['created_at', 'DESC']]
    });

    res.json(accounts);
  } catch (error) {
    console.error('Error al obtener cuentas del cliente:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};