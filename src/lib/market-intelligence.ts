// Market Intelligence Service for CropYieldAI
// Provides current market prices, price trends, selling recommendations, and market locations

export interface MarketPrice {
  commodityName: string;
  variety: string;
  unit: 'quintal' | 'kg' | 'ton' | 'bag';
  currentPrice: number;
  currency: string;
  priceDate: Date;
  marketName: string;
  marketCode: string;
  state: string;
  district: string;
  priceChange: {
    daily: number;
    weekly: number;
    monthly: number;
    percentage: {
      daily: number;
      weekly: number;
      monthly: number;
    };
  };
  priceRange: {
    min: number;
    max: number;
    average: number;
  };
  quality: 'poor' | 'average' | 'good' | 'excellent';
  demand: 'very-low' | 'low' | 'moderate' | 'high' | 'very-high';
  supply: 'shortage' | 'low' | 'adequate' | 'surplus' | 'excess';
}

export interface PriceTrend {
  commodityName: string;
  variety: string;
  timeframe: '7d' | '30d' | '90d' | '1y';
  trendDirection: 'rising' | 'falling' | 'stable' | 'volatile';
  volatility: 'low' | 'moderate' | 'high' | 'very-high';
  confidence: number; // 0-100 percentage
  historicalPrices: {
    date: Date;
    price: number;
    volume?: number;
  }[];
  seasonalPattern: {
    month: number;
    averagePrice: number;
    volatility: number;
  }[];
  forecast: {
    period: string;
    predictedPrice: number;
    confidence: number;
    factors: string[];
  }[];
  influencingFactors: MarketFactor[];
}

export interface MarketFactor {
  factor: string;
  impact: 'positive' | 'negative' | 'neutral';
  strength: 'weak' | 'moderate' | 'strong' | 'very-strong';
  description: string;
  timeframe: string;
}

export interface SellingRecommendation {
  commodityName: string;
  variety: string;
  recommendation: 'sell-now' | 'wait-and-sell' | 'hold' | 'store' | 'process';
  confidence: number; // 0-100 percentage
  reasoning: string;
  optimalTiming: {
    bestTime: Date;
    priceExpectation: number;
    rationale: string;
  };
  marketSuggestions: MarketSuggestion[];
  riskFactors: string[];
  alternatives: Alternative[];
  expectedReturn: {
    immediate: number;
    delayed: number;
    best: number;
  };
}

export interface MarketSuggestion {
  marketName: string;
  location: string;
  distance: number; // km
  currentPrice: number;
  advantages: string[];
  requirements: string[];
  contact: {
    phone?: string;
    address: string;
    timings: string;
  };
}

export interface Alternative {
  option: 'direct-sale' | 'cooperative' | 'online-platform' | 'processing' | 'storage';
  description: string;
  expectedPrice: number;
  requirements: string[];
  timeframe: string;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface MarketLocation {
  id: string;
  name: string;
  type: 'mandi' | 'wholesale' | 'retail' | 'cooperative' | 'online' | 'processing';
  location: {
    latitude: number;
    longitude: number;
    address: string;
    district: string;
    state: string;
    pincode: string;
  };
  contact: {
    phone?: string;
    email?: string;
    website?: string;
    timings: string;
    workingDays: string[];
  };
  facilities: {
    storage: boolean;
    grading: boolean;
    packaging: boolean;
    transportation: boolean;
    weighbridge: boolean;
    coldStorage: boolean;
  };
  commoditiesTraded: string[];
  averagePrices: { [commodity: string]: number };
  recentTransactions: number;
  reputation: number; // 1-5 rating
  paymentTerms: string[];
  minimumQuantity: { [commodity: string]: number };
  commission: number; // percentage
  distance?: number; // calculated from user location
}

export interface MarketIntelligence {
  marketSummary: {
    totalMarkets: number;
    activeCommodities: number;
    averagePriceChange: number;
    marketSentiment: 'bearish' | 'neutral' | 'bullish' | 'mixed';
    topGainers: { commodity: string; change: number }[];
    topLosers: { commodity: string; change: number }[];
  };
  priceAlerts: PriceAlert[];
  seasonalInsights: SeasonalInsight[];
  tradingOpportunities: TradingOpportunity[];
}

export interface PriceAlert {
  id: string;
  commodityName: string;
  variety: string;
  alertType: 'price-rise' | 'price-drop' | 'target-reached' | 'volatility' | 'demand-spike';
  currentPrice: number;
  targetPrice?: number;
  change: number;
  changePercentage: number;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  actionRequired: string;
  timestamp: Date;
}

export interface SeasonalInsight {
  season: 'summer' | 'monsoon' | 'winter' | 'harvest';
  commodity: string;
  insight: string;
  expectedPriceMovement: 'increase' | 'decrease' | 'stable';
  confidence: number;
  historicalData: string;
  recommendation: string;
}

export interface TradingOpportunity {
  id: string;
  type: 'price-arbitrage' | 'seasonal-trade' | 'surplus-sale' | 'demand-spike';
  commodity: string;
  description: string;
  potentialProfit: number;
  riskLevel: 'low' | 'medium' | 'high';
  timeframe: string;
  requirements: string[];
  action: string;
}

class MarketIntelligenceService {
  private useSimulatedData: boolean = true; // Always true for demo
  private majorCommodities: string[] = [
    'Rice', 'Wheat', 'Maize', 'Sugarcane', 'Cotton', 'Soybean', 'Groundnut',
    'Mustard', 'Sunflower', 'Turmeric', 'Onion', 'Potato', 'Tomato', 'Chili'
  ];
  
