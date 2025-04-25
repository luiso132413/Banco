const { body, param, query } = require('express-validator');

exports.validateCustomer = [
  body('name').notEmpty().withMessage('El nombre es requerido'),
  body('identification')
    .notEmpty().withMessage('La identificación es requerida')
    .isLength({ min: 5 }).withMessage('La identificación debe tener al menos 5 caracteres'),
  body('email')
    .notEmpty().withMessage('El email es requerido')
    .isEmail().withMessage('Email inválido'),
  body('phone')
    .notEmpty().withMessage('El teléfono es requerido')
    .isMobilePhone().withMessage('Teléfono inválido')
];

exports.validateAccountCreation = [
  body('customer_id')
    .notEmpty().withMessage('El ID del cliente es requerido')
    .isInt().withMessage('ID de cliente inválido'),
  body('account_type')
    .notEmpty().withMessage('El tipo de cuenta es requerido')
    .isIn(['monetaria', 'ahorro']).withMessage('Tipo de cuenta inválido')
];

exports.validateTransaction = [
  body('account_number')
    .notEmpty().withMessage('El número de cuenta es requerido'),
  body('amount')
    .notEmpty().withMessage('El monto es requerido')
    .isFloat({ gt: 0 }).withMessage('El monto debe ser mayor que 0')
];

// ... otros validadores
exports.validateTransfer = [
  body('from_account')
    .notEmpty().withMessage('La cuenta de origen es requerida'),
  body('to_account')
    .notEmpty().withMessage('La cuenta de destino es requerida'),
  body('amount')
    .notEmpty().withMessage('El monto es requerido')
    .isFloat({ gt: 0 }).withMessage('El monto debe ser mayor que 0'),
  body().custom((value, { req }) => {
    if (req.body.from_account === req.body.to_account) {
      throw new Error('No puedes transferir a la misma cuenta');
    }
    return true;
  })
];

exports.validateAccountParam = [
  param('accountNumber')
    .notEmpty().withMessage('El número de cuenta es requerido')
];