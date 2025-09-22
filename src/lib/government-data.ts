// Government Data Integration Service for CropYieldAI
// Simulates AGMARKNET price data, crop statistics, and government agricultural data

export interface AGMARKNETPrice {
  commodity: string;
  variety: string;
  market: string;
  state: string;
  district: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  priceUnit: string;
  date: Date;
  trend: 'increasing' | 'decreasing' | 'stable';
  changePercent: number;
}

export interface CropStatistics {
  crop: string;
  state: string;
  district: string;
  season: 'kharif' | 'rabi' | 'zaid';
  year: number;
  areaHectares: number;
  productionTonnes: number;
  yieldKgPerHectare: number;
  averageYield: number;
  productivityIndex: number;
  comparisonWithLastYear: {
    areaChange: number;
    productionChange: number;
    yieldChange: number;
  };
}

export interface SoilHealthCard {
  farmerId: string;
  farmerName: string;
  village: string;
  district: string;
  state: string;
  surveyNumber: string;
  sampleDate: Date;
  soilType: string;
  ph: number;
  organicCarbon: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  sulphur: number;
  zinc: number;
  boron: number;
  iron: number;
  manganese: number;
  copper: number;
  salinity: number;
  recommendations: SoilRecommendation[];
  healthScore: number;
  deficiencies: string[];
}

export interface SoilRecommendation {
  nutrient: string;
  currentLevel: string;
  requiredLevel: string;
  fertilizer: string;
  quantity: number;
  unit: string;
  applicationMethod: string;
  timing: string;
}

export interface GovernmentScheme {
  id: string;
  name: string;
  description: string;
  ministry: string;
  launchDate: Date;
  eligibility: string[];
  benefits: string[];
  applicationProcess: string;
  documents: string[];
  deadline?: Date;
  budget: number;
  beneficiaries: number;
  website: string;
  isActive: boolean;
  targetCrops?: string[];
  targetStates?: string[];
}

export interface RegionalYieldData {
  crop: string;
  state: string;
  district: string;
  season: string;
  year: number;
  averageYield: number;
  bestYield: number;
  worstYield: number;
  yieldVariation: number;
  factorsAffectingYield: string[];
  recommendedPractices: string[];
  successStories: string[];
}

class GovernmentDataService {
  private baseUrl: string = 'https://api.data.gov.in';
  private useSimulatedData: boolean = true; // Always true for demo

  constructor() {
    console.log('Government Data Service: Using simulated realistic data');
  }

  // Get AGMARKNET price data
  public async getAGMARKNETPrices(
    commodity?: string,
    state?: string,
    district?: string
  ): Promise<AGMARKNETPrice[]> {
    if (this.useSimulatedData) {
      return this.getSimulatedPriceData(commodity, state, district);
    }
    
    // Real API integration would go here
    try {
      const response = await fetch(`${this.baseUrl}/agmarknet/prices`);
      return await response.json();
    } catch (error) {
      console.error('AGMARKNET API Error:', error);
      return this.getSimulatedPriceData(commodity, state, district);
    }
  }

  // Get crop statistics from government sources
  public async getCropStatistics(
    crop?: string,
    state?: string,
    year?: number
  ): Promise<CropStatistics[]> {
    if (this.useSimulatedData) {
      return this.getSimulatedCropStatistics(crop, state, year);
    }

    // Real API integration would go here
    try {
      const response = await fetch(`${this.baseUrl}/agriculture/statistics`);
      return await response.json();
    } catch (error) {
      console.error('Crop Statistics API Error:', error);
      return this.getSimulatedCropStatistics(crop, state, year);
    }
  }

  // Get soil health card data
  public async getSoilHealthData(
    district?: string,
    state?: string
  ): Promise<SoilHealthCard[]> {
    if (this.useSimulatedData) {
      return this.getSimulatedSoilHealthData(district, state);
    }

    // Real API integration would go here
    try {
      const response = await fetch(`${this.baseUrl}/soil-health/cards`);
      return await response.json();
    } catch (error) {
      console.error('Soil Health API Error:', error);
      return this.getSimulatedSoilHealthData(district, state);
    }
  }

  // Get government schemes for farmers
  public async getGovernmentSchemes(
    crop?: string,
    state?: string
  ): Promise<GovernmentScheme[]> {
    if (this.useSimulatedData) {
      return this.getSimulatedGovernmentSchemes(crop, state);
    }

    // Real API integration would go here
    try {
      const response = await fetch(`${this.baseUrl}/schemes/agriculture`);
      return await response.json();
    } catch (error) {
      console.error('Government Schemes API Error:', error);
      return this.getSimulatedGovernmentSchemes(crop, state);
    }
  }