  private indianStates: string[] = [
    'Uttar Pradesh', 'Maharashtra', 'Bihar', 'West Bengal', 'Madhya Pradesh',
    'Tamil Nadu', 'Rajasthan', 'Karnataka', 'Gujarat', 'Andhra Pradesh',
    'Odisha', 'Telangana', 'Kerala', 'Jharkhand', 'Assam', 'Punjab', 'Haryana'
  ];

  constructor() {
    console.log('Market Intelligence Service: Using simulated market data');
  }

  // Get current market prices for commodities
  public async getCurrentMarketPrices(
    commodities: string[],
    location?: { state: string; district: string }
  ): Promise<MarketPrice[]> {
    if (this.useSimulatedData) {
      return this.getSimulatedMarketPrices(commodities, location);
    }

    // Real market data integration would go here (AGMARKNET API, etc.)
    try {
      return [];
    } catch (error) {
      console.error('Market Prices API Error:', error);
      return this.getSimulatedMarketPrices(commodities, location);
    }
  }

  // Get price trends and forecasts
  public async getPriceTrends(
    commodity: string,
    variety: string,
    timeframe: '7d' | '30d' | '90d' | '1y' = '30d'
  ): Promise<PriceTrend> {
    if (this.useSimulatedData) {
      return this.getSimulatedPriceTrends(commodity, variety, timeframe);
    }

    // Real price trend analysis would go here
    try {
      return {} as PriceTrend;
    } catch (error) {
      console.error('Price Trends API Error:', error);
      return this.getSimulatedPriceTrends(commodity, variety, timeframe);
    }
  }

  // Get selling recommendations
  public async getSellingRecommendations(
    commodity: string,
    variety: string,
    quantity: number,
    location: { latitude: number; longitude: number }
  ): Promise<SellingRecommendation> {
    if (this.useSimulatedData) {
      return this.getSimulatedSellingRecommendations(commodity, variety, quantity, location);
    }

    // Real recommendation engine would go here
    try {
      return {} as SellingRecommendation;
    } catch (error) {
      console.error('Selling Recommendations API Error:', error);
      return this.getSimulatedSellingRecommendations(commodity, variety, quantity, location);
    }
  }

  // Get nearby market locations
  public async getNearbyMarkets(
    latitude: number,
    longitude: number,
    radius: number = 50,
    commodityFilter?: string
  ): Promise<MarketLocation[]> {
    if (this.useSimulatedData) {
      return this.getSimulatedNearbyMarkets(latitude, longitude, radius, commodityFilter);
    }

    // Real market location API would go here
    try {
      return [];
    } catch (error) {
      console.error('Market Locations API Error:', error);
      return this.getSimulatedNearbyMarkets(latitude, longitude, radius, commodityFilter);
    }
  }

  // Get comprehensive market intelligence
  public async getMarketIntelligence(
    location?: { state: string; district: string }
  ): Promise<MarketIntelligence> {
    if (this.useSimulatedData) {
      return this.getSimulatedMarketIntelligence(location);
    }

    // Real market intelligence aggregation would go here
    try {
      return {} as MarketIntelligence;
    } catch (error) {
      console.error('Market Intelligence API Error:', error);
      return this.getSimulatedMarketIntelligence(location);
    }
  }

