const NodeCache = require('node-cache');

// Standard TTL 10 minutes (600 seconds)
const myCache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

module.exports = myCache;
