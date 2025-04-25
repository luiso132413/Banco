const db = require('../config/db.config.js');
const Account = db.Account;
const Customer = db.Customer;

exports.createAccountForCustomer = async (customerId, accountType) => {
  const accountNumber = await Account.generateAccountNumber();
  
  const account = await Account.create({
    customer_id: customerId,
    account_number: accountNumber,
    account_type: accountType,
    balance: 0.00,
    status: 'activa'
  });

  return account;
};

exports.getAccountWithCustomer = async (accountNumber) => {
  return await Account.findOne({
    where: { account_number: accountNumber },
    include: [{
      model: Customer,
      attributes: ['name', 'identification', 'email']
    }]
  });
};