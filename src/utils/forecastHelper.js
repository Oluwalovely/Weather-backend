// This file is no longer needed with WeatherAPI
// WeatherAPI already gives us clean forecast data!
module.exports = {
    processForecastData: (data) => {
        // If you want to keep it, here's a simple version
        return data.forecast.forecastday.map(day => ({
            date: day.date,
            maxTemp: day.day.maxtemp_c,
            minTemp: day.day.mintemp_c,
            condition: day.day.condition.text,
            icon: day.day.condition.icon
        }));
    }
};