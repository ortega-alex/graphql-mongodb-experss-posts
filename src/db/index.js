const { connect, connection } = require('mongoose');
const { MONGODB_URI } = require('../config');

const connectDB = async () => {
    try {
        const db = await connect(MONGODB_URI);
        console.log('DB Connected to ', db.connection.name);
    } catch (error) {
        console.log(error);
    }
};

connection.on('error', err => console.log(err));

module.exports = { connectDB, connection };