  // Simulated data generation methods
  private getSimulatedMarketPrices(
    commodities: string[],
    location?: { state: string; district: string }
  ): MarketPrice[] {
    const prices: MarketPrice[] = [];
    const state = location?.state || this.getRandomState();
    const district = location?.district || this.getRandomDistrict();

    commodities.forEach(commodity => {
      const basePrice = this.getBasePriceForCommodity(commodity);
      const priceVariation = (Math.random() - 0.5) * 0.3; // ±15% variation
      const currentPrice = Math.round(basePrice * (1 + priceVariation));

      // Generate price changes
      const dailyChange = (Math.random() - 0.5) * 100; // ±50 per day
      const weeklyChange = (Math.random() - 0.5) * 300; // ±150 per week
      const monthlyChange = (Math.random() - 0.5) * 800; // ±400 per month

      const variety = this.getVarietyForCommodity(commodity);
      const quality = this.getRandomQuality();
      const demand = this.getRandomDemand();
      const supply = this.getRandomSupply();

      prices.push({
        commodityName: commodity,
        variety,
        unit: this.getUnitForCommodity(commodity),
        currentPrice,
        currency: 'INR',
        priceDate: new Date(),
        marketName: `${district} Mandi`,
        marketCode: `${state.substring(0, 2).toUpperCase()}${district.substring(0, 3).toUpperCase()}`,
        state,
        district,
        priceChange: {
          daily: Math.round(dailyChange),
          weekly: Math.round(weeklyChange),
          monthly: Math.round(monthlyChange),
          percentage: {
            daily: Math.round((dailyChange / currentPrice) * 100 * 100) / 100,
            weekly: Math.round((weeklyChange / currentPrice) * 100 * 100) / 100,
            monthly: Math.round((monthlyChange / currentPrice) * 100 * 100) / 100
          }
        },
        priceRange: {
          min: Math.round(currentPrice * 0.9),
          max: Math.round(currentPrice * 1.1),
          average: currentPrice
        },
        quality,
        demand,
        supply
      });
    });

    return prices;
  }

  private getSimulatedPriceTrends(
    commodity: string,
    variety: string,
    timeframe: '7d' | '30d' | '90d' | '1y'
  ): PriceTrend {
    const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : timeframe === '90d' ? 90 : 365;
    const basePrice = this.getBasePriceForCommodity(commodity);
    
    // Generate historical prices
    const historicalPrices: { date: Date; price: number; volume?: number }[] = [];
    let currentPrice = basePrice;
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Add some realistic price movement
      const randomChange = (Math.random() - 0.5) * 0.1; // ±5% daily variation
      const seasonalFactor = this.getSeasonalPriceFactor(commodity, date);
      currentPrice = Math.round(currentPrice * (1 + randomChange + seasonalFactor * 0.02));
      
      historicalPrices.push({
        date,
        price: currentPrice,
        volume: Math.round(Math.random() * 1000 + 500)
      });
    }

    // Determine trend direction
    const firstPrice = historicalPrices[0].price;
    const lastPrice = historicalPrices[historicalPrices.length - 1].price;
    const priceChange = (lastPrice - firstPrice) / firstPrice;
    
    let trendDirection: 'rising' | 'falling' | 'stable' | 'volatile';
    if (Math.abs(priceChange) < 0.05) trendDirection = 'stable';
    else if (priceChange > 0.15) trendDirection = 'rising';
    else if (priceChange < -0.15) trendDirection = 'falling';
    else trendDirection = 'volatile';

    // Calculate volatility
    const priceChanges = historicalPrices.slice(1).map((p, i) => 
      Math.abs(p.price - historicalPrices[i].price) / historicalPrices[i].price
    );
    const avgVolatility = priceChanges.reduce((sum, change) => sum + change, 0) / priceChanges.length;
    
    let volatility: 'low' | 'moderate' | 'high' | 'very-high';
    if (avgVolatility < 0.02) volatility = 'low';
    else if (avgVolatility < 0.05) volatility = 'moderate';
    else if (avgVolatility < 0.1) volatility = 'high';
    else volatility = 'very-high';

