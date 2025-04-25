const Account = require('../models/account.model');
const Transaction = require('../models/transaction.model');
const { validationResult } = require('express-validator');

exports.processDeposit = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { account_number, amount, description } = req.body;
    
    const account = await Account.findOne({ where: { account_number } });
    if (!account) {
      return res.status(404).json({ error: 'Cuenta no encontrada' });
    }

    if (account.status !== 'activa') {
      return res.status(400).json({ error: 'La cuenta no está activa' });
    }

    const transaction = await Transaction.create({
      account_id: account.account_id,
      type: 'deposito',
      amount,
      description: description || 'Depósito en efectivo'
    });

    account.balance = parseFloat(account.balance) + parseFloat(amount);
    await account.save();

    res.status(201).json({
      message: 'Depósito realizado',
      transaction,
      new_balance: account.balance
    });
  } catch (error) {
    console.error('Error al procesar depósito:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.processWithdrawal = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { account_number, amount, description } = req.body;
    
    const account = await Account.findOne({ where: { account_number } });
    if (!account) {
      return res.status(404).json({ error: 'Cuenta no encontrada' });
    }

    if (account.status !== 'activa') {
      return res.status(400).json({ error: 'La cuenta no está activa' });
    }

    if (parseFloat(account.balance) < parseFloat(amount)) {
      return res.status(400).json({ error: 'Fondos insuficientes' });
    }

    const transaction = await Transaction.create({
      account_id: account.account_id,
      type: 'retiro',
      amount,
      description: description || 'Retiro en efectivo'
    });

    account.balance = parseFloat(account.balance) - parseFloat(amount);
    await account.save();

    res.status(201).json({
      message: 'Retiro realizado',
      transaction,
      new_balance: account.balance
    });
  } catch (error) {
    console.error('Error al procesar retiro:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};