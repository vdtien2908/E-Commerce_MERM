const mongoose = require('mongoose');

class Database {
    constructor() {
        this._connect();
    }

    _connect() {
        mongoose
            .connect(
                `mongodb://${process.env.DB_SERVER}/${process.env.DB_NAME}`
            )
            .then(() => {
                console.log('Database connection successful');
            })
            .catch((err) => {
                console.error('Database connection error');
            });
    }
}

module.exports = new Database();
