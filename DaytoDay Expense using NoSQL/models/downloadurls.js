const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const downloadUrlSchema = new Schema({
    filename: {
        type: String,
        required: true
    },
    fileURL: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('downloadUrl', downloadUrlSchema);


// const Sequelize = require('sequelize');
// const sequelize = require('../util/database');

// const Downloadurl = sequelize.define('downloadurls' , {
//     id:{
//         type:Sequelize.INTEGER,
//         unique:true,
//         autoIncrement:true,
//         allowNull:false,
//         primaryKey:true,
//     },
//     fileName:{
//         type:Sequelize.STRING,
//         allowNull:false,
//     },
//     fileUrl:{
//         type:Sequelize.STRING,
//         allowNull:false,
//     }
// })

// module.exports = Downloadurl;