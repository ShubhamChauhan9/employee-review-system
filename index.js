
const express = require('express');
const path = require('path');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
const MongoStore = require('connect-mongo');
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('./mongo/congif');
const User = require('./models/User');
const PerformanceReview = require('./models/PerformanceReview');

const app = express();
const PORT = process.env.PORT;
let db = connectDB();

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'your secret key',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongoUrl: process.env.MONGO_DB_URL })
// admin login for mongo atlas store used in deployement for the hoisted link 
    // email ->abc@xyz.com
    // password -> 12345
}));

const strategy = new LocalStrategy(User.authenticate())

passport.use(strategy);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(passport.initialize());
app.use(passport.session());


require('./routes')(app);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
