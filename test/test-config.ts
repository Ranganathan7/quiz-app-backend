const dotenv = require('dotenv/config');
const config = {
    functional: {
        baseUrl: process.env.BASE_URL || 'http://127.0.0.1:5000',
        serviceUrl: '',
    },
    performance: {

    },
    e2e: {
        baseUrl: process.env.BASE_URL || 'http://127.0.0.1:5000'
    }
}

export default config;