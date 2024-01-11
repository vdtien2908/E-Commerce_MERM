const mongoose = require('mongoose');

const connectDB = () => {
    mongoose
        .connect(`mongodb://${process.env.DB_SERVER}/${process.env.DB_NAME}`)
        .then(() => {
            console.log('Database connection successful');
        })
        .catch((err) => {
            console.error('Database connection error');
        });
};

module.exports = connectDB;
