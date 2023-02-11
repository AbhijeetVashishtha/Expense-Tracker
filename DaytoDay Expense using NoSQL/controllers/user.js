const User = require('../models/users');
// Bcrypt turns a simple password into fixed-length characters called a hash. Before hashing a password, 
// bcrypt applies a salt , a unique random string that makes the hash unpredictable.
const bcrypt = require('bcrypt');
// JSON Web Token is a standard used to create access tokens for an application. It works this way: the server 
// generates a token that certifies the user identity and sends it to the client. In simpler words JWT Tokens is
// more like a key. If user is authenticated, the server will give a key(the token) using which the client can 
// now(access) open/use routes or services.
const jwt = require('jsonwebtoken');

//Made this function for checking whether the input is not empty or undefined
function isstringinvalid(string){
    if(string == undefined || string.length === 0){
        return true;
    }
    else{
        return false;
    }
}

const generateAccessToken = (id, name, ispremiumuser) => {
    return jwt.sign({userId: id, name: name, ispremiumuser: ispremiumuser}, 'wjdnejddwkdmwldmkfwkdkwdwfdnjwdnlwkd');
}

const signUp = async (req,res,next) => {
    try{
        // Here i have used destructuring for selecting values 
        const { name, email, password } = req.body;
        // console.log('email', email);
        if(isstringinvalid(name) || isstringinvalid(email) || isstringinvalid(password)){
            return res.status(400).json({err: 'Parameters are missing'});
        }
        const userExist = await User.find({email});
        // console.log(userExist);

        if(userExist.length > 0)
        {
            res.status(401).json({message: 'User Already Exist with this EmailId'})
        }
        else
        {
            const saltRounds = 10;
            bcrypt.hash(password, saltRounds, async (err, hash) => {
            const user = new User({ name, email, password:hash});
            // await User.create({ name, email, password: hash });
            user.save();
            res.status(200).json({message: "user created successfully"});
            })
        }
    }
    catch(err) {    
        console.log(err);
        res.status(500).json(err); 
    }
};

const logIn = async (req,res,next) => {
    try{
        const {email,password} = req.body;
       if(isstringinvalid(email) || isstringinvalid(password))
       {
        return res.status(400).json({
            message: "Email or Password is missing",
            success: false
        })
       }
        // console.log(password);
       const user = await User.find({ email: email });
       if(user.length > 0){
        bcrypt.compare(password, user[0].password, (err,result) => {
            if(result == true)
            {
                return res.status(200).json({success: true, message: 'User logged in Successfully', token: generateAccessToken(user[0].id, user[0].name, user[0].ispremiumuser)});
            }
            else{
                return res.status(400).json({success: false, message: "Password is incorrect"});
            }
        })
       }
       else{
        return res.status(404).json({success: false, message: "User Doesn't Exist"});
       }
    }
    catch(err) {
        console.log(err);
        res.status(500).json({
            message: err,
            success: false
        });
    }
};


module.exports = {
    signUp,
    logIn,
    generateAccessToken
}

