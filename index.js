const express = require('express');
const dotenv = require('dotenv').config(); // Import and configure dotenv
const dbConnect = require('./db');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const PORT = process.env.PORT;
const app = express();

console.log(PORT);

dbConnect();

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

app.get('/', function(req, res) {
    res.send(`Hello World, running on port ${PORT}`); 
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
