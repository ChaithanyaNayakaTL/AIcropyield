# 🌾 CropYieldAI - Smart Farming Assistant

An intelligent, mobile-first crop yield prediction and farming advisory platform designed for farmers of all literacy levels. Built with React, TypeScript, and modern web technologies to provide comprehensive agricultural guidance with full accessibility support.

## 🌟 Key Features

### 🤖 Intelligent Farming Advisory
- **Smart Recommendations Engine**: AI-powered crop selection and optimization
- **Multilingual Chatbot**: 24/7 farming assistance in Hindi and English
- **Risk Assessment Module**: Weather, pest, and market risk analysis
- **Crop Comparison Tool**: Side-by-side analysis of different crops

### 📱 Mobile-First Design
- **Progressive Web App (PWA)**: Install like a native app
- **Offline Functionality**: Works without internet connection
- **Touch-Friendly Interface**: 44px minimum touch targets
- **Swipe Navigation**: Gesture-based navigation between pages
- **Pull-to-Refresh**: Swipe down to refresh data

### ♿ Comprehensive Accessibility
- **Voice Control**: Navigate and fill forms using voice (Hindi/English)
- **Text-to-Speech**: App reads content aloud
- **Visual Accessibility**: Font size control, high contrast mode
- **Screen Reader Support**: Full compatibility with assistive technologies
- **Keyboard Navigation**: Complete keyboard accessibility

### 🌐 Location-Based Services
- **GPS Integration**: Automatic location detection
- **Regional Recommendations**: Location-specific crop and farming advice
- **Weather Integration**: Local weather data for accurate predictions
- **Soil Analysis**: Region-specific soil recommendations

### 💾 Data Management
- **Local Storage**: Farm data stored securely on device
- **Offline Cache**: Essential data available without internet
- **Data Export/Import**: PDF reports and JSON data exchange
- **Prediction History**: Track and analyze farming decisions

## 🚀 Quick Start

### Installation
1. **Visit the App**: Open in your mobile browser
2. **Install PWA**: Tap "Add to Home Screen" in browser menu
3. **Grant Permissions**: Allow location and microphone access
4. **Start Farming**: Enter your farm details and get predictions

### Voice Control Setup
1. Tap the blue accessibility button
2. Enable "Voice Commands"
3. Say "Help" to hear available commands
4. Use "Fill Form" for voice-guided form filling

## 🛠️ Technology Stack

### Frontend Framework
- **React 18**: Modern component-based architecture
- **TypeScript**: Type-safe development
- **Vite**: Fast development and build tool
- **Tailwind CSS**: Utility-first styling

### UI Components
- **shadcn/ui**: Modern, accessible component library
- **Radix UI**: Primitive components with full accessibility
- **Lucide Icons**: Comprehensive icon library
- **Responsive Design**: Mobile-first approach

### Progressive Web App
- **Service Worker**: Offline functionality and caching
- **Web App Manifest**: Native app-like experience
- **IndexedDB**: Client-side database
- **Push Notifications**: Farming alerts and reminders

### Accessibility Technologies
- **Web Speech API**: Voice recognition and text-to-speech
- **ARIA Labels**: Screen reader compatibility
- **WCAG Guidelines**: Web Content Accessibility Guidelines compliance
- **Focus Management**: Keyboard navigation support

## 🌾 Core Features

### Crop Yield Prediction
- **Machine Learning Models**: Advanced prediction algorithms
- **Multiple Factors**: Weather, soil, location, and historical data
- **Accuracy Metrics**: Confidence scores and error margins
- **Historical Analysis**: Compare with previous seasons

### Smart Recommendations
- **Crop Selection**: Best crops for your region and season
- **Planting Schedule**: Optimal timing for planting and harvesting
- **Resource Optimization**: Water, fertilizer, and seed recommendations
- **Sustainable Practices**: Eco-friendly farming suggestions

### Risk Management
- **Weather Monitoring**: Real-time weather alerts and forecasts
- **Pest & Disease**: Early warning system for common threats
- **Market Analysis**: Price trends and demand forecasting
- **Insurance Guidance**: Crop insurance recommendations

### Knowledge Hub
- **Best Practices**: Expert farming advice and techniques
- **Regional Expertise**: Location-specific farming knowledge
- **Seasonal Guidance**: Month-wise farming activities
- **Problem Solving**: Solutions for common farming challenges

