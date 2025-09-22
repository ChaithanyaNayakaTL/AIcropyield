// Government Integration Hub for CropYieldAI
// Scheme eligibility, subsidy calculator, insurance guidance, and DBT status

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
import { 
  Building2,
  Calculator,
  Shield,
  CreditCard,
  FileText,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  Users,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  Download,
  Upload,
  Search,
  Filter,
  RefreshCw,
  DollarSign,
  Percent,
  TrendingUp,
  Award,
  Leaf,
  Droplets,
  Zap,
  Tractor,
  Home,
  Banknote
} from 'lucide-react';

export interface GovernmentScheme {
  id: string;
  name: string;
  nameHindi: string;
  description: string;
  department: string;
  category: 'subsidy' | 'insurance' | 'loan' | 'training' | 'infrastructure' | 'direct-benefit' | 'input-support';
  benefitType: 'financial' | 'technical' | 'equipment' | 'training' | 'insurance';
  eligibility: {
    farmSize: { min: number; max: number }; // in acres
    income: { max: number }; // annual income limit
    landOwnership: 'owner' | 'tenant' | 'both';
    crops: string[];
    states: string[];
    categories: string[]; // SC/ST/OBC/General
    gender: 'all' | 'women' | 'men';
    age: { min: number; max: number };
  };
  benefits: {
    amount: number;
    percentage?: number;
    maxAmount?: number;
    paymentMode: 'direct-transfer' | 'subsidy' | 'reimbursement';
    paymentSchedule: 'lump-sum' | 'installments' | 'seasonal';
  };
  applicationProcess: {
    isOnline: boolean;
    documents: string[];
    authority: string;
    processingTime: string;
    applicationFee: number;
  };
  status: 'active' | 'suspended' | 'closed' | 'upcoming';
  deadline?: string;
  website: string;
  helpline: string;
  lastUpdated: string;
}

export interface SubsidyCalculation {
  schemeId: string;
  schemeName: string;
  farmSize: number;
  cropType: string;
  investmentAmount: number;
  calculatedSubsidy: number;
  eligibilityScore: number; // 0-100
  requiredDocuments: string[];
  estimatedProcessingTime: string;
  nextSteps: string[];
}

export interface InsurancePolicy {
  id: string;
  name: string;
  provider: 'government' | 'private';
  type: 'crop' | 'livestock' | 'equipment' | 'life' | 'weather';
  coverage: {
    crops: string[];
    risks: string[];
    sumInsured: { min: number; max: number };
    premiumRate: number; // percentage
    governmentSubsidy: number; // percentage
  };
  premiumCalculation: {
    basePremium: number;
    farmerShare: number;
    governmentShare: number;
    stateShare: number;
  };
  claims: {
    process: string[];
    documentsRequired: string[];
    assessmentTime: string;
    settlementTime: string;
  };
  enrollment: {
    period: string;
    cutoffDate: string;
    isAutoRenewal: boolean;
  };
  benefits: string[];
  contact: {
    phone: string;
    email: string;
    website: string;
  };
}

export interface DBTStatus {
  beneficiaryId: string;
  farmerName: string;
  accountNumber: string;
  ifscCode: string;
  aadhaarNumber: string;
  transactions: {
    id: string;
    scheme: string;
    amount: number;
    date: string;
    status: 'pending' | 'processed' | 'failed' | 'reversed';
    utrnNumber?: string;
    remarks?: string;
  }[];
  totalReceived: number;
  pendingAmount: number;
  kycStatus: 'verified' | 'pending' | 'rejected';
  eKycDate?: string;
  beneficiaryStatus: 'active' | 'inactive' | 'blocked';
}

