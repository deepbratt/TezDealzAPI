const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./config/swagger.yaml');
const { AppError } = require('tdb_globalutils');

const PORT = 3005; // port
const app = express();

// CORS
app.use(cors());

// GLOBAL MIDDLEWARES
app.use(express.json()); // body parser (reading data from body to req.body)
app.use(cookieParser()); // cookie parser (reading data from cookie to req.cookie)

app.use('/v1/tezDeals-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.all('*', (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});

app.listen(PORT, () => {
  console.log(`Listening on Port ${PORT}`);
});
