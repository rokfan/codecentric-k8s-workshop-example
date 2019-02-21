const express = require('express');
const path = require('path');
const morgan = require('morgan');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

const routes = require('./routes');

const httpStatusNotFound = 404;
const httpStatusInternalServerError = 500;
const app = express();

const redisServerURL = process.env.REDIS_SERVER_URL;
const appRootPath = process.env.APP_ROOT;

app.locals = { app: { rootPath: appRootPath } };

app.use(morgan('tiny'));
app.use(session({
  store: new RedisStore({
    url: redisServerURL,
    logErrors: true,
    ttl: 60000,
  }),
  name: 'app_session',
  rolling: true,
  resave: false,
  proxy: true,
  secret: 'abc def',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
  saveUninitialized: false,
}));
app.set('trust proxy', 1);
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());

app.get('/', (req, res, next) => {
  if (req.session.views) {
    req.session.views += 1;
  } else {
    req.session.views = 1;
  }
  req.session.save();
  next();
});

app.use(appRootPath, express.static(path.join(__dirname, 'public')));

app.use(appRootPath, routes);
app.use((req, res, next) => {
  const status = httpStatusNotFound;
  const err = new Error(status.toString());
  err.status = status;
  next(err);
});
app.use(
  // eslint-disable-next-line no-unused-vars
  (err, req, res, next) => {
    res.status(err.status || httpStatusInternalServerError);
    res.render('error', {
      message: err.message,
      error: err,
    });
  },
);

module.exports = app;