    // Generate seasonal patterns
    const seasonalPattern = Array.from({ length: 12 }, (_, month) => ({
      month: month + 1,
      averagePrice: Math.round(basePrice * (0.9 + Math.random() * 0.2)),
      volatility: Math.round(Math.random() * 15 + 5)
    }));

    // Generate forecasts
    const forecast = [
      {
        period: 'Next Week',
        predictedPrice: Math.round(lastPrice * (1 + (Math.random() - 0.5) * 0.1)),
        confidence: Math.round(Math.random() * 30 + 60),
        factors: ['Weather conditions', 'Market demand', 'Seasonal trends']
      },
      {
        period: 'Next Month',
        predictedPrice: Math.round(lastPrice * (1 + (Math.random() - 0.5) * 0.2)),
        confidence: Math.round(Math.random() * 25 + 50),
        factors: ['Government policies', 'Export demand', 'Harvest season']
      }
    ];

    // Generate influencing factors
    const influencingFactors: MarketFactor[] = this.generateMarketFactors(commodity);

    return {
      commodityName: commodity,
      variety,
      timeframe,
      trendDirection,
      volatility,
      confidence: Math.round(Math.random() * 30 + 60),
      historicalPrices,
      seasonalPattern,
      forecast,
      influencingFactors
    };
  }

  private getSimulatedSellingRecommendations(
    commodity: string,
    variety: string,
    quantity: number,
    location: { latitude: number; longitude: number }
  ): SellingRecommendation {
    const currentPrice = this.getBasePriceForCommodity(commodity);
    const marketConditions = Math.random();
    
    let recommendation: 'sell-now' | 'wait-and-sell' | 'hold' | 'store' | 'process';
    let reasoning: string;
    
    if (marketConditions > 0.7) {
      recommendation = 'sell-now';
      reasoning = 'Current market prices are favorable with high demand and stable supply.';
    } else if (marketConditions > 0.5) {
      recommendation = 'wait-and-sell';
      reasoning = 'Prices are expected to improve in the coming weeks due to seasonal factors.';
    } else if (marketConditions > 0.3) {
      recommendation = 'hold';
      reasoning = 'Market conditions are uncertain. Consider waiting for better price signals.';
    } else if (marketConditions > 0.1) {
      recommendation = 'store';
      reasoning = 'Current prices are below average. Storage until next season could be profitable.';
    } else {
      recommendation = 'process';
      reasoning = 'Raw commodity prices are low. Consider value addition through processing.';
    }

    const bestTime = new Date();
    bestTime.setDate(bestTime.getDate() + Math.round(Math.random() * 30 + 7));
    
    const marketSuggestions = this.generateMarketSuggestions(commodity, location);
    const alternatives = this.generateAlternatives(commodity, currentPrice);

    return {
      commodityName: commodity,
      variety,
      recommendation,
      confidence: Math.round(Math.random() * 30 + 60),
      reasoning,
      optimalTiming: {
        bestTime,
        priceExpectation: Math.round(currentPrice * (1 + Math.random() * 0.2)),
        rationale: 'Based on seasonal price patterns and market demand analysis'
      },
      marketSuggestions,
      riskFactors: [
        'Weather uncertainties',
        'Government policy changes',
        'Global market fluctuations',
        'Storage and transportation costs'
      ],
      alternatives,
      expectedReturn: {
        immediate: Math.round(currentPrice * quantity),
        delayed: Math.round(currentPrice * quantity * (1 + Math.random() * 0.15)),
        best: Math.round(currentPrice * quantity * (1 + Math.random() * 0.3))
      }
    };
  }

