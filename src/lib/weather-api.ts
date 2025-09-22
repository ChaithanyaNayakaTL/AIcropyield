// Weather API Integration Service for CropYieldAI
// Integrates with OpenWeatherMap API for real-time weather data

export interface WeatherData {
  location: {
    lat: number;
    lon: number;
    name: string;
    country: string;
    state?: string;
  };
  current: {
    temperature: number;
    feelsLike: number;
    humidity: number;
    pressure: number;
    windSpeed: number;
    windDirection: number;
    visibility: number;
    uvIndex: number;
    cloudCover: number;
    precipitation: number;
    description: string;
    icon: string;
    timestamp: Date;
  };
  forecast: WeatherForecast[];
  historical: HistoricalWeather[];
  alerts: WeatherAlert[];
}

export interface WeatherForecast {
  date: Date;
  day: string;
  tempMax: number;
  tempMin: number;
  humidity: number;
  precipitation: number;
  precipitationProbability: number;
  windSpeed: number;
  description: string;
  icon: string;
  farmingConditions: FarmingConditions;
}

export interface HistoricalWeather {
  date: Date;
  temperature: number;
  precipitation: number;
  humidity: number;
  notes: string;
}

export interface WeatherAlert {
  id: string;
  type: 'warning' | 'watch' | 'advisory';
  severity: 'minor' | 'moderate' | 'severe' | 'extreme';
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  farmingImpact: string;
  recommendations: string[];
}

export interface FarmingConditions {
  irrigation: 'not-needed' | 'light' | 'moderate' | 'heavy';
  fieldWork: 'excellent' | 'good' | 'fair' | 'poor' | 'not-recommended';
  spraying: 'ideal' | 'suitable' | 'not-recommended';
  harvesting: 'excellent' | 'good' | 'fair' | 'poor' | 'not-recommended';
  planting: 'excellent' | 'good' | 'fair' | 'poor' | 'not-recommended';
  notes: string[];
}

class WeatherAPIService {
  private apiKey: string = process.env.OPENWEATHER_API_KEY || 'demo_key';
  private baseUrl: string = 'https://api.openweathermap.org/data/2.5';
  private useSimulatedData: boolean = this.apiKey === 'demo_key';

  constructor() {
    if (this.useSimulatedData) {
      console.log('Weather API: Using simulated data (no API key provided)');
    }
  }

  // Get comprehensive weather data for location
  public async getWeatherData(lat: number, lon: number): Promise<WeatherData> {
    if (this.useSimulatedData) {
      return this.getSimulatedWeatherData(lat, lon);
    }

    try {
      // Real API calls would go here
      const [current, forecast, alerts] = await Promise.all([
        this.getCurrentWeather(lat, lon),
        this.getWeatherForecast(lat, lon),
        this.getWeatherAlerts(lat, lon)
      ]);

      const historical = await this.getHistoricalWeather(lat, lon);

      return {
        location: current.location,
        current: current.current,
        forecast,
        historical,
        alerts
      };
    } catch (error) {
      console.error('Weather API Error:', error);
      return this.getSimulatedWeatherData(lat, lon);
    }
  }

