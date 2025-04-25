let express = require('express');
let router = express.Router();

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
router.post('/accounts', validateAccountCreation, accountController.createAccount);
router.put('/accounts/:id/suspend', accountController.suspendAccount);
router.get('/accounts/:accountNumber', accountController.getAccountDetails);

//Rutas de cajero

router.post('/deposits', validateTransaction, cashierController.processDeposit);
router.post('/withdrawals', validateTransaction, cashierController.processWithdrawal);

//ruta de cliente

router.post('/customers', validateCustomer, customerController.createCustomer);
router.get('/customers/:customerId/accounts', customerController.getCustomerAccounts);

//ruta de transacciones

router.post('/transfers', validateTransfer, transactionController.processTransfer);
router.get('/accounts/:account_id/transactions', transactionController.getTransactionHistory);

module.exports = router;
