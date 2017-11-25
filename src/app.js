const path          = require('path');
const favicon       = require('serve-favicon');
const compress      = require('compression');
const cors          = require('cors');
const helmet        = require('helmet');
const logger        = require('winston');

const feathers      = require('@feathersjs/feathers');
const configuration = require('@feathersjs/configuration');
const express       = require('@feathersjs/express');
const socketio      = require('@feathersjs/socketio');


const helpers       = require('./helpers');
const middleware    = require('./middleware');
const base          = require('./base');
const services      = require('./services');
const appHooks      = require('./app.hooks');
const channels      = require('./channels');

const associations  = require('./helpers/associations-module');

const authentication = require('./authentication');

const mongoose = require('./mongoose');

const app = express(feathers());

app.configure(associations);

app.set('enums', {});
app.set('helpers', helpers);
// Load app configuration
app.configure(configuration());
// Enable CORS, security, compression, favicon and body parsing
app.use(cors());
app.use(helmet());
app.use(compress());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(favicon(path.join(app.get('public'), 'favicon.ico')));
// Host the public folder
app.use('/', express.static(app.get('public')));

// Set up Plugins and providers
app.configure(express.rest());
app.configure(socketio());

app.configure(mongoose);

// Configure other middleware (see `middleware/index.js`)
app.configure(middleware);
app.configure(authentication);
// Set up our bases and services (see `services/index.js` and `base/index.js`)
app.configure(base);
app.configure(services);
// Set up event channels (see channels.js)
app.configure(channels);

// Configure a middleware for 404s and the error handler
app.use(express.notFound());
app.use(express.errorHandler({ logger }));

app.hooks(appHooks);

module.exports = app;