  private getSimulatedNearbyMarkets(
    latitude: number,
    longitude: number,
    radius: number,
    commodityFilter?: string
  ): MarketLocation[] {
    const markets: MarketLocation[] = [];
    const marketCount = Math.min(10, Math.round(Math.random() * 8 + 3));

    for (let i = 0; i < marketCount; i++) {
      const distance = Math.random() * radius;
      const angle = Math.random() * 2 * Math.PI;
      const marketLat = latitude + (distance / 111) * Math.cos(angle);
      const marketLng = longitude + (distance / (111 * Math.cos(latitude * Math.PI / 180))) * Math.sin(angle);

      const state = this.getRandomState();
      const district = this.getRandomDistrict();
      const marketTypes = ['mandi', 'wholesale', 'retail', 'cooperative', 'processing'] as const;
      const type = marketTypes[Math.floor(Math.random() * marketTypes.length)];

      const commoditiesTraded = commodityFilter 
        ? [commodityFilter]
        : this.majorCommodities.slice(0, Math.round(Math.random() * 8 + 3));

      const averagePrices: { [commodity: string]: number } = {};
      commoditiesTraded.forEach(commodity => {
        averagePrices[commodity] = this.getBasePriceForCommodity(commodity);
      });

      markets.push({
        id: `market_${i + 1}_${Date.now()}`,
        name: `${district} ${type === 'mandi' ? 'Mandi' : type === 'wholesale' ? 'Wholesale Market' : 'Agricultural Market'}`,
        type,
        location: {
          latitude: Math.round(marketLat * 1000000) / 1000000,
          longitude: Math.round(marketLng * 1000000) / 1000000,
          address: `Market Road, ${district}`,
          district,
          state,
          pincode: `${Math.floor(Math.random() * 900000 + 100000)}`
        },
        contact: {
          phone: `+91-${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
          timings: '6:00 AM - 8:00 PM',
          workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        },
        facilities: {
          storage: Math.random() > 0.4,
          grading: Math.random() > 0.6,
          packaging: Math.random() > 0.5,
          transportation: Math.random() > 0.3,
          weighbridge: Math.random() > 0.2,
          coldStorage: Math.random() > 0.8
        },
        commoditiesTraded,
        averagePrices,
        recentTransactions: Math.round(Math.random() * 200 + 50),
        reputation: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0-5.0 rating
        paymentTerms: ['Cash', 'Cheque', Math.random() > 0.5 ? 'Digital Payment' : 'Bank Transfer'],
        minimumQuantity: commoditiesTraded.reduce((acc, commodity) => {
          acc[commodity] = Math.round(Math.random() * 50 + 10);
          return acc;
        }, {} as { [commodity: string]: number }),
        commission: Math.round(Math.random() * 5 + 2), // 2-7%
        distance: Math.round(distance * 10) / 10
      });
    }

    return markets.sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }

  private getSimulatedMarketIntelligence(
    location?: { state: string; district: string }
  ): MarketIntelligence {
    const totalMarkets = Math.round(Math.random() * 500 + 100);
    const activeCommodities = Math.round(Math.random() * 50 + 20);
    const averagePriceChange = Math.round((Math.random() - 0.5) * 10 * 100) / 100;
    
    const sentiments = ['bearish', 'neutral', 'bullish', 'mixed'] as const;
    const marketSentiment = sentiments[Math.floor(Math.random() * sentiments.length)];

    const topGainers = this.majorCommodities
      .slice(0, 5)
      .map(commodity => ({
        commodity,
        change: Math.round(Math.random() * 15 + 5)
      }))
      .sort((a, b) => b.change - a.change);

    const topLosers = this.majorCommodities
      .slice(5, 10)
      .map(commodity => ({
        commodity,
        change: Math.round((Math.random() * -15 - 5) * 100) / 100
      }))
      .sort((a, b) => a.change - b.change);

    const priceAlerts = this.generatePriceAlerts();
    const seasonalInsights = this.generateSeasonalInsights();
    const tradingOpportunities = this.generateTradingOpportunities();

    return {
      marketSummary: {
        totalMarkets,
        activeCommodities,
        averagePriceChange,
        marketSentiment,
        topGainers,
        topLosers
      },
      priceAlerts,
      seasonalInsights,
      tradingOpportunities
    };
  }

  // Helper methods
  private getBasePriceForCommodity(commodity: string): number {
    const basePrices: { [key: string]: number } = {
      'Rice': 2800, 'Wheat': 2200, 'Maize': 1800, 'Sugarcane': 300,
      'Cotton': 6000, 'Soybean': 4500, 'Groundnut': 5200, 'Mustard': 5800,
      'Sunflower': 6200, 'Turmeric': 8500, 'Onion': 2500, 'Potato': 1200,
      'Tomato': 2800, 'Chili': 12000
    };
    return basePrices[commodity] || 3000;
  }

  private getVarietyForCommodity(commodity: string): string {
    const varieties: { [key: string]: string[] } = {
      'Rice': ['Basmati', 'IR-64', 'Sona Masuri', 'PR-106'],
      'Wheat': ['PBW-343', 'HD-2967', 'WH-147', 'DBW-88'],
      'Cotton': ['Bt Cotton', 'Desi Cotton', 'American Cotton'],
      'Onion': ['Nasik Red', 'Bellary Red', 'Poona Red'],
      'Potato': ['Kufri Jyoti', 'Kufri Pukhraj', 'Kufri Badshah']
    };
    const commodityVarieties = varieties[commodity] || ['Standard', 'Premium', 'Local'];
    return commodityVarieties[Math.floor(Math.random() * commodityVarieties.length)];
  }

  private getUnitForCommodity(commodity: string): 'quintal' | 'kg' | 'ton' | 'bag' {
    const units: { [key: string]: 'quintal' | 'kg' | 'ton' | 'bag' } = {
      'Rice': 'quintal', 'Wheat': 'quintal', 'Maize': 'quintal',
      'Sugarcane': 'ton', 'Cotton': 'quintal', 'Onion': 'quintal',
      'Potato': 'quintal', 'Tomato': 'quintal'
    };
    return units[commodity] || 'quintal';
  }

  private getRandomState(): string {
    return this.indianStates[Math.floor(Math.random() * this.indianStates.length)];
  }

  private getRandomDistrict(): string {
    const districts = [
      'Kanpur', 'Lucknow', 'Agra', 'Varanasi', 'Meerut', 'Pune', 'Nashik',
      'Aurangabad', 'Patna', 'Gaya', 'Muzaffarpur', 'Kolkata', 'Howrah',
      'Bhopal', 'Indore', 'Jabalpur', 'Chennai', 'Coimbatore', 'Madurai',
      'Jaipur', 'Jodhpur', 'Kota', 'Bangalore', 'Mysore', 'Hubli',
      'Ahmedabad', 'Surat', 'Rajkot', 'Hyderabad', 'Warangal', 'Nizamabad'
    ];
    return districts[Math.floor(Math.random() * districts.length)];
  }

  private getRandomQuality(): 'poor' | 'average' | 'good' | 'excellent' {
    const qualities = ['poor', 'average', 'good', 'excellent'] as const;
    const weights = [0.1, 0.3, 0.4, 0.2]; // Distribution weights
    const random = Math.random();
    let sum = 0;
    for (let i = 0; i < weights.length; i++) {
      sum += weights[i];
      if (random <= sum) return qualities[i];
    }
    return 'good';
  }

  private getRandomDemand(): 'very-low' | 'low' | 'moderate' | 'high' | 'very-high' {
    const demands = ['very-low', 'low', 'moderate', 'high', 'very-high'] as const;
    return demands[Math.floor(Math.random() * demands.length)];
  }

  private getRandomSupply(): 'shortage' | 'low' | 'adequate' | 'surplus' | 'excess' {
    const supplies = ['shortage', 'low', 'adequate', 'surplus', 'excess'] as const;
    return supplies[Math.floor(Math.random() * supplies.length)];
  }

  private getSeasonalPriceFactor(commodity: string, date: Date): number {
    const month = date.getMonth();
    // Simplified seasonal factors (harvest months typically have lower prices)
    const seasonalFactors: { [key: string]: number[] } = {
      'Rice': [0.1, 0.2, 0.1, -0.1, -0.2, -0.1, 0.0, 0.1, 0.2, 0.3, 0.2, 0.1],
      'Wheat': [0.2, 0.1, -0.1, -0.2, -0.3, -0.2, 0.0, 0.1, 0.2, 0.3, 0.2, 0.1],
      'Onion': [-0.2, -0.1, 0.1, 0.2, 0.3, 0.2, 0.1, 0.0, -0.1, -0.2, -0.3, -0.2]
    };
    return seasonalFactors[commodity]?.[month] || 0;
  }

  private generateMarketFactors(commodity: string): MarketFactor[] {
    const factors: MarketFactor[] = [
      {
        factor: 'Monsoon Forecast',
        impact: Math.random() > 0.5 ? 'positive' : 'negative',
        strength: 'moderate',
        description: 'Current monsoon predictions affecting crop yields',
        timeframe: 'Next 3 months'
      },
      {
        factor: 'Export Demand',
        impact: 'positive',
        strength: 'strong',
        description: 'Increased international demand for agricultural commodities',
        timeframe: 'Next 6 months'
      },
      {
        factor: 'Government MSP',
        impact: 'positive',
        strength: 'very-strong',
        description: 'Minimum Support Price announcement',
        timeframe: 'Current season'
      },
      {
        factor: 'Storage Costs',
        impact: 'negative',
        strength: 'moderate',
        description: 'Rising storage and transportation costs',
        timeframe: 'Ongoing'
      }
    ];

    return factors.slice(0, Math.floor(Math.random() * 3 + 2));
  }

  private generateMarketSuggestions(
    commodity: string,
    location: { latitude: number; longitude: number }
  ): MarketSuggestion[] {
    const suggestions: MarketSuggestion[] = [];
    const count = Math.floor(Math.random() * 3 + 2);

    for (let i = 0; i < count; i++) {
      const distance = Math.random() * 100 + 10;
      const basePrice = this.getBasePriceForCommodity(commodity);
      const priceVariation = (Math.random() - 0.5) * 0.2;

      suggestions.push({
        marketName: `${this.getRandomDistrict()} Agricultural Market`,
        location: `${this.getRandomDistrict()}, ${this.getRandomState()}`,
        distance: Math.round(distance),
        currentPrice: Math.round(basePrice * (1 + priceVariation)),
        advantages: [
          'Higher than average prices',
          'Quick payment processing',
          'Good storage facilities',
          'Regular buyers available'
        ].slice(0, Math.floor(Math.random() * 2 + 2)),
        requirements: [
          'Minimum 10 quintals',
          'Quality certificate required',
          'Advance booking needed'
        ].slice(0, Math.floor(Math.random() * 2 + 1)),
        contact: {
          phone: `+91-${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
          address: `Market Complex, ${this.getRandomDistrict()}`,
          timings: '6:00 AM - 6:00 PM'
        }
      });
    }

    return suggestions;
  }

  private generateAlternatives(commodity: string, currentPrice: number): Alternative[] {
    return [
      {
        option: 'direct-sale',
        description: 'Sell directly to local processors or retailers',
        expectedPrice: Math.round(currentPrice * 1.1),
        requirements: ['Quality grading', 'Transportation arrangement'],
        timeframe: '1-2 weeks',
        riskLevel: 'medium'
      },
      {
        option: 'cooperative',
        description: 'Sell through farmer producer organization',
        expectedPrice: Math.round(currentPrice * 1.05),
        requirements: ['FPO membership', 'Collective bargaining'],
        timeframe: '2-3 weeks',
        riskLevel: 'low'
      },
      {
        option: 'online-platform',
        description: 'List on digital agriculture marketplace',
        expectedPrice: Math.round(currentPrice * 1.15),
        requirements: ['Digital literacy', 'Quality standards'],
        timeframe: '1-4 weeks',
        riskLevel: 'medium'
      }
    ];
  }

  private generatePriceAlerts(): PriceAlert[] {
    const alerts: PriceAlert[] = [];
    const commodities = this.majorCommodities.slice(0, 5);

    commodities.forEach((commodity, index) => {
      const currentPrice = this.getBasePriceForCommodity(commodity);
      const change = (Math.random() - 0.5) * 500;
      const changePercentage = (change / currentPrice) * 100;

      let alertType: 'price-rise' | 'price-drop' | 'target-reached' | 'volatility' | 'demand-spike';
      let severity: 'info' | 'warning' | 'critical';

      if (Math.abs(changePercentage) > 10) {
        alertType = change > 0 ? 'price-rise' : 'price-drop';
        severity = 'critical';
      } else if (Math.abs(changePercentage) > 5) {
        alertType = 'volatility';
        severity = 'warning';
      } else {
        alertType = 'demand-spike';
        severity = 'info';
      }

      alerts.push({
        id: `alert_${index}_${Date.now()}`,
        commodityName: commodity,
        variety: this.getVarietyForCommodity(commodity),
        alertType,
        currentPrice: Math.round(currentPrice + change),
        change: Math.round(change),
        changePercentage: Math.round(changePercentage * 100) / 100,
        severity,
        message: `${commodity} prices ${change > 0 ? 'increased' : 'decreased'} by ${Math.abs(Math.round(changePercentage))}%`,
        actionRequired: change > 0 ? 'Consider selling if holding inventory' : 'Monitor for buying opportunities',
        timestamp: new Date()
      });
    });

    return alerts;
  }

  private generateSeasonalInsights(): SeasonalInsight[] {
    const insights: SeasonalInsight[] = [
      {
        season: 'monsoon',
        commodity: 'Rice',
        insight: 'Rice prices typically stabilize during monsoon season due to assured water supply',
        expectedPriceMovement: 'stable',
        confidence: 85,
        historicalData: 'Historical analysis shows 3-5% price stability during good monsoon years',
        recommendation: 'Good time for advance contracts with buyers'
      },
      {
        season: 'winter',
        commodity: 'Wheat',
        insight: 'Wheat demand increases in winter months leading to price appreciation',
        expectedPriceMovement: 'increase',
        confidence: 78,
        historicalData: 'Average 8-12% price increase observed in winter months',
        recommendation: 'Consider storage if harvest is completed'
      },
      {
        season: 'summer',
        commodity: 'Onion',
        insight: 'Summer onion supply decreases leading to price spike',
        expectedPriceMovement: 'increase',
        confidence: 92,
        historicalData: 'Consistent 20-30% price increase during summer storage season',
        recommendation: 'Excellent opportunity for stored onion sales'
      }
    ];

    return insights;
  }

  private generateTradingOpportunities(): TradingOpportunity[] {
    return [
      {
        id: `opp_1_${Date.now()}`,
        type: 'price-arbitrage',
        commodity: 'Rice',
        description: 'Price difference between local and distant markets',
        potentialProfit: Math.round(Math.random() * 500 + 200),
        riskLevel: 'medium',
        timeframe: '2-3 weeks',
        requirements: ['Transportation arrangement', 'Quality certification'],
        action: 'Transport surplus rice to higher-price markets'
      },
      {
        id: `opp_2_${Date.now()}`,
        type: 'seasonal-trade',
        commodity: 'Wheat',
        description: 'Seasonal price increase expected in coming months',
        potentialProfit: Math.round(Math.random() * 800 + 300),
        riskLevel: 'low',
        timeframe: '1-2 months',
        requirements: ['Storage facilities', 'Quality maintenance'],
        action: 'Store current harvest for later sale'
      },
      {
        id: `opp_3_${Date.now()}`,
        type: 'demand-spike',
        commodity: 'Turmeric',
        description: 'Increased export demand driving prices up',
        potentialProfit: Math.round(Math.random() * 1200 + 500),
        riskLevel: 'high',
        timeframe: '3-4 weeks',
        requirements: ['Export quality standards', 'Certification'],
        action: 'Prepare turmeric for export markets'
      }
    ];
  }

  // Utility methods for UI components
  public formatPrice(price: number, unit: string): string {
    return `₹${price.toLocaleString('en-IN')}/${unit}`;
  }

  public getPriceChangeColor(change: number): string {
    if (change > 0) return '#10B981'; // Green
    if (change < 0) return '#EF4444'; // Red
    return '#6B7280'; // Gray
  }

  public getPriceChangeIcon(change: number): string {
    if (change > 0) return '↗️';
    if (change < 0) return '↘️';
    return '➡️';
  }

  public getRecommendationColor(recommendation: string): string {
    switch (recommendation) {
      case 'sell-now': return '#10B981'; // Green
      case 'wait-and-sell': return '#F59E0B'; // Yellow
      case 'hold': return '#6B7280'; // Gray
      case 'store': return '#3B82F6'; // Blue
      case 'process': return '#8B5CF6'; // Purple
      default: return '#6B7280';
    }
  }

  public getDemandSupplyIndicator(demand: string, supply: string): {
    indicator: 'favorable' | 'neutral' | 'unfavorable';
    description: string;
  } {
    const demandScore = ['very-low', 'low', 'moderate', 'high', 'very-high'].indexOf(demand);
    const supplyScore = ['excess', 'surplus', 'adequate', 'low', 'shortage'].indexOf(supply);
    const combined = demandScore + supplyScore;

    if (combined >= 7) {
      return {
        indicator: 'favorable',
        description: 'High demand with limited supply - excellent selling opportunity'
      };
    } else if (combined >= 4) {
      return {
        indicator: 'neutral',
        description: 'Balanced market conditions - moderate pricing expected'
      };
    } else {
      return {
        indicator: 'unfavorable',
        description: 'Low demand with high supply - consider alternative strategies'
      };
    }
  }
}

export const marketIntelligenceService = new MarketIntelligenceService();