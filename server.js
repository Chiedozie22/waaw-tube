const {globalVariables} = require('./config/configuration');
const express = require('express');
const path = require('path');
const app = express();
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const ejs = require('ejs');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo');
const bcrypt = require('bcryptjs');

// Database connection
mongoose.connect('mongodb://localhost/waawtube')
.then(connected => console.log('Database connected successfully'))
.catch(err => console.log('Error connecting to DB'));

// Configure express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session Configuration
app.use(cookieParser());
app.use(session({ 
    secret: 'sanzo',
    saveUninitialized: true,
    resave: true,
    cookie: { maxAge: Date.now() * 3600 * 24 * 60 * 60},
    store: MongoStore.create({ 
        mongoUrl: 'mongodb://localhost/waawtube',
        ttl: 3600 * 24 * 60 * 60
    })
}));

// Passport Set up
app.use(passport.initialize());
app.use(passport.session());

//Flash and Morgan Configuration
app.use(logger('dev'));
app.use(flash());

//Bringing in global globalVariables
app.use(globalVariables);

//Views Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const defaultRoutes = require('./routes/default/default.routes');
const authRoutes = require('./routes/auth/auth.routes');
const videoRoutes = require('./routes/video/video.routes');


// Routes (Routes grouping)
app.use('/', defaultRoutes);
app.use('/auth', authRoutes);
app.use('/video', videoRoutes);

app.get('/contact', (res, req) => {
    res.send('Contact Page')
})

//Catch 404 and forward to error handler
app.use((req, res, next) => {
    res.send('error404');
    next();
});

const port = process.env.PORT || 6050;

app.listen(port, () => console.log(`Server listening on port::: ${port}`));