  // Get regional yield averages
  public async getRegionalYieldData(
    crop: string,
    state?: string,
    district?: string
  ): Promise<RegionalYieldData[]> {
    if (this.useSimulatedData) {
      return this.getSimulatedRegionalYieldData(crop, state, district);
    }

    // Real API integration would go here
    try {
      const response = await fetch(`${this.baseUrl}/agriculture/yields`);
      return await response.json();
    } catch (error) {
      console.error('Regional Yield API Error:', error);
      return this.getSimulatedRegionalYieldData(crop, state, district);
    }
  }

  // Simulated data generation methods
  private getSimulatedPriceData(
    commodity?: string,
    state?: string,
    district?: string
  ): AGMARKNETPrice[] {
    const commodities = [
      'Rice', 'Wheat', 'Maize', 'Sugarcane', 'Cotton', 'Soybean',
      'Groundnut', 'Sunflower', 'Mustard', 'Barley', 'Gram', 'Arhar',
      'Onion', 'Potato', 'Tomato', 'Chilli', 'Turmeric', 'Coriander'
    ];

    const markets = [
      { market: 'Bangalore', state: 'Karnataka', district: 'Bangalore Urban' },
      { market: 'Pune', state: 'Maharashtra', district: 'Pune' },
      { market: 'Delhi', state: 'Delhi', district: 'New Delhi' },
      { market: 'Chennai', state: 'Tamil Nadu', district: 'Chennai' },
      { market: 'Hyderabad', state: 'Telangana', district: 'Hyderabad' },
      { market: 'Indore', state: 'Madhya Pradesh', district: 'Indore' },
      { market: 'Jaipur', state: 'Rajasthan', district: 'Jaipur' },
      { market: 'Kolkata', state: 'West Bengal', district: 'Kolkata' }
    ];

    const prices: AGMARKNETPrice[] = [];
    const targetCommodities = commodity ? [commodity] : commodities.slice(0, 10);

    targetCommodities.forEach(comm => {
      markets.forEach(market => {
        if (state && market.state !== state) return;
        if (district && market.district !== district) return;

        const basePrice = this.getBasePriceForCommodity(comm);
        const variation = (Math.random() - 0.5) * 0.3; // ±15% variation
        const modalPrice = Math.round(basePrice * (1 + variation));
        const minPrice = Math.round(modalPrice * 0.85);
        const maxPrice = Math.round(modalPrice * 1.15);

        const trend = Math.random() < 0.4 ? 'increasing' : 
                     Math.random() < 0.7 ? 'decreasing' : 'stable';
        
        const changePercent = trend === 'stable' ? 
          (Math.random() - 0.5) * 2 : 
          trend === 'increasing' ? 
            Math.random() * 12 + 2 : 
            -(Math.random() * 10 + 1);

        prices.push({
          commodity: comm,
          variety: this.getVarietyForCommodity(comm),
          market: market.market,
          state: market.state,
          district: market.district,
          minPrice,
          maxPrice,
          modalPrice,
          priceUnit: this.getPriceUnit(comm),
          date: new Date(),
          trend,
          changePercent: Math.round(changePercent * 100) / 100
        });
      });
    });

    return prices;
  }

  private getSimulatedCropStatistics(
    crop?: string,
    state?: string,
    year?: number
  ): CropStatistics[] {
    const crops = ['Rice', 'Wheat', 'Maize', 'Sugarcane', 'Cotton', 'Soybean'];
    const states = ['Karnataka', 'Maharashtra', 'Punjab', 'Uttar Pradesh', 'Tamil Nadu'];
    const districts = ['Bangalore Rural', 'Mysore', 'Mandya', 'Hassan', 'Shimoga'];
    
    const statistics: CropStatistics[] = [];
    const targetCrops = crop ? [crop] : crops;
    const targetYear = year || new Date().getFullYear() - 1;

    targetCrops.forEach(cropName => {
      states.forEach(stateName => {
        if (state && stateName !== state) return;

        districts.forEach(district => {
          const baseArea = 50000 + Math.random() * 100000; // hectares
          const baseYield = this.getBaseYieldForCrop(cropName);
          const yieldVariation = (Math.random() - 0.5) * 0.4; // ±20%
          const actualYield = Math.round(baseYield * (1 + yieldVariation));
          const production = Math.round(baseArea * actualYield / 1000); // tonnes

          const season = this.getSeasonForCrop(cropName);

          statistics.push({
            crop: cropName,
            state: stateName,
            district,
            season,
            year: targetYear,
            areaHectares: Math.round(baseArea),
            productionTonnes: production,
            yieldKgPerHectare: actualYield,
            averageYield: baseYield,
            productivityIndex: Math.round((actualYield / baseYield) * 100),
            comparisonWithLastYear: {
              areaChange: Math.round((Math.random() - 0.5) * 20 * 100) / 100,
              productionChange: Math.round((Math.random() - 0.5) * 25 * 100) / 100,
              yieldChange: Math.round((Math.random() - 0.5) * 15 * 100) / 100
            }
          });
        });
      });
    });

    return statistics;
  }

