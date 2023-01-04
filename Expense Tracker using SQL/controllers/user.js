const User = require('../models/user');
const Expense = require('../models/user');

exports.addExpense = async (req,res,next) => {
    try{
        const expenseamount = req.body.expense;
        const expensedesc = req.body.description;
        const expensecategory = req.body.category;
        
        const data = await Expense.create({
            expense: expenseamount,
            description: expensedesc,
            category: expensecategory
        })
        res.status(200).json({
            newExpenseDetails: data
        })
    }
    catch(err) {
        console.log(err);
        res.status(500).json({
            error: err
        });
    }
};

exports.getExpense = async (req,res,next) => {
    try{
        const expenses = await Expense.findAll();
        res.status(200).json({
            allExpenses: expenses
        })  
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            error:err
        });
    }
};

exports.deleteExpense = async (req,res,next) => {
    try{
        if(!req.params.id) {
            console.log('Id is missing');
            return res.status(400).json({error: 'Id is missing'});
        }
        const eId = req.params.id;
        await Expense.destroy({where: {id: eId}});
        res.sendStatus(200);
    }
    catch(err) {
        console.log(err);
        res.status(500).json({
            error: err
        });
    }
};

exports.editExpense = async (req,res,next) => {
    try {
        if(!req.params.id) {
            console.log('Id is missing');
            return res.status(400).json({error: 'Id is missing'});
        }
        const eId = req.params.id;
        await Expense.build({where: {id: eId}});
        res.sendStatus(200);
    }
    catch(err) {
        console.log(err);
        res.status(500).json({
            error: err
        })
    }
}