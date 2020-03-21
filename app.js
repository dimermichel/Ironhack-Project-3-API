require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');


const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();
// require database configuration
require('./configs/db.config');

// Middleware Setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// make sure express- session is used before the passport
require('./configs/session.config')(app);
require('./configs/passport/passport.config.js')(app);


// HBS just for NOW *********************************
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
// **************************************************

app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));



// default value for title local
app.locals.title = 'Express - Travelpacker API';


// Routes
app.use('/', require('./routes/index.routes'));
app.use('/', require('./routes/auth.routes'))

module.exports = app;
