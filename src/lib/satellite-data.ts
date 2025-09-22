// Satellite Data Simulation Service for CropYieldAI
// Simulates NDVI, soil moisture, crop health monitoring, and growth stage tracking

export interface NDVIData {
  coordinates: {
    latitude: number;
    longitude: number;
  };
  date: Date;
  ndviValue: number;
  ndviCategory: 'very-low' | 'low' | 'moderate' | 'high' | 'very-high';
  cropHealth: 'poor' | 'fair' | 'good' | 'excellent';
  vegetationCover: number; // percentage
  biomassIndex: number;
  seasonalTrend: 'increasing' | 'decreasing' | 'stable' | 'fluctuating';
  historicalComparison: {
    lastYear: number;
    lastMonth: number;
    change: number;
    trend: 'improving' | 'declining' | 'stable';
  };
}

export interface SoilMoistureData {
  coordinates: {
    latitude: number;
    longitude: number;
  };
  date: Date;
  moistureLevel: number; // percentage
  moistureCategory: 'very-dry' | 'dry' | 'moderate' | 'moist' | 'very-moist';
  depth: number; // cm
  soilTemperature: number; // celsius
  irrigationRecommendation: 'not-needed' | 'light' | 'moderate' | 'heavy' | 'urgent';
  droughtRisk: 'none' | 'low' | 'moderate' | 'high' | 'severe';
  waterStressIndex: number;
  evapotranspiration: number; // mm/day
}

export interface CropHealthMetrics {
  fieldId: string;
  cropType: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  assessmentDate: Date;
  overallHealth: number; // 0-100 score
  healthCategory: 'critical' | 'poor' | 'fair' | 'good' | 'excellent';
  stressIndicators: {
    waterStress: number;
    nutrientStress: number;
    pestStress: number;
    diseaseStress: number;
    heatStress: number;
  };
  leafAreaIndex: number;
  chlorophyllContent: number;
  canopyTemperature: number;
  photosynthesis: number;
  recommendations: HealthRecommendation[];
  alerts: HealthAlert[];
}

export interface HealthRecommendation {
  type: 'irrigation' | 'fertilization' | 'pest-control' | 'disease-management' | 'general';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  description: string;
  actionRequired: string;
  timeframe: string;
  expectedImprovement: string;
}

export interface HealthAlert {
  id: string;
  severity: 'info' | 'warning' | 'critical';
  type: 'drought' | 'disease' | 'pest' | 'nutrient' | 'temperature';
  title: string;
  description: string;
  affectedArea: number; // percentage of field
  detectionDate: Date;
  recommendedAction: string;
  urgency: 'immediate' | 'within-24h' | 'within-week' | 'monitor';
}

export interface GrowthStageData {
  fieldId: string;
  cropType: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  currentStage: string;
  stageProgress: number; // percentage completion of current stage
  daysInStage: number;
  estimatedDaysToNextStage: number;
  stageTimeline: GrowthStage[];
  phenologyData: {
    germination: Date | null;
    emergence: Date | null;
    vegetative: Date | null;
    flowering: Date | null;
    fruitDevelopment: Date | null;
    maturity: Date | null;
    harvest: Date | null;
  };
  developmentIndex: number;
  thermalUnits: number;
  recommendations: StageRecommendation[];
}

export interface GrowthStage {
  stage: string;
  description: string;
  startDate: Date | null;
  endDate: Date | null;
  duration: number; // days
  keyActivities: string[];
  criticalFactors: string[];
  status: 'completed' | 'current' | 'upcoming' | 'delayed';
}

export interface StageRecommendation {
  stage: string;
  recommendation: string;
  timing: string;
  importance: 'low' | 'medium' | 'high' | 'critical';
}

