const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const users = require('./routes/api/users');
const profiles = require('./routes/api/profiles');
const rooms = require('./routes/api/rooms');
const departments = require('./routes/api/departments');
const staff = require('./routes/api/staff');
const bookings = require('./routes/api/bookings');
const customers = require('./routes/api/customers');
const food = require('./routes/api/food');
const beverages = require('./routes/api/beverages');
const epos = require('./routes/api/epos');
const bars = require('./routes/api/bars');
const orders = require('./routes/api/orders');
const tables = require('./routes/api/tables');
const staffDetails = require('./routes/api/staffdetails');
const room101 = require('./routes/api/room101');
const leisure = require('./routes/api/leisure');
const SendSMS = require('./routes/api/SendSMS');

var nodemon = require('nodemon');

process

  // Handle normal exits
  .on('exit', (code) => {
    nodemon.emit('quit');
    process.exit(code);
  })

  // Handle CTRL+C
  .on('SIGINT', () => {
    nodemon.emit('quit');
    process.exit(0);
  });

const app = express();

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
  });

// Body Parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Database Config
const dataBase = 'mongodb://dave:dmedke711583@ds159634.mlab.com:59634/hotel_management_platform'
// const dataBase = 'mongodb://localhost:27017/Hotel_Management_Platform'
// const dataBase = 'mongodb+srv://GautamUser1:gautam2000@jaspreetsingh.koxle.gcp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

// Connect Database
mongoose
  .connect(dataBase, { useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Passport Middleware
app.use(passport.initialize());

// Passport Config
require('./config/passport')(passport);

// Routing
app.use('/api/users', users);
app.use('/api/profiles', profiles);
app.use('/api/rooms', rooms);
app.use('/api/departments', departments);
app.use('/api/staff', staff);
app.use('/api/bookings', bookings);
app.use('/api/customers', customers);
app.use('/api/food', food);
app.use('/api/beverages', beverages);
app.use('/api/epos', epos);
app.use('/api/bars', bars);
app.use('/api/orders', orders);
app.use('/api/tables', tables);
app.use('/api/staffdetails', staffDetails);
app.use('/api/room101', room101);
app.use('/api/SendSMS', SendSMS);
app.use('/api/leisure', leisure);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));