const express = require('express');
const dotenv = require('dotenv').config();
const dbConnect = require('./db');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cloudinary = require('cloudinary').v2;
const cors = require('cors');
const PORT = process.env.PORT;
const app = express();

dbConnect();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

app.use(express.json({limit: "10mb"}));
app.use(morgan('common'));
app.use(cookieParser());

let origin = 'https://662821c3b18c2814f18bc2f7--papaya-cat-8bdd21.netlify.app/#';


app.use(cors({
    credentials: true,
    origin
}));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/user', require('./routes/user'));
app.use('/api/hyart', require('./routes/common'));

app.get('/', function (req, res) {
    res.send(`Hello World, running on port ${PORT}`);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});