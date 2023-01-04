const express = require('express');
const expenseController = require('../controllers/user');

const router = express.Router();

router.post('/addExpense', expenseController.addExpense);

router.get('/getExpense', expenseController.getExpense);

router.delete('/deleteExpense/:id', expenseController.deleteExpense);

router.get('/editExpense/:id', expenseController.editExpense);

module.exports = router;