  private getSimulatedSoilHealthData(
    district?: string,
    state?: string
  ): SoilHealthCard[] {
    const soilCards: SoilHealthCard[] = [];
    const sampleSize = 20;

    for (let i = 1; i <= sampleSize; i++) {
      const ph = 6.0 + Math.random() * 3.0; // pH 6.0-9.0
      const organicCarbon = 0.3 + Math.random() * 1.2; // 0.3-1.5%
      const nitrogen = 200 + Math.random() * 300; // kg/ha
      const phosphorus = 15 + Math.random() * 40; // kg/ha
      const potassium = 150 + Math.random() * 200; // kg/ha

      const healthScore = this.calculateSoilHealthScore(ph, organicCarbon, nitrogen, phosphorus, potassium);
      const deficiencies = this.identifySoilDeficiencies(ph, organicCarbon, nitrogen, phosphorus, potassium);
      const recommendations = this.generateSoilRecommendations(deficiencies);

      soilCards.push({
        farmerId: `FID${1000 + i}`,
        farmerName: `Farmer ${i}`,
        village: `Village ${Math.ceil(i / 4)}`,
        district: district || 'Bangalore Rural',
        state: state || 'Karnataka',
        surveyNumber: `${Math.floor(Math.random() * 999) + 1}`,
        sampleDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
        soilType: this.getRandomSoilType(),
        ph: Math.round(ph * 10) / 10,
        organicCarbon: Math.round(organicCarbon * 100) / 100,
        nitrogen: Math.round(nitrogen),
        phosphorus: Math.round(phosphorus),
        potassium: Math.round(potassium),
        sulphur: Math.round(10 + Math.random() * 20),
        zinc: Math.round(0.5 + Math.random() * 2),
        boron: Math.round(0.3 + Math.random() * 1),
        iron: Math.round(3 + Math.random() * 7),
        manganese: Math.round(2 + Math.random() * 8),
        copper: Math.round(0.8 + Math.random() * 2),
        salinity: Math.round((Math.random() * 0.8) * 100) / 100,
        recommendations,
        healthScore,
        deficiencies
      });
    }

    return soilCards;
  }

  private getSimulatedGovernmentSchemes(
    crop?: string,
    state?: string
  ): GovernmentScheme[] {
    const schemes: GovernmentScheme[] = [
      {
        id: 'PM-KISAN',
        name: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
        description: 'Direct income support scheme for small and marginal farmers',
        ministry: 'Ministry of Agriculture and Farmers Welfare',
        launchDate: new Date('2019-02-24'),
        eligibility: [
          'Small and marginal farmers with up to 2 hectares',
          'Valid Aadhaar card required',
          'Land ownership documents required'
        ],
        benefits: [
          'Rs. 6,000 per year in three installments',
          'Direct bank transfer',
          'No processing fee'
        ],
        applicationProcess: 'Apply online at pmkisan.gov.in or through Common Service Centers',
        documents: ['Aadhaar Card', 'Bank Account Details', 'Land Records'],
        budget: 75000000000, // 75,000 crores
        beneficiaries: 110000000,
        website: 'https://pmkisan.gov.in',
        isActive: true
      },
      {
        id: 'PMFBY',
        name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
        description: 'Crop insurance scheme to protect farmers against crop losses',
        ministry: 'Ministry of Agriculture and Farmers Welfare',
        launchDate: new Date('2016-01-13'),
        eligibility: [
          'All farmers including sharecroppers and tenant farmers',
          'Notified crops in notified areas',
          'Voluntary for non-loanee farmers'
        ],
        benefits: [
          'Maximum premium: 2% for Kharif, 1.5% for Rabi crops',
          'Coverage against natural calamities',
          'Technology-based loss assessment'
        ],
        applicationProcess: 'Apply through banks, insurance companies, or online portal',
        documents: ['Aadhaar Card', 'Bank Account', 'Land Records', 'Sowing Certificate'],
        budget: 15695000000, // 15,695 crores
        beneficiaries: 36000000,
        website: 'https://pmfby.gov.in',
        isActive: true,
        targetCrops: ['Rice', 'Wheat', 'Cotton', 'Sugarcane']
      },
      {
        id: 'MSP-OPERATIONS',
        name: 'Minimum Support Price (MSP) Operations',
        description: 'Procurement of crops at minimum support prices',
        ministry: 'Ministry of Agriculture and Farmers Welfare',
        launchDate: new Date('1966-10-01'),
        eligibility: [
          'All farmers',
          'Quality specifications must be met',
          'Registered with procurement agencies'
        ],
        benefits: [
          'Guaranteed minimum price',
          'Quality bonus for superior quality',
          'Direct payment to farmers'
        ],
        applicationProcess: 'Register with local procurement centers during season',
        documents: ['Identity Proof', 'Land Records', 'Bank Account Details'],
        budget: 200000000000, // 2,00,000 crores
        beneficiaries: 50000000,
        website: 'https://agricoop.nic.in',
        isActive: true,
        targetCrops: ['Rice', 'Wheat', 'Cotton', 'Sugarcane', 'Jowar', 'Bajra']
      },
      {
        id: 'SOIL-HEALTH-CARD',
        name: 'Soil Health Card Scheme',
        description: 'Provides soil health cards to farmers with recommendations',
        ministry: 'Ministry of Agriculture and Farmers Welfare',
        launchDate: new Date('2015-02-19'),
        eligibility: [
          'All farmers',
          'One card per 2.5 hectares',
          'Free for all farmers'
        ],
        benefits: [
          'Free soil testing',
          'Crop-specific recommendations',
          'Digital soil health cards'
        ],
        applicationProcess: 'Apply through agriculture extension officers or online',
        documents: ['Identity Proof', 'Land Records'],
        budget: 5681000000, // 5,681 crores
        beneficiaries: 220000000,
        website: 'https://soilhealth.dac.gov.in',
        isActive: true
      },
      {
        id: 'ORGANIC-FARMING',
        name: 'Paramparagat Krishi Vikas Yojana (PKVY)',
        description: 'Promotion of organic farming practices',
        ministry: 'Ministry of Agriculture and Farmers Welfare',
        launchDate: new Date('2015-04-01'),
        eligibility: [
          'Groups of 50 farmers minimum',
          'Cluster approach required',
          'Organic farming commitment for 3 years'
        ],
        benefits: [
          'Rs. 50,000 per hectare over 3 years',
          'Organic certification support',
          'Training and capacity building'
        ],
        applicationProcess: 'Apply through state agriculture departments',
        documents: ['Group Formation Certificate', 'Land Records', 'Bank Details'],
        budget: 14262500000, // 14,262.5 crores
        beneficiaries: 1000000,
        website: 'https://pgsindia-ncof.gov.in',
        isActive: true
      }
    ];

    // Filter by crop and state if specified
    return schemes.filter(scheme => {
      if (crop && scheme.targetCrops && !scheme.targetCrops.includes(crop)) {
        return false;
      }
      if (state && scheme.targetStates && !scheme.targetStates.includes(state)) {
        return false;
      }
      return scheme.isActive;
    });
  }

  private getSimulatedRegionalYieldData(
    crop: string,
    state?: string,
    district?: string
  ): RegionalYieldData[] {
    const regions = [
      { state: 'Karnataka', district: 'Bangalore Rural' },
      { state: 'Karnataka', district: 'Mysore' },
      { state: 'Maharashtra', district: 'Pune' },
      { state: 'Punjab', district: 'Ludhiana' },
      { state: 'Tamil Nadu', district: 'Thanjavur' }
    ];

    const yieldData: RegionalYieldData[] = [];
    const baseYield = this.getBaseYieldForCrop(crop);

    regions.forEach(region => {
      if (state && region.state !== state) return;
      if (district && region.district !== district) return;

      const regionalFactor = Math.random() * 0.4 + 0.8; // 0.8 to 1.2 multiplier
      const avgYield = Math.round(baseYield * regionalFactor);
      const bestYield = Math.round(avgYield * 1.3);
      const worstYield = Math.round(avgYield * 0.7);

      yieldData.push({
        crop,
        state: region.state,
        district: region.district,
        season: this.getSeasonForCrop(crop),
        year: new Date().getFullYear() - 1,
        averageYield: avgYield,
        bestYield,
        worstYield,
        yieldVariation: Math.round(((bestYield - worstYield) / avgYield) * 100),
        factorsAffectingYield: this.getYieldFactors(crop),
        recommendedPractices: this.getRecommendedPractices(crop),
        successStories: this.getSuccessStories(crop, region.district)
      });
    });

    return yieldData;
  }

