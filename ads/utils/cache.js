const redis = require('redis');
const { promisify } = require('util');
//const cache = new NodeCache();

module.exports = (duration) => async (req, res, next) => {
	console.log(duration);
	// const client = redis.createClient({
	// 	host: 'us1-mint-spaniel-34776.upstash.io',
	// 	port: '34776',
	// 	password: '5d8d4327a75846eeab92d8a6666c8507',
	// 	tls: {},
	// });
	// client.on('error', function (err) {
	// 	console.log(err);
	// });

	// const GET_ASYNC = promisify(client.get).bind(client);
	// const SET_ASYNC = promisify(client.set).bind(client);

	// if (req.method !== 'GET') {
	// 	client.flushdb(function (err, succeeded) {
	// 		console.log(succeeded); // will be true if successfull
	// 	});
	// 	return next();
	// }
	// let key;
	// if (req.user) {
	// 	key = `${req.originalUrl}_${req.user._id}`;
	// } else {
	// 	key = req.originalUrl;
	// }
	// console.log(key);

	// const cachedResponse = await GET_ASYNC(key);

	// if (cachedResponse) {
	// 	console.log(`Cache hit for ${key}`);
	// 	res.json(JSON.parse(cachedResponse));
	// } else {
	// 	console.log(`Cache miss for ${key}`);
	// 	res.originalSend = res.json;
	// 	res.json = async (body) => {
	// 		res.originalSend(body);
	// 		await SET_ASYNC(key, JSON.stringify(body), 'EX', duration);
	// 		//cache.set(key, body, duration);
	// 	};
	// 	next();
	// }
	next();
};
