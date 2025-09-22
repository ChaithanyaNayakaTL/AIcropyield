// Farmer Dashboard - Core Component for CropYieldAI
// Comprehensive dashboard for rural farmers with simple, intuitive interface

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  MapPin, 
  Calendar, 
  TrendingUp, 
  Droplets, 
  Thermometer,
  Leaf,
  DollarSign,
  Bell,
  Settings,
  Plus,
  Eye,
  Edit,
  BarChart3,
  Users,
  FileText,
  Share2
} from 'lucide-react';

// Import our data services
import { weatherAPIService } from '@/lib/weather-api';
import { governmentDataService } from '@/lib/government-data';
import { satelliteDataService } from '@/lib/satellite-data';
import { marketIntelligenceService } from '@/lib/market-intelligence';
import { notificationService } from '@/lib/notification-service';

export interface FarmerProfile {
  id: string;
  name: string;
  phone: string;
  location: {
    village: string;
    district: string;
    state: string;
    latitude: number;
    longitude: number;
  };
  totalLand: number; // in acres
  experienceYears: number;
  primaryCrops: string[];
  farmingType: 'organic' | 'conventional' | 'mixed';
  registrationDate: Date;
  profilePicture?: string;
}

export interface Field {
  id: string;
  name: string;
  area: number; // in acres
  soilType: 'clay' | 'sandy' | 'loamy' | 'black' | 'red';
  currentCrop?: string;
  plantingDate?: Date;
  expectedHarvest?: Date;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  waterSource: 'rain-fed' | 'irrigation' | 'borewell' | 'canal';
  lastSoilTest?: Date;
  soilHealth: {
    ph: number;
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    organicMatter: number;
  };
}

export interface CropRotationPlan {
  fieldId: string;
  seasons: {
    season: 'kharif' | 'rabi' | 'summer';
    year: number;
    crop: string;
    variety: string;
    expectedYield: number;
    plannedArea: number;
    status: 'planned' | 'sown' | 'growing' | 'harvested';
  }[];
}

export interface SeasonYieldRecord {
  id: string;
  fieldId: string;
  crop: string;
  variety: string;
  season: 'kharif' | 'rabi' | 'summer';
  year: number;
  area: number;
  actualYield: number;
  expectedYield: number;
  totalProduction: number;
  costOfCultivation: number;
  sellingPrice: number;
  totalRevenue: number;
  profit: number;
  profitPerAcre: number;
  challenges: string[];
  successFactors: string[];
}

