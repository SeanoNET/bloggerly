if(process.env.NODE_ENV === 'production'){
    module.exports = require('./prod-data');
}else{
    module.exports = require('./dev-data');
}