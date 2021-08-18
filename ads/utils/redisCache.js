const redis = require('redis');

var client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  tls: {},
});
client.on('error', function (err, next) {
  return next(new AppError('Error Connecting to Redis'));
});

const isCached = (req, res, next) => {
  const { id } = req.params;

  //First check in Redis
  client.get(id, (err, data) => {
    if (err) {
      console.log(err);
    }
    if (data) {
      const result = JSON.parse(data);
      return res.status(200).json(result);
    }
    next();
  });
};

module.exports = { client, isCached };
