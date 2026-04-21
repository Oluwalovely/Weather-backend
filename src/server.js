const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const weatherRoutes = require('./routes/weatherRoutes');
const errorHandler = require('./middleware/errorHandler');


const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
};

app.use(cors());
app.use(express.json());
app.use('/api/weather', weatherRoutes);


app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Weather API is running'
    });
});


app.use(errorHandler);


const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];


app.use(cors(corsOptions));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});