// Analytics & Insights Dashboard for CropYieldAI
// Comprehensive analytics with yield trends, performance comparison, ROI calculations

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  LineChart,
  DollarSign,
  Users,
  Award,
  Target,
  Calendar,
  Leaf,
  Droplets,
  Zap,
  AlertTriangle,
  CheckCircle,
  Download,
  Share2,
  Filter
} from 'lucide-react';

export interface YieldTrendData {
  year: number;
  season: 'kharif' | 'rabi' | 'summer';
  crop: string;
  actualYield: number;
  expectedYield: number;
  area: number;
  profit: number;
  profitPerAcre: number;
  costPerAcre: number;
  yieldEfficiency: number; // actual/expected * 100
}

export interface PerformanceComparison {
  metric: string;
  myFarm: number;
  localAverage: number;
  stateAverage: number;
  nationalAverage: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  ranking: {
    local: number;
    state: number;
    percentile: number;
  };
}

export interface CropPerformance {
  crop: string;
  variety: string;
  totalSeasons: number;
  averageYield: number;
  bestYield: number;
  worstYield: number;
  consistencyScore: number; // 0-100
  profitability: number; // average profit per acre
  riskLevel: 'low' | 'medium' | 'high';
  recommendation: 'continue' | 'optimize' | 'consider-alternative';
  successRate: number; // percentage of profitable seasons
}

export interface ResourceUtilization {
  resource: 'water' | 'fertilizer' | 'labor' | 'machinery' | 'seeds' | 'pesticides';
  totalUsed: number;
  optimalUsage: number;
  efficiency: number; // 0-100
  costPerUnit: number;
  totalCost: number;
  wastePercentage: number;
  improvementPotential: number;
  recommendations: string[];
}

export interface ROIAnalysis {
  timeframe: 'season' | 'year' | 'total';
  period: string;
  totalInvestment: number;
  totalRevenue: number;
  netProfit: number;
  roi: number; // percentage
  breakdownByCategory: {
    category: string;
    investment: number;
    returns: number;
    roi: number;
  }[];
  riskAdjustedROI: number;
  comparisonWithAlternatives: {
    alternative: string;
    estimatedROI: number;
  }[];
}

export interface SeasonalInsight {
  season: 'kharif' | 'rabi' | 'summer';
  year: number;
  totalProfit: number;
  totalArea: number;
  averageYield: number;
  bestPerformingCrop: string;
  worstPerformingCrop: string;
  weatherImpact: 'positive' | 'negative' | 'neutral';
  marketConditions: 'favorable' | 'challenging' | 'mixed';
  keyLearnings: string[];
  improvementAreas: string[];
}

