// Fields Management Component for CropYieldAI
// Comprehensive field management with multiple field support, crop monitoring, and planning

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  MapPin, 
  Plus, 
  Edit, 
  Eye, 
  Trash2, 
  Droplets,
  Thermometer,
  Leaf,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  Map,
  Beaker,
  Camera,
  Download
} from 'lucide-react';

// Import data services
import { satelliteDataService } from '@/lib/satellite-data';
import { weatherAPIService } from '@/lib/weather-api';

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
  cropHistory: CropHistory[];
  alerts: FieldAlert[];
  notes: FieldNote[];
}

export interface CropHistory {
  id: string;
  crop: string;
  variety: string;
  season: 'kharif' | 'rabi' | 'summer';
  year: number;
  plantingDate: Date;
  harvestDate: Date;
  yield: number;
  quality: 'poor' | 'average' | 'good' | 'excellent';
  profit: number;
  challenges: string[];
  successFactors: string[];
}

export interface FieldAlert {
  id: string;
  type: 'weather' | 'pest' | 'disease' | 'irrigation' | 'fertilizer' | 'general';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  dateCreated: Date;
  isResolved: boolean;
  resolvedDate?: Date;
  actionTaken?: string;
}

export interface FieldNote {
  id: string;
  date: Date;
  category: 'observation' | 'activity' | 'reminder' | 'measurement';
  title: string;
  content: string;
  images?: string[];
  tags: string[];
}

export interface FieldMonitoring {
  fieldId: string;
  ndviData: any;
  soilMoisture: any;
  cropHealth: any;
  growthStage: any;
  weatherData: any;
}

