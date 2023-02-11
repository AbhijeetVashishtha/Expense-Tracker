const sibApiClient = require('sib-api-v3-sdk');
const sibApi = sibApiClient.default;
// UUID is a great way of hide sequential database IDs. UUID is Universal Unique Identifier. UUIDs are unique 
// 128-bit values popularly used to uniquely identify entities on the internet
const uuid = require('uuid');
const bcrypt = require('bcrypt');

const User = require('../models/users');
const ForgotPassword = require('../models/forgotpassword');


exports.forgotPassword = async (req,res,next) => {
    try{
        const {email}  = req.body;
        const user = await User.findOne({email: email});
        console.log(user);

        const forgotPassword = new ForgotPassword({active: true})
        forgotPassword.save();

        const id = forgotPassword._id;
        console.log(id);


        const sib = new sibApiClient.ApiClient();
        const tranEmailApi = new sibApiClient.TransactionalEmailsApi();

        // const client = sib.ApiClient.instance;
        // const apiKey = client.authentications['api-key'];
        sib.apiKey = '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';

        // const tranEmailApi = new sib.TransactionalEmailsApi();

        const sender = {
            email: 'abhijeet@gmail.com',
            name: 'Abhijeet'
        };
        const recievers = [{
            email: email
        }];

        tranEmailApi.sendTransactionalEmail({
            sender,
            to: recievers,
            subject: 'Forgot Password Link',
            textContent: 'Follow the link and reset your Password',
            htmlContent: `Click on the link below to reset password <br> <a href="http://localhost:3000/password/reset/${id}">Reset Password</a>`
        })
        .then((response) => {
            return res.status(200).json({success: true, message: 'Password mail Sent Successfully'});
        })
        .catch((err) => {
            console.log(err);
        })
    }
    catch(err){
        console.error(err);
        return res.json({message: err, success: false});
    }
};

exports.resetPassword = (req,res,next) => {
    try{
        let id = req.params.id;
        console.log(id);

        ForgotPassword.findById(id)
        then((forgotPassword) => {
            forgotPassword.active = false;
            return forgotPassword.save();
        })
        .catch(err => {
            console.log(err);
        })

        res.status(200).json(`<html>
        <script>
            function formsubmitted(e){
                e.preventDefault();
                console.log('called')
            }
        </script>
        <form action="/password/update/${id}" method="get">
            <label for="newpassword">Enter New password</label>
            <input name="newpassword" type="password" required></input>
            <button>reset password</button>
        </form>
    </html>`);
    res.end();
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message: err});
    }
};

exports.updatePassword = async (req,res) => {
        const { newpassword } = req.query;
        const { id } = req.params;
        console.log(newpassword);
        try{
        const resetpasswordrequest = await ForgotPassword.findOne({where:{id}});
        const user = await User.findOne({where: {id: resetpasswordrequest.userId}});

        if(!user)
        {
            return res.status(401).json({error: "User doesn't exist", success: false});
        }
        const saltRounds = 10;
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err){
                console.log(err);
                throw new Error(err);
            }
            bcrypt.hash(newpassword, salt, async(err, hash) =>  {
                // Store hash in your password DB.
                if(err){
                    console.log(err);
                    throw new Error(err);
                }
                await user.update({ password: hash });
                return res.status(200).json({message: 'Successfuly update the new password'})
            })
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({err, success:false});
    }
}


  