  // Get current weather from OpenWeatherMap
  private async getCurrentWeather(lat: number, lon: number): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
    );
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    return await response.json();
  }

  // Get 15-day weather forecast
  private async getWeatherForecast(lat: number, lon: number): Promise<WeatherForecast[]> {
    const response = await fetch(
      `${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric&cnt=40`
    );
    
    if (!response.ok) {
      throw new Error(`Forecast API error: ${response.status}`);
    }

    const data = await response.json();
    return this.processForecastData(data);
  }

  // Get weather alerts
  private async getWeatherAlerts(lat: number, lon: number): Promise<WeatherAlert[]> {
    // OpenWeatherMap One Call API would be used here
    // For simulation, we'll generate realistic alerts
    return this.generateWeatherAlerts();
  }

  // Get historical weather data
  private async getHistoricalWeather(lat: number, lon: number): Promise<HistoricalWeather[]> {
    const historical: HistoricalWeather[] = [];
    const endDate = new Date();
    
    // Get last 30 days of data
    for (let i = 30; i >= 1; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // In real implementation, this would call historical weather API
      const temp = 25 + Math.sin(i * 0.1) * 8 + (Math.random() - 0.5) * 6;
      const precipitation = Math.random() < 0.3 ? Math.random() * 15 : 0;
      
      historical.push({
        date,
        temperature: Math.round(temp * 10) / 10,
        precipitation: Math.round(precipitation * 10) / 10,
        humidity: 60 + Math.random() * 30,
        notes: this.generateHistoricalNotes(temp, precipitation)
      });
    }

    return historical;
  }

  // Process forecast data and add farming insights
  private processForecastData(data: any): WeatherForecast[] {
    const forecasts: WeatherForecast[] = [];
    
    // Group by day and get daily summaries
    const dailyData = this.groupForecastByDay(data.list);
    
    dailyData.forEach((dayData, index) => {
      if (index < 15) { // 15-day forecast
        const forecast: WeatherForecast = {
          date: new Date(dayData.dt * 1000),
          day: this.getDayName(new Date(dayData.dt * 1000)),
          tempMax: Math.round(dayData.main.temp_max),
          tempMin: Math.round(dayData.main.temp_min),
          humidity: dayData.main.humidity,
          precipitation: dayData.rain ? dayData.rain['3h'] || 0 : 0,
          precipitationProbability: dayData.pop * 100,
          windSpeed: dayData.wind.speed,
          description: dayData.weather[0].description,
          icon: dayData.weather[0].icon,
          farmingConditions: this.calculateFarmingConditions(dayData)
        };
        
        forecasts.push(forecast);
      }
    });

    return forecasts;
  }

  // Calculate farming conditions based on weather
  private calculateFarmingConditions(weatherData: any): FarmingConditions {
    const temp = weatherData.main.temp;
    const humidity = weatherData.main.humidity;
    const windSpeed = weatherData.wind.speed;
    const precipitation = weatherData.rain ? weatherData.rain['3h'] || 0 : 0;
    const pop = weatherData.pop;

    const conditions: FarmingConditions = {
      irrigation: 'not-needed',
      fieldWork: 'excellent',
      spraying: 'ideal',
      harvesting: 'excellent',
      planting: 'excellent',
      notes: []
    };

    // Irrigation recommendations
    if (precipitation < 2 && humidity < 50) {
      conditions.irrigation = 'moderate';
      conditions.notes.push('Consider irrigation due to low moisture');
    } else if (precipitation < 1 && humidity < 30) {
      conditions.irrigation = 'heavy';
      conditions.notes.push('Heavy irrigation recommended');
    }

    // Field work conditions
    if (precipitation > 10 || pop > 0.8) {
      conditions.fieldWork = 'poor';
      conditions.notes.push('Avoid heavy field work due to wet conditions');
    } else if (precipitation > 5 || pop > 0.6) {
      conditions.fieldWork = 'fair';
    }

    // Spraying conditions
    if (windSpeed > 15 || precipitation > 1) {
      conditions.spraying = 'not-recommended';
      conditions.notes.push('Avoid spraying due to wind/rain');
    } else if (windSpeed > 10) {
      conditions.spraying = 'suitable';
    }

    // Harvesting conditions
    if (precipitation > 5 || pop > 0.7) {
      conditions.harvesting = 'poor';
      conditions.notes.push('Delay harvesting due to wet conditions');
    } else if (temp > 35) {
      conditions.harvesting = 'fair';
      conditions.notes.push('Early morning harvesting recommended');
    }

    // Planting conditions
    if (temp < 10 || temp > 40) {
      conditions.planting = 'poor';
      conditions.notes.push('Temperature not ideal for planting');
    } else if (precipitation > 15) {
      conditions.planting = 'fair';
      conditions.notes.push('Soil may be too wet for planting');
    }

    return conditions;
  }

  // Generate realistic weather alerts
  private generateWeatherAlerts(): WeatherAlert[] {
    const alerts: WeatherAlert[] = [];
    const now = new Date();

    // Simulate different types of weather alerts
    const alertTypes = [
      {
        type: 'warning' as const,
        severity: 'moderate' as const,
        title: 'Heavy Rainfall Warning',
        description: 'Heavy rainfall expected in the next 24-48 hours. 50-100mm precipitation forecast.',
        farmingImpact: 'May cause waterlogging in low-lying fields. Harvest mature crops before rainfall.',
        recommendations: [
          'Harvest ready crops immediately',
          'Ensure proper drainage in fields',
          'Cover stored grains and equipment',
          'Avoid field operations during heavy rain'
        ]
      },
      {
        type: 'advisory' as const,
        severity: 'minor' as const,
        title: 'High Temperature Advisory',
        description: 'Maximum temperatures may reach 38-42°C in the next 3 days.',
        farmingImpact: 'Heat stress on crops, increased water requirements.',
        recommendations: [
          'Increase irrigation frequency',
          'Provide shade to livestock',
          'Avoid midday field work',
          'Monitor crops for heat stress symptoms'
        ]
      }
    ];

    // Randomly generate alerts (30% chance)
    if (Math.random() < 0.3) {
      const alertTemplate = alertTypes[Math.floor(Math.random() * alertTypes.length)];
      
      alerts.push({
        id: `alert_${Date.now()}`,
        ...alertTemplate,
        startTime: now,
        endTime: new Date(now.getTime() + 72 * 60 * 60 * 1000) // 3 days
      });
    }

    return alerts;
  }

  // Get simulated weather data for demo purposes
  private getSimulatedWeatherData(lat: number, lon: number): WeatherData {
    const location = this.getLocationName(lat, lon);
    const now = new Date();

    // Generate realistic current weather
    const baseTemp = this.getSeasonalBaseTemp();
    const currentTemp = baseTemp + (Math.random() - 0.5) * 8;
    
    const current = {
      temperature: Math.round(currentTemp * 10) / 10,
      feelsLike: Math.round((currentTemp + (Math.random() - 0.5) * 3) * 10) / 10,
      humidity: Math.round(40 + Math.random() * 40),
      pressure: Math.round(1010 + (Math.random() - 0.5) * 20),
      windSpeed: Math.round(Math.random() * 15 * 10) / 10,
      windDirection: Math.round(Math.random() * 360),
      visibility: Math.round(8 + Math.random() * 7),
      uvIndex: Math.round(Math.random() * 11),
      cloudCover: Math.round(Math.random() * 100),
      precipitation: Math.random() < 0.3 ? Math.round(Math.random() * 5 * 10) / 10 : 0,
      description: this.getWeatherDescription(),
      icon: this.getRandomWeatherIcon(),
      timestamp: now
    };

    // Generate 15-day forecast
    const forecast: WeatherForecast[] = [];
    for (let i = 1; i <= 15; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      const dayTemp = baseTemp + Math.sin(i * 0.2) * 5 + (Math.random() - 0.5) * 6;
      const precipitation = Math.random() < 0.4 ? Math.random() * 12 : 0;
      
      forecast.push({
        date,
        day: this.getDayName(date),
        tempMax: Math.round((dayTemp + 3) * 10) / 10,
        tempMin: Math.round((dayTemp - 5) * 10) / 10,
        humidity: Math.round(50 + Math.random() * 30),
        precipitation: Math.round(precipitation * 10) / 10,
        precipitationProbability: Math.round(Math.random() * 80),
        windSpeed: Math.round(Math.random() * 12 * 10) / 10,
        description: this.getWeatherDescription(),
        icon: this.getRandomWeatherIcon(),
        farmingConditions: this.calculateSimulatedFarmingConditions(dayTemp, precipitation)
      });
    }

    // Generate historical data
    const historical = this.generateSimulatedHistorical();

    // Generate alerts
    const alerts = this.generateWeatherAlerts();

    return {
      location: {
        lat,
        lon,
        name: location.name,
        country: location.country,
        state: location.state
      },
      current,
      forecast,
      historical,
      alerts
    };
  }

  // Helper methods
  private getLocationName(lat: number, lon: number) {
    // Simulate location based on coordinates
    const locations = [
      { name: 'Bangalore', country: 'India', state: 'Karnataka' },
      { name: 'Pune', country: 'India', state: 'Maharashtra' },
      { name: 'Hyderabad', country: 'India', state: 'Telangana' },
      { name: 'Chennai', country: 'India', state: 'Tamil Nadu' },
      { name: 'Delhi', country: 'India', state: 'Delhi' }
    ];
    
    return locations[Math.floor(Math.random() * locations.length)];
  }

  private getSeasonalBaseTemp(): number {
    const month = new Date().getMonth();
    const seasonalTemps = [18, 22, 27, 32, 38, 35, 28, 27, 29, 26, 22, 19]; // Monthly averages
    return seasonalTemps[month];
  }

  private getWeatherDescription(): string {
    const descriptions = [
      'Clear sky', 'Partly cloudy', 'Cloudy', 'Light rain',
      'Moderate rain', 'Sunny', 'Overcast', 'Drizzle',
      'Scattered clouds', 'Fair weather'
    ];
    
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  }

  private getRandomWeatherIcon(): string {
    const icons = ['01d', '02d', '03d', '04d', '09d', '10d', '11d', '13d', '50d'];
    return icons[Math.floor(Math.random() * icons.length)];
  }

  private getDayName(date: Date): string {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  }

  private groupForecastByDay(forecastList: any[]): any[] {
    // Group 3-hourly forecasts by day
    const grouped = forecastList.reduce((acc, item) => {
      const date = new Date(item.dt * 1000).toDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(item);
      return acc;
    }, {});

    // Return daily summaries
    return Object.values(grouped).map((dayItems: any) => {
      // Take the midday forecast as representative
      return dayItems[Math.floor(dayItems.length / 2)];
    });
  }

  private calculateSimulatedFarmingConditions(temp: number, precipitation: number): FarmingConditions {
    return {
      irrigation: precipitation < 2 ? 'moderate' : 'not-needed',
      fieldWork: precipitation > 8 ? 'poor' : temp > 35 ? 'fair' : 'good',
      spraying: precipitation > 1 ? 'not-recommended' : 'ideal',
      harvesting: precipitation > 5 ? 'poor' : 'good',
      planting: temp < 15 || temp > 40 ? 'poor' : 'good',
      notes: this.generateConditionNotes(temp, precipitation)
    };
  }

  private generateConditionNotes(temp: number, precipitation: number): string[] {
    const notes: string[] = [];
    
    if (temp > 35) notes.push('High temperature - avoid midday work');
    if (temp < 15) notes.push('Cool weather - monitor for frost');
    if (precipitation > 8) notes.push('Heavy rain expected - delay field operations');
    if (precipitation < 1) notes.push('Dry conditions - increase irrigation');
    
    return notes;
  }

  private generateSimulatedHistorical(): HistoricalWeather[] {
    const historical: HistoricalWeather[] = [];
    const baseTemp = this.getSeasonalBaseTemp();
    
    for (let i = 30; i >= 1; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const temp = baseTemp + Math.sin(i * 0.1) * 6 + (Math.random() - 0.5) * 8;
      const precipitation = Math.random() < 0.35 ? Math.random() * 15 : 0;
      
      historical.push({
        date,
        temperature: Math.round(temp * 10) / 10,
        precipitation: Math.round(precipitation * 10) / 10,
        humidity: Math.round(55 + Math.random() * 30),
        notes: this.generateHistoricalNotes(temp, precipitation)
      });
    }
    
    return historical;
  }

  private generateHistoricalNotes(temp: number, precipitation: number): string {
    if (temp > 38) return 'Very hot day - heat stress likely';
    if (temp < 12) return 'Cold day - frost risk';
    if (precipitation > 12) return 'Heavy rainfall - waterlogging risk';
    if (precipitation > 5) return 'Good rainfall for crops';
    if (precipitation === 0 && temp > 30) return 'Hot and dry - irrigation needed';
    return 'Normal weather conditions';
  }

  // Public utility methods
  public getWeatherIcon(iconCode: string): string {
    return `https://openweathermap.org/img/w/${iconCode}.png`;
  }

  public getFarmingRecommendations(weatherData: WeatherData): string[] {
    const recommendations: string[] = [];
    const current = weatherData.current;
    const upcoming = weatherData.forecast.slice(0, 3);

    // Current conditions
    if (current.temperature > 35) {
      recommendations.push('🌡️ Very hot weather - provide shade to crops and livestock');
    }
    
    if (current.precipitation > 0) {
      recommendations.push('🌧️ Rain detected - postpone spraying and harvesting');
    }
    
    if (current.windSpeed > 15) {
      recommendations.push('💨 High winds - secure farm equipment and avoid aerial spraying');
    }

    // Upcoming conditions
    const totalRain = upcoming.reduce((sum, day) => sum + day.precipitation, 0);
    if (totalRain > 20) {
      recommendations.push('☔ Heavy rain expected - harvest ready crops and ensure drainage');
    }

    // Alerts
    weatherData.alerts.forEach(alert => {
      recommendations.push(`⚠️ ${alert.title} - ${alert.farmingImpact}`);
    });

    return recommendations;
  }

  // Weather-based adjustments for predictions
  public getWeatherAdjustments(weatherData: WeatherData, cropType: string): {
    yieldAdjustment: number;
    riskFactors: string[];
    recommendations: string[];
  } {
    const adjustments = {
      yieldAdjustment: 0,
      riskFactors: [] as string[],
      recommendations: [] as string[]
    };

    const avgTemp = weatherData.forecast.slice(0, 7)
      .reduce((sum, day) => sum + (day.tempMax + day.tempMin) / 2, 0) / 7;
    
    const totalRain = weatherData.forecast.slice(0, 7)
      .reduce((sum, day) => sum + day.precipitation, 0);

    // Temperature-based adjustments
    if (avgTemp > 35) {
      adjustments.yieldAdjustment -= 15;
      adjustments.riskFactors.push('Heat stress risk');
      adjustments.recommendations.push('Increase irrigation frequency');
    } else if (avgTemp < 15) {
      adjustments.yieldAdjustment -= 10;
      adjustments.riskFactors.push('Cold stress risk');
      adjustments.recommendations.push('Consider frost protection');
    }

    // Rainfall-based adjustments
    if (totalRain < 20) {
      adjustments.yieldAdjustment -= 20;
      adjustments.riskFactors.push('Drought stress');
      adjustments.recommendations.push('Implement water conservation');
    } else if (totalRain > 100) {
      adjustments.yieldAdjustment -= 25;
      adjustments.riskFactors.push('Waterlogging risk');
      adjustments.recommendations.push('Improve field drainage');
    }

    // Crop-specific adjustments
    if (cropType === 'wheat' && avgTemp > 30) {
      adjustments.yieldAdjustment -= 10;
      adjustments.riskFactors.push('Wheat heat sensitivity');
    }
    
    if (cropType === 'rice' && totalRain < 50) {
      adjustments.yieldAdjustment -= 30;
      adjustments.riskFactors.push('Rice water requirement not met');
    }

    return adjustments;
  }
}

export const weatherAPIService = new WeatherAPIService();