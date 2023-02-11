const Expense = require('../models/expense');
const S3Services = require('../services/s3service');
// const UserServices = require('../services/userservice');
const DownloadUrl = require('../models/downloadurls');
// const jwt = require('jsonwebtoken');

const downloadExpense =async (req,res) => {
    try{
        const expenses = await Expense.find({userId: req.user._id});
    // console.log(expenses);
    const stringifiedExpense = JSON.stringify(expenses);
    const userId = req.user._id;
    const fileName = `Expense${userId}/${new Date()}.txt`;
    const fileURL = await S3Services.uploadToS3(stringifiedExpense, fileName);
    // console.log(fileURL);
    const downloadUrlData = new DownloadUrl({
        fileURL: fileURL,
        filename: fileName,
        userId: req.user
    })
    downloadUrlData.save();
    res.status(200).json({fileURL, downloadUrlData, success: true});
    }
    catch(err){
        console.log(err);
        res.status(500).json({fileUrl: '', success: false});
    }
 };

const addExpense = async (req,res) => {
    try{
        const {expenseamount, description, category} = req.body;

        if(expenseamount == undefined || expenseamount.length === 0)
        {
            return res.status(400).json({success: false, message: 'Parameters Missing'});
        }
        const data = new Expense({expenseamount, description, category, userId: req.user});
        data.save();
        res.status(200).json({expense:data, success: true});
    }
    catch(err){
        console.log(err)
        res.status(500).json({success: false, error: err});
    }
};


const getExpense = async (req,res) => {
    let page = req.params.pageNo || 1;

    // console.log(page);
    let Items_Per_Page = +(req.body.Items_Per_Page) || 5;
    // console.log(Items_Per_Page);
    let totalItems;
    
    try{
        let count = await Expense.count({userId: req.user});
        totalItems = count;

        let data = await Expense.find({userId: req.user});
        res.status(200).json({
            data,
            info:{
                currentPage: page,
                hasNextPage: totalItems>page*Items_Per_Page,
                hasPreviousPage: page>1,
                nextPage: +page + 1,
                previousPage: +page - 1,
                lastPage: Math.ceil(totalItems/Items_Per_Page)
            },
            success: true
        })
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: err, success:false})
    }
};

const deleteExpense = async (req,res) => {
    const expenseid = req.params.expenseid;
    // console.log(expenseid);
   try{
        if(expenseid == undefined || expenseid.length === 0)
        {
            return res.status(404).json({message: "Expense not found", success: false});
        }
        const numberOfRows = await Expense.deleteOne({_id: expenseid, userId: req.user});
        // console.log(numberOfRows);
        if(numberOfRows === 0)
        {
            return res.status(400).json({success: false, message: "Expense Doesn't belong to the user"});
        }
        else{
            res.status(200).json({success: true, message: "Expense Deleted Successfully"});
        }
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            error: err,
            success: false,
            message: 'Failed to Delete'
        });
    }
};

const getAllUrl = async (req,res) => {
    try{
        let urls = await DownloadUrl.find();
        if(!urls){
            console.log('No urls found!!!');
            res.status(404).json({message: "no urls found with this user", success: false});
        }
        res.status(200).json({urls, success: true});
    }
    catch(err){
        console.log(err);
        res.status(500).json(err);
    }
}

module.exports = {
    addExpense,
    getExpense,
    deleteExpense,
    downloadExpense,
    getAllUrl
}