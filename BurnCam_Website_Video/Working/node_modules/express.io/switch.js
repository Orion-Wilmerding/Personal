
try {
    module.exports = require('./compiled');
} catch(error) {
    require('coffee-script');
    module.exports = require('./lib');
}

