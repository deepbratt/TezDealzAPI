const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cluster = require('cluster');
const os = require('os');
const cors = require('cors');
const path = require('path');
const { AppError, errorHandler } = require('@utils/tdb_globalutils');
//const {c}= require('tdb_globalutils')
dotenv.config({ path: './config/config.env' }); // read config.env to environmental variables
require('./config/dbConnection')(); // db connection
const session = require('cookie-session');
//const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');
const numCpu = os.cpus().length;
// Global Error Handler
const { ERRORS } = require('@constants/tdb-constants');

const ecommerceRoute = require('./constants/ecommerceConst').routeConsts.ecommerceRoute;
const ecommerceRouter = require('./routes/ecommerceRoutes');

const rateLimitRoute = require('./constants/ecommerceConst').routeConsts.rateLimitAPI;

const PORT = 3004; // port
const app = express();

// Security HTTP Headers
app.use(helmet());

// CORS
app.use(cors());

app.set('utils', path.join(__dirname, 'utils'));


app.use(
  morgan('dev', {
    skip: function (req, res) {
      return res.statusCode < 200;
    },
  }),
);

// GLOBAL MIDDLEWARES
app.use(express.json()); // body parser (reading data from body to req.body)
//app.use(cookieParser()); // cookie parser (reading data from cookie to req.cookie)

// Data Sanitization against noSQL query Injection
app.use(mongoSanitize());

// Data Sanitization against XSS(Cross site Scripting attack) (Remove HTML&JS Code in input)
app.use(xss());

app.use(
  session({
    signed: false,
  }),
);

app.use(compression());
//routes
app.use(ecommerceRoute, ecommerceRouter);
app.all('*', (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});

app.use(errorHandler);

if (cluster.isMaster) {
  for (let i = 0; i < numCpu; i++) {
    cluster.fork();
  }
} else {
  app.listen(PORT, () => {
    console.log(`${process.pid} listening on ${PORT}`);
  });
}
