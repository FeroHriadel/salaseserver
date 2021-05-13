const mongoose = require('mongoose');



const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true
        });

        console.log(`MongoDB Connected: ${connection.connection.host}`.green.inverse);

    } catch (error) {
        console.error(`Error: ${error}`.red.inverse);
        process.exit(1);
    }
}

module.exports = connectDB;
