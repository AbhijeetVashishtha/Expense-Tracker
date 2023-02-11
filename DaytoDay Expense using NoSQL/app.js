const fs = require('fs')
const express = require('express');
const mongoose = require('mongoose');

// const https = require('https');
const path = require('path');

const helmet = require('helmet');

const morgan = require('morgan');

var cors = require('cors');

const compression = require('compression');
// const sequelize = require('./util/database');
const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const purchaseRoutes = require('./routes/purchase');
const premiumUserRoutes = require('./routes/premiumuser');
const forgotPassRoutes = require('./routes/forgotpass');


// const User = require('./models/users');
// const Expense = require('./models/expense');
// const Order = require('./models/orders');
// const forgotPass = require('./models/forgotpassword');
// const downloadUrl = require('./models/downloadurls');

const app = express();
const dotenv = require('dotenv');

const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'),
    {flags: 'a'}
    );

// const privateKey = fs.readFileSync('server.key');
// const certificate = fs.readFileSync('server.cert');

dotenv.config();
app.use(helmet());
app.use(compression());
app.use(morgan('combined', {stream: accessLogStream}));
app.use(express.json());
app.use(cors());
app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/premium', premiumUserRoutes);
app.use('/password', forgotPassRoutes);

app.use((req,res) => {
    res.sendFile(path.join(__dirname, `Frontend/${req.url}`));
})


mongoose.connect('mongodb+srv://abhi:abhi12345@cluster0.7pnmyaa.mongodb.net/expensetracker?retryWrites=true&w=majority')
.then(() => {
    app.listen(4000);
    console.log('Connected!');
})
.catch(err => {
    console.log(err);
})

// User.hasMany(Expense);
// Expense.belongsTo(User);

// User.hasMany(Order);
// Order.belongsTo(User);

// User.hasMany(forgotPass);
// forgotPass.belongsTo(User);

// User.hasMany(downloadUrl);
// downloadUrl.belongsTo(User);


// sequelize.sync()
// .then(() => {
//     // https
//     // .createServer({key: privateKey, cert: certificate}, app)
//     // .listen(process.env.PORT || 4000);
//     app.listen(process.env.PORT || 4000);
// })
// .catch((err) => {
//     console.log(err);
// });