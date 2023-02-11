const express = require('express');
const expenseController = require('../controllers/expense');
const userAuthentication = require('../middleware/auth');
const router = express.Router();

router.post('/addexpense', userAuthentication.authenticate, expenseController.addExpense);

router.get('/download', userAuthentication.authenticate, expenseController.downloadExpense);

router.get('/getAllUrl', userAuthentication.authenticate, expenseController.getAllUrl);

router.delete('/deleteexpense/:expenseid', userAuthentication.authenticate, expenseController.deleteExpense);

module.exports = router;