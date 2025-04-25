module.exports = (sequelize, Sequelize) => {
  const Transaction = sequelize.define('Transaction', {
    transaction_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    account_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    type: {
      type: Sequelize.ENUM('deposito', 'retiro', 'transferencia'),
      allowNull: false
    },
    amount: {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: false
    },
    description: {
      type: Sequelize.STRING(255)
    },
    related_account: {
      type: Sequelize.STRING(20)
    },
    transaction_date: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
  }, {
    tableName: 'transactions'
  });

  return Transaction;
};