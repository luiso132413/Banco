module.exports = (sequelize, Sequelize) => {
  const Customer = sequelize.define('Customer', {
    customer_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    identification: {
      type: Sequelize.STRING(20),
      allowNull: false,
      unique: true
    },
    email: {
      type: Sequelize.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: Sequelize.STRING(20),
      allowNull: false
    },
    address: {
      type: Sequelize.STRING(255)
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
  }, {
    tableName: 'customers'
  });

  return Customer;
};