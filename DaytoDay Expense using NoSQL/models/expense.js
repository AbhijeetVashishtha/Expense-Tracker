const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const expenseSchema = new Schema({
    expenseamount: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Expense', expenseSchema);


// const Sequelize = require('sequelize');
// const sequelize = require('../util/database');

// const Expense = sequelize.define('expenses', {
//     id: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//         autoIncrement: true,
//         primaryKey: true
//     },
//     expenseamount: Sequelize.INTEGER,
//     category: Sequelize.STRING,
//     description: Sequelize.STRING
// });


// module.exports = Expense;
