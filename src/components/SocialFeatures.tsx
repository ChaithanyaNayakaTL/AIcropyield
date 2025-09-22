// Social Features Platform for CropYieldAI
// Farmer community forum, success stories, expert advice, and knowledge sharing

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageCircle, 
  ThumbsUp, 
  ThumbsDown,
  Star,
  Award,
  Users,
  BookOpen,
  Send,
  Search,
  Filter,
  Pin,
  MoreVertical,
  Heart,
  Share2,
  Bookmark,
  Calendar,
  MapPin,
  Verified,
  TrendingUp,
  HelpCircle,
  CheckCircle,
  AlertCircle,
  Bell,
  Eye,
  Leaf
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    location: string;
    reputation: number;
    isExpert: boolean;
    joinDate: string;
    totalPosts: number;
  };
  category: 'general' | 'crops' | 'pest-disease' | 'weather' | 'market' | 'technology' | 'government';
  tags: string[];
  createdAt: string;
  updatedAt?: string;
  likes: number;
  dislikes: number;
  replies: number;
  views: number;
  isPinned: boolean;
  isSolved: boolean;
  hasImage: boolean;
  urgency: 'low' | 'medium' | 'high';
  language: 'hindi' | 'english';
}

export interface Reply {
  id: string;
  postId: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    location: string;
    reputation: number;
    isExpert: boolean;
  };
  createdAt: string;
  likes: number;
  dislikes: number;
  isAcceptedAnswer: boolean;
  hasImage: boolean;
}

export interface SuccessStory {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    location: string;
    farmSize: number;
    mainCrops: string[];
  };
  beforeAfter: {
    before: {
      yield: number;
      income: number;
      challenges: string[];
    };
    after: {
      yield: number;
      income: number;
      improvements: string[];
    };
  };
  techniques: string[];
  timeframe: string;
  category: 'yield-improvement' | 'cost-reduction' | 'technology-adoption' | 'organic-farming' | 'water-management';
  images: string[];
  createdAt: string;
  likes: number;
  bookmarks: number;
  shares: number;
  isVerified: boolean;
}

export interface ExpertAdvice {
  id: string;
  question: string;
  answer: string;
  expert: {
    id: string;
    name: string;
    avatar?: string;
    title: string;
    specialization: string[];
    experience: number;
    institution: string;
    credentials: string[];
    rating: number;
    totalAnswers: number;
  };
  category: 'crop-management' | 'soil-health' | 'pest-control' | 'irrigation' | 'fertilization' | 'market-advice';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  createdAt: string;
  helpful: number;
  views: number;
  isBookmarked: boolean;
  tags: string[];
}

export interface LocalGroup {
  id: string;
  name: string;
  description: string;
  location: {
    district: string;
    state: string;
    coordinates?: { lat: number; lng: number };
  };
  category: 'crop-specific' | 'technology' | 'organic' | 'women-farmers' | 'young-farmers' | 'general';
  members: number;
  admin: {
    id: string;
    name: string;
    avatar?: string;
  };
  isPrivate: boolean;
  createdAt: string;
  lastActivity: string;
  activeMembers: number;
  weeklyPosts: number;
  focusAreas: string[];
  meetingSchedule?: {
    frequency: 'weekly' | 'monthly' | 'seasonal';
    day: string;
    time: string;
    location: string;
  };
}