const FieldsManagement: React.FC = () => {
  const [fields, setFields] = useState<Field[]>([]);
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [fieldMonitoring, setFieldMonitoring] = useState<{ [fieldId: string]: FieldMonitoring }>({});
  const [activeTab, setActiveTab] = useState('overview');
  const [isAddFieldOpen, setIsAddFieldOpen] = useState(false);
  const [isEditFieldOpen, setIsEditFieldOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize fields data
  useEffect(() => {
    initializeFields();
  }, []);

  // Load monitoring data when selected field changes
  useEffect(() => {
    if (selectedField) {
      loadFieldMonitoring(selectedField.id);
    }
  }, [selectedField]);

  const initializeFields = async () => {
    try {
      setLoading(true);
      const fieldsData = getSimulatedFields();
      setFields(fieldsData);
      if (fieldsData.length > 0) {
        setSelectedField(fieldsData[0]);
      }
    } catch (error) {
      console.error('Failed to initialize fields:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFieldMonitoring = async (fieldId: string) => {
    const field = fields.find(f => f.id === fieldId);
    if (!field) return;

    try {
      const [ndviData, soilMoisture, cropHealth, growthStage, weatherData] = await Promise.all([
        satelliteDataService.getNDVIData(field.coordinates.latitude, field.coordinates.longitude),
        satelliteDataService.getSoilMoistureData(field.coordinates.latitude, field.coordinates.longitude),
        field.currentCrop ? 
          satelliteDataService.getCropHealthMetrics(fieldId, field.currentCrop, field.coordinates.latitude, field.coordinates.longitude) :
          Promise.resolve(null),
        field.currentCrop && field.plantingDate ?
          satelliteDataService.getGrowthStageData(fieldId, field.currentCrop, field.coordinates.latitude, field.coordinates.longitude, field.plantingDate) :
          Promise.resolve(null),
        weatherAPIService.getWeatherData(field.coordinates.latitude, field.coordinates.longitude)
      ]);

      setFieldMonitoring(prev => ({
        ...prev,
        [fieldId]: {
          fieldId,
          ndviData,
          soilMoisture,
          cropHealth,
          growthStage,
          weatherData
        }
      }));
    } catch (error) {
      console.error('Failed to load field monitoring data:', error);
    }
  };

  const getSimulatedFields = (): Field[] => {
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
          latitude: 26.4499,
          longitude: 80.3319
        },
        waterSource: 'canal',
        lastSoilTest: new Date('2024-03-01'),
        soilHealth: {
          ph: 6.8,
          nitrogen: 280,
          phosphorus: 25,
          potassium: 180,
          organicMatter: 1.8
        },
        cropHistory: generateCropHistory('field_001'),
        alerts: generateFieldAlerts('field_001'),
        notes: generateFieldNotes('field_001')
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
          latitude: 26.4489,
          longitude: 80.3329
        },
        waterSource: 'borewell',
        lastSoilTest: new Date('2024-02-15'),
        soilHealth: {
          ph: 7.2,
          nitrogen: 320,
          phosphorus: 30,
          potassium: 200,
          organicMatter: 2.1
        },
        cropHistory: generateCropHistory('field_002'),
        alerts: generateFieldAlerts('field_002'),
        notes: generateFieldNotes('field_002')
      },
      {
        id: 'field_003',
        name: 'पश्चिमी खेत (West Field)',
        area: 1.2,
        soilType: 'sandy',
        currentCrop: undefined,
        coordinates: {
          latitude: 26.4509,
          longitude: 80.3309
        },
        waterSource: 'rain-fed',
        lastSoilTest: new Date('2024-01-10'),
        soilHealth: {
          ph: 6.5,
          nitrogen: 220,
          phosphorus: 18,
          potassium: 150,
          organicMatter: 1.4
        },
        cropHistory: generateCropHistory('field_003'),
        alerts: [],
        notes: generateFieldNotes('field_003')
      }
    ];
  };

  const generateCropHistory = (fieldId: string): CropHistory[] => {
    const crops = ['Rice', 'Wheat', 'Sugarcane', 'Cotton'];
    const varieties = {
      'Rice': ['IR-64', 'Sona Masuri', 'Basmati'],
      'Wheat': ['PBW-343', 'HD-2967', 'WH-147'],
      'Sugarcane': ['Co-0238', 'Co-86032'],
      'Cotton': ['Bt Cotton', 'Desi Cotton']
    };
    
    const history: CropHistory[] = [];
    
    for (let year = 2021; year <= 2023; year++) {
      const crop = crops[Math.floor(Math.random() * crops.length)];
      const variety = varieties[crop as keyof typeof varieties][0];
      
      history.push({
        id: `history_${fieldId}_${year}`,
        crop,
        variety,
        season: 'kharif',
        year,
        plantingDate: new Date(year, 5, 15), // June 15
        harvestDate: new Date(year, 9, 15), // October 15
        yield: 20 + Math.random() * 15,
        quality: ['good', 'excellent', 'average'][Math.floor(Math.random() * 3)] as any,
        profit: 50000 + Math.random() * 30000,
        challenges: ['Pest attack', 'Irregular rainfall', 'Market price fluctuation'].slice(0, Math.floor(Math.random() * 2) + 1),
        successFactors: ['Good seed quality', 'Proper fertilization', 'Timely irrigation'].slice(0, Math.floor(Math.random() * 2) + 1)
      });
    }
    
    return history;
  };

  const generateFieldAlerts = (fieldId: string): FieldAlert[] => {
    const alertTypes = ['weather', 'pest', 'disease', 'irrigation', 'fertilizer'] as const;
    const severities = ['medium', 'high'] as const;
    
    return [
      {
        id: `alert_${fieldId}_1`,
        type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
        severity: severities[Math.floor(Math.random() * severities.length)],
        title: 'Water Stress Detected',
        description: 'Soil moisture levels are below optimal range. Consider irrigation.',
        dateCreated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        isResolved: false
      },
      {
        id: `alert_${fieldId}_2`,
        type: 'pest',
        severity: 'high',
        title: 'Pest Activity Increased',
        description: 'Brown plant hopper activity detected in nearby areas.',
        dateCreated: new Date(Date.now() - 24 * 60 * 60 * 1000),
        isResolved: false
      }
    ];
  };

  const generateFieldNotes = (fieldId: string): FieldNote[] => {
    return [
      {
        id: `note_${fieldId}_1`,
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        category: 'activity',
        title: 'Applied Fertilizer',
        content: 'Applied urea fertilizer @ 50kg/acre. Weather conditions were favorable.',
        tags: ['fertilizer', 'urea', 'nutrition']
      },
      {
        id: `note_${fieldId}_2`,
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        category: 'observation',
        title: 'Good Crop Stand',
        content: 'Observed uniform crop stand with healthy green color. No pest damage visible.',
        tags: ['observation', 'health', 'growth']
      }
    ];
  };

  const getSoilHealthScore = (soilHealth: Field['soilHealth']): number => {
    // Simplified soil health scoring
    const phScore = soilHealth.ph >= 6.0 && soilHealth.ph <= 7.5 ? 25 : 15;
    const nScore = soilHealth.nitrogen >= 250 ? 25 : 15;
    const pScore = soilHealth.phosphorus >= 20 ? 25 : 15;
    const kScore = soilHealth.potassium >= 150 ? 25 : 15;
    
    return phScore + nScore + pScore + kScore;
  };

  const getSoilHealthColor = (score: number): string => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGrowthProgress = (plantingDate?: Date, expectedHarvest?: Date): number => {
    if (!plantingDate || !expectedHarvest) return 0;
    
    const totalDays = expectedHarvest.getTime() - plantingDate.getTime();
    const elapsedDays = Date.now() - plantingDate.getTime();
    
    return Math.min(100, Math.max(0, (elapsedDays / totalDays) * 100));
  };

  const addField = (fieldData: Partial<Field>) => {
    const newField: Field = {
      id: `field_${Date.now()}`,
      name: fieldData.name || 'New Field',
      area: fieldData.area || 1,
      soilType: fieldData.soilType || 'loamy',
      coordinates: fieldData.coordinates || { latitude: 26.45, longitude: 80.33 },
      waterSource: fieldData.waterSource || 'rain-fed',
      soilHealth: fieldData.soilHealth || {
        ph: 6.5,
        nitrogen: 250,
        phosphorus: 20,
        potassium: 150,
        organicMatter: 1.5
      },
      cropHistory: [],
      alerts: [],
      notes: []
    };
    
    setFields(prev => [...prev, newField]);
    setIsAddFieldOpen(false);
  };

  const updateField = (fieldId: string, updates: Partial<Field>) => {
    setFields(prev => prev.map(field => 
      field.id === fieldId ? { ...field, ...updates } : field
    ));
    
    if (selectedField?.id === fieldId) {
      setSelectedField(prev => prev ? { ...prev, ...updates } : null);
    }
    
    setIsEditFieldOpen(false);
  };

  const deleteField = (fieldId: string) => {
    setFields(prev => prev.filter(field => field.id !== fieldId));
    
    if (selectedField?.id === fieldId) {
      setSelectedField(fields.find(f => f.id !== fieldId) || null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading fields...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Field Management</h2>
          <p className="text-gray-600">Monitor and manage all your agricultural fields</p>
        </div>
        
        <Dialog open={isAddFieldOpen} onOpenChange={setIsAddFieldOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Field
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Field</DialogTitle>
            </DialogHeader>
            <AddFieldForm onSubmit={addField} onCancel={() => setIsAddFieldOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Fields Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        {fields.map((field) => (
          <Card 
            key={field.id} 
            className={`cursor-pointer transition-all duration-200 ${
              selectedField?.id === field.id ? 'ring-2 ring-green-500 bg-green-50' : 'hover:shadow-md'
            }`}
            onClick={() => setSelectedField(field)}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{field.name}</CardTitle>
                  <p className="text-sm text-gray-600">{field.area} acres • {field.soilType} soil</p>
                </div>
                <div className="flex space-x-1">
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedField(field);
                      setIsEditFieldOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Are you sure you want to delete this field?')) {
                        deleteField(field.id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-3">
                {/* Current Crop */}
                <div>
                  <p className="text-sm font-medium text-gray-700">Current Crop</p>
                  {field.currentCrop ? (
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{field.currentCrop}</Badge>
                      {field.plantingDate && field.expectedHarvest && (
                        <div className="text-xs text-gray-600">
                          {Math.ceil((field.expectedHarvest.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days to harvest
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Fallow</p>
                  )}
                </div>

                {/* Growth Progress */}
                {field.currentCrop && field.plantingDate && field.expectedHarvest && (
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Growth Progress</span>
                      <span>{Math.round(getGrowthProgress(field.plantingDate, field.expectedHarvest))}%</span>
                    </div>
                    <Progress value={getGrowthProgress(field.plantingDate, field.expectedHarvest)} className="h-2" />
                  </div>
                )}

                {/* Soil Health Score */}
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Soil Health</span>
                    <span className={getSoilHealthColor(getSoilHealthScore(field.soilHealth))}>
                      {getSoilHealthScore(field.soilHealth)}/100
                    </span>
                  </div>
                </div>

                {/* Alerts */}
                {field.alerts.filter(a => !a.isResolved).length > 0 && (
                  <div className="flex items-center text-sm text-orange-600">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    <span>{field.alerts.filter(a => !a.isResolved).length} active alerts</span>
                  </div>
                )}

                {/* Water Source */}
                <div className="flex items-center text-sm text-gray-600">
                  <Droplets className="h-4 w-4 mr-1" />
                  <span className="capitalize">{field.waterSource.replace('-', ' ')}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected Field Details */}
      {selectedField && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl">{selectedField.name}</CardTitle>
                <p className="text-gray-600">
                  {selectedField.area} acres • {selectedField.soilType} soil • {selectedField.waterSource}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Map className="h-4 w-4 mr-2" />
                  View on Map
                </Button>
                <Button variant="outline" size="sm">
                  <Camera className="h-4 w-4 mr-2" />
                  Add Photo
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="alerts">Alerts</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="soil">Soil Health</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <FieldOverview field={selectedField} monitoring={fieldMonitoring[selectedField.id]} />
              </TabsContent>

              <TabsContent value="monitoring" className="mt-6">
                <FieldMonitoring field={selectedField} monitoring={fieldMonitoring[selectedField.id]} />
              </TabsContent>

              <TabsContent value="history" className="mt-6">
                <FieldHistory history={selectedField.cropHistory} />
              </TabsContent>

              <TabsContent value="alerts" className="mt-6">
                <FieldAlerts alerts={selectedField.alerts} fieldId={selectedField.id} />
              </TabsContent>

              <TabsContent value="notes" className="mt-6">
                <FieldNotes notes={selectedField.notes} fieldId={selectedField.id} />
              </TabsContent>

              <TabsContent value="soil" className="mt-6">
                <SoilHealthDetails soilHealth={selectedField.soilHealth} lastTestDate={selectedField.lastSoilTest} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Edit Field Dialog */}
      <Dialog open={isEditFieldOpen} onOpenChange={setIsEditFieldOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Field</DialogTitle>
          </DialogHeader>
          {selectedField && (
            <EditFieldForm 
              field={selectedField}
              onSubmit={(updates) => updateField(selectedField.id, updates)}
              onCancel={() => setIsEditFieldOpen(false)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Sub-components will be defined in separate files for better organization
const FieldOverview: React.FC<{ field: Field; monitoring?: FieldMonitoring }> = ({ field, monitoring }) => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardContent className="p-4">
          <p className="text-center text-gray-600">Field overview component will show current status, weather, and quick stats.</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <p className="text-center text-gray-600">Satellite imagery and NDVI data visualization will be shown here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

const FieldMonitoring: React.FC<{ field: Field; monitoring?: FieldMonitoring }> = ({ field, monitoring }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4">
          <p className="text-center text-gray-600">Real-time monitoring data including NDVI, soil moisture, crop health will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

const FieldHistory: React.FC<{ history: CropHistory[] }> = ({ history }) => {
  return (
    <div className="space-y-4">
      {history.map((record) => (
        <Card key={record.id}>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{record.crop} ({record.variety})</p>
                <p className="text-sm text-gray-600">{record.season} {record.year}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">₹{record.profit.toLocaleString()}</p>
                <p className="text-sm text-gray-600">{record.yield} quintals/acre</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const FieldAlerts: React.FC<{ alerts: FieldAlert[]; fieldId: string }> = ({ alerts, fieldId }) => {
  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <Card key={alert.id} className={`border-l-4 ${
          alert.severity === 'critical' ? 'border-l-red-500' :
          alert.severity === 'high' ? 'border-l-orange-500' :
          alert.severity === 'medium' ? 'border-l-yellow-500' : 'border-l-blue-500'
        }`}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{alert.title}</p>
                <p className="text-sm text-gray-600">{alert.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {alert.dateCreated.toLocaleDateString()}
                </p>
              </div>
              <Badge variant={alert.isResolved ? 'secondary' : 'destructive'}>
                {alert.isResolved ? 'Resolved' : alert.severity}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const FieldNotes: React.FC<{ notes: FieldNote[]; fieldId: string }> = ({ notes, fieldId }) => {
  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <Card key={note.id}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <p className="font-medium">{note.title}</p>
              <Badge variant="outline">{note.category}</Badge>
            </div>
            <p className="text-sm text-gray-600 mb-2">{note.content}</p>
            <div className="flex items-center justify-between">
              <div className="flex space-x-1">
                {note.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-gray-500">{note.date.toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const SoilHealthDetails: React.FC<{ soilHealth: Field['soilHealth']; lastTestDate?: Date }> = ({ soilHealth, lastTestDate }) => {
  const getParameterStatus = (value: number, parameter: string): 'good' | 'fair' | 'poor' => {
    const ranges = {
      ph: { good: [6.0, 7.5], fair: [5.5, 8.0] },
      nitrogen: { good: [250, Infinity], fair: [200, 250] },
      phosphorus: { good: [20, Infinity], fair: [15, 20] },
      potassium: { good: [150, Infinity], fair: [100, 150] },
      organicMatter: { good: [1.5, Infinity], fair: [1.0, 1.5] }
    };
    
    const range = ranges[parameter as keyof typeof ranges];
    if (value >= range.good[0] && value <= range.good[1]) return 'good';
    if (value >= range.fair[0] && value <= range.fair[1]) return 'fair';
    return 'poor';
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'fair': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Soil Health Analysis</h3>
        {lastTestDate && (
          <p className="text-sm text-gray-600">
            Last tested: {lastTestDate.toLocaleDateString()}
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Soil Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">pH Level</p>
                <p className="text-sm text-gray-600">Soil acidity/alkalinity</p>
              </div>
              <div className="text-right">
                <p className="font-bold">{soilHealth.ph}</p>
                <p className={`text-sm ${getStatusColor(getParameterStatus(soilHealth.ph, 'ph'))}`}>
                  {getParameterStatus(soilHealth.ph, 'ph').toUpperCase()}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Nitrogen (N)</p>
                <p className="text-sm text-gray-600">kg/hectare</p>
              </div>
              <div className="text-right">
                <p className="font-bold">{soilHealth.nitrogen}</p>
                <p className={`text-sm ${getStatusColor(getParameterStatus(soilHealth.nitrogen, 'nitrogen'))}`}>
                  {getParameterStatus(soilHealth.nitrogen, 'nitrogen').toUpperCase()}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Phosphorus (P)</p>
                <p className="text-sm text-gray-600">kg/hectare</p>
              </div>
              <div className="text-right">
                <p className="font-bold">{soilHealth.phosphorus}</p>
                <p className={`text-sm ${getStatusColor(getParameterStatus(soilHealth.phosphorus, 'phosphorus'))}`}>
                  {getParameterStatus(soilHealth.phosphorus, 'phosphorus').toUpperCase()}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Potassium (K)</p>
                <p className="text-sm text-gray-600">kg/hectare</p>
              </div>
              <div className="text-right">
                <p className="font-bold">{soilHealth.potassium}</p>
                <p className={`text-sm ${getStatusColor(getParameterStatus(soilHealth.potassium, 'potassium'))}`}>
                  {getParameterStatus(soilHealth.potassium, 'potassium').toUpperCase()}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Organic Matter</p>
                <p className="text-sm text-gray-600">percentage</p>
              </div>
              <div className="text-right">
                <p className="font-bold">{soilHealth.organicMatter}%</p>
                <p className={`text-sm ${getStatusColor(getParameterStatus(soilHealth.organicMatter, 'organicMatter'))}`}>
                  {getParameterStatus(soilHealth.organicMatter, 'organicMatter').toUpperCase()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm font-medium text-green-800">Nitrogen Management</p>
                <p className="text-sm text-green-700">
                  Apply urea fertilizer @ 50kg/acre during vegetative stage
                </p>
              </div>
              
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-800">Soil pH</p>
                <p className="text-sm text-blue-700">
                  pH level is optimal. Maintain with organic matter addition
                </p>
              </div>
              
              <div className="p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm font-medium text-yellow-800">Organic Matter</p>
                <p className="text-sm text-yellow-700">
                  Add compost or farmyard manure to improve soil structure
                </p>
              </div>
            </div>
            
            <Button className="w-full mt-4" variant="outline">
              <Beaker className="h-4 w-4 mr-2" />
              Schedule Soil Test
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Form components for adding/editing fields
const AddFieldForm: React.FC<{ onSubmit: (data: Partial<Field>) => void; onCancel: () => void }> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Field>>({
    name: '',
    area: 1,
    soilType: 'loamy',
    waterSource: 'rain-fed'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Field Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Enter field name"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="area">Area (acres)</Label>
        <Input
          id="area"
          type="number"
          step="0.1"
          value={formData.area}
          onChange={(e) => setFormData(prev => ({ ...prev, area: parseFloat(e.target.value) }))}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="soilType">Soil Type</Label>
        <Select value={formData.soilType} onValueChange={(value) => setFormData(prev => ({ ...prev, soilType: value as any }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="clay">Clay</SelectItem>
            <SelectItem value="sandy">Sandy</SelectItem>
            <SelectItem value="loamy">Loamy</SelectItem>
            <SelectItem value="black">Black</SelectItem>
            <SelectItem value="red">Red</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="waterSource">Water Source</Label>
        <Select value={formData.waterSource} onValueChange={(value) => setFormData(prev => ({ ...prev, waterSource: value as any }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rain-fed">Rain Fed</SelectItem>
            <SelectItem value="irrigation">Irrigation</SelectItem>
            <SelectItem value="borewell">Borewell</SelectItem>
            <SelectItem value="canal">Canal</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Add Field
        </Button>
      </div>
    </form>
  );
};

const EditFieldForm: React.FC<{ field: Field; onSubmit: (data: Partial<Field>) => void; onCancel: () => void }> = ({ field, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Field>>({
    name: field.name,
    area: field.area,
    soilType: field.soilType,
    waterSource: field.waterSource
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Field Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="area">Area (acres)</Label>
        <Input
          id="area"
          type="number"
          step="0.1"
          value={formData.area}
          onChange={(e) => setFormData(prev => ({ ...prev, area: parseFloat(e.target.value) }))}
          required
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Update Field
        </Button>
      </div>
    </form>
  );
};

export default FieldsManagement;