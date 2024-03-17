const express = require('express');
const dotenv = require('dotenv').config(); // Import and configure dotenv
const dbConnect = require('./db');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cloudinary = require('cloudinary').v2;
const cors = require('cors');
const PORT = process.env.PORT;
const app = express();

console.log(PORT);

dbConnect();


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

app.use(express.json());
app.use(morgan('common'));
app.use(cookieParser());

let origin = 'http://localhost:3000';
if (process.env.NODE_ENV === 'production') {
    origin = process.env.CORS_ORIGIN;
}

app.use(cors({
    credentials: true,
    origin
}));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));

app.get('/', function(req, res) {
    res.send(`Hello World, running on port ${PORT}`); 
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