const SocialFeatures: React.FC = () => {
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
  const [successStories, setSuccessStories] = useState<SuccessStory[]>([]);
  const [expertAdvice, setExpertAdvice] = useState<ExpertAdvice[]>([]);
  const [localGroups, setLocalGroups] = useState<LocalGroup[]>([]);
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [activeTab, setActiveTab] = useState('forum');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeSocialData();
  }, []);

  const initializeSocialData = async () => {
    try {
      setLoading(true);
      
      // Generate mock social data
      const forumData = generateForumPosts();
      const storiesData = generateSuccessStories();
      const adviceData = generateExpertAdvice();
      const groupsData = generateLocalGroups();
      
      setForumPosts(forumData);
      setSuccessStories(storiesData);
      setExpertAdvice(adviceData);
      setLocalGroups(groupsData);
      
    } catch (error) {
      console.error('Failed to load social data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateForumPosts = (): ForumPost[] => {
    const authors = [
      { id: '1', name: 'राम प्रकाश शर्मा', location: 'Muzaffarnagar, UP', reputation: 850, isExpert: false, joinDate: '2022-03-15', totalPosts: 45 },
      { id: '2', name: 'Dr. Priya Patel', location: 'Anand, Gujarat', reputation: 1200, isExpert: true, joinDate: '2021-08-20', totalPosts: 89 },
      { id: '3', name: 'विकास कुमार', location: 'Ludhiana, Punjab', reputation: 650, isExpert: false, joinDate: '2023-01-10', totalPosts: 32 },
      { id: '4', name: 'Sunita Devi', location: 'Nashik, Maharashtra', reputation: 720, isExpert: false, joinDate: '2022-07-05', totalPosts: 56 }
    ];
    
    const posts: ForumPost[] = [
      {
        id: '1',
        title: 'गेहूं में पीला रतुआ रोग का उपचार',
        content: 'मेरे गेहूं के खेत में पीला रतुआ रोग दिखाई दे रहा है। कृपया बताएं कि इसका बेहतर उपचार क्या है? क्या प्रोपिकोनाजोल का छिड़काव करना चाहिए?',
        author: authors[0],
        category: 'pest-disease',
        tags: ['गेहूं', 'पीला रतुआ', 'रोग', 'उपचार'],
        createdAt: '2024-01-15T10:30:00Z',
        likes: 12,
        dislikes: 1,
        replies: 8,
        views: 156,
        isPinned: false,
        isSolved: true,
        hasImage: true,
        urgency: 'high',
        language: 'hindi'
      },
      {
        id: '2',
        title: 'Best variety of rice for Punjab region?',
        content: 'I am planning to cultivate rice this kharif season in Punjab. Which variety gives better yield and is resistant to diseases? Also suggest about water management.',
        author: authors[2],
        category: 'crops',
        tags: ['rice', 'variety', 'punjab', 'kharif'],
        createdAt: '2024-01-14T14:20:00Z',
        likes: 18,
        dislikes: 0,
        replies: 12,
        views: 234,
        isPinned: true,
        isSolved: false,
        hasImage: false,
        urgency: 'medium',
        language: 'english'
      },
      {
        id: '3',
        title: 'ड्रिप सिंचाई से कितनी पानी की बचत होती है?',
        content: 'मैं अपने खेत में ड्रिप इरिगेशन लगवाने की सोच रहा हूं। किसी ने इसका इस्तेमाल किया है? कितनी पानी की बचत होती है और लागत कितनी आती है?',
        author: authors[3],
        category: 'technology',
        tags: ['ड्रिप सिंचाई', 'पानी की बचत', 'लागत'],
        createdAt: '2024-01-13T09:15:00Z',
        likes: 25,
        dislikes: 2,
        replies: 15,
        views: 289,
        isPinned: false,
        isSolved: false,
        hasImage: false,
        urgency: 'low',
        language: 'hindi'
      },
      {
        id: '4',
        title: 'Cotton market prices - when to sell?',
        content: 'Cotton prices are fluctuating a lot this season. I have harvested my cotton but confused about when to sell. Should I wait for better prices or sell now?',
        author: authors[0],
        category: 'market',
        tags: ['cotton', 'market', 'prices', 'selling'],
        createdAt: '2024-01-12T16:45:00Z',
        likes: 8,
        dislikes: 0,
        replies: 6,
        views: 98,
        isPinned: false,
        isSolved: false,
        hasImage: false,
        urgency: 'medium',
        language: 'english'
      }
    ];
    
    return posts;
  };

  const generateSuccessStories = (): SuccessStory[] => {
    return [
      {
        id: '1',
        title: 'From Traditional to Precision Farming: 300% Increase in Profits',
        content: 'After adopting precision farming techniques and soil testing, I was able to triple my profits in just 2 years. Here\'s my complete journey...',
        author: {
          id: '1',
          name: 'Rajesh Kumar',
          location: 'Hisar, Haryana',
          farmSize: 5.5,
          mainCrops: ['Wheat', 'Rice', 'Cotton']
        },
        beforeAfter: {
          before: {
            yield: 18.5,
            income: 180000,
            challenges: ['Low yields', 'High input costs', 'Pest problems']
          },
          after: {
            yield: 28.2,
            income: 540000,
            improvements: ['Precision farming', 'Soil health management', 'IPM practices']
          }
        },
        techniques: ['Soil testing', 'Variable rate fertilization', 'Drip irrigation', 'IPM'],
        timeframe: '2 years',
        category: 'yield-improvement',
        images: ['before-field.jpg', 'after-field.jpg', 'equipment.jpg'],
        createdAt: '2024-01-10T12:00:00Z',
        likes: 156,
        bookmarks: 89,
        shares: 45,
        isVerified: true
      },
      {
        id: '2',
        title: 'Organic Farming Success: Chemical-Free and Profitable',
        content: 'Switched to organic farming 3 years ago. Initially had losses but now earning more than conventional farming with premium prices...',
        author: {
          id: '2',
          name: 'Priya Sharma',
          location: 'Nashik, Maharashtra',
          farmSize: 3.2,
          mainCrops: ['Grapes', 'Pomegranate', 'Vegetables']
        },
        beforeAfter: {
          before: {
            yield: 12.5,
            income: 125000,
            challenges: ['Chemical dependency', 'Soil degradation', 'Health concerns']
          },
          after: {
            yield: 15.8,
            income: 285000,
            improvements: ['Organic certification', 'Premium prices', 'Better soil health']
          }
        },
        techniques: ['Vermicomposting', 'Bio-pesticides', 'Crop rotation', 'Green manuring'],
        timeframe: '3 years',
        category: 'organic-farming',
        images: ['organic-field.jpg', 'compost.jpg', 'certification.jpg'],
        createdAt: '2024-01-08T15:30:00Z',
        likes: 198,
        bookmarks: 134,
        shares: 78,
        isVerified: true
      }
    ];
  };

  const generateExpertAdvice = (): ExpertAdvice[] => {
    return [
      {
        id: '1',
        question: 'What is the ideal time for wheat sowing in North India?',
        answer: 'For North India, the optimal wheat sowing time is from November 1st to November 25th. Early sowing (before November 1st) may lead to pest problems, while late sowing (after December 1st) reduces yield potential. The ideal soil temperature should be 18-20°C at 5cm depth.',
        expert: {
          id: '1',
          name: 'Dr. R.K. Singh',
          title: 'Senior Agronomist',
          specialization: ['Wheat', 'Rice', 'Crop Management'],
          experience: 25,
          institution: 'IARI, New Delhi',
          credentials: ['PhD Agronomy', 'ICAR Scientist'],
          rating: 4.8,
          totalAnswers: 234
        },
        category: 'crop-management',
        difficulty: 'beginner',
        createdAt: '2024-01-15T09:00:00Z',
        helpful: 156,
        views: 890,
        isBookmarked: false,
        tags: ['wheat', 'sowing', 'timing', 'north-india']
      },
      {
        id: '2',
        question: 'How to manage iron deficiency in rice crops?',
        answer: 'Iron deficiency in rice appears as yellowing of young leaves. Management includes: 1) Foliar spray of FeSO4 (2-3%), 2) Soil application of iron chelates, 3) Proper water management to avoid waterlogging, 4) Use of organic matter to improve soil structure.',
        expert: {
          id: '2',
          name: 'Dr. Meera Patel',
          title: 'Soil Health Specialist',
          specialization: ['Soil Health', 'Nutrient Management', 'Rice'],
          experience: 18,
          institution: 'IRRI, Philippines',
          credentials: ['PhD Soil Science', 'CGIAR Researcher'],
          rating: 4.9,
          totalAnswers: 189
        },
        category: 'soil-health',
        difficulty: 'intermediate',
        createdAt: '2024-01-14T11:15:00Z',
        helpful: 89,
        views: 456,
        isBookmarked: true,
        tags: ['rice', 'iron-deficiency', 'nutrient', 'management']
      }
    ];
  };

  const generateLocalGroups = (): LocalGroup[] => {
    return [
      {
        id: '1',
        name: 'पंजाब राइस ग्रोअर्स एसोसिएशन',
        description: 'Punjab के चावल किसानों का समुदाय। नई तकनीक, बाजार की जानकारी और सरकारी योजनाओं की चर्चा।',
        location: {
          district: 'Ludhiana',
          state: 'Punjab'
        },
        category: 'crop-specific',
        members: 1247,
        admin: {
          id: '1',
          name: 'गुरदीप सिंह'
        },
        isPrivate: false,
        createdAt: '2022-05-15T00:00:00Z',
        lastActivity: '2024-01-15T08:30:00Z',
        activeMembers: 345,
        weeklyPosts: 28,
        focusAreas: ['Rice cultivation', 'Water management', 'Market prices'],
        meetingSchedule: {
          frequency: 'monthly',
          day: 'Saturday',
          time: '10:00 AM',
          location: 'Community Center, Ludhiana'
        }
      },
      {
        id: '2',
        name: 'महाराष्ट्र महिला किसान संघ',
        description: 'महाराष्ट्र की महिला किसानों का सशक्तिकरण और ज्ञान साझाकरण समुदाय।',
        location: {
          district: 'Pune',
          state: 'Maharashtra'
        },
        category: 'women-farmers',
        members: 892,
        admin: {
          id: '2',
          name: 'सुनीता देवी'
        },
        isPrivate: false,
        createdAt: '2022-08-20T00:00:00Z',
        lastActivity: '2024-01-14T16:45:00Z',
        activeMembers: 234,
        weeklyPosts: 19,
        focusAreas: ['Women empowerment', 'Organic farming', 'Self-help groups'],
        meetingSchedule: {
          frequency: 'weekly',
          day: 'Thursday',
          time: '2:00 PM',
          location: 'Various villages'
        }
      },
      {
        id: '3',
        name: 'Digital Farming Youth Group',
        description: 'Young farmers embracing technology and modern farming practices. Share experiences about apps, sensors, and smart farming.',
        location: {
          district: 'Hyderabad',
          state: 'Telangana'
        },
        category: 'young-farmers',
        members: 567,
        admin: {
          id: '3',
          name: 'Arjun Reddy'
        },
        isPrivate: false,
        createdAt: '2023-02-10T00:00:00Z',
        lastActivity: '2024-01-15T14:20:00Z',
        activeMembers: 189,
        weeklyPosts: 35,
        focusAreas: ['Technology adoption', 'Precision farming', 'Startup ideas']
      }
    ];
  };

  const handleLike = (postId: string) => {
    setForumPosts(posts => 
      posts.map(post => 
        post.id === postId 
          ? { ...post, likes: post.likes + 1 }
          : post
      )
    );
  };

  const handleReply = (postId: string, content: string) => {
    // In a real app, this would send the reply to the backend
    console.log('Replying to post:', postId, 'with content:', content);
  };

  const handleCreatePost = () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) return;
    
    const newPost: ForumPost = {
      id: Date.now().toString(),
      title: newPostTitle,
      content: newPostContent,
      author: {
        id: 'current-user',
        name: 'आप',
        location: 'Your Location',
        reputation: 0,
        isExpert: false,
        joinDate: new Date().toISOString(),
        totalPosts: 1
      },
      category: 'general',
      tags: [],
      createdAt: new Date().toISOString(),
      likes: 0,
      dislikes: 0,
      replies: 0,
      views: 0,
      isPinned: false,
      isSolved: false,
      hasImage: false,
      urgency: 'medium',
      language: 'hindi'
    };
    
    setForumPosts(posts => [newPost, ...posts]);
    setNewPostTitle('');
    setNewPostContent('');
  };

  const filteredPosts = forumPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getUrgencyColor = (urgency: string): string => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'crops': return <Leaf className="h-4 w-4" />;
      case 'pest-disease': return <AlertCircle className="h-4 w-4" />;
      case 'weather': return <Calendar className="h-4 w-4" />;
      case 'market': return <TrendingUp className="h-4 w-4" />;
      case 'technology': return <BookOpen className="h-4 w-4" />;
      case 'government': return <CheckCircle className="h-4 w-4" />;
      default: return <MessageCircle className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading social features...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Community Hub</h2>
          <p className="text-gray-600">Connect, learn and grow with fellow farmers</p>
        </div>
        
        <div className="flex space-x-2">
          <Button>
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="forum">Forum</TabsTrigger>
          <TabsTrigger value="stories">Success Stories</TabsTrigger>
          <TabsTrigger value="experts">Expert Advice</TabsTrigger>
          <TabsTrigger value="groups">Local Groups</TabsTrigger>
        </TabsList>

        {/* Forum Tab */}
        <TabsContent value="forum" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search posts..."
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
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="crops">Crops</SelectItem>
                <SelectItem value="pest-disease">Pest & Disease</SelectItem>
                <SelectItem value="weather">Weather</SelectItem>
                <SelectItem value="market">Market</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="government">Government</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Create New Post */}
          <Card>
            <CardHeader>
              <CardTitle>Ask a Question</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Enter post title..."
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
              />
              <Textarea
                placeholder="Describe your question or problem..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                rows={3}
              />
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Bookmark className="h-4 w-4 mr-2" />
                    Add Image
                  </Button>
                  <Select defaultValue="hindi">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hindi">हिंदी</SelectItem>
                      <SelectItem value="english">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleCreatePost}>
                  <Send className="h-4 w-4 mr-2" />
                  Post Question
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Forum Posts */}
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {post.isPinned && <Pin className="h-4 w-4 text-blue-600" />}
                        {post.isSolved && <CheckCircle className="h-4 w-4 text-green-600" />}
                        <Badge className={getUrgencyColor(post.urgency)}>
                          {post.urgency}
                        </Badge>
                        <Badge variant="outline" className="flex items-center space-x-1">
                          {getCategoryIcon(post.category)}
                          <span className="capitalize">{post.category.replace('-', ' ')}</span>
                        </Badge>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>
                      <p className="text-gray-600 line-clamp-2">{post.content}</p>
                      
                      <div className="flex flex-wrap gap-1 mt-2">
                        {post.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center space-x-1">
                            <span className="text-sm font-medium">{post.author.name}</span>
                            {post.author.isExpert && <Verified className="h-3 w-3 text-blue-600" />}
                          </div>
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <MapPin className="h-3 w-3" />
                            <span>{post.author.location}</span>
                            <span>•</span>
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>{post.views}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{post.replies}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(post.id)}
                        className="flex items-center space-x-1"
                      >
                        <ThumbsUp className="h-4 w-4" />
                        <span>{post.likes}</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Success Stories Tab */}
        <TabsContent value="stories" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {successStories.map((story) => (
              <Card key={story.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-100 text-green-800">
                        {story.category.replace('-', ' ').toUpperCase()}
                      </Badge>
                      {story.isVerified && <Verified className="h-4 w-4 text-blue-600" />}
                    </div>
                    <span className="text-sm text-gray-500">{story.timeframe}</span>
                  </div>
                  <CardTitle className="line-clamp-2">{story.title}</CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>{story.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{story.author.name}</div>
                      <div className="text-sm text-gray-500 flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{story.author.location}</span>
                        <span>•</span>
                        <span>{story.author.farmSize} acres</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 line-clamp-3">{story.content}</p>
                  
                  <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Before</p>
                      <p className="font-bold text-red-600">₹{(story.beforeAfter.before.income / 1000).toFixed(0)}K</p>
                      <p className="text-xs">{story.beforeAfter.before.yield} q/acre</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">After</p>
                      <p className="font-bold text-green-600">₹{(story.beforeAfter.after.income / 1000).toFixed(0)}K</p>
                      <p className="text-xs">{story.beforeAfter.after.yield} q/acre</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {story.techniques.slice(0, 3).map((technique, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {technique}
                      </Badge>
                    ))}
                    {story.techniques.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{story.techniques.length - 3} more
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center space-x-1 text-gray-600 hover:text-red-600">
                        <Heart className="h-4 w-4" />
                        <span>{story.likes}</span>
                      </button>
                      <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
                        <Bookmark className="h-4 w-4" />
                        <span>{story.bookmarks}</span>
                      </button>
                      <button className="flex items-center space-x-1 text-gray-600 hover:text-green-600">
                        <Share2 className="h-4 w-4" />
                        <span>{story.shares}</span>
                      </button>
                    </div>
                    <span className="text-gray-500">
                      {new Date(story.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Expert Advice Tab */}
        <TabsContent value="experts" className="space-y-6">
          <div className="space-y-4">
            {expertAdvice.map((advice) => (
              <Card key={advice.id}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>{advice.expert.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-4">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium">{advice.expert.name}</h4>
                          <Badge variant="outline" className="text-xs">Expert</Badge>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs">{advice.expert.rating}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{advice.expert.title} • {advice.expert.institution}</p>
                        <p className="text-xs text-gray-500">{advice.expert.experience} years experience • {advice.expert.totalAnswers} answers</p>
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <HelpCircle className="h-4 w-4 text-blue-600" />
                          <Badge className="bg-blue-100 text-blue-800">
                            {advice.category.replace('-', ' ')}
                          </Badge>
                          <Badge variant="outline" className={
                            advice.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                            advice.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }>
                            {advice.difficulty}
                          </Badge>
                        </div>
                        <h3 className="font-medium text-gray-900 mb-2">{advice.question}</h3>
                        <p className="text-gray-700">{advice.answer}</p>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {advice.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4">
                          <button className="flex items-center space-x-1 text-gray-600 hover:text-green-600">
                            <ThumbsUp className="h-4 w-4" />
                            <span>{advice.helpful}</span>
                          </button>
                          <div className="flex items-center space-x-1 text-gray-500">
                            <Eye className="h-4 w-4" />
                            <span>{advice.views}</span>
                          </div>
                          <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
                            <Bookmark className="h-4 w-4" />
                            <span>Bookmark</span>
                          </button>
                        </div>
                        <span className="text-gray-500">
                          {new Date(advice.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Local Groups Tab */}
        <TabsContent value="groups" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {localGroups.map((group) => (
              <Card key={group.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-purple-100 text-purple-800">
                      {group.category.replace('-', ' ').toUpperCase()}
                    </Badge>
                    {group.isPrivate && <Badge variant="outline">Private</Badge>}
                  </div>
                  <CardTitle className="line-clamp-1">{group.name}</CardTitle>
                  <p className="text-sm text-gray-600 line-clamp-2">{group.description}</p>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{group.location.district}, {group.location.state}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>{group.members.toLocaleString()} members</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-center text-sm">
                    <div>
                      <p className="font-bold text-green-600">{group.activeMembers}</p>
                      <p className="text-xs text-gray-500">Active</p>
                    </div>
                    <div>
                      <p className="font-bold text-blue-600">{group.weeklyPosts}</p>
                      <p className="text-xs text-gray-500">Posts/week</p>
                    </div>
                    <div>
                      <p className="font-bold text-purple-600">
                        {Math.floor((Date.now() - new Date(group.lastActivity).getTime()) / (1000 * 60 * 60 * 24))}d
                      </p>
                      <p className="text-xs text-gray-500">Last active</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">Focus Areas:</p>
                    <div className="flex flex-wrap gap-1">
                      {group.focusAreas.map((area, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {group.meetingSchedule && (
                    <div className="p-3 bg-gray-50 rounded-lg text-sm">
                      <p className="font-medium mb-1">Regular Meetings:</p>
                      <p className="text-gray-600">
                        {group.meetingSchedule.frequency} on {group.meetingSchedule.day}s at {group.meetingSchedule.time}
                      </p>
                      <p className="text-gray-500 text-xs">{group.meetingSchedule.location}</p>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">{group.admin.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-600">Admin: {group.admin.name}</span>
                    </div>
                    
                    <Button size="sm">
                      <Users className="h-4 w-4 mr-2" />
                      Join Group
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SocialFeatures;