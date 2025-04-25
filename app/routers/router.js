let express = require('express');
let mainRouter = express.Router();

// Controladores
const accountController = require('../Controllers/accounts.controller.js');
const cashierController = require('../Controllers/cashier.controller.js');
const customerController = require('../Controllers/customerService.controller.js');
const transactionController = require('../Controllers/transactions.controller.js');

// Middlewares
const {
  validateAccountCreation,
  validateTransaction,
  validateCustomer,
  validateTransfer
} = require('../Middlewares/accountValidation.js');

// Rutas de cuentas
mainRouter.post('/api/accounts/create', validateAccountCreation, accountController.createAccount);
mainRouter.put('/api/accounts/:id/suspend', accountController.suspendAccount);
mainRouter.get('/api/accounts/:accountNumber', accountController.getAccountDetails);

//Rutas de cajero

mainRouter.post('/deposits', validateTransaction, cashierController.processDeposit);
mainRouter.post('/withdrawals', validateTransaction, cashierController.processWithdrawal);

//ruta de cliente

mainRouter.post('/customers', validateCustomer, customerController.createCustomer);
mainRouter.get('/customers/:customerId/accounts', customerController.getCustomerAccounts);

//ruta de transacciones

mainRouter.post('/transfers', validateTransfer, transactionController.processTransfer);
mainRouter.get('/accounts/:account_id/transactions', transactionController.getTransactionHistory);

module.exports = mainRouter;