export interface DashboardData {
  currentWeather: any;
  todayTasks: Task[];
  upcomingAlerts: any[];
  fieldStatuses: FieldStatus[];
  marketPrices: any[];
  governmentSchemes: any[];
  notifications: any[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  type: 'irrigation' | 'fertilization' | 'pest-control' | 'harvesting' | 'sowing' | 'general';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: Date;
  fieldId?: string;
  isCompleted: boolean;
  estimatedTime: string;
}

export interface FieldStatus {
  fieldId: string;
  fieldName: string;
  crop: string;
  stage: string;
  health: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  daysToHarvest: number;
  needsAttention: boolean;
  alerts: string[];
}

const FarmerDashboard: React.FC = () => {
  // State management
  const [farmerProfile, setFarmerProfile] = useState<FarmerProfile | null>(null);
  const [fields, setFields] = useState<Field[]>([]);
  const [rotationPlans, setRotationPlans] = useState<CropRotationPlan[]>([]);
  const [yieldRecords, setYieldRecords] = useState<SeasonYieldRecord[]>([]);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Initialize dashboard data
  useEffect(() => {
    initializeDashboard();
  }, []);

  const initializeDashboard = async () => {
    try {
      setLoading(true);
      
      // Load farmer profile (simulated data)
      const profile = getSimulatedFarmerProfile();
      setFarmerProfile(profile);
      
      // Load fields data
      const fieldsData = getSimulatedFields(profile);
      setFields(fieldsData);
      
      // Load rotation plans
      const rotationData = getSimulatedRotationPlans(fieldsData);
      setRotationPlans(rotationData);
      
      // Load yield records
      const yieldData = getSimulatedYieldRecords(fieldsData);
      setYieldRecords(yieldData);
      
      // Load dashboard data
      const dashData = await loadDashboardData(profile);
      setDashboardData(dashData);
      
    } catch (error) {
      console.error('Failed to initialize dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardData = async (profile: FarmerProfile): Promise<DashboardData> => {
    const [currentWeather, marketPrices, governmentSchemes] = await Promise.all([
      weatherAPIService.getWeatherData(profile.location.latitude, profile.location.longitude),
      marketIntelligenceService.getCurrentMarketPrices(['Rice', 'Wheat', 'Cotton'], {
        state: profile.location.state,
        district: profile.location.district
      }),
      governmentDataService.getGovernmentSchemes(profile.location.state, profile.primaryCrops[0])
    ]);

    const todayTasks = generateTodayTasks(fields);
    const fieldStatuses = generateFieldStatuses(fields);
    const upcomingAlerts = generateUpcomingAlerts(fields);
    const notifications = notificationService.getNotifications('farmer1', { limit: 5 });

    return {
      currentWeather,
      todayTasks,
      upcomingAlerts,
      fieldStatuses,
      marketPrices,
      governmentSchemes,
      notifications
    };
  };

  const getSimulatedFarmerProfile = (): FarmerProfile => {
    return {
      id: 'farmer_001',
      name: 'राम कुमार शर्मा (Ram Kumar Sharma)',
      phone: '+91-9876543210',
      location: {
        village: 'Rampur',
        district: 'Kanpur',
        state: 'Uttar Pradesh',
        latitude: 26.4499,
        longitude: 80.3319
      },
      totalLand: 5.5,
      experienceYears: 15,
      primaryCrops: ['Rice', 'Wheat', 'Sugarcane'],
      farmingType: 'conventional',
      registrationDate: new Date('2023-01-15')
    };
  };

  const getSimulatedFields = (profile: FarmerProfile): Field[] => {
    return [
      {
        id: 'field_001',
        name: 'मुख्य खेत (Main Field)',
        area: 2.5,
        soilType: 'loamy',
        currentCrop: 'Rice',
        plantingDate: new Date('2024-06-15'),
        expectedHarvest: new Date('2024-10-15'),
        coordinates: {
          latitude: profile.location.latitude + 0.001,
          longitude: profile.location.longitude + 0.001
        },
        waterSource: 'canal',
        lastSoilTest: new Date('2024-03-01'),
        soilHealth: {
          ph: 6.8,
          nitrogen: 280,
          phosphorus: 25,
          potassium: 180,
          organicMatter: 1.8
        }
      },
      {
        id: 'field_002',
        name: 'पूर्वी खेत (East Field)',
        area: 1.8,
        soilType: 'clay',
        currentCrop: 'Sugarcane',
        plantingDate: new Date('2024-02-01'),
        expectedHarvest: new Date('2025-01-15'),
        coordinates: {
          latitude: profile.location.latitude - 0.001,
          longitude: profile.location.longitude + 0.002
        },
        waterSource: 'borewell',
        lastSoilTest: new Date('2024-02-15'),
        soilHealth: {
          ph: 7.2,
          nitrogen: 320,
          phosphorus: 30,
          potassium: 200,
          organicMatter: 2.1
        }
      },
      {
        id: 'field_003',
        name: 'पश्चिमी खेत (West Field)',
        area: 1.2,
        soilType: 'sandy',
        currentCrop: undefined,
        coordinates: {
          latitude: profile.location.latitude + 0.002,
          longitude: profile.location.longitude - 0.001
        },
        waterSource: 'rain-fed',
        lastSoilTest: new Date('2024-01-10'),
        soilHealth: {
          ph: 6.5,
          nitrogen: 220,
          phosphorus: 18,
          potassium: 150,
          organicMatter: 1.4
        }
      }
    ];
  };

  const getSimulatedRotationPlans = (fields: Field[]): CropRotationPlan[] => {
    return fields.map(field => ({
      fieldId: field.id,
      seasons: [
        {
          season: 'kharif',
          year: 2024,
          crop: 'Rice',
          variety: 'IR-64',
          expectedYield: 25,
          plannedArea: field.area,
          status: field.currentCrop === 'Rice' ? 'growing' : 'planned'
        },
        {
          season: 'rabi',
          year: 2024,
          crop: 'Wheat',
          variety: 'PBW-343',
          expectedYield: 30,
          plannedArea: field.area,
          status: 'planned'
        },
        {
          season: 'summer',
          year: 2025,
          crop: 'Sugarcane',
          variety: 'Co-0238',
          expectedYield: 80,
          plannedArea: field.area * 0.5,
          status: 'planned'
        }
      ]
    }));
  };

  const getSimulatedYieldRecords = (fields: Field[]): SeasonYieldRecord[] => {
    const records: SeasonYieldRecord[] = [];
    
    fields.forEach(field => {
      // Generate 3 years of historical data
      for (let year = 2021; year <= 2023; year++) {
        records.push({
          id: `yield_${field.id}_${year}_kharif`,
          fieldId: field.id,
          crop: 'Rice',
          variety: 'IR-64',
          season: 'kharif',
          year,
          area: field.area,
          actualYield: 20 + Math.random() * 10,
          expectedYield: 25,
          totalProduction: (20 + Math.random() * 10) * field.area,
          costOfCultivation: 35000 * field.area,
          sellingPrice: 1800 + Math.random() * 400,
          totalRevenue: 0, // Will be calculated
          profit: 0, // Will be calculated
          profitPerAcre: 0, // Will be calculated
          challenges: ['Pest attack', 'Irregular rainfall'],
          successFactors: ['Good seed quality', 'Timely fertilization']
        });
        
        records.push({
          id: `yield_${field.id}_${year}_rabi`,
          fieldId: field.id,
          crop: 'Wheat',
          variety: 'PBW-343',
          season: 'rabi',
          year,
          area: field.area,
          actualYield: 25 + Math.random() * 8,
          expectedYield: 30,
          totalProduction: (25 + Math.random() * 8) * field.area,
          costOfCultivation: 30000 * field.area,
          sellingPrice: 2000 + Math.random() * 300,
          totalRevenue: 0, // Will be calculated
          profit: 0, // Will be calculated
          profitPerAcre: 0, // Will be calculated
          challenges: ['Late rains', 'Market price fluctuation'],
          successFactors: ['Quality seed', 'Proper irrigation']
        });
      }
    });
    
    // Calculate revenue and profit
    records.forEach(record => {
      record.totalRevenue = record.totalProduction * record.sellingPrice;
      record.profit = record.totalRevenue - record.costOfCultivation;
      record.profitPerAcre = record.profit / record.area;
    });
    
    return records;
  };

  const generateTodayTasks = (fields: Field[]): Task[] => {
    const tasks: Task[] = [
      {
        id: 'task_001',
        title: 'मुख्य खेत में सिंचाई (Irrigation in Main Field)',
        description: 'Rice crop needs irrigation after 3 days gap',
        type: 'irrigation',
        priority: 'high',
        dueDate: new Date(),
        fieldId: 'field_001',
        isCompleted: false,
        estimatedTime: '2 hours'
      },
      {
        id: 'task_002',
        title: 'यूरिया डालना (Apply Urea Fertilizer)',
        description: 'Apply urea fertilizer in sugarcane field',
        type: 'fertilization',
        priority: 'medium',
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        fieldId: 'field_002',
        isCompleted: false,
        estimatedTime: '1 hour'
      },
      {
        id: 'task_003',
        title: 'कीट जांच (Pest Inspection)',
        description: 'Check for brown plant hopper in rice field',
        type: 'pest-control',
        priority: 'urgent',
        dueDate: new Date(),
        fieldId: 'field_001',
        isCompleted: false,
        estimatedTime: '30 minutes'
      }
    ];
    
    return tasks;
  };

  const generateFieldStatuses = (fields: Field[]): FieldStatus[] => {
    return fields.map(field => {
      const needsAttention = Math.random() > 0.7;
      const healthOptions: Array<'excellent' | 'good' | 'fair' | 'poor' | 'critical'> = 
        ['excellent', 'good', 'fair', 'poor', 'critical'];
      
      return {
        fieldId: field.id,
        fieldName: field.name,
        crop: field.currentCrop || 'Fallow',
        stage: field.currentCrop ? 'Flowering' : 'Preparation',
        health: healthOptions[Math.floor(Math.random() * healthOptions.length)],
        daysToHarvest: field.expectedHarvest ? 
          Math.ceil((field.expectedHarvest.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0,
        needsAttention,
        alerts: needsAttention ? ['Water stress detected', 'Pest activity increased'] : []
      };
    });
  };

  const generateUpcomingAlerts = (fields: Field[]): any[] => {
    return [
      {
        id: 'alert_001',
        type: 'weather',
        title: 'Heavy Rain Forecast',
        message: 'Heavy rainfall expected in next 2 days',
        severity: 'warning',
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'alert_002',
        type: 'market',
        title: 'Rice Price Increase',
        message: 'Rice prices increased by 8% in local market',
        severity: 'info',
        date: new Date()
      }
    ];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your farm dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-gray-900">CropYieldAI</h1>
              </div>
              <div className="hidden md:block">
                <p className="text-sm text-gray-600">Welcome back, {farmerProfile?.name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
                <Badge className="ml-1 bg-red-500">3</Badge>
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="hidden md:block text-sm font-medium">
                  {farmerProfile?.name.split('(')[0].trim()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="fields">Fields</TabsTrigger>
            <TabsTrigger value="crops">Crops</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="social">Community</TabsTrigger>
            <TabsTrigger value="government">Government</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Land</p>
                      <p className="text-2xl font-bold">{farmerProfile?.totalLand}</p>
                      <p className="text-xs text-gray-500">acres</p>
                    </div>
                    <MapPin className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Active Fields</p>
                      <p className="text-2xl font-bold">{fields.filter(f => f.currentCrop).length}</p>
                      <p className="text-xs text-gray-500">growing</p>
                    </div>
                    <Leaf className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Today's Tasks</p>
                      <p className="text-2xl font-bold">{dashboardData?.todayTasks.length || 0}</p>
                      <p className="text-xs text-gray-500">pending</p>
                    </div>
                    <Calendar className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Profit This Year</p>
                      <p className="text-2xl font-bold">₹{(Math.random() * 200000 + 100000).toFixed(0)}</p>
                      <p className="text-xs text-green-600">+12% from last year</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Weather & Tasks Row */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Current Weather */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Thermometer className="h-5 w-5" />
                    <span>Today's Weather</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {dashboardData?.currentWeather && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-3xl font-bold">
                            {Math.round(dashboardData.currentWeather.temperature)}°C
                          </p>
                          <p className="text-gray-600 capitalize">
                            {dashboardData.currentWeather.description}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Humidity</p>
                          <p className="font-semibold">{dashboardData.currentWeather.humidity}%</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Droplets className="h-4 w-4 text-blue-500" />
                          <span>Rain: {dashboardData.currentWeather.precipitation || 0}mm</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span>Wind: {dashboardData.currentWeather.windSpeed || 5} km/h</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium text-blue-800">Farming Advice</p>
                        <p className="text-sm text-blue-700">
                          Good weather for field activities. Consider irrigation if needed.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Today's Tasks */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5" />
                      <span>Today's Tasks</span>
                    </span>
                    <Button size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Task
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dashboardData?.todayTasks.slice(0, 3).map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-sm">{task.title}</p>
                          <p className="text-xs text-gray-600">{task.description}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge
                              variant={
                                task.priority === 'urgent' ? 'destructive' :
                                task.priority === 'high' ? 'default' : 'secondary'
                              }
                              className="text-xs"
                            >
                              {task.priority}
                            </Badge>
                            <span className="text-xs text-gray-500">{task.estimatedTime}</span>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    
                    {dashboardData?.todayTasks && dashboardData.todayTasks.length > 3 && (
                      <Button variant="ghost" size="sm" className="w-full">
                        View All Tasks ({dashboardData.todayTasks.length})
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Field Status & Market Prices */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Field Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Leaf className="h-5 w-5" />
                    <span>Field Status</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData?.fieldStatuses.map((status) => (
                      <div key={status.fieldId} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-medium">{status.fieldName}</p>
                            <p className="text-sm text-gray-600">{status.crop} - {status.stage}</p>
                          </div>
                          <Badge
                            variant={
                              status.health === 'excellent' ? 'default' :
                              status.health === 'good' ? 'secondary' :
                              status.health === 'fair' ? 'outline' : 'destructive'
                            }
                          >
                            {status.health}
                          </Badge>
                        </div>
                        
                        {status.daysToHarvest > 0 && (
                          <div className="mb-2">
                            <p className="text-sm text-gray-600">Days to harvest: {status.daysToHarvest}</p>
                            <Progress 
                              value={Math.max(0, 100 - (status.daysToHarvest / 120 * 100))} 
                              className="h-2"
                            />
                          </div>
                        )}
                        
                        {status.alerts.length > 0 && (
                          <div className="mt-2">
                            {status.alerts.map((alert, index) => (
                              <p key={index} className="text-xs text-red-600 bg-red-50 p-1 rounded">
                                ⚠️ {alert}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Market Prices */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Market Prices</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dashboardData?.marketPrices.slice(0, 4).map((price, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{price.commodityName}</p>
                          <p className="text-sm text-gray-600">{price.variety} - {price.marketName}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">₹{price.currentPrice}</p>
                          <p className={`text-sm ${
                            price.priceChange.daily > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {price.priceChange.daily > 0 ? '+' : ''}₹{price.priceChange.daily}
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    <Button variant="ghost" size="sm" className="w-full">
                      View All Prices
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-20 flex-col space-y-2">
                    <BarChart3 className="h-6 w-6" />
                    <span className="text-sm">View Analytics</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col space-y-2">
                    <Users className="h-6 w-6" />
                    <span className="text-sm">Community</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col space-y-2">
                    <FileText className="h-6 w-6" />
                    <span className="text-sm">Generate Report</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col space-y-2">
                    <Share2 className="h-6 w-6" />
                    <span className="text-sm">Share Data</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tabs will be implemented in separate components */}
          <TabsContent value="fields">
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-gray-600">
                  Fields management component will be implemented here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="crops">
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-gray-600">
                  Crop rotation and planning component will be implemented here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-gray-600">
                  Analytics and insights component will be implemented here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social">
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-gray-600">
                  Social features and community component will be implemented here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="government">
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-gray-600">
                  Government integration component will be implemented here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default FarmerDashboard;