const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const weatherRoutes = require('./routes/weatherRoutes');
const errorHandler = require('./middleware/errorHandler');


const app = express();
const PORT = process.env.PORT || 5000;

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


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});