  // Helper methods
  private getBasePriceForCommodity(commodity: string): number {
    const basePrices: { [key: string]: number } = {
      'Rice': 2040, 'Wheat': 2275, 'Maize': 1962, 'Sugarcane': 315,
      'Cotton': 6080, 'Soybean': 4300, 'Groundnut': 5850, 'Sunflower': 6400,
      'Mustard': 5450, 'Barley': 1735, 'Gram': 5335, 'Arhar': 6600,
      'Onion': 35, 'Potato': 25, 'Tomato': 45, 'Chilli': 350,
      'Turmeric': 950, 'Coriander': 700
    };
    return basePrices[commodity] || 1000;
  }

  private getVarietyForCommodity(commodity: string): string {
    const varieties: { [key: string]: string[] } = {
      'Rice': ['Basmati', 'Common', 'Parboiled', 'Brown'],
      'Wheat': ['Durum', 'Sharbati', 'Lokwan', 'Common'],
      'Cotton': ['Shankar-6', 'DCH-32', 'Bunny Bt', 'Jaadoo'],
      'Onion': ['Bangalore Rose', 'Poona Red', 'Nasik Red', 'Bellary Red']
    };
    const commodityVarieties = varieties[commodity] || ['Common'];
    return commodityVarieties[Math.floor(Math.random() * commodityVarieties.length)];
  }

  private getPriceUnit(commodity: string): string {
    const units: { [key: string]: string } = {
      'Rice': 'Rs/Quintal', 'Wheat': 'Rs/Quintal', 'Maize': 'Rs/Quintal',
      'Sugarcane': 'Rs/Quintal', 'Cotton': 'Rs/Quintal', 'Onion': 'Rs/Quintal',
      'Potato': 'Rs/Quintal', 'Tomato': 'Rs/Quintal'
    };
    return units[commodity] || 'Rs/Quintal';
  }

  private getBaseYieldForCrop(crop: string): number {
    const yields: { [key: string]: number } = {
      'Rice': 2500, 'Wheat': 3200, 'Maize': 4200, 'Sugarcane': 70000,
      'Cotton': 500, 'Soybean': 1300, 'Groundnut': 1800, 'Sunflower': 1200
    };
    return yields[crop] || 2000;
  }

  private getSeasonForCrop(crop: string): 'kharif' | 'rabi' | 'zaid' {
    const seasons: { [key: string]: 'kharif' | 'rabi' | 'zaid' } = {
      'Rice': 'kharif', 'Cotton': 'kharif', 'Sugarcane': 'kharif',
      'Wheat': 'rabi', 'Mustard': 'rabi', 'Gram': 'rabi',
      'Maize': 'kharif', 'Sunflower': 'rabi'
    };
    return seasons[crop] || 'kharif';
  }

  private getRandomSoilType(): string {
    const types = ['Red Soil', 'Black Soil', 'Alluvial Soil', 'Laterite Soil', 'Sandy Soil'];
    return types[Math.floor(Math.random() * types.length)];
  }

  private calculateSoilHealthScore(
    ph: number, organicCarbon: number, nitrogen: number, phosphorus: number, potassium: number
  ): number {
    let score = 0;

    // pH score (optimal range: 6.5-7.5)
    if (ph >= 6.5 && ph <= 7.5) score += 20;
    else if (ph >= 6.0 && ph <= 8.0) score += 15;
    else score += 10;

    // Organic carbon score (optimal: >0.75%)
    if (organicCarbon > 0.75) score += 20;
    else if (organicCarbon > 0.5) score += 15;
    else score += 10;

    // Nitrogen score (optimal: >280 kg/ha)
    if (nitrogen > 280) score += 20;
    else if (nitrogen > 200) score += 15;
    else score += 10;

    // Phosphorus score (optimal: >25 kg/ha)
    if (phosphorus > 25) score += 20;
    else if (phosphorus > 15) score += 15;
    else score += 10;

    // Potassium score (optimal: >250 kg/ha)
    if (potassium > 250) score += 20;
    else if (potassium > 180) score += 15;
    else score += 10;

    return score;
  }

