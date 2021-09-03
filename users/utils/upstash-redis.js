const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');

const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  tls: {},
});

client.hget = util.promisify(client.hget);

// create reference for .exec
const exec = mongoose.Query.prototype.exec;

// create new cache function on prototype
mongoose.Query.prototype.cache = function (options = { time: 10 }) {
  this.useCache = true;
  this.time = options.time;
  this.hashKey = JSON.stringify(options.key || this.mongooseCollection.name);

  return this;
};

mongoose.Query.prototype.exec = async function () {
  if (!this.useCache) {
    return await exec.apply(this, arguments);
  }

  const key = JSON.stringify({
    ...this.getQuery(),
  });

  const cacheValue = await client.hget(this.hashKey, key);

  if (cacheValue) {
    const doc = JSON.parse(cacheValue);

    console.log('Response from Redis');
    return Array.isArray(doc) ? doc.map((d) => new this.model(d)) : new this.model(doc);
  }

  const result = await exec.apply(this, arguments);
  console.log(this.time);
  client.hset(this.hashKey, key, JSON.stringify(result));
  client.expire(this.hashKey, this.time);

  console.log('Response from MongoDB');
  return result;
};

module.exports = {
  clearKey(hashKey) {
    client.del(JSON.stringify(hashKey));
  },
};

// client.hget = util.promisify(client.hget);

// // create reference for .exec
// const exec = mongoose.Query.prototype.exec;

// // create new cache function on prototype
// mongoose.Query.prototype.cache = function (time = 60 * 60) {
//   this.cacheMe = true;
//   // we will talk about cacheTime later;
//   this.cacheTime = time;
//   return this;
// };

// // override exec function to first check cache for data
// mongoose.Query.prototype.exec = async function () {
//   const collectionName = this.mongooseCollection.name;

//   if (this.cacheMe) {
//     // You can't insert json straight to redis needs to be a string

//     const key = JSON.stringify({
//       ...this.getOptions(),
//       collectionName: collectionName,
//       op: this.op,
//     });
//     const cachedResults = await redis.HGET(collectionName, key);

//     // getOptions() returns the query and this.op is the method which in our case is "find"

//     if (cachedResults) {
//       // if you found cached results return it;
//       const result = JSON.parse(cachedResults);
//       return result;
//     }
//     //else
//     // get results from Database then cache it
//     const result = await exec.apply(this, arguments);

//     redis.HSET(collectionName, key, JSON.stringify(result), 'EX', this.cacheTime);
//     //Blogs - > {op: "find" , ... the original query} -> result we got from database
//     return result;
//   }

//   clearCachedData(collectionName, this.op);
//   return exec.apply(this, arguments);
// };

// async function clearCachedData(collectionName, op) {
//   const allowedCacheOps = ['find', 'findById', 'findOne'];
//   // if operation is insert or delete or update for any collection that exists and has cached values
//   // delete its childern
//   if (!allowedCacheOps.includes(op) && (await redis.EXISTS(collectionName))) {
//     redis.DEL(collectionName);
//   }
// }
