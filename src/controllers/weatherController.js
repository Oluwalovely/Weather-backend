const axios = require('axios');
const NodeCache = require('node-cache');

// Initialize cache with 10 minutes TTL
const cache = new NodeCache({ stdTTL: 600 });

const API_KEY = process.env.WEATHER_API_KEY;
const BASE_URL = 'http://api.weatherapi.com/v1';

// Validate API key on startup
if (!API_KEY) {
    console.error('WEATHER_API_KEY is missing in .env file');
    console.error('Get a free key from: https://www.weatherapi.com/');
    process.exit(1);
}

console.log(`Using WeatherAPI with key: ${API_KEY.substring(0, 5)}...`);

const getWeather = async (req, res, next) => {
    try {
        const { city } = req.params;

        // Check cache
        const cacheKey = `current_${city.toLowerCase()}`;
        const cachedData = cache.get(cacheKey);

        if (cachedData) {
            console.log(`📦 Cache hit for ${city}`);
            return res.json(cachedData);
        }
        
        console.log(`🌐 Fetching current weather for ${city} from WeatherAPI`);

        
        const response = await axios.get(
            `${BASE_URL}/current.json?key=${API_KEY}&q=${city}`
        );

        const data = response.data;
        
        // Format data for frontend
        const formattedData = {
            location: {
                name: data.location.name,
                country: data.location.country,
                localTime: data.location.localtime
            },
            current: {
                temp_c: data.current.temp_c,
                temp_f: data.current.temp_f,
                feelslike_c: data.current.feelslike_c,
                humidity: data.current.humidity,
                wind_kph: data.current.wind_kph,
                pressure_mb: data.current.pressure_mb,
                condition: {
                    text: data.current.condition.text,
                    icon: data.current.condition.icon
                }
            }
        };

        // Store in cache
        cache.set(cacheKey, formattedData);

        res.json(formattedData);
        
    } catch (error) {
        console.error('Error:', error.response?.data?.error?.message || error.message);
        
        if (error.response?.status === 400) {
            return next({
                status: 404,
                message: `City "${req.params.city}" not found. Please check the spelling.`
            });
        }
        
        next({
            status: 500,
            message: 'Failed to fetch weather data. Please try again later.'
        });
    }
};

const getForecast = async (req, res, next) => {
    try {
        const { city } = req.params;

        const cacheKey = `forecast_${city.toLowerCase()}`;
        const cachedData = cache.get(cacheKey);

        if (cachedData) {
            console.log(`📦 Cache hit for ${city} forecast`);
            return res.json(cachedData);
        }
        
        console.log(`🌐 Fetching 5-day forecast for ${city} from WeatherAPI`);

        //CORRECT WeatherAPI endpoint for forecast
        const response = await axios.get(
            `${BASE_URL}/forecast.json?key=${API_KEY}&q=${city}&days=5`
        );

        // Process the forecast data
        const processedForecast = response.data.forecast.forecastday.map(day => ({
            date: day.date,
            maxTemp: day.day.maxtemp_c,
            minTemp: day.day.mintemp_c,
            condition: day.day.condition.text,
            icon: day.day.condition.icon,
            chanceOfRain: day.day.daily_chance_of_rain,
            maxWind: day.day.maxwind_kph
        }));

        cache.set(cacheKey, processedForecast);
        res.json(processedForecast);
        
    } catch (error) {
        console.error('Forecast error:', error.message);
        next({
            status: 500,
            message: 'Failed to fetch forecast data'
        });
    }
};

module.exports = { getWeather, getForecast };