  private identifySoilDeficiencies(
    ph: number, organicCarbon: number, nitrogen: number, phosphorus: number, potassium: number
  ): string[] {
    const deficiencies: string[] = [];

    if (ph < 6.0) deficiencies.push('Acidic soil - pH too low');
    if (ph > 8.5) deficiencies.push('Alkaline soil - pH too high');
    if (organicCarbon < 0.5) deficiencies.push('Low organic matter');
    if (nitrogen < 200) deficiencies.push('Nitrogen deficiency');
    if (phosphorus < 15) deficiencies.push('Phosphorus deficiency');
    if (potassium < 180) deficiencies.push('Potassium deficiency');

    return deficiencies;
  }

  private generateSoilRecommendations(deficiencies: string[]): SoilRecommendation[] {
    const recommendations: SoilRecommendation[] = [];

    deficiencies.forEach(deficiency => {
      if (deficiency.includes('pH too low')) {
        recommendations.push({
          nutrient: 'pH',
          currentLevel: 'Low',
          requiredLevel: '6.5-7.5',
          fertilizer: 'Lime',
          quantity: 200,
          unit: 'kg/hectare',
          applicationMethod: 'Broadcasting and incorporation',
          timing: 'Before sowing'
        });
      }

      if (deficiency.includes('Nitrogen')) {
        recommendations.push({
          nutrient: 'Nitrogen',
          currentLevel: 'Low',
          requiredLevel: 'Medium',
          fertilizer: 'Urea',
          quantity: 87,
          unit: 'kg/hectare',
          applicationMethod: 'Split application',
          timing: 'Basal + Top dressing'
        });
      }

      if (deficiency.includes('Phosphorus')) {
        recommendations.push({
          nutrient: 'Phosphorus',
          currentLevel: 'Low',
          requiredLevel: 'Medium',
          fertilizer: 'DAP',
          quantity: 125,
          unit: 'kg/hectare',
          applicationMethod: 'Broadcasting',
          timing: 'At the time of sowing'
        });
      }
    });

    return recommendations;
  }

  private getYieldFactors(crop: string): string[] {
    const factors = [
      'Soil fertility', 'Water availability', 'Weather conditions',
      'Seed quality', 'Fertilizer application', 'Pest management',
      'Weed control', 'Harvesting timing', 'Storage practices'
    ];
    return factors.slice(0, 5 + Math.floor(Math.random() * 3));
  }

  private getRecommendedPractices(crop: string): string[] {
    const practices = [
      'Use certified seeds', 'Follow recommended spacing',
      'Apply balanced fertilizers', 'Implement IPM practices',
      'Ensure proper drainage', 'Use organic manures',
      'Follow crop rotation', 'Timely harvesting'
    ];
    return practices.slice(0, 4 + Math.floor(Math.random() * 3));
  }

  private getSuccessStories(crop: string, district: string): string[] {
    return [
      `Farmer in ${district} achieved 25% higher yield using precision farming techniques`,
      `Successful adoption of high-yielding varieties increased productivity by 30%`,
      `Integrated nutrient management led to 20% cost reduction and improved soil health`
    ];
  }

  // Public utility methods
  public formatPrice(price: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price);
  }

  public getPriceAnalysis(prices: AGMARKNETPrice[]): {
    averagePrice: number;
    highestPrice: number;
    lowestPrice: number;
    priceRange: number;
    trend: string;
  } {
    if (prices.length === 0) {
      return {
        averagePrice: 0,
        highestPrice: 0,
        lowestPrice: 0,
        priceRange: 0,
        trend: 'stable'
      };
    }

    const modalPrices = prices.map(p => p.modalPrice);
    const averagePrice = modalPrices.reduce((sum, price) => sum + price, 0) / modalPrices.length;
    const highestPrice = Math.max(...modalPrices);
    const lowestPrice = Math.min(...modalPrices);
    const priceRange = highestPrice - lowestPrice;

    // Determine overall trend
    const increasingCount = prices.filter(p => p.trend === 'increasing').length;
    const decreasingCount = prices.filter(p => p.trend === 'decreasing').length;
    
    let trend = 'stable';
    if (increasingCount > decreasingCount * 1.5) trend = 'increasing';
    else if (decreasingCount > increasingCount * 1.5) trend = 'decreasing';

    return {
      averagePrice: Math.round(averagePrice),
      highestPrice,
      lowestPrice,
      priceRange,
      trend
    };
  }
}

export const governmentDataService = new GovernmentDataService();