## 📚 Detailed Documentation

- **[Mobile Features Guide](./MOBILE_FEATURES.md)**: Comprehensive mobile and accessibility features
- **Voice Commands**: Complete list of Hindi/English voice commands
- **Accessibility Guide**: Full accessibility feature documentation
- **PWA Features**: Progressive Web App capabilities and installation

## 🔧 Development

### Prerequisites
```bash
# Node.js 18+ and npm
node --version  # Should be 18+
npm --version   # Should be 8+
```

### Local Setup
```bash
# Clone repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## 🌍 Accessibility Standards

### WCAG Compliance
- **Level AA**: Meets Web Content Accessibility Guidelines 2.1
- **Color Contrast**: 4.5:1 minimum contrast ratio
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader**: Compatible with NVDA, JAWS, VoiceOver

### Voice Features
- **Hindi Support**: Complete voice commands in Hindi
- **English Support**: Full English voice interaction
- **Multilingual TTS**: Text-to-speech in both languages
- **Voice Form Filling**: Step-by-step voice guidance

### Mobile Accessibility
- **Touch Targets**: 44px minimum size (exceeds standard)
- **Gesture Alternative**: All gestures have button alternatives
- **Zoom Support**: Up to 200% zoom without loss of functionality
- **Orientation**: Works in both portrait and landscape

## 🚀 Performance Optimization

### Mobile Performance
- **Fast Loading**: Optimized bundle size and lazy loading
- **Smooth Interactions**: 60fps animations and transitions
- **Battery Efficiency**: Minimal background processing
- **Data Conservation**: Smart caching and compression

### Offline Capabilities
- **Core Features**: Basic predictions work offline
- **Data Sync**: Smart synchronization when online
- **Cached Content**: Essential data cached locally
- **Graceful Degradation**: Reduced features when offline

## 🎯 Target Users

### Primary Audience
- **Small-scale Farmers**: Resource optimization and yield improvement
- **Illiterate Farmers**: Voice-based interaction and audio feedback
- **Tech-Savvy Farmers**: Advanced analytics and data insights
- **Agricultural Students**: Learning tool for modern farming techniques

### Accessibility Focus
- **Visual Impairments**: Screen reader support and high contrast
- **Motor Disabilities**: Voice control and large touch targets
- **Cognitive Disabilities**: Simple interface and clear navigation
- **Language Barriers**: Multilingual support (Hindi/English)

## 📊 Key Voice Commands

### Navigation (Hindi/English)
- **"Go Home" / "होम पर जाएं"**: Navigate to home page
- **"Predict Yield" / "फसल की भविष्यवाणी"**: Go to prediction page
- **"Show Results" / "परिणाम दिखाएं"**: View prediction results
- **"Open Chat" / "चैट खोलें"**: Open farming chatbot

### Form Interaction
- **"Fill Form" / "फॉर्म भरें"**: Start voice-guided form filling
- **"Help" / "मदद"**: Show available commands
- **"Read Page" / "पेज पढ़ें"**: Read current page content

### Accessibility
- **"Increase Font" / "फॉन्ट बढ़ाएं"**: Increase text size
- **"High Contrast" / "उच्च कंट्रास्ट"**: Toggle high contrast mode

## 🤝 Contributing

### Guidelines
1. **Accessibility First**: All features must be fully accessible
2. **Mobile Optimization**: Test on real mobile devices
3. **Multilingual Support**: Consider Hindi and English users
4. **Performance**: Maintain fast loading and smooth interactions

### Development Process
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Test accessibility and mobile compatibility
4. Commit changes (`git commit -m 'Add amazing feature'`)
5. Push to branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Farmers**: For inspiring this accessible agricultural technology
- **Accessibility Community**: For guidance on inclusive design
- **Open Source**: Built with amazing open-source libraries
- **Agricultural Experts**: For domain knowledge and validation

## 📞 Support & Contact

- **In-App Help**: Use voice command "Help" or accessibility panel
- **Chatbot**: Ask questions to the AI farming assistant
- **Documentation**: Comprehensive guides and troubleshooting
- **Community**: Join farmer forums and knowledge sharing

---

*Empowering farmers through accessible technology and intelligent agricultural insights. Building a sustainable future for farming communities.*
#   c r o p y i e l d  
 #   c r o p y i e l d  
 #   A I c r o p y i e l d  
 