//imports
const express = require('express');
require('dotenv').config();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const colors = require('colors');
const connectDB = require('./config/db.js');
const authRoutes = require('./routes/authRoutes');
const cloudinaryRoutes = require('./routes/cloudinaryRoutes');
const locationRoutes = require('./routes/locationRoutes');
const typeRoutes = require('./routes/typeRoutes');
const hutRoutes = require('./routes/hutRoutes');
const commentRoutes = require('./routes/commentRoutes');
const topPickRoutes = require('./routes/topPickRoutes');
const contactRoutes = require('./routes/contactRoutes');



//app config
const app = express();

connectDB();

app.use(morgan('dev'));
app.use(bodyParser({limit: '50mb'}));
app.use(cookieParser());
app.use(cors());////

// if (process.env.NODE_ENV === 'development') {
//     app.use(cors({ origin: `${process.env.CLIENT_URL}` }));
// }



//routes
app.use('/api', authRoutes);
app.use('/api', cloudinaryRoutes);
app.use('/api', locationRoutes);
app.use('/api', typeRoutes);
app.use('/api', hutRoutes);
app.use('/api', commentRoutes);
app.use('/api', topPickRoutes);
app.use('/api', contactRoutes);



//run server
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.blue.inverse))

