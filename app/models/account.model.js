module.exports = (sequelize, Sequelize) => {
  const Account = sequelize.define('Account', {
    account_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    customer_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    account_number: {
      type: Sequelize.STRING(20),
      allowNull: false,
      unique: true
    },
    account_type: {
      type: Sequelize.ENUM('monetaria', 'ahorro'),
      allowNull: false
    },
    balance: {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    status: {
      type: Sequelize.ENUM('activa', 'suspendida', 'cerrada'),
      allowNull: false,
      defaultValue: 'activa'
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
  }, {
    tableName: 'accounts'
  });

  Account.generateAccountNumber = async function() {
    const randomNum = Math.floor(10000000 + Math.random() * 90000000);
    const accountNumber = `BAN-${randomNum}`;
    
    const exists = await Account.findOne({ where: { account_number: accountNumber } });
    return exists ? this.generateAccountNumber() : accountNumber;
  };

  return Account;
};