const AnalyticsInsights: React.FC = () => {
  const [yieldTrends, setYieldTrends] = useState<YieldTrendData[]>([]);
  const [performanceComparison, setPerformanceComparison] = useState<PerformanceComparison[]>([]);
  const [cropPerformance, setCropPerformance] = useState<CropPerformance[]>([]);
  const [resourceUtilization, setResourceUtilization] = useState<ResourceUtilization[]>([]);
  const [roiAnalysis, setROIAnalysis] = useState<ROIAnalysis[]>([]);
  const [seasonalInsights, setSeasonalInsights] = useState<SeasonalInsight[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('3years');
  const [selectedCrop, setSelectedCrop] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAnalytics();
  }, [selectedTimeframe, selectedCrop]);

  const initializeAnalytics = async () => {
    try {
      setLoading(true);
      
      // Generate simulated analytics data
      const trendsData = generateYieldTrends();
      const comparisonData = generatePerformanceComparison();
      const cropPerfData = generateCropPerformance();
      const resourceData = generateResourceUtilization();
      const roiData = generateROIAnalysis();
      const seasonalData = generateSeasonalInsights();
      
      setYieldTrends(trendsData);
      setPerformanceComparison(comparisonData);
      setCropPerformance(cropPerfData);
      setResourceUtilization(resourceData);
      setROIAnalysis(roiData);
      setSeasonalInsights(seasonalData);
      
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateYieldTrends = (): YieldTrendData[] => {
    const crops = ['Rice', 'Wheat', 'Sugarcane', 'Cotton'];
    const seasons: Array<'kharif' | 'rabi' | 'summer'> = ['kharif', 'rabi'];
    const trends: YieldTrendData[] = [];
    
    for (let year = 2021; year <= 2024; year++) {
      seasons.forEach(season => {
        crops.forEach(crop => {
          const expectedYield = crop === 'Rice' ? 25 : crop === 'Wheat' ? 30 : crop === 'Sugarcane' ? 80 : 20;
          const actualYield = expectedYield + (Math.random() - 0.5) * 8;
          const area = Math.random() * 2 + 1;
          const costPerAcre = crop === 'Rice' ? 35000 : crop === 'Wheat' ? 30000 : crop === 'Sugarcane' ? 50000 : 40000;
          const revenue = actualYield * area * (crop === 'Rice' ? 2000 : crop === 'Wheat' ? 2200 : crop === 'Sugarcane' ? 300 : 5000);
          const cost = costPerAcre * area;
          
          trends.push({
            year,
            season,
            crop,
            actualYield: Math.round(actualYield * 10) / 10,
            expectedYield,
            area: Math.round(area * 10) / 10,
            profit: Math.round(revenue - cost),
            profitPerAcre: Math.round((revenue - cost) / area),
            costPerAcre,
            yieldEfficiency: Math.round((actualYield / expectedYield) * 100)
          });
        });
      });
    }
    
    return trends;
  };

  const generatePerformanceComparison = (): PerformanceComparison[] => {
    return [
      {
        metric: 'Average Yield',
        myFarm: 28.5,
        localAverage: 25.2,
        stateAverage: 23.8,
        nationalAverage: 22.1,
        unit: 'quintals/acre',
        trend: 'up',
        ranking: {
          local: 8,
          state: 15,
          percentile: 85
        }
      },
      {
        metric: 'Profit per Acre',
        myFarm: 45000,
        localAverage: 38000,
        stateAverage: 35000,
        nationalAverage: 32000,
        unit: '₹',
        trend: 'up',
        ranking: {
          local: 5,
          state: 12,
          percentile: 78
        }
      },
      {
        metric: 'Cost Efficiency',
        myFarm: 85.2,
        localAverage: 78.5,
        stateAverage: 75.3,
        nationalAverage: 71.8,
        unit: '%',
        trend: 'up',
        ranking: {
          local: 6,
          state: 18,
          percentile: 82
        }
      },
      {
        metric: 'Water Use Efficiency',
        myFarm: 1.2,
        localAverage: 1.5,
        stateAverage: 1.8,
        nationalAverage: 2.1,
        unit: 'kg/m³',
        trend: 'up',
        ranking: {
          local: 12,
          state: 25,
          percentile: 75
        }
      }
    ];
  };

  const generateCropPerformance = (): CropPerformance[] => {
    const crops = ['Rice', 'Wheat', 'Sugarcane', 'Cotton'];
    
    return crops.map(crop => ({
      crop,
      variety: crop === 'Rice' ? 'IR-64' : crop === 'Wheat' ? 'PBW-343' : crop === 'Sugarcane' ? 'Co-0238' : 'Bt Cotton',
      totalSeasons: Math.floor(Math.random() * 6 + 8),
      averageYield: crop === 'Rice' ? 26.5 : crop === 'Wheat' ? 28.2 : crop === 'Sugarcane' ? 85.3 : 18.7,
      bestYield: crop === 'Rice' ? 32.1 : crop === 'Wheat' ? 35.8 : crop === 'Sugarcane' ? 95.2 : 24.3,
      worstYield: crop === 'Rice' ? 18.9 : crop === 'Wheat' ? 22.1 : crop === 'Sugarcane' ? 72.5 : 12.8,
      consistencyScore: Math.floor(Math.random() * 30 + 65),
      profitability: Math.floor(Math.random() * 20000 + 30000),
      riskLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
      recommendation: ['continue', 'optimize', 'consider-alternative'][Math.floor(Math.random() * 3)] as any,
      successRate: Math.floor(Math.random() * 25 + 70)
    }));
  };

  const generateResourceUtilization = (): ResourceUtilization[] => {
    const resources: Array<'water' | 'fertilizer' | 'labor' | 'machinery' | 'seeds' | 'pesticides'> = 
      ['water', 'fertilizer', 'labor', 'machinery', 'seeds', 'pesticides'];
    
    return resources.map(resource => {
      const totalUsed = Math.random() * 1000 + 500;
      const optimalUsage = totalUsed * (0.8 + Math.random() * 0.3);
      const efficiency = (optimalUsage / totalUsed) * 100;
      
      return {
        resource,
        totalUsed: Math.round(totalUsed),
        optimalUsage: Math.round(optimalUsage),
        efficiency: Math.round(efficiency),
        costPerUnit: Math.round(Math.random() * 50 + 10),
        totalCost: Math.round(totalUsed * (Math.random() * 50 + 10)),
        wastePercentage: Math.round((1 - efficiency / 100) * 100),
        improvementPotential: Math.round(Math.random() * 20 + 5),
        recommendations: getResourceRecommendations(resource)
      };
    });
  };

  const getResourceRecommendations = (resource: string): string[] => {
    const recommendations: { [key: string]: string[] } = {
      water: [
        'Install drip irrigation system',
        'Use mulching to reduce evaporation',
        'Monitor soil moisture regularly'
      ],
      fertilizer: [
        'Conduct regular soil testing',
        'Use precision application techniques',
        'Consider organic alternatives'
      ],
      labor: [
        'Mechanize repetitive tasks',
        'Provide skill training',
        'Optimize work scheduling'
      ],
      machinery: [
        'Regular maintenance scheduling',
        'Optimize field operations',
        'Consider equipment sharing'
      ],
      seeds: [
        'Use certified seeds',
        'Optimize planting density',
        'Consider hybrid varieties'
      ],
      pesticides: [
        'Implement IPM practices',
        'Use targeted applications',
        'Monitor pest thresholds'
      ]
    };
    
    return recommendations[resource] || [];
  };

  const generateROIAnalysis = (): ROIAnalysis[] => {
    return [
      {
        timeframe: 'year',
        period: '2023-24',
        totalInvestment: 250000,
        totalRevenue: 340000,
        netProfit: 90000,
        roi: 36,
        breakdownByCategory: [
          { category: 'Seeds', investment: 25000, returns: 45000, roi: 80 },
          { category: 'Fertilizers', investment: 60000, returns: 95000, roi: 58 },
          { category: 'Labor', investment: 80000, returns: 110000, roi: 38 },
          { category: 'Machinery', investment: 50000, returns: 60000, roi: 20 },
          { category: 'Others', investment: 35000, returns: 30000, roi: -14 }
        ],
        riskAdjustedROI: 28,
        comparisonWithAlternatives: [
          { alternative: 'Fixed Deposit', estimatedROI: 6.5 },
          { alternative: 'Mutual Funds', estimatedROI: 12 },
          { alternative: 'Gold', estimatedROI: 8 }
        ]
      }
    ];
  };

  const generateSeasonalInsights = (): SeasonalInsight[] => {
    const seasons: Array<'kharif' | 'rabi' | 'summer'> = ['kharif', 'rabi'];
    const insights: SeasonalInsight[] = [];
    
    for (let year = 2022; year <= 2024; year++) {
      seasons.forEach(season => {
        insights.push({
          season,
          year,
          totalProfit: Math.floor(Math.random() * 100000 + 150000),
          totalArea: Math.round((Math.random() * 3 + 3) * 10) / 10,
          averageYield: Math.round((Math.random() * 10 + 20) * 10) / 10,
          bestPerformingCrop: ['Rice', 'Wheat', 'Cotton'][Math.floor(Math.random() * 3)],
          worstPerformingCrop: ['Rice', 'Wheat', 'Cotton'][Math.floor(Math.random() * 3)],
          weatherImpact: ['positive', 'negative', 'neutral'][Math.floor(Math.random() * 3)] as any,
          marketConditions: ['favorable', 'challenging', 'mixed'][Math.floor(Math.random() * 3)] as any,
          keyLearnings: [
            'Early sowing improved yields',
            'Better pest management needed',
            'Market timing was crucial'
          ].slice(0, Math.floor(Math.random() * 2 + 1)),
          improvementAreas: [
            'Water management',
            'Nutrient optimization',
            'Technology adoption'
          ].slice(0, Math.floor(Math.random() * 2 + 1))
        });
      });
    }
    
    return insights;
  };

  const getPerformanceColor = (value: number, comparison: number): string => {
    if (value > comparison * 1.1) return 'text-green-600';
    if (value < comparison * 0.9) return 'text-red-600';
    return 'text-yellow-600';
  };

  const getPerformanceIcon = (value: number, comparison: number) => {
    if (value > comparison * 1.1) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (value < comparison * 0.9) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <span className="h-4 w-4 text-yellow-600">→</span>;
  };

  const getRecommendationColor = (recommendation: string): string => {
    switch (recommendation) {
      case 'continue': return 'bg-green-100 text-green-800';
      case 'optimize': return 'bg-yellow-100 text-yellow-800';
      case 'consider-alternative': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics & Insights</h2>
          <p className="text-gray-600">Comprehensive analysis of your farming performance</p>
        </div>
        
        <div className="flex space-x-2">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1year">Last 1 Year</SelectItem>
              <SelectItem value="3years">Last 3 Years</SelectItem>
              <SelectItem value="5years">Last 5 Years</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedCrop} onValueChange={setSelectedCrop}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Crop" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Crops</SelectItem>
              <SelectItem value="rice">Rice</SelectItem>
              <SelectItem value="wheat">Wheat</SelectItem>
              <SelectItem value="sugarcane">Sugarcane</SelectItem>
              <SelectItem value="cotton">Cotton</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Yield Trends</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
          <TabsTrigger value="crops">Crop Analysis</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="roi">ROI Analysis</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg Yield</p>
                    <p className="text-2xl font-bold">26.8</p>
                    <p className="text-xs text-green-600">+12% vs last year</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Profit</p>
                    <p className="text-2xl font-bold">₹2.8L</p>
                    <p className="text-xs text-green-600">+18% vs last year</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Efficiency</p>
                    <p className="text-2xl font-bold">85%</p>
                    <p className="text-xs text-yellow-600">+5% vs avg</p>
                  </div>
                  <Target className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Ranking</p>
                    <p className="text-2xl font-bold">Top 15%</p>
                    <p className="text-xs text-green-600">In your district</p>
                  </div>
                  <Award className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Summary */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Performance Highlights</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium text-green-800">Best Season</p>
                    <p className="text-sm text-green-700">Rabi 2023 - ₹1.2L profit</p>
                  </div>
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium text-blue-800">Top Performing Crop</p>
                    <p className="text-sm text-blue-700">Wheat - 28.5 quintals/acre</p>
                  </div>
                  <Leaf className="h-6 w-6 text-blue-600" />
                </div>
                
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div>
                    <p className="font-medium text-purple-800">Efficiency Leader</p>
                    <p className="text-sm text-purple-700">Water usage - 85% efficiency</p>
                  </div>
                  <Droplets className="h-6 w-6 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Improvement Opportunities</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="font-medium text-yellow-800">Labor Efficiency</p>
                    <p className="text-sm text-yellow-700">Can improve by 15% with mechanization</p>
                  </div>
                  <Users className="h-6 w-6 text-yellow-600" />
                </div>
                
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div>
                    <p className="font-medium text-orange-800">Fertilizer Usage</p>
                    <p className="text-sm text-orange-700">Reduce usage by 10% with soil testing</p>
                  </div>
                  <Zap className="h-6 w-6 text-orange-600" />
                </div>
                
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium text-red-800">Market Timing</p>
                    <p className="text-sm text-red-700">Better price realization possible</p>
                  </div>
                  <Calendar className="h-6 w-6 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Seasonal Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {seasonalInsights.slice(0, 3).map((insight, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium capitalize">{insight.season} {insight.year}</h4>
                      <Badge variant="outline">₹{(insight.totalProfit / 1000).toFixed(0)}K</Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Best crop:</span> {insight.bestPerformingCrop}</p>
                      <p><span className="font-medium">Avg yield:</span> {insight.averageYield} q/acre</p>
                      <p><span className="font-medium">Weather:</span> 
                        <Badge 
                          variant={insight.weatherImpact === 'positive' ? 'default' : 'destructive'}
                          className="ml-1 text-xs"
                        >
                          {insight.weatherImpact}
                        </Badge>
                      </p>
                    </div>
                    
                    {insight.keyLearnings.length > 0 && (
                      <div className="mt-3 p-2 bg-gray-50 rounded text-xs">
                        <p className="font-medium">Key Learning:</p>
                        <p>{insight.keyLearnings[0]}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Yield Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Yield Trends Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-center text-gray-600 py-12">
                  Interactive yield trend charts will be implemented here showing:
                  <br />• Year-over-year yield comparisons
                  <br />• Seasonal performance patterns
                  <br />• Crop-wise trend analysis
                  <br />• Efficiency metrics over time
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Comparison Tab */}
        <TabsContent value="comparison" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance vs Peers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {performanceComparison.map((metric, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h4 className="font-medium">{metric.metric}</h4>
                        <p className="text-sm text-gray-600">Your ranking: Top {metric.ranking.percentile}%</p>
                      </div>
                      {getPerformanceIcon(metric.myFarm, metric.localAverage)}
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div className="text-center">
                        <p className="font-bold text-green-600">{metric.myFarm.toLocaleString()}</p>
                        <p className="text-gray-600">Your Farm</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold">{metric.localAverage.toLocaleString()}</p>
                        <p className="text-gray-600">Local Avg</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold">{metric.stateAverage.toLocaleString()}</p>
                        <p className="text-gray-600">State Avg</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold">{metric.nationalAverage.toLocaleString()}</p>
                        <p className="text-gray-600">National Avg</p>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>0</span>
                        <span>{metric.unit}</span>
                      </div>
                      <div className="relative">
                        <Progress 
                          value={(metric.myFarm / Math.max(metric.myFarm, metric.nationalAverage * 1.2)) * 100} 
                          className="h-2"
                        />
                        <div 
                          className="absolute top-0 w-0.5 h-2 bg-red-500"
                          style={{ left: `${(metric.localAverage / Math.max(metric.myFarm, metric.nationalAverage * 1.2)) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Crop Analysis Tab */}
        <TabsContent value="crops" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {cropPerformance.map((crop, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>{crop.crop}</CardTitle>
                      <p className="text-sm text-gray-600">{crop.variety}</p>
                    </div>
                    <Badge className={getRecommendationColor(crop.recommendation)}>
                      {crop.recommendation.replace('-', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Avg Yield</p>
                      <p className="font-bold">{crop.averageYield} q/acre</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Success Rate</p>
                      <p className="font-bold">{crop.successRate}%</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Profitability</p>
                      <p className="font-bold">₹{(crop.profitability / 1000).toFixed(0)}K/acre</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Risk Level</p>
                      <Badge 
                        variant={crop.riskLevel === 'low' ? 'default' : crop.riskLevel === 'medium' ? 'secondary' : 'destructive'}
                        className="text-xs"
                      >
                        {crop.riskLevel}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Consistency Score</span>
                      <span>{crop.consistencyScore}%</span>
                    </div>
                    <Progress value={crop.consistencyScore} className="h-2" />
                  </div>
                  
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span>Best yield:</span>
                      <span className="font-medium">{crop.bestYield} q/acre</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Worst yield:</span>
                      <span className="font-medium">{crop.worstYield} q/acre</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total seasons:</span>
                      <span className="font-medium">{crop.totalSeasons}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Resource Utilization Tab */}
        <TabsContent value="resources" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {resourceUtilization.map((resource, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="capitalize">{resource.resource} Utilization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Efficiency Score</p>
                      <p className="text-2xl font-bold">{resource.efficiency}%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Total Cost</p>
                      <p className="text-lg font-bold">₹{resource.totalCost.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Efficiency</span>
                      <span>{resource.efficiency}%</span>
                    </div>
                    <Progress value={resource.efficiency} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Used</p>
                      <p className="font-medium">{resource.totalUsed}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Optimal</p>
                      <p className="font-medium">{resource.optimalUsage}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Waste</p>
                      <p className="font-medium text-red-600">{resource.wastePercentage}%</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Savings Potential</p>
                      <p className="font-medium text-green-600">{resource.improvementPotential}%</p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Recommendations:</p>
                    <ul className="text-xs space-y-1">
                      {resource.recommendations.slice(0, 2).map((rec, idx) => (
                        <li key={idx} className="flex items-start space-x-1">
                          <span className="text-green-600">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ROI Analysis Tab */}
        <TabsContent value="roi" className="space-y-6">
          {roiAnalysis.map((roi, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>Return on Investment - {roi.period}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-gray-600">Total ROI</p>
                      <p className="text-3xl font-bold text-green-600">{roi.roi}%</p>
                      <p className="text-sm text-gray-600">₹{roi.netProfit.toLocaleString()} profit</p>
                    </div>
                    
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600">Risk Adjusted ROI</p>
                      <p className="text-2xl font-bold text-blue-600">{roi.riskAdjustedROI}%</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Investment Breakdown</h4>
                    <div className="space-y-2">
                      {roi.breakdownByCategory.map((cat, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm">
                          <span>{cat.category}</span>
                          <div className="text-right">
                            <span className={`font-medium ${cat.roi > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {cat.roi > 0 ? '+' : ''}{cat.roi}%
                            </span>
                            <br />
                            <span className="text-xs text-gray-600">₹{cat.investment.toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Comparison with Alternatives</h4>
                    <div className="space-y-2">
                      {roi.comparisonWithAlternatives.map((alt, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm">
                          <span>{alt.alternative}</span>
                          <span className="font-medium">{alt.estimatedROI}%</span>
                        </div>
                      ))}
                      <div className="pt-2 border-t">
                        <div className="flex justify-between items-center text-sm font-medium">
                          <span>Your Farm</span>
                          <span className="text-green-600">{roi.roi}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsInsights;