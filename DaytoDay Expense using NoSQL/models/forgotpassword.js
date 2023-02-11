const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const forgotPasswordSchema = new Schema({
    active:{
        type: Boolean
    },
    expiresBy: {
        type: Date
    }
});

module.exports = mongoose.model('ForgotPassword', forgotPasswordSchema)


// const Sequelize = require('sequelize');
// const sequelize = require('../util/database');

// const Forgotpassword = sequelize.define('forgotpassword', {
//     id: {
//         type: Sequelize.UUID,
//         allowNull: false,
//         primaryKey: true
//     },
//     active: Sequelize.BOOLEAN,
//     expiresBy: Sequelize.DATE
// })

// module.exports = Forgotpassword;