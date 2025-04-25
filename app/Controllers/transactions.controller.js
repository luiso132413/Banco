const Transaction = require('../models/transaction.model');
const Account = require('../models/account.model');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

exports.processTransfer = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { from_account, to_account, amount, description } = req.body;
    
    const originAccount = await Account.findOne({ where: { account_number: from_account } });
    const destinationAccount = await Account.findOne({ where: { account_number: to_account } });

    if (!originAccount || !destinationAccount) {
      return res.status(404).json({ error: 'Una o ambas cuentas no existen' });
    }

    if (originAccount.status !== 'activa' || destinationAccount.status !== 'activa') {
      return res.status(400).json({ error: 'Una o ambas cuentas no están activas' });
    }

    if (parseFloat(originAccount.balance) < parseFloat(amount)) {
      return res.status(400).json({ error: 'Fondos insuficientes' });
    }

    const t = await sequelize.transaction();

    try {
      const outgoingTransaction = await Transaction.create({
        account_id: originAccount.account_id,
        type: 'transferencia',
        amount,
        description: description || `Transferencia a cuenta ${to_account}`,
        related_account: to_account
      }, { transaction: t });

      const incomingTransaction = await Transaction.create({
        account_id: destinationAccount.account_id,
        type: 'transferencia',
        amount,
        description: description || `Transferencia de cuenta ${from_account}`,
        related_account: from_account
      }, { transaction: t });

      originAccount.balance = parseFloat(originAccount.balance) - parseFloat(amount);
      destinationAccount.balance = parseFloat(destinationAccount.balance) + parseFloat(amount);

      await originAccount.save({ transaction: t });
      await destinationAccount.save({ transaction: t });

      await t.commit();

      res.status(201).json({
        message: 'Transferencia realizada',
        transactions: {
          outgoing: outgoingTransaction,
          incoming: incomingTransaction
        },
        balances: {
          origin: originAccount.balance,
          destination: destinationAccount.balance
        }
      });
    } catch (error) {
      await t.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error al procesar transferencia:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.getTransactionHistory = async (req, res) => {
  try {
    const { account_id } = req.params;
    const { start_date, end_date, limit = 10 } = req.query;
    
    const where = { account_id };
    
    if (start_date && end_date) {
      where.transaction_date = {
        [Op.between]: [new Date(start_date), new Date(end_date)]
      };
    }

    const transactions = await Transaction.findAll({
      where,
      order: [['transaction_date', 'DESC']],
      limit: parseInt(limit)
    });

    res.json(transactions);
  } catch (error) {
    console.error('Error al obtener historial:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};