export interface SatelliteImageData {
  imageId: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  captureDate: Date;
  satelliteName: string;
  cloudCover: number; // percentage
  resolution: number; // meters per pixel
  spectralBands: {
    red: number[];
    green: number[];
    blue: number[];
    nir: number[]; // Near Infrared
    swir: number[]; // Short Wave Infrared
  };
  indices: {
    ndvi: number[][];
    ndwi: number[][]; // Normalized Difference Water Index
    evi: number[][]; // Enhanced Vegetation Index
    savi: number[][]; // Soil Adjusted Vegetation Index
  };
  analysisResults: {
    vegetationCover: number;
    waterBodies: number;
    soilExposure: number;
    urbanArea: number;
    cloudShadow: number;
  };
}

class SatelliteDataService {
  private useSimulatedData: boolean = true; // Always true for demo
  private fieldSize: number = 5; // hectares (default field size)

  constructor() {
    console.log('Satellite Data Service: Using simulated satellite data');
  }

  // Get NDVI data for field monitoring
  public async getNDVIData(
    latitude: number,
    longitude: number,
    startDate?: Date,
    endDate?: Date
  ): Promise<NDVIData[]> {
    if (this.useSimulatedData) {
      return this.getSimulatedNDVIData(latitude, longitude, startDate, endDate);
    }

    // Real satellite API integration would go here
    try {
      // Example: Sentinel-2 or Landsat API calls
      return [];
    } catch (error) {
      console.error('Satellite NDVI API Error:', error);
      return this.getSimulatedNDVIData(latitude, longitude, startDate, endDate);
    }
  }

  // Get soil moisture data
  public async getSoilMoistureData(
    latitude: number,
    longitude: number,
    depth: number = 30
  ): Promise<SoilMoistureData[]> {
    if (this.useSimulatedData) {
      return this.getSimulatedSoilMoistureData(latitude, longitude, depth);
    }

    // Real API integration (e.g., SMAP, SMOS data)
    try {
      return [];
    } catch (error) {
      console.error('Soil Moisture API Error:', error);
      return this.getSimulatedSoilMoistureData(latitude, longitude, depth);
    }
  }

  // Get comprehensive crop health metrics
  public async getCropHealthMetrics(
    fieldId: string,
    cropType: string,
    latitude: number,
    longitude: number
  ): Promise<CropHealthMetrics> {
    if (this.useSimulatedData) {
      return this.getSimulatedCropHealthMetrics(fieldId, cropType, latitude, longitude);
    }

    // Real analysis would combine multiple satellite data sources
    try {
      return {} as CropHealthMetrics;
    } catch (error) {
      console.error('Crop Health API Error:', error);
      return this.getSimulatedCropHealthMetrics(fieldId, cropType, latitude, longitude);
    }
  }

  // Get growth stage tracking data
  public async getGrowthStageData(
    fieldId: string,
    cropType: string,
    latitude: number,
    longitude: number,
    plantingDate: Date
  ): Promise<GrowthStageData> {
    if (this.useSimulatedData) {
      return this.getSimulatedGrowthStageData(fieldId, cropType, latitude, longitude, plantingDate);
    }

    // Real phenology monitoring would use time-series satellite data
    try {
      return {} as GrowthStageData;
    } catch (error) {
      console.error('Growth Stage API Error:', error);
      return this.getSimulatedGrowthStageData(fieldId, cropType, latitude, longitude, plantingDate);
    }
  }

  // Get satellite imagery with analysis
  public async getSatelliteImagery(
    latitude: number,
    longitude: number,
    date?: Date
  ): Promise<SatelliteImageData> {
    if (this.useSimulatedData) {
      return this.getSimulatedSatelliteImagery(latitude, longitude, date);
    }

    // Real satellite imagery APIs (Sentinel Hub, Planet, etc.)
    try {
      return {} as SatelliteImageData;
    } catch (error) {
      console.error('Satellite Imagery API Error:', error);
      return this.getSimulatedSatelliteImagery(latitude, longitude, date);
    }
  }

