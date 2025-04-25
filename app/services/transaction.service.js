const Transaction = require('../models/Transaction');
const Account = require('../models/Account');
const sequelize = require('../config/db');

exports.processTransaction = async (accountId, type, amount, description, relatedAccount = null) => {
  const t = await sequelize.transaction();
  
  try {
    const account = await Account.findByPk(accountId, { transaction: t });
    if (!account) throw new Error('Cuenta no encontrada');
    
    if (account.status !== 'activa') {
      throw new Error('La cuenta no está activa');
    }

    // Validar fondos para retiros y transferencias
    if (['retiro', 'transferencia'].includes(type) && parseFloat(account.balance) < parseFloat(amount)) {
      throw new Error('Fondos insuficientes');
    }

    // Crear transacción
    const transaction = await Transaction.create({
      account_id: accountId,
      type,
      amount,
      description,
      related_account: relatedAccount
    }, { transaction: t });

    // Actualizar balance
    if (type === 'deposito') {
      account.balance = parseFloat(account.balance) + parseFloat(amount);
    } else {
      account.balance = parseFloat(account.balance) - parseFloat(amount);
    }
    
    await account.save({ transaction: t });
    await t.commit();
    
    return {
      transaction,
      newBalance: account.balance
    };
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

exports.getAccountTransactions = async (accountId, limit = 10, startDate, endDate) => {
  const where = { account_id: accountId };
  
  if (startDate && endDate) {
    where.transaction_date = {
      [Op.between]: [new Date(startDate), new Date(endDate)]
    };
  }

  return await Transaction.findAll({
    where,
    order: [['transaction_date', 'DESC']],
    limit: parseInt(limit)
  });
};