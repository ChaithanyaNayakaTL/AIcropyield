// Export & Sharing Tools for CropYieldAI
// Farm reports, prediction sharing, bank documentation, and insurance support

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  FileText,
  Download,
  Share2,
  Send,
  Mail,
  MessageCircle,
  Printer,
  Save,
  Upload,
  Link,
  Copy,
  Calendar,
  Building2,
  Shield,
  CreditCard,
  PieChart,
  BarChart3,
  TrendingUp,
  Users,
  MapPin,
  Phone,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Clock,
  Eye,
  ThumbsUp,
  Bookmark,
  Filter,
  Settings,
  Edit,
  Trash2,
  Plus
} from 'lucide-react';

export interface FarmReport {
  id: string;
  title: string;
  type: 'comprehensive' | 'financial' | 'production' | 'compliance' | 'custom';
  description: string;
  sections: {
    farmProfile: boolean;
    fieldDetails: boolean;
    cropHistory: boolean;
    yieldAnalysis: boolean;
    financialSummary: boolean;
    inputUsage: boolean;
    weatherImpact: boolean;
    governmentSchemes: boolean;
    recommendations: boolean;
    futureProjections: boolean;
  };
  format: 'pdf' | 'excel' | 'word' | 'html';
  dateRange: {
    from: string;
    to: string;
  };
  generatedDate: string;
  status: 'generating' | 'ready' | 'shared' | 'expired';
  downloadUrl?: string;
  shareCount: number;
  size: string;
  validity: string; // validity period
}

export interface SharedPrediction {
  id: string;
  title: string;
  description: string;
  predictionType: 'yield' | 'weather' | 'market' | 'pest-disease' | 'soil-health';
  data: {
    crop: string;
    field: string;
    season: string;
    predictedValue: number;
    confidence: number;
    factors: string[];
    recommendations: string[];
  };
  sharedWith: {
    type: 'family' | 'advisor' | 'bank' | 'insurance' | 'public';
    contacts: Array<{
      name: string;
      email?: string;
      phone?: string;
      relation: string;
    }>;
  };
  privacy: 'private' | 'family' | 'community' | 'public';
  createdDate: string;
  expiryDate?: string;
  views: number;
  downloads: number;
  feedback: Array<{
    user: string;
    comment: string;
    rating: number;
    date: string;
  }>;
}

export interface BankDocument {
  id: string;
  documentType: 'loan-application' | 'income-proof' | 'asset-valuation' | 'crop-insurance' | 'subsidy-certificate';
  title: string;
  description: string;
  bankName: string;
  loanAmount?: number;
  purpose: string;
  sections: {
    personalDetails: boolean;
    farmDetails: boolean;
    incomeStatement: boolean;
    assetDetails: boolean;
    cropPlan: boolean;
    repaymentCapacity: boolean;
    collateralDetails: boolean;
    governmentSchemes: boolean;
  };
  supportingDocuments: Array<{
    name: string;
    type: string;
    required: boolean;
    status: 'pending' | 'uploaded' | 'verified';
  }>;
  generatedDate: string;
  status: 'draft' | 'ready' | 'submitted' | 'approved' | 'rejected';
  submissionDate?: string;
  validUntil: string;
}

export interface InsuranceClaim {
  id: string;
  claimType: 'crop-loss' | 'weather-damage' | 'pest-disease' | 'natural-calamity';
  title: string;
  description: string;
  policyNumber: string;
  insuranceCompany: string;
  incidentDate: string;
  reportedDate: string;
  affectedCrop: string;
  affectedArea: number; // in acres
  estimatedLoss: number;
  claimAmount: number;
  evidenceDocuments: Array<{
    type: 'photo' | 'video' | 'report' | 'certificate';
    name: string;
    description: string;
    uploadDate: string;
    verified: boolean;
  }>;
  status: 'submitted' | 'under-review' | 'assessment-pending' | 'approved' | 'rejected' | 'settled';
  assessmentReport?: {
    assessorName: string;
    visitDate: string;
    findings: string;
    recommendedAmount: number;
    comments: string;
  };
  timeline: Array<{
    date: string;
    status: string;
    description: string;
    updatedBy: string;
  }>;
}

const ExportSharingTools: React.FC = () => {
  const [farmReports, setFarmReports] = useState<FarmReport[]>([]);
  const [sharedPredictions, setSharedPredictions] = useState<SharedPrediction[]>([]);
  const [bankDocuments, setBankDocuments] = useState<BankDocument[]>([]);
  const [insuranceClaims, setInsuranceClaims] = useState<InsuranceClaim[]>([]);
  const [activeTab, setActiveTab] = useState('reports');
  const [loading, setLoading] = useState(true);
  
  // Report generation state
  const [newReport, setNewReport] = useState({
    title: '',
    type: 'comprehensive' as const,
    format: 'pdf' as const,
    dateRange: {
      from: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      to: new Date().toISOString().split('T')[0]
    },
    sections: {
      farmProfile: true,
      fieldDetails: true,
      cropHistory: true,
      yieldAnalysis: true,
      financialSummary: true,
      inputUsage: true,
      weatherImpact: true,
      governmentSchemes: true,
      recommendations: true,
      futureProjections: true
    }
  });

  // Sharing state
  const [shareModal, setShareModal] = useState({
    isOpen: false,
    type: '',
    id: '',
    title: ''
  });

  useEffect(() => {
    initializeExportData();
  }, []);

  const initializeExportData = async () => {
    try {
      setLoading(true);
      
      // Generate mock data
      const reportsData = generateFarmReports();
      const predictionsData = generateSharedPredictions();
      const documentsData = generateBankDocuments();
      const claimsData = generateInsuranceClaims();
      
      setFarmReports(reportsData);
      setSharedPredictions(predictionsData);
      setBankDocuments(documentsData);
      setInsuranceClaims(claimsData);
      
    } catch (error) {
      console.error('Failed to load export data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateFarmReports = (): FarmReport[] => {
    return [
      {
        id: '1',
        title: 'Annual Farm Performance Report 2023-24',
        type: 'comprehensive',
        description: 'Complete analysis of farm performance including yield, financial summary, and recommendations',
        sections: {
          farmProfile: true,
          fieldDetails: true,
          cropHistory: true,
          yieldAnalysis: true,
          financialSummary: true,
          inputUsage: true,
          weatherImpact: true,
          governmentSchemes: true,
          recommendations: true,
          futureProjections: true
        },
        format: 'pdf',
        dateRange: {
          from: '2023-04-01',
          to: '2024-03-31'
        },
        generatedDate: '2024-01-15T10:30:00Z',
        status: 'ready',
        downloadUrl: '/reports/annual-2023-24.pdf',
        shareCount: 5,
        size: '2.3 MB',
        validity: '6 months'
      },
      {
        id: '2',
        title: 'Kharif Season Financial Report',
        type: 'financial',
        description: 'Financial performance analysis for Kharif 2023 season',
        sections: {
          farmProfile: true,
          fieldDetails: false,
          cropHistory: true,
          yieldAnalysis: true,
          financialSummary: true,
          inputUsage: true,
          weatherImpact: false,
          governmentSchemes: true,
          recommendations: true,
          futureProjections: false
        },
        format: 'excel',
        dateRange: {
          from: '2023-06-01',
          to: '2023-11-30'
        },
        generatedDate: '2024-01-10T14:20:00Z',
        status: 'shared',
        shareCount: 12,
        size: '1.8 MB',
        validity: '3 months'
      }
    ];
  };

  const generateSharedPredictions = (): SharedPrediction[] => {
    return [
      {
        id: '1',
        title: 'Wheat Yield Prediction - Rabi 2024',
        description: 'AI-powered yield prediction for wheat crop based on current conditions',
        predictionType: 'yield',
        data: {
          crop: 'Wheat',
          field: 'Field A (5.5 acres)',
          season: 'Rabi 2024',
          predictedValue: 28.5,
          confidence: 85,
          factors: ['Favorable weather', 'Optimal soil conditions', 'Good irrigation'],
          recommendations: ['Continue current practices', 'Monitor for rust disease', 'Plan timely harvest']
        },
        sharedWith: {
          type: 'family',
          contacts: [
            { name: 'Vikash Kumar', email: 'vikash@email.com', relation: 'Son' },
            { name: 'Priya Sharma', phone: '+91-9876543210', relation: 'Agricultural Advisor' }
          ]
        },
        privacy: 'family',
        createdDate: '2024-01-12T09:15:00Z',
        views: 15,
        downloads: 3,
        feedback: [
          {
            user: 'Vikash Kumar',
            comment: 'Very helpful for planning',
            rating: 5,
            date: '2024-01-13T10:00:00Z'
          }
        ]
      }
    ];
  };

  const generateBankDocuments = (): BankDocument[] => {
    return [
      {
        id: '1',
        documentType: 'loan-application',
        title: 'Crop Loan Application - SBI',
        description: 'Loan application for crop cultivation and farm equipment purchase',
        bankName: 'State Bank of India',
        loanAmount: 500000,
        purpose: 'Crop cultivation and tractor purchase',
        sections: {
          personalDetails: true,
          farmDetails: true,
          incomeStatement: true,
          assetDetails: true,
          cropPlan: true,
          repaymentCapacity: true,
          collateralDetails: true,
          governmentSchemes: true
        },
        supportingDocuments: [
          { name: 'Aadhaar Card', type: 'identity', required: true, status: 'verified' },
          { name: 'Land Records', type: 'property', required: true, status: 'verified' },
          { name: 'Income Certificate', type: 'financial', required: true, status: 'uploaded' },
          { name: 'Crop Insurance Policy', type: 'insurance', required: false, status: 'pending' }
        ],
        generatedDate: '2024-01-10T11:30:00Z',
        status: 'submitted',
        submissionDate: '2024-01-12T16:45:00Z',
        validUntil: '2024-04-12T00:00:00Z'
      }
    ];
  };

  const generateInsuranceClaims = (): InsuranceClaim[] => {
    return [
      {
        id: '1',
        claimType: 'weather-damage',
        title: 'Hailstorm Damage Claim - Cotton Crop',
        description: 'Crop damage due to unexpected hailstorm in cotton field',
        policyNumber: 'PMF1234567890',
        insuranceCompany: 'Agriculture Insurance Company of India',
        incidentDate: '2024-01-05T00:00:00Z',
        reportedDate: '2024-01-06T10:30:00Z',
        affectedCrop: 'Cotton',
        affectedArea: 3.5,
        estimatedLoss: 150000,
        claimAmount: 120000,
        evidenceDocuments: [
          {
            type: 'photo',
            name: 'Field damage photos',
            description: '15 photos showing hail damage to cotton plants',
            uploadDate: '2024-01-06T14:20:00Z',
            verified: true
          },
          {
            type: 'report',
            name: 'Weather report',
            description: 'Official weather report from meteorological department',
            uploadDate: '2024-01-07T09:15:00Z',
            verified: true
          }
        ],
        status: 'assessment-pending',
        assessmentReport: {
          assessorName: 'Dr. Rajesh Kumar',
          visitDate: '2024-01-08T11:00:00Z',
          findings: 'Significant damage observed in 3.2 acres due to hailstorm. Loss estimated at 60%',
          recommendedAmount: 95000,
          comments: 'Damage is consistent with hailstorm. Recommend partial settlement.'
        },
        timeline: [
          {
            date: '2024-01-06T10:30:00Z',
            status: 'Claim Reported',
            description: 'Initial claim submission',
            updatedBy: 'System'
          },
          {
            date: '2024-01-07T14:45:00Z',
            status: 'Documents Uploaded',
            description: 'All required documents submitted',
            updatedBy: 'Farmer'
          },
          {
            date: '2024-01-08T16:30:00Z',
            status: 'Assessment Completed',
            description: 'Field assessment completed by surveyor',
            updatedBy: 'Dr. Rajesh Kumar'
          }
        ]
      }
    ];
  };

  const handleGenerateReport = () => {
    const reportId = Date.now().toString();
    const report: FarmReport = {
      id: reportId,
      title: newReport.title || `Farm Report - ${new Date().toLocaleDateString()}`,
      type: newReport.type,
      description: `${newReport.type.charAt(0).toUpperCase() + newReport.type.slice(1)} farm report`,
      sections: newReport.sections,
      format: newReport.format,
      dateRange: newReport.dateRange,
      generatedDate: new Date().toISOString(),
      status: 'generating',
      shareCount: 0,
      size: '0 MB',
      validity: '6 months'
    };

    setFarmReports(prev => [report, ...prev]);
    
    // Simulate report generation
    setTimeout(() => {
      setFarmReports(prev => 
        prev.map(r => 
          r.id === reportId 
            ? { ...r, status: 'ready' as const, downloadUrl: `/reports/${reportId}.${newReport.format}`, size: '2.1 MB' }
            : r
        )
      );
    }, 3000);
  };

  const handleShareItem = (type: string, id: string, title: string) => {
    setShareModal({ isOpen: true, type, id, title });
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'ready': case 'approved': case 'verified': case 'settled': return 'bg-green-100 text-green-800';
      case 'generating': case 'under-review': case 'assessment-pending': return 'bg-yellow-100 text-yellow-800';
      case 'shared': case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'rejected': case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'comprehensive': return <FileText className="h-4 w-4" />;
      case 'financial': return <PieChart className="h-4 w-4" />;
      case 'production': return <BarChart3 className="h-4 w-4" />;
      case 'compliance': return <Shield className="h-4 w-4" />;
      case 'yield': return <TrendingUp className="h-4 w-4" />;
      case 'weather': return <Calendar className="h-4 w-4" />;
      case 'loan-application': return <CreditCard className="h-4 w-4" />;
      case 'crop-loss': return <AlertCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading export tools...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Export & Sharing</h2>
          <p className="text-gray-600">Generate reports, share predictions, and manage documents</p>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="reports">Farm Reports</TabsTrigger>
          <TabsTrigger value="predictions">Share Predictions</TabsTrigger>
          <TabsTrigger value="banking">Bank Documents</TabsTrigger>
          <TabsTrigger value="insurance">Insurance Claims</TabsTrigger>
        </TabsList>

        {/* Farm Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          {/* Report Generator */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Generate New Report</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Report Title</label>
                    <Input
                      placeholder="Enter report title"
                      value={newReport.title}
                      onChange={(e) => setNewReport(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Report Type</label>
                      <Select value={newReport.type} onValueChange={(value: any) => setNewReport(prev => ({ ...prev, type: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="comprehensive">Comprehensive</SelectItem>
                          <SelectItem value="financial">Financial</SelectItem>
                          <SelectItem value="production">Production</SelectItem>
                          <SelectItem value="compliance">Compliance</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Format</label>
                      <Select value={newReport.format} onValueChange={(value: any) => setNewReport(prev => ({ ...prev, format: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pdf">PDF</SelectItem>
                          <SelectItem value="excel">Excel</SelectItem>
                          <SelectItem value="word">Word</SelectItem>
                          <SelectItem value="html">HTML</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">From Date</label>
                      <Input
                        type="date"
                        value={newReport.dateRange.from}
                        onChange={(e) => setNewReport(prev => ({ 
                          ...prev, 
                          dateRange: { ...prev.dateRange, from: e.target.value }
                        }))}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">To Date</label>
                      <Input
                        type="date"
                        value={newReport.dateRange.to}
                        onChange={(e) => setNewReport(prev => ({ 
                          ...prev, 
                          dateRange: { ...prev.dateRange, to: e.target.value }
                        }))}
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-3">Include Sections</label>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {Object.entries(newReport.sections).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox
                          id={key}
                          checked={value}
                          onCheckedChange={(checked) => 
                            setNewReport(prev => ({
                              ...prev,
                              sections: { ...prev.sections, [key]: checked as boolean }
                            }))
                          }
                        />
                        <label htmlFor={key} className="text-sm capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <Button onClick={handleGenerateReport} className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </CardContent>
          </Card>

          {/* Generated Reports */}
          <div className="space-y-4">
            {farmReports.map((report) => (
              <Card key={report.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className={getStatusColor(report.status)}>
                          {report.status === 'generating' && <Clock className="h-3 w-3 mr-1 animate-spin" />}
                          {report.status}
                        </Badge>
                        <Badge variant="outline" className="flex items-center space-x-1">
                          {getTypeIcon(report.type)}
                          <span className="capitalize">{report.type}</span>
                        </Badge>
                        <Badge variant="secondary">{report.format.toUpperCase()}</Badge>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                      <p className="text-gray-600 mb-2">{report.description}</p>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Period:</span>
                          <p className="font-medium">
                            {new Date(report.dateRange.from).toLocaleDateString()} - {new Date(report.dateRange.to).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Size:</span>
                          <p className="font-medium">{report.size}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Shares:</span>
                          <p className="font-medium">{report.shareCount}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm text-gray-500">
                      Generated: {new Date(report.generatedDate).toLocaleDateString()}
                      <span className="ml-4">Valid until: {report.validity}</span>
                    </div>
                    
                    <div className="flex space-x-2">
                      {report.status === 'ready' && (
                        <>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                          <Button size="sm" onClick={() => handleShareItem('report', report.id, report.title)}>
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </Button>
                        </>
                      )}
                      {report.status === 'generating' && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4 animate-spin" />
                          <span>Generating...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Share Predictions Tab */}
        <TabsContent value="predictions" className="space-y-6">
          <Button className="mb-4">
            <Plus className="h-4 w-4 mr-2" />
            Share New Prediction
          </Button>
          
          <div className="space-y-4">
            {sharedPredictions.map((prediction) => (
              <Card key={prediction.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className="bg-blue-100 text-blue-800">
                          {getTypeIcon(prediction.predictionType)}
                          <span className="ml-1 capitalize">{prediction.predictionType.replace('-', ' ')}</span>
                        </Badge>
                        <Badge variant="outline" className="capitalize">{prediction.privacy}</Badge>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900">{prediction.title}</h3>
                      <p className="text-gray-600 mb-3">{prediction.description}</p>
                      
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Crop:</span>
                            <span className="font-medium">{prediction.data.crop}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Field:</span>
                            <span className="font-medium">{prediction.data.field}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Season:</span>
                            <span className="font-medium">{prediction.data.season}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Predicted Value:</span>
                            <span className="font-bold text-green-600">{prediction.data.predictedValue} quintals/acre</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Confidence:</span>
                            <span className="font-medium">{prediction.data.confidence}%</span>
                          </div>
                          <div>
                            <Progress value={prediction.data.confidence} className="h-2" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Shared with:</p>
                        <div className="flex flex-wrap gap-2">
                          {prediction.sharedWith.contacts.map((contact, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {contact.name} ({contact.relation})
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>{prediction.views} views</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Download className="h-4 w-4" />
                        <span>{prediction.downloads} downloads</span>
                      </div>
                      <span>Shared: {new Date(prediction.createdDate).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button size="sm" onClick={() => handleShareItem('prediction', prediction.id, prediction.title)}>
                        <Share2 className="h-4 w-4 mr-2" />
                        Share More
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Bank Documents Tab */}
        <TabsContent value="banking" className="space-y-6">
          <Button className="mb-4">
            <Plus className="h-4 w-4 mr-2" />
            Create Bank Document
          </Button>
          
          <div className="space-y-4">
            {bankDocuments.map((document) => (
              <Card key={document.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className={getStatusColor(document.status)}>
                          {document.status}
                        </Badge>
                        <Badge variant="outline" className="flex items-center space-x-1">
                          {getTypeIcon(document.documentType)}
                          <span className="capitalize">{document.documentType.replace('-', ' ')}</span>
                        </Badge>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900">{document.title}</h3>
                      <p className="text-gray-600 mb-2">{document.description}</p>
                      
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <span className="text-gray-600">Bank:</span>
                          <p className="font-medium">{document.bankName}</p>
                        </div>
                        {document.loanAmount && (
                          <div>
                            <span className="text-gray-600">Loan Amount:</span>
                            <p className="font-medium text-green-600">₹{document.loanAmount.toLocaleString()}</p>
                          </div>
                        )}
                        <div>
                          <span className="text-gray-600">Purpose:</span>
                          <p className="font-medium">{document.purpose}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Valid Until:</span>
                          <p className="font-medium">{new Date(document.validUntil).toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Supporting Documents:</p>
                        <div className="grid grid-cols-2 gap-2">
                          {document.supportingDocuments.map((doc, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <span className="text-sm">{doc.name}</span>
                              <Badge className={getStatusColor(doc.status)}>
                                {doc.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm text-gray-500">
                      Generated: {new Date(document.generatedDate).toLocaleDateString()}
                      {document.submissionDate && (
                        <span className="ml-4">Submitted: {new Date(document.submissionDate).toLocaleDateString()}</span>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      {document.status === 'draft' && (
                        <Button size="sm">
                          <Send className="h-4 w-4 mr-2" />
                          Submit
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Insurance Claims Tab */}
        <TabsContent value="insurance" className="space-y-6">
          <Button className="mb-4">
            <Plus className="h-4 w-4 mr-2" />
            File New Claim
          </Button>
          
          <div className="space-y-4">
            {insuranceClaims.map((claim) => (
              <Card key={claim.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className={getStatusColor(claim.status)}>
                          {claim.status.replace('-', ' ')}
                        </Badge>
                        <Badge variant="outline" className="flex items-center space-x-1">
                          {getTypeIcon(claim.claimType)}
                          <span className="capitalize">{claim.claimType.replace('-', ' ')}</span>
                        </Badge>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900">{claim.title}</h3>
                      <p className="text-gray-600 mb-3">{claim.description}</p>
                      
                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <span className="text-gray-600">Policy Number:</span>
                          <p className="font-medium">{claim.policyNumber}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Insurance Company:</span>
                          <p className="font-medium">{claim.insuranceCompany}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Affected Crop:</span>
                          <p className="font-medium">{claim.affectedCrop}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Affected Area:</span>
                          <p className="font-medium">{claim.affectedArea} acres</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Estimated Loss:</span>
                          <p className="font-medium text-red-600">₹{claim.estimatedLoss.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Claim Amount:</span>
                          <p className="font-medium text-green-600">₹{claim.claimAmount.toLocaleString()}</p>
                        </div>
                      </div>
                      
                      {claim.assessmentReport && (
                        <div className="p-3 bg-blue-50 rounded-lg mb-4">
                          <h4 className="font-medium text-blue-800 mb-2">Assessment Report</h4>
                          <p className="text-sm text-blue-700">{claim.assessmentReport.findings}</p>
                          <p className="text-sm text-blue-600 mt-1">
                            Recommended Amount: ₹{claim.assessmentReport.recommendedAmount.toLocaleString()}
                          </p>
                        </div>
                      )}
                      
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Timeline:</p>
                        <div className="space-y-2">
                          {claim.timeline.slice(0, 3).map((event, index) => (
                            <div key={index} className="flex items-center space-x-3 text-sm">
                              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                              <span className="text-gray-600">{new Date(event.date).toLocaleDateString()}</span>
                              <span className="font-medium">{event.status}</span>
                              <span className="text-gray-500">- {event.description}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm text-gray-500">
                      Incident: {new Date(claim.incidentDate).toLocaleDateString()}
                      <span className="ml-4">Reported: {new Date(claim.reportedDate).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Documents
                      </Button>
                      <Button size="sm">
                        <Phone className="h-4 w-4 mr-2" />
                        Contact Support
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Share Modal (placeholder) */}
      {shareModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Share {shareModal.title}</h3>
            <p className="text-gray-600 mb-4">Choose how you want to share this item:</p>
            
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Mail className="h-4 w-4 mr-3" />
                Share via Email
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageCircle className="h-4 w-4 mr-3" />
                Share via WhatsApp
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Link className="h-4 w-4 mr-3" />
                Copy Link
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-3" />
                Download & Share
              </Button>
            </div>
            
            <div className="flex space-x-2 mt-6">
              <Button variant="outline" onClick={() => setShareModal({ isOpen: false, type: '', id: '', title: '' })}>
                Cancel
              </Button>
              <Button className="flex-1">
                Share Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportSharingTools;