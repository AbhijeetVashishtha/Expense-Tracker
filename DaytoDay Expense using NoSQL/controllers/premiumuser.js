const Expense = require('../models/expense');
const User = require('../models/users');

exports.getUserLeaderBoard = async (req,res) => {
    try{
        const users = await User.find();
        const expenses = await Expense.find();
        const userAggregatedExpenses = {};
        let leaderBoard = [];
        expenses.forEach(expense => {
            if(userAggregatedExpenses[expense.userId]){
                userAggregatedExpenses[expense.userId] += expense.expenseamount; 
            }
            else{
                userAggregatedExpenses[expense.userId] = expense.expenseamount;
            }
            // console.log(userAggregatedExpenses);
            // console.log(leaderBoard);
        })
        users.forEach(user => {
            leaderBoard.push({id: user._id, name: user.name, totalExpense: (userAggregatedExpenses[user.id] || 0)})
        });
        res.status(200).json({data: leaderBoard});
        // const leaderBoardOfUsers = await User.findAll({
        //     attributes: ['id', 'name', [sequelize.fn('sum', sequelize.col('expenses.expenseamount')), 'total_cost'] ],
        //     include: [
        //         {
        //             model: Expense,
        //             attributes: []
        //         }
        //     ],
        //     group: ['users.id'],
        //     order: [['total_cost', 'DESC']]
        // });
        // res.status(200).json(leaderBoardOfUsers);
    }
    catch(err){
        console.log(err);
        res.status(500).json(err);
    }
};

