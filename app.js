const express = require('express');
const expressValidator = require('express-validator');
const path = require('path');
const cookieParser = require('cookie-parser');
const config = require('./config/config.json');
const http = require('http');

const app = express();

const corsOptions = {
    origin : '*',
    credentials: true
}

const CORS = require('cors')(corsOptions);

app.use(CORS);
//app.use(expressValidator());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((err, req, res, next) => {
    res.render('error', {
        message: err.message,
        error: {
            status: 500
        }
    })
})

const port = config[config.run_mode].API_SERVICE_PORT;
app.set('port', port);

exports.server = http.createServer(app);
exports.server.listen(port, () => {});

function onListening() {
    const addr = exports.server.address();
    const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
    if( process.env.NODE_ENV === 'prod') {
        console.log('API RUN AS PROD');
    }else if(process.env.NODE_ENV === 'dev') {
        console.log('API RUN AS DEV');
    } else {
        console.log('API RUN AS LOCAL');
    }
}

exports.server.on('listening', onListening);
module.exports = {app};