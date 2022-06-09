const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
var path = require('path')

require('dotenv').config();


const userRoutes = require('./api/routes/user_route');
const homeRoutes = require('./api/routes/home_route');

const mySecret = process.env.MONGODB_URL;
mongoose.connect(mySecret, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const app = express();

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', './views');



app.use(userRoutes);
app.use(homeRoutes);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;