  // Simulated data generation methods
  private getSimulatedNDVIData(
    latitude: number,
    longitude: number,
    startDate?: Date,
    endDate?: Date
  ): NDVIData[] {
    const data: NDVIData[] = [];
    const end = endDate || new Date();
    const start = startDate || new Date(end.getTime() - 90 * 24 * 60 * 60 * 1000); // 90 days ago

    // Generate weekly NDVI data
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 7)) {
      const seasonalFactor = this.getSeasonalNDVIFactor(new Date(date));
      const randomVariation = (Math.random() - 0.5) * 0.2;
      const baseNDVI = 0.6 + seasonalFactor * 0.3 + randomVariation;
      const ndviValue = Math.max(0, Math.min(1, baseNDVI));

      const ndviCategory = this.categorizeNDVI(ndviValue);
      const cropHealth = this.deriveCropHealthFromNDVI(ndviValue);

      // Simulate historical comparison
      const lastYearNDVI = ndviValue + (Math.random() - 0.5) * 0.1;
      const lastMonthNDVI = ndviValue + (Math.random() - 0.5) * 0.05;

      data.push({
        coordinates: { latitude, longitude },
        date: new Date(date),
        ndviValue: Math.round(ndviValue * 1000) / 1000,
        ndviCategory,
        cropHealth,
        vegetationCover: Math.round(ndviValue * 100),
        biomassIndex: Math.round(ndviValue * 150),
        seasonalTrend: this.getSeasonalTrend(ndviValue, seasonalFactor),
        historicalComparison: {
          lastYear: Math.round(lastYearNDVI * 1000) / 1000,
          lastMonth: Math.round(lastMonthNDVI * 1000) / 1000,
          change: Math.round((ndviValue - lastYearNDVI) * 1000) / 1000,
          trend: ndviValue > lastYearNDVI ? 'improving' : ndviValue < lastYearNDVI ? 'declining' : 'stable'
        }
      });
    }

    return data;
  }

  private getSimulatedSoilMoistureData(
    latitude: number,
    longitude: number,
    depth: number
  ): SoilMoistureData[] {
    const data: SoilMoistureData[] = [];

    // Generate daily soil moisture data for last 30 days
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      // Simulate seasonal and depth-based moisture patterns
      const seasonalFactor = this.getSeasonalMoistureFactor(date);
      const depthFactor = Math.max(0.3, 1 - (depth / 100)); // Moisture decreases with depth
      const weatherFactor = Math.random() * 0.4 + 0.6; // Random weather influence
      
      const baseMoisture = seasonalFactor * depthFactor * weatherFactor;
      const moistureLevel = Math.max(10, Math.min(100, baseMoisture * 100));

      const moistureCategory = this.categorizeMoisture(moistureLevel);
      const irrigationRecommendation = this.getIrrigationRecommendation(moistureLevel);
      const droughtRisk = this.assessDroughtRisk(moistureLevel);

      data.push({
        coordinates: { latitude, longitude },
        date,
        moistureLevel: Math.round(moistureLevel),
        moistureCategory,
        depth,
        soilTemperature: Math.round((15 + Math.random() * 20) * 10) / 10,
        irrigationRecommendation,
        droughtRisk,
        waterStressIndex: Math.round((100 - moistureLevel) / 10),
        evapotranspiration: Math.round((2 + Math.random() * 6) * 10) / 10
      });
    }

    return data;
  }

  private getSimulatedCropHealthMetrics(
    fieldId: string,
    cropType: string,
    latitude: number,
    longitude: number
  ): CropHealthMetrics {
    // Generate realistic crop health metrics
    const waterStress = Math.random() * 30; // 0-30%
    const nutrientStress = Math.random() * 25; // 0-25%
    const pestStress = Math.random() * 20; // 0-20%
    const diseaseStress = Math.random() * 15; // 0-15%
    const heatStress = Math.random() * 35; // 0-35%

    const totalStress = (waterStress + nutrientStress + pestStress + diseaseStress + heatStress) / 5;
    const overallHealth = Math.max(20, 100 - totalStress);

    const healthCategory = this.categorizeHealth(overallHealth);
    const recommendations = this.generateHealthRecommendations(
      waterStress, nutrientStress, pestStress, diseaseStress, heatStress
    );
    const alerts = this.generateHealthAlerts(waterStress, nutrientStress, pestStress, diseaseStress);

    return {
      fieldId,
      cropType,
      coordinates: { latitude, longitude },
      assessmentDate: new Date(),
      overallHealth: Math.round(overallHealth),
      healthCategory,
      stressIndicators: {
        waterStress: Math.round(waterStress),
        nutrientStress: Math.round(nutrientStress),
        pestStress: Math.round(pestStress),
        diseaseStress: Math.round(diseaseStress),
        heatStress: Math.round(heatStress)
      },
      leafAreaIndex: Math.round((2 + Math.random() * 4) * 100) / 100,
      chlorophyllContent: Math.round((25 + Math.random() * 15) * 10) / 10,
      canopyTemperature: Math.round((20 + Math.random() * 15) * 10) / 10,
      photosynthesis: Math.round((overallHealth / 100 * 30) * 10) / 10,
      recommendations,
      alerts
    };
  }

  private getSimulatedGrowthStageData(
    fieldId: string,
    cropType: string,
    latitude: number,
    longitude: number,
    plantingDate: Date
  ): GrowthStageData {
    const stages = this.getCropStages(cropType);
    const daysSincePlanting = Math.floor((Date.now() - plantingDate.getTime()) / (1000 * 60 * 60 * 24));
    
    let currentStageIndex = 0;
    let daysInCurrentStage = 0;
    let cumulativeDays = 0;

    // Determine current stage
    for (let i = 0; i < stages.length; i++) {
      if (daysSincePlanting <= cumulativeDays + stages[i].duration) {
        currentStageIndex = i;
        daysInCurrentStage = daysSincePlanting - cumulativeDays;
        break;
      }
      cumulativeDays += stages[i].duration;
    }

    const currentStage = stages[currentStageIndex];
    const stageProgress = (daysInCurrentStage / currentStage.duration) * 100;
    const estimatedDaysToNextStage = currentStage.duration - daysInCurrentStage;

    // Generate phenology data
    const phenologyData = this.generatePhenologyData(plantingDate, stages);
    
    // Calculate thermal units (Growing Degree Days)
    const thermalUnits = daysSincePlanting * (25 - 10); // Simplified GDD calculation

    const recommendations = this.generateStageRecommendations(currentStage.stage, cropType);

    return {
      fieldId,
      cropType,
      coordinates: { latitude, longitude },
      currentStage: currentStage.stage,
      stageProgress: Math.round(stageProgress),
      daysInStage: daysInCurrentStage,
      estimatedDaysToNextStage: Math.max(0, estimatedDaysToNextStage),
      stageTimeline: stages,
      phenologyData,
      developmentIndex: Math.round((daysSincePlanting / 120) * 100), // Assume 120-day crop cycle
      thermalUnits: Math.round(thermalUnits),
      recommendations
    };
  }

  private getSimulatedSatelliteImagery(
    latitude: number,
    longitude: number,
    date?: Date
  ): SatelliteImageData {
    const captureDate = date || new Date();
    const imageSize = 100; // 100x100 pixel simulation

    // Generate synthetic spectral data
    const spectralBands = {
      red: this.generateSpectralBand(imageSize, 0.1, 0.3),
      green: this.generateSpectralBand(imageSize, 0.1, 0.4),
      blue: this.generateSpectralBand(imageSize, 0.05, 0.2),
      nir: this.generateSpectralBand(imageSize, 0.4, 0.8),
      swir: this.generateSpectralBand(imageSize, 0.1, 0.5)
    };

    // Calculate vegetation indices
    const indices = this.calculateVegetationIndices(spectralBands);

    // Analyze land cover
    const analysisResults = this.analyzeLandCover(indices);

    return {
      imageId: `IMG_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      coordinates: { latitude, longitude },
      captureDate,
      satelliteName: 'Sentinel-2A',
      cloudCover: Math.round(Math.random() * 30), // 0-30% cloud cover
      resolution: 10, // 10m resolution
      spectralBands,
      indices,
      analysisResults
    };
  }

  // Helper methods
  private getSeasonalNDVIFactor(date: Date): number {
    const month = date.getMonth();
    // Simulate seasonal NDVI patterns for crops
    const seasonalFactors = [0.3, 0.4, 0.6, 0.8, 1.0, 0.9, 0.7, 0.6, 0.7, 0.8, 0.6, 0.4];
    return seasonalFactors[month];
  }

  private categorizeNDVI(ndvi: number): 'very-low' | 'low' | 'moderate' | 'high' | 'very-high' {
    if (ndvi < 0.2) return 'very-low';
    if (ndvi < 0.4) return 'low';
    if (ndvi < 0.6) return 'moderate';
    if (ndvi < 0.8) return 'high';
    return 'very-high';
  }

  private deriveCropHealthFromNDVI(ndvi: number): 'poor' | 'fair' | 'good' | 'excellent' {
    if (ndvi < 0.3) return 'poor';
    if (ndvi < 0.5) return 'fair';
    if (ndvi < 0.7) return 'good';
    return 'excellent';
  }

  private getSeasonalTrend(ndvi: number, seasonalFactor: number): 'increasing' | 'decreasing' | 'stable' | 'fluctuating' {
    const trends = ['increasing', 'decreasing', 'stable', 'fluctuating'] as const;
    return trends[Math.floor(Math.random() * trends.length)];
  }

  private getSeasonalMoistureFactor(date: Date): number {
    const month = date.getMonth();
    // Simulate seasonal moisture patterns (monsoon influence)
    const moistureFactors = [0.4, 0.3, 0.5, 0.7, 0.6, 0.9, 1.0, 0.9, 0.8, 0.6, 0.4, 0.3];
    return moistureFactors[month];
  }

  private categorizeMoisture(moisture: number): 'very-dry' | 'dry' | 'moderate' | 'moist' | 'very-moist' {
    if (moisture < 20) return 'very-dry';
    if (moisture < 40) return 'dry';
    if (moisture < 60) return 'moderate';
    if (moisture < 80) return 'moist';
    return 'very-moist';
  }

  private getIrrigationRecommendation(moisture: number): 'not-needed' | 'light' | 'moderate' | 'heavy' | 'urgent' {
    if (moisture > 70) return 'not-needed';
    if (moisture > 50) return 'light';
    if (moisture > 30) return 'moderate';
    if (moisture > 15) return 'heavy';
    return 'urgent';
  }

  private assessDroughtRisk(moisture: number): 'none' | 'low' | 'moderate' | 'high' | 'severe' {
    if (moisture > 60) return 'none';
    if (moisture > 40) return 'low';
    if (moisture > 25) return 'moderate';
    if (moisture > 15) return 'high';
    return 'severe';
  }

  private categorizeHealth(health: number): 'critical' | 'poor' | 'fair' | 'good' | 'excellent' {
    if (health < 30) return 'critical';
    if (health < 50) return 'poor';
    if (health < 70) return 'fair';
    if (health < 85) return 'good';
    return 'excellent';
  }

  private generateHealthRecommendations(
    waterStress: number,
    nutrientStress: number,
    pestStress: number,
    diseaseStress: number,
    heatStress: number
  ): HealthRecommendation[] {
    const recommendations: HealthRecommendation[] = [];

    if (waterStress > 20) {
      recommendations.push({
        type: 'irrigation',
        priority: waterStress > 30 ? 'urgent' : 'high',
        title: 'Water Stress Detected',
        description: `High water stress levels detected (${Math.round(waterStress)}%)`,
        actionRequired: 'Increase irrigation frequency and check soil moisture levels',
        timeframe: 'Within 24 hours',
        expectedImprovement: 'Reduced water stress within 2-3 days'
      });
    }

    if (nutrientStress > 15) {
      recommendations.push({
        type: 'fertilization',
        priority: nutrientStress > 25 ? 'high' : 'medium',
        title: 'Nutrient Deficiency',
        description: `Nutrient stress indicators present (${Math.round(nutrientStress)}%)`,
        actionRequired: 'Apply balanced fertilizer and conduct soil test',
        timeframe: 'Within 1 week',
        expectedImprovement: 'Improved plant vigor within 1-2 weeks'
      });
    }

    if (pestStress > 10) {
      recommendations.push({
        type: 'pest-control',
        priority: pestStress > 20 ? 'urgent' : 'medium',
        title: 'Pest Activity Detected',
        description: `Pest stress indicators present (${Math.round(pestStress)}%)`,
        actionRequired: 'Scout for pests and apply appropriate control measures',
        timeframe: 'Immediate',
        expectedImprovement: 'Reduced pest pressure within 3-5 days'
      });
    }

    return recommendations;
  }

  private generateHealthAlerts(
    waterStress: number,
    nutrientStress: number,
    pestStress: number,
    diseaseStress: number
  ): HealthAlert[] {
    const alerts: HealthAlert[] = [];

    if (waterStress > 35) {
      alerts.push({
        id: `alert_water_${Date.now()}`,
        severity: 'critical',
        type: 'drought',
        title: 'Severe Water Stress',
        description: 'Crops showing severe water stress symptoms',
        affectedArea: Math.round(Math.random() * 30 + 70), // 70-100% affected
        detectionDate: new Date(),
        recommendedAction: 'Immediate irrigation required',
        urgency: 'immediate'
      });
    }

    if (pestStress > 25) {
      alerts.push({
        id: `alert_pest_${Date.now()}`,
        severity: 'warning',
        type: 'pest',
        title: 'High Pest Activity',
        description: 'Elevated pest activity detected in field',
        affectedArea: Math.round(Math.random() * 40 + 20), // 20-60% affected
        detectionDate: new Date(),
        recommendedAction: 'Apply integrated pest management',
        urgency: 'within-24h'
      });
    }

    return alerts;
  }

  private getCropStages(cropType: string): GrowthStage[] {
    const stageTemplates: { [key: string]: GrowthStage[] } = {
      rice: [
        {
          stage: 'Germination',
          description: 'Seed germination and initial root development',
          startDate: null,
          endDate: null,
          duration: 7,
          keyActivities: ['Seed soaking', 'Field preparation'],
          criticalFactors: ['Temperature', 'Moisture'],
          status: 'completed'
        },
        {
          stage: 'Seedling',
          description: 'Emergence of shoots and initial leaf development',
          startDate: null,
          endDate: null,
          duration: 21,
          keyActivities: ['Transplanting', 'First fertilizer application'],
          criticalFactors: ['Water management', 'Temperature'],
          status: 'current'
        },
        {
          stage: 'Tillering',
          description: 'Development of tillers and vegetative growth',
          startDate: null,
          endDate: null,
          duration: 35,
          keyActivities: ['Weed management', 'Second fertilizer application'],
          criticalFactors: ['Nutrition', 'Water level'],
          status: 'upcoming'
        },
        {
          stage: 'Flowering',
          description: 'Panicle initiation and flowering',
          startDate: null,
          endDate: null,
          duration: 21,
          keyActivities: ['Pest monitoring', 'Water management'],
          criticalFactors: ['Weather conditions', 'Pollination'],
          status: 'upcoming'
        },
        {
          stage: 'Grain Filling',
          description: 'Grain development and filling',
          startDate: null,
          endDate: null,
          duration: 28,
          keyActivities: ['Disease monitoring', 'Final fertilizer'],
          criticalFactors: ['Water availability', 'Temperature'],
          status: 'upcoming'
        },
        {
          stage: 'Maturity',
          description: 'Grain maturation and harvest preparation',
          startDate: null,
          endDate: null,
          duration: 14,
          keyActivities: ['Harvest planning', 'Drying preparation'],
          criticalFactors: ['Weather timing', 'Moisture content'],
          status: 'upcoming'
        }
      ],
      wheat: [
        {
          stage: 'Germination',
          description: 'Seed germination and emergence',
          startDate: null,
          endDate: null,
          duration: 10,
          keyActivities: ['Sowing', 'Field preparation'],
          criticalFactors: ['Soil moisture', 'Temperature'],
          status: 'completed'
        },
        {
          stage: 'Tillering',
          description: 'Vegetative growth and tiller development',
          startDate: null,
          endDate: null,
          duration: 45,
          keyActivities: ['First irrigation', 'Weed control'],
          criticalFactors: ['Nutrition', 'Water management'],
          status: 'current'
        },
        {
          stage: 'Jointing',
          description: 'Stem elongation and node formation',
          startDate: null,
          endDate: null,
          duration: 30,
          keyActivities: ['Top dressing', 'Disease monitoring'],
          criticalFactors: ['Nitrogen supply', 'Pest control'],
          status: 'upcoming'
        },
        {
          stage: 'Flowering',
          description: 'Ear emergence and flowering',
          startDate: null,
          endDate: null,
          duration: 14,
          keyActivities: ['Final irrigation', 'Disease control'],
          criticalFactors: ['Weather conditions', 'Pollination'],
          status: 'upcoming'
        },
        {
          stage: 'Grain Filling',
          description: 'Grain development and maturation',
          startDate: null,
          endDate: null,
          duration: 35,
          keyActivities: ['Harvest preparation', 'Storage planning'],
          criticalFactors: ['Water management', 'Heat stress'],
          status: 'upcoming'
        }
      ]
    };

    return stageTemplates[cropType.toLowerCase()] || stageTemplates.rice;
  }

  private generatePhenologyData(plantingDate: Date, stages: GrowthStage[]): any {
    const phenology: any = {
      germination: null,
      emergence: null,
      vegetative: null,
      flowering: null,
      fruitDevelopment: null,
      maturity: null,
      harvest: null
    };

    let currentDate = new Date(plantingDate);
    
    // Simulate phenology dates based on stages
    stages.forEach((stage, index) => {
      currentDate.setDate(currentDate.getDate() + stage.duration);
      
      if (stage.stage.toLowerCase().includes('germination')) {
        phenology.germination = new Date(currentDate);
      } else if (stage.stage.toLowerCase().includes('seedling') || stage.stage.toLowerCase().includes('emergence')) {
        phenology.emergence = new Date(currentDate);
      } else if (stage.stage.toLowerCase().includes('tillering') || stage.stage.toLowerCase().includes('vegetative')) {
        phenology.vegetative = new Date(currentDate);
      } else if (stage.stage.toLowerCase().includes('flowering')) {
        phenology.flowering = new Date(currentDate);
      } else if (stage.stage.toLowerCase().includes('grain') || stage.stage.toLowerCase().includes('fruit')) {
        phenology.fruitDevelopment = new Date(currentDate);
      } else if (stage.stage.toLowerCase().includes('maturity')) {
        phenology.maturity = new Date(currentDate);
        phenology.harvest = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days after maturity
      }
    });

    return phenology;
  }

  private generateStageRecommendations(stage: string, cropType: string): StageRecommendation[] {
    const recommendations: StageRecommendation[] = [];

    const stageRecommendations: { [key: string]: StageRecommendation[] } = {
      'Germination': [
        {
          stage: 'Germination',
          recommendation: 'Ensure adequate soil moisture for seed germination',
          timing: 'Immediately after sowing',
          importance: 'critical'
        }
      ],
      'Seedling': [
        {
          stage: 'Seedling',
          recommendation: 'Monitor for pest and disease attacks on young plants',
          timing: 'Daily monitoring required',
          importance: 'high'
        },
        {
          stage: 'Seedling',
          recommendation: 'Apply starter fertilizer for strong root development',
          timing: '7-10 days after emergence',
          importance: 'medium'
        }
      ],
      'Tillering': [
        {
          stage: 'Tillering',
          recommendation: 'Apply nitrogen fertilizer to promote tiller development',
          timing: '3-4 weeks after transplanting',
          importance: 'high'
        },
        {
          stage: 'Tillering',
          recommendation: 'Maintain proper water levels in the field',
          timing: 'Throughout tillering stage',
          importance: 'critical'
        }
      ]
    };

    return stageRecommendations[stage] || [];
  }

  private generateSpectralBand(size: number, min: number, max: number): number[] {
    const band: number[] = [];
    for (let i = 0; i < size * size; i++) {
      band.push(min + Math.random() * (max - min));
    }
    return band;
  }

  private calculateVegetationIndices(spectralBands: any): any {
    const size = Math.sqrt(spectralBands.red.length);
    const indices: any = {
      ndvi: [],
      ndwi: [],
      evi: [],
      savi: []
    };

    for (let i = 0; i < spectralBands.red.length; i++) {
      const red = spectralBands.red[i];
      const nir = spectralBands.nir[i];
      const green = spectralBands.green[i];
      const blue = spectralBands.blue[i];

      // NDVI = (NIR - Red) / (NIR + Red)
      const ndvi = (nir - red) / (nir + red + 0.0001);
      
      // NDWI = (Green - NIR) / (Green + NIR)
      const ndwi = (green - nir) / (green + nir + 0.0001);
      
      // EVI = 2.5 * ((NIR - Red) / (NIR + 6 * Red - 7.5 * Blue + 1))
      const evi = 2.5 * ((nir - red) / (nir + 6 * red - 7.5 * blue + 1));
      
      // SAVI = ((NIR - Red) / (NIR + Red + 0.5)) * (1 + 0.5)
      const savi = ((nir - red) / (nir + red + 0.5)) * 1.5;

      indices.ndvi.push(Math.max(-1, Math.min(1, ndvi)));
      indices.ndwi.push(Math.max(-1, Math.min(1, ndwi)));
      indices.evi.push(Math.max(-1, Math.min(1, evi)));
      indices.savi.push(Math.max(-1, Math.min(1, savi)));
    }

    // Convert to 2D arrays
    Object.keys(indices).forEach(key => {
      const array2D: number[][] = [];
      for (let i = 0; i < size; i++) {
        array2D.push(indices[key].slice(i * size, (i + 1) * size));
      }
      indices[key] = array2D;
    });

    return indices;
  }

  private analyzeLandCover(indices: any): any {
    const flatNDVI = indices.ndvi.flat();
    const flatNDWI = indices.ndwi.flat();

    const vegetationPixels = flatNDVI.filter((val: number) => val > 0.3).length;
    const waterPixels = flatNDWI.filter((val: number) => val > 0.3).length;
    const totalPixels = flatNDVI.length;

    return {
      vegetationCover: Math.round((vegetationPixels / totalPixels) * 100),
      waterBodies: Math.round((waterPixels / totalPixels) * 100),
      soilExposure: Math.round(((totalPixels - vegetationPixels - waterPixels) / totalPixels) * 100),
      urbanArea: Math.round(Math.random() * 5), // Random small percentage
      cloudShadow: Math.round(Math.random() * 10) // Random cloud shadow
    };
  }

  // Public utility methods
  public getNDVIColorCode(ndvi: number): string {
    if (ndvi < 0) return '#8B4513'; // Brown - bare soil
    if (ndvi < 0.2) return '#DEB887'; // Burlywood - sparse vegetation
    if (ndvi < 0.4) return '#F0E68C'; // Khaki - low vegetation
    if (ndvi < 0.6) return '#9ACD32'; // Yellow green - moderate vegetation
    if (ndvi < 0.8) return '#32CD32'; // Lime green - dense vegetation
    return '#006400'; // Dark green - very dense vegetation
  }

  public getMoistureColorCode(moisture: number): string {
    if (moisture < 20) return '#8B0000'; // Dark red - very dry
    if (moisture < 40) return '#FF4500'; // Orange red - dry
    if (moisture < 60) return '#FFD700'; // Gold - moderate
    if (moisture < 80) return '#32CD32'; // Lime green - moist
    return '#0000FF'; // Blue - very moist
  }

  public getHealthColorCode(health: number): string {
    if (health < 30) return '#FF0000'; // Red - critical
    if (health < 50) return '#FF6600'; // Orange - poor
    if (health < 70) return '#FFFF00'; // Yellow - fair
    if (health < 85) return '#90EE90'; // Light green - good
    return '#00FF00'; // Green - excellent
  }
}

export const satelliteDataService = new SatelliteDataService();