const GovernmentIntegration: React.FC = () => {
  const [schemes, setSchemes] = useState<GovernmentScheme[]>([]);
  const [subsidyCalculations, setSubsidyCalculations] = useState<SubsidyCalculation[]>([]);
  const [insurancePolicies, setInsurancePolicies] = useState<InsurancePolicy[]>([]);
  const [dbtStatus, setDBTStatus] = useState<DBTStatus | null>(null);
  const [eligibleSchemes, setEligibleSchemes] = useState<GovernmentScheme[]>([]);
  const [activeTab, setActiveTab] = useState('schemes');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [farmerProfile, setFarmerProfile] = useState({
    farmSize: 5,
    annualIncome: 250000,
    landOwnership: 'owner' as const,
    crops: ['Rice', 'Wheat'],
    state: 'Punjab',
    category: 'General',
    gender: 'men' as const,
    age: 35
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeGovernmentData();
  }, []);

  useEffect(() => {
    checkEligibility();
  }, [schemes, farmerProfile]);

  const initializeGovernmentData = async () => {
    try {
      setLoading(true);
      
      // Generate mock government data
      const schemesData = generateGovernmentSchemes();
      const insuranceData = generateInsurancePolicies();
      const dbtData = generateDBTStatus();
      
      setSchemes(schemesData);
      setInsurancePolicies(insuranceData);
      setDBTStatus(dbtData);
      
    } catch (error) {
      console.error('Failed to load government data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateGovernmentSchemes = (): GovernmentScheme[] => {
    return [
      {
        id: 'pmkisan',
        name: 'PM-KISAN Samman Nidhi',
        nameHindi: 'प्रधानमंत्री किसान सम्मान निधि',
        description: 'Direct income support of ₹6000 per year to all farmer families having cultivable land holding.',
        department: 'Ministry of Agriculture & Farmers Welfare',
        category: 'direct-benefit',
        benefitType: 'financial',
        eligibility: {
          farmSize: { min: 0, max: 1000 },
          income: { max: 1000000 },
          landOwnership: 'both',
          crops: [],
          states: ['All'],
          categories: ['General', 'SC', 'ST', 'OBC'],
          gender: 'all',
          age: { min: 18, max: 100 }
        },
        benefits: {
          amount: 6000,
          paymentMode: 'direct-transfer',
          paymentSchedule: 'installments'
        },
        applicationProcess: {
          isOnline: true,
          documents: ['Aadhaar', 'Bank Account', 'Land Records'],
          authority: 'Agriculture Department',
          processingTime: '30 days',
          applicationFee: 0
        },
        status: 'active',
        website: 'https://pmkisan.gov.in',
        helpline: '011-24300606',
        lastUpdated: '2024-01-15T00:00:00Z'
      },
      {
        id: 'kisancredit',
        name: 'Kisan Credit Card',
        nameHindi: 'किसान क्रेडिट कार्ड',
        description: 'Flexible credit facility for cultivation and other needs of farmers at subsidized interest rates.',
        department: 'Ministry of Agriculture & Farmers Welfare',
        category: 'loan',
        benefitType: 'financial',
        eligibility: {
          farmSize: { min: 0.5, max: 1000 },
          income: { max: 500000 },
          landOwnership: 'both',
          crops: [],
          states: ['All'],
          categories: ['General', 'SC', 'ST', 'OBC'],
          gender: 'all',
          age: { min: 18, max: 75 }
        },
        benefits: {
          amount: 300000,
          percentage: 7,
          paymentMode: 'direct-transfer',
          paymentSchedule: 'seasonal'
        },
        applicationProcess: {
          isOnline: true,
          documents: ['Aadhaar', 'Bank Account', 'Land Records', 'Income Certificate'],
          authority: 'Cooperative Banks/Commercial Banks',
          processingTime: '15 days',
          applicationFee: 0
        },
        status: 'active',
        website: 'https://pmkisan.gov.in/KCC.aspx',
        helpline: '1800-180-1551',
        lastUpdated: '2024-01-15T00:00:00Z'
      },
      {
        id: 'pmfby',
        name: 'Pradhan Mantri Fasal Bima Yojana',
        nameHindi: 'प्रधानमंत्री फसल बीमा योजना',
        description: 'Comprehensive crop insurance scheme providing coverage against yield losses due to natural calamities.',
        department: 'Ministry of Agriculture & Farmers Welfare',
        category: 'insurance',
        benefitType: 'insurance',
        eligibility: {
          farmSize: { min: 0, max: 1000 },
          income: { max: 1000000 },
          landOwnership: 'both',
          crops: ['Rice', 'Wheat', 'Cotton', 'Sugarcane', 'Maize'],
          states: ['All'],
          categories: ['General', 'SC', 'ST', 'OBC'],
          gender: 'all',
          age: { min: 18, max: 100 }
        },
        benefits: {
          amount: 200000,
          percentage: 2,
          paymentMode: 'reimbursement',
          paymentSchedule: 'seasonal'
        },
        applicationProcess: {
          isOnline: true,
          documents: ['Aadhaar', 'Bank Account', 'Land Records', 'Sowing Certificate'],
          authority: 'Insurance Companies',
          processingTime: '7 days',
          applicationFee: 0
        },
        status: 'active',
        website: 'https://pmfby.gov.in',
        helpline: '14447',
        lastUpdated: '2024-01-15T00:00:00Z'
      },
      {
        id: 'pmkusum',
        name: 'PM-KUSUM Solar Pump Scheme',
        nameHindi: 'प्रधानमंत्री कुसुम योजना',
        description: 'Installation of solar pumps and grid connected solar power plants for farmers.',
        department: 'Ministry of New and Renewable Energy',
        category: 'subsidy',
        benefitType: 'equipment',
        eligibility: {
          farmSize: { min: 1, max: 1000 },
          income: { max: 500000 },
          landOwnership: 'owner',
          crops: [],
          states: ['All'],
          categories: ['General', 'SC', 'ST', 'OBC'],
          gender: 'all',
          age: { min: 18, max: 100 }
        },
        benefits: {
          amount: 175000,
          percentage: 60,
          paymentMode: 'subsidy',
          paymentSchedule: 'lump-sum'
        },
        applicationProcess: {
          isOnline: true,
          documents: ['Aadhaar', 'Bank Account', 'Land Records', 'Electricity Connection'],
          authority: 'State Renewable Energy Agencies',
          processingTime: '45 days',
          applicationFee: 500
        },
        status: 'active',
        website: 'https://pmkusum.mnre.gov.in',
        helpline: '011-24363071',
        lastUpdated: '2024-01-15T00:00:00Z'
      }
    ];
  };

  const generateInsurancePolicies = (): InsurancePolicy[] => {
    return [
      {
        id: 'pmfby-crop',
        name: 'PM Fasal Bima Yojana - Crop Insurance',
        provider: 'government',
        type: 'crop',
        coverage: {
          crops: ['Rice', 'Wheat', 'Cotton', 'Sugarcane', 'Pulses', 'Oilseeds'],
          risks: ['Drought', 'Flood', 'Pest Attack', 'Disease', 'Fire', 'Hailstorm'],
          sumInsured: { min: 10000, max: 200000 },
          premiumRate: 2,
          governmentSubsidy: 95
        },
        premiumCalculation: {
          basePremium: 4000,
          farmerShare: 200,
          governmentShare: 1900,
          stateShare: 1900
        },
        claims: {
          process: ['Crop loss intimation', 'Yield assessment', 'Claim calculation', 'Payment'],
          documentsRequired: ['Land records', 'Bank account', 'Aadhaar', 'Sowing certificate'],
          assessmentTime: '15 days',
          settlementTime: '30 days'
        },
        enrollment: {
          period: 'Kharif: June-July, Rabi: October-December',
          cutoffDate: '31st July (Kharif), 31st December (Rabi)',
          isAutoRenewal: false
        },
        benefits: [
          'Coverage from sowing to harvesting',
          'Premium subsidy up to 95%',
          'Quick claim settlement',
          'Technology-enabled yield assessment'
        ],
        contact: {
          phone: '14447',
          email: 'support@pmfby.gov.in',
          website: 'https://pmfby.gov.in'
        }
      }
    ];
  };

  const generateDBTStatus = (): DBTStatus => {
    return {
      beneficiaryId: 'UP1234567890',
      farmerName: 'राम प्रकाश शर्मा',
      accountNumber: '1234567890',
      ifscCode: 'SBIN0001234',
      aadhaarNumber: '1234-5678-9012',
      transactions: [
        {
          id: 'TXN001',
          scheme: 'PM-KISAN (Installment 1)',
          amount: 2000,
          date: '2024-01-15T00:00:00Z',
          status: 'processed',
          utrnNumber: 'UTR123456789',
          remarks: 'Successfully transferred'
        },
        {
          id: 'TXN002',
          scheme: 'PM-KISAN (Installment 2)',
          amount: 2000,
          date: '2024-01-10T00:00:00Z',
          status: 'processed',
          utrnNumber: 'UTR123456788'
        },
        {
          id: 'TXN003',
          scheme: 'Crop Insurance Claim',
          amount: 15000,
          date: '2024-01-05T00:00:00Z',
          status: 'pending',
          remarks: 'Under verification'
        }
      ],
      totalReceived: 4000,
      pendingAmount: 15000,
      kycStatus: 'verified',
      eKycDate: '2023-03-15T00:00:00Z',
      beneficiaryStatus: 'active'
    };
  };

  const checkEligibility = () => {
    const eligible = schemes.filter(scheme => {
      const farmSizeEligible = farmerProfile.farmSize >= scheme.eligibility.farmSize.min && 
                              farmerProfile.farmSize <= scheme.eligibility.farmSize.max;
      const incomeEligible = farmerProfile.annualIncome <= scheme.eligibility.income.max;
      const landOwnershipEligible = scheme.eligibility.landOwnership === 'both' || 
                                   scheme.eligibility.landOwnership === farmerProfile.landOwnership;
      const categoryEligible = scheme.eligibility.categories.includes(farmerProfile.category);
      const ageEligible = farmerProfile.age >= scheme.eligibility.age.min && 
                         farmerProfile.age <= scheme.eligibility.age.max;
      const genderEligible = scheme.eligibility.gender === 'all' || 
                            scheme.eligibility.gender === farmerProfile.gender;
      
      return farmSizeEligible && incomeEligible && landOwnershipEligible && 
             categoryEligible && ageEligible && genderEligible;
    });
    
    setEligibleSchemes(eligible);
  };

  const calculateSubsidy = (schemeId: string, investmentAmount: number): SubsidyCalculation | null => {
    const scheme = schemes.find(s => s.id === schemeId);
    if (!scheme) return null;
    
    let calculatedSubsidy = 0;
    if (scheme.benefits.percentage) {
      calculatedSubsidy = (investmentAmount * scheme.benefits.percentage) / 100;
      if (scheme.benefits.maxAmount) {
        calculatedSubsidy = Math.min(calculatedSubsidy, scheme.benefits.maxAmount);
      }
    } else {
      calculatedSubsidy = scheme.benefits.amount;
    }
    
    return {
      schemeId: scheme.id,
      schemeName: scheme.name,
      farmSize: farmerProfile.farmSize,
      cropType: farmerProfile.crops[0] || 'Mixed',
      investmentAmount,
      calculatedSubsidy,
      eligibilityScore: 85,
      requiredDocuments: scheme.applicationProcess.documents,
      estimatedProcessingTime: scheme.applicationProcess.processingTime,
      nextSteps: [
        'Gather required documents',
        'Visit online portal or nearest office',
        'Submit application with documents',
        'Track application status'
      ]
    };
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'processed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'suspended': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'subsidy': return <DollarSign className="h-4 w-4" />;
      case 'insurance': return <Shield className="h-4 w-4" />;
      case 'loan': return <CreditCard className="h-4 w-4" />;
      case 'training': return <Users className="h-4 w-4" />;
      case 'infrastructure': return <Building2 className="h-4 w-4" />;
      case 'direct-benefit': return <Banknote className="h-4 w-4" />;
      case 'input-support': return <Leaf className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading government schemes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Government Integration</h2>
          <p className="text-gray-600">Access schemes, subsidies, insurance and DBT services</p>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Eligible Schemes</p>
                <p className="text-2xl font-bold text-green-600">{eligibleSchemes.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">DBT Received</p>
                <p className="text-2xl font-bold text-blue-600">₹{dbtStatus?.totalReceived?.toLocaleString() || 0}</p>
              </div>
              <CreditCard className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Amount</p>
                <p className="text-2xl font-bold text-yellow-600">₹{dbtStatus?.pendingAmount?.toLocaleString() || 0}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">KYC Status</p>
                <p className="text-lg font-bold text-green-600">Verified</p>
              </div>
              <Shield className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="schemes">Schemes</TabsTrigger>
          <TabsTrigger value="calculator">Subsidy Calculator</TabsTrigger>
          <TabsTrigger value="insurance">Insurance</TabsTrigger>
          <TabsTrigger value="dbt">DBT Status</TabsTrigger>
        </TabsList>

        {/* Government Schemes Tab */}
        <TabsContent value="schemes" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search schemes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="direct-benefit">Direct Benefit</SelectItem>
                <SelectItem value="subsidy">Subsidies</SelectItem>
                <SelectItem value="insurance">Insurance</SelectItem>
                <SelectItem value="loan">Loans</SelectItem>
                <SelectItem value="training">Training</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Eligible Schemes */}
          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>You are eligible for {eligibleSchemes.length} schemes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {eligibleSchemes.slice(0, 4).map((scheme) => (
                  <div key={scheme.id} className="p-3 bg-white rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-green-100 text-green-800">Eligible</Badge>
                      <Badge variant="outline" className="flex items-center space-x-1">
                        {getCategoryIcon(scheme.category)}
                        <span className="capitalize">{scheme.category.replace('-', ' ')}</span>
                      </Badge>
                    </div>
                    <h4 className="font-medium text-gray-900">{scheme.nameHindi}</h4>
                    <p className="text-sm text-gray-600 mb-2">{scheme.name}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-green-600">
                        {scheme.benefits.amount 
                          ? `₹${scheme.benefits.amount.toLocaleString()}`
                          : `${scheme.benefits.percentage}% subsidy`
                        }
                      </span>
                      <Button size="sm">
                        Apply Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* All Schemes */}
          <div className="space-y-4">
            {schemes.map((scheme) => (
              <Card key={scheme.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className={getStatusColor(scheme.status)}>
                          {scheme.status}
                        </Badge>
                        <Badge variant="outline" className="flex items-center space-x-1">
                          {getCategoryIcon(scheme.category)}
                          <span className="capitalize">{scheme.category.replace('-', ' ')}</span>
                        </Badge>
                        {eligibleSchemes.some(s => s.id === scheme.id) && (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Eligible
                          </Badge>
                        )}
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900">{scheme.nameHindi}</h3>
                      <p className="text-sm text-gray-600 mb-2">{scheme.name}</p>
                      <p className="text-gray-700 mb-3">{scheme.description}</p>
                      
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-gray-900">Benefits</p>
                          <p className="text-green-600 font-bold">
                            {scheme.benefits.amount 
                              ? `₹${scheme.benefits.amount.toLocaleString()}`
                              : `${scheme.benefits.percentage}% subsidy`
                            }
                          </p>
                          <p className="text-xs text-gray-500">{scheme.benefits.paymentMode}</p>
                        </div>
                        
                        <div>
                          <p className="font-medium text-gray-900">Eligibility</p>
                          <p className="text-gray-600">
                            {scheme.eligibility.farmSize.min === 0 ? 'Any' : scheme.eligibility.farmSize.min} - {scheme.eligibility.farmSize.max} acres
                          </p>
                          <p className="text-xs text-gray-500">Max income: ₹{(scheme.eligibility.income.max / 100000).toFixed(1)}L</p>
                        </div>
                        
                        <div>
                          <p className="font-medium text-gray-900">Processing</p>
                          <p className="text-gray-600">{scheme.applicationProcess.processingTime}</p>
                          <p className="text-xs text-gray-500">{scheme.applicationProcess.authority}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Phone className="h-4 w-4" />
                        <span>{scheme.helpline}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Building2 className="h-4 w-4" />
                        <span>{scheme.department}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      {eligibleSchemes.some(s => s.id === scheme.id) && (
                        <Button size="sm">
                          <FileText className="h-4 w-4 mr-2" />
                          Apply Now
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Subsidy Calculator Tab */}
        <TabsContent value="calculator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calculator className="h-5 w-5" />
                <span>Subsidy Calculator</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Select Scheme</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a scheme" />
                      </SelectTrigger>
                      <SelectContent>
                        {eligibleSchemes.map((scheme) => (
                          <SelectItem key={scheme.id} value={scheme.id}>
                            {scheme.nameHindi}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Investment Amount (₹)</label>
                    <Input type="number" placeholder="Enter investment amount" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Crop Type</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select crop" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rice">Rice</SelectItem>
                        <SelectItem value="wheat">Wheat</SelectItem>
                        <SelectItem value="cotton">Cotton</SelectItem>
                        <SelectItem value="sugarcane">Sugarcane</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button className="w-full">
                    <Calculator className="h-4 w-4 mr-2" />
                    Calculate Subsidy
                  </Button>
                </div>
                
                <div className="p-6 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-4">Calculation Result</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Investment Amount:</span>
                      <span className="font-medium">₹0</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Subsidy Rate:</span>
                      <span className="font-medium">0%</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-green-600 pt-2 border-t">
                      <span>Calculated Subsidy:</span>
                      <span>₹0</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Your Investment:</span>
                      <span className="font-medium">₹0</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-blue-50 rounded">
                    <p className="text-sm text-blue-800">
                      <FileText className="h-4 w-4 inline mr-1" />
                      Select a scheme and enter investment amount to calculate subsidy
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insurance Tab */}
        <TabsContent value="insurance" className="space-y-6">
          {insurancePolicies.map((policy) => (
            <Card key={policy.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{policy.name}</CardTitle>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge className={policy.provider === 'government' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}>
                        {policy.provider}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {policy.type} insurance
                      </Badge>
                    </div>
                  </div>
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Coverage Details</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">Sum Insured:</span>
                        <span className="font-medium ml-2">
                          ₹{policy.coverage.sumInsured.min.toLocaleString()} - ₹{policy.coverage.sumInsured.max.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Premium Rate:</span>
                        <span className="font-medium ml-2">{policy.coverage.premiumRate}%</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Government Subsidy:</span>
                        <span className="font-medium ml-2 text-green-600">{policy.coverage.governmentSubsidy}%</span>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <p className="text-xs text-gray-600 mb-1">Covered Crops:</p>
                      <div className="flex flex-wrap gap-1">
                        {policy.coverage.crops.slice(0, 3).map((crop, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">{crop}</Badge>
                        ))}
                        {policy.coverage.crops.length > 3 && (
                          <Badge variant="secondary" className="text-xs">+{policy.coverage.crops.length - 3}</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Premium Breakdown</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Base Premium:</span>
                        <span className="font-medium">₹{policy.premiumCalculation.basePremium.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Farmer Share:</span>
                        <span className="font-medium text-orange-600">₹{policy.premiumCalculation.farmerShare.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Government Share:</span>
                        <span className="font-medium text-green-600">₹{policy.premiumCalculation.governmentShare.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>State Share:</span>
                        <span className="font-medium text-blue-600">₹{policy.premiumCalculation.stateShare.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 p-2 bg-green-50 rounded">
                      <p className="text-xs text-green-800">
                        You pay only ₹{policy.premiumCalculation.farmerShare.toLocaleString()} out of ₹{policy.premiumCalculation.basePremium.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Enrollment Info</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">Enrollment Period:</span>
                        <p className="font-medium">{policy.enrollment.period}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Cut-off Date:</span>
                        <p className="font-medium">{policy.enrollment.cutoffDate}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Assessment Time:</span>
                        <p className="font-medium">{policy.claims.assessmentTime}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Settlement Time:</span>
                        <p className="font-medium">{policy.claims.settlementTime}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Key Benefits</h4>
                  <ul className="grid md:grid-cols-2 gap-2 text-sm">
                    {policy.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <Phone className="h-4 w-4" />
                      <span>{policy.contact.phone}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Mail className="h-4 w-4" />
                      <span>{policy.contact.email}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Policy
                    </Button>
                    <Button size="sm">
                      <Shield className="h-4 w-4 mr-2" />
                      Enroll Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* DBT Status Tab */}
        <TabsContent value="dbt" className="space-y-6">
          {dbtStatus && (
            <>
              {/* Beneficiary Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5" />
                    <span>Beneficiary Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div>
                        <span className="text-gray-600">Beneficiary Name:</span>
                        <p className="font-medium">{dbtStatus.farmerName}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Beneficiary ID:</span>
                        <p className="font-medium">{dbtStatus.beneficiaryId}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Account Number:</span>
                        <p className="font-medium">****{dbtStatus.accountNumber.slice(-4)}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">IFSC Code:</span>
                        <p className="font-medium">{dbtStatus.ifscCode}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <span className="text-gray-600">Aadhaar Number:</span>
                        <p className="font-medium">{dbtStatus.aadhaarNumber}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">KYC Status:</span>
                        <Badge className={getStatusColor(dbtStatus.kycStatus)}>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {dbtStatus.kycStatus}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-gray-600">Beneficiary Status:</span>
                        <Badge className={getStatusColor(dbtStatus.beneficiaryStatus)}>
                          {dbtStatus.beneficiaryStatus}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-gray-600">eKYC Date:</span>
                        <p className="font-medium">
                          {dbtStatus.eKycDate ? new Date(dbtStatus.eKycDate).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Transaction Summary */}
              <div className="grid md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <DollarSign className="h-8 w-8 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold text-green-600">₹{dbtStatus.totalReceived.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Total Received</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Clock className="h-8 w-8 text-yellow-600" />
                    </div>
                    <p className="text-2xl font-bold text-yellow-600">₹{dbtStatus.pendingAmount.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Pending Amount</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <FileText className="h-8 w-8 text-blue-600" />
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{dbtStatus.transactions.length}</p>
                    <p className="text-sm text-gray-600">Total Transactions</p>
                  </CardContent>
                </Card>
              </div>

              {/* Transaction History */}
              <Card>
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dbtStatus.transactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className={`p-2 rounded-full ${getStatusColor(transaction.status).replace('text-', 'bg-').replace('800', '100')}`}>
                            {transaction.status === 'processed' && <CheckCircle className="h-4 w-4 text-green-600" />}
                            {transaction.status === 'pending' && <Clock className="h-4 w-4 text-yellow-600" />}
                            {transaction.status === 'failed' && <AlertCircle className="h-4 w-4 text-red-600" />}
                          </div>
                          
                          <div>
                            <p className="font-medium">{transaction.scheme}</p>
                            <p className="text-sm text-gray-600">
                              {new Date(transaction.date).toLocaleDateString()}
                              {transaction.utrnNumber && (
                                <span className="ml-2">• UTR: {transaction.utrnNumber}</span>
                              )}
                            </p>
                            {transaction.remarks && (
                              <p className="text-xs text-gray-500 mt-1">{transaction.remarks}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-bold text-lg">₹{transaction.amount.toLocaleString()}</p>
                          <Badge className={getStatusColor(transaction.status)}>
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GovernmentIntegration;