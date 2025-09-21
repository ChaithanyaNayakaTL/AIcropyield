import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, X, Globe } from "lucide-react";

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatbotProps {
  isOpen: boolean;
  onToggle: () => void;
}

const predefinedQuestions = {
  en: [
    "When should I plant?",
    "How much fertilizer to use?",
    "Weather impact on my crop?",
    "Market price predictions?",
    "What are the pest risks?",
    "When to harvest?",
    "Irrigation schedule?",
    "Insurance recommendations?"
  ],
  hi: [
    "कब बोना चाहिए?",
    "कितना खाद डालना चाहिए?",
    "मौसम का फसल पर क्या प्रभाव?",
    "बाजार भाव की भविष्यवाणी?",
    "कीट-रोग का खतरा?",
    "कब काटना चाहिए?",
    "सिंचाई का समय?",
    "बीमा की सलाह?"
  ]
};

const responses = {
  en: {
    "When should I plant?": "Planting time depends on your crop and season. For Kharif crops, plant during June-July with monsoon. For Rabi crops, November-December is ideal. Always check local weather conditions!",
    "How much fertilizer to use?": "Fertilizer depends on crop type and soil test. Generally: Rice needs 120:60:40 NPK kg/ha, Wheat needs 120:60:40 NPK kg/ha. Always do soil testing first!",
    "Weather impact on my crop?": "Weather greatly affects crops. Excess rain can cause waterlogging, drought affects growth, and extreme temperatures stress plants. Monitor weather forecasts and plan accordingly.",
    "Market price predictions?": "Market prices fluctuate based on demand-supply. Check mandi prices regularly, use government apps like eNAM. Generally, avoid selling immediately after harvest when prices are low.",
    "What are the pest risks?": "Common pests vary by crop. Rice: Brown planthopper, blast. Wheat: Rust, aphids. Cotton: Bollworm. Use IPM practices and monitor fields regularly.",
    "When to harvest?": "Harvest timing is crucial. Rice: 30-35 days after flowering. Wheat: When grains are hard. Look for visual signs like grain color and moisture content.",
    "Irrigation schedule?": "Irrigation depends on crop stage and weather. Critical stages: Rice - transplanting, tillering, flowering. Wheat - crown root, flowering, grain filling. Avoid overwatering!",
    "Insurance recommendations?": "PMFBY (Pradhan Mantri Fasal Bima Yojana) is recommended for all farmers. Low premium, covers weather risks, pest attacks, and natural disasters. Enroll before cutoff dates!"
  },
  hi: {
    "कब बोना चाहिए?": "बुआई का समय फसल और मौसम पर निर्भर करता है। खरीफ फसलों के लिए जून-जुलाई में मानसून के साथ बोएं। रबी फसलों के लिए नवंबर-दिसंबर आदर्श है। हमेशा स्थानीय मौसम की जांच करें!",
    "कितना खाद डालना चाहिए?": "खाद की मात्रा फसल और मिट्टी जांच पर निर्भर करती है। आमतौर पर: धान को 120:60:40 NPK किग्रा/हेक्टेयर, गेहूं को 120:60:40 NPK किग्रा/हेक्टेयर। पहले मिट्टी की जांच जरूर कराएं!",
    "मौसम का फसल पर क्या प्रभाव?": "मौसम का फसल पर बहुत प्रभाव पड़ता है। अधिक बारिश से जलभराव, सूखे से विकास में बाधा, और अत्यधिक तापमान से पौधों में तनाव। मौसम पूर्वानुमान देखें और योजना बनाएं।",
    "बाजार भाव की भविष्यवाणी?": "बाजार भाव मांग-आपूर्ति पर निर्भर करता है। नियमित रूप से मंडी भाव देखें, eNAM जैसे सरकारी ऐप्स का उपयोग करें। फसल काटने के तुरंत बाद न बेचें जब भाव कम होते हैं।",
    "कीट-रोग का खतरा?": "सामान्य कीट फसल के अनुसार अलग होते हैं। धान: भूरा फुदका, ब्लास्ट। गेहूं: रस्ट, माहू। कपास: सुंडी। IPM तकनीक अपनाएं और खेतों की नियमित निगरानी करें।",
    "कब काटना चाहिए?": "कटाई का समय बहुत महत्वपूर्ण है। धान: फूल आने के 30-35 दिन बाद। गेहूं: जब दाने सख्त हो जाएं। दाने के रंग और नमी को देखकर पहचानें।",
    "सिंचाई का समय?": "सिंचाई फसल की अवस्था और मौसम पर निर्भर करती है। महत्वपूर्ण अवस्थाएं: धान - रोपाई, कल्ले, फूल। गेहूं - जड़ विकास, फूल, दाना भरना। अधिक पानी न दें!",
    "बीमा की सलाह?": "PMFBY (प्रधानमंत्री फसल बीमा योजना) सभी किसानों के लिए सुझाई जाती है। कम प्रीमियम, मौसम जोखिम, कीट हमले और प्राकृतिक आपदाओं का कवर। अंतिम तारीख से पहले नामांकन कराएं!"
  }
};

export const FarmingChatbot = ({ isOpen, onToggle }: ChatbotProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Hello! I\'m your farming assistant. Ask me anything about crops, weather, fertilizers, or market prices. मैं आपका कृषि सहायक हूं। फसल, मौसम, खाद या बाजार भाव के बारे में कुछ भी पूछें।',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (text?: string) => {
    const messageText = text || inputText.trim();
    if (!messageText) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // Generate bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(messageText, language);
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const generateBotResponse = (userText: string, lang: 'en' | 'hi'): string => {
    const currentResponses = responses[lang];
    
    // Check for exact matches in predefined questions
    for (const [question, answer] of Object.entries(currentResponses)) {
      if (userText.toLowerCase().includes(question.toLowerCase()) || 
          question.toLowerCase().includes(userText.toLowerCase())) {
        return answer;
      }
    }

    // Check for keywords and provide relevant responses
    const keywords = {
      en: {
        'plant': 'Planting time varies by crop and season. Check our prediction tool for specific recommendations!',
        'fertilizer': 'Fertilizer requirements depend on soil test and crop type. Use our advisory features for personalized recommendations.',
        'weather': 'Weather monitoring is crucial for farming. Check weather forecasts and use our risk assessment tools.',
        'price': 'Market prices change daily. Check local mandi rates and government portals like eNAM for current prices.',
        'water': 'Water management is key to good yields. Follow crop-specific irrigation schedules and avoid overwatering.',
        'pest': 'Pest management requires regular monitoring. Use IPM practices and consult local agriculture experts.',
        'insurance': 'Crop insurance protects against losses. PMFBY is available for most crops with subsidized premiums.'
      },
      hi: {
        'बोना': 'बुआई का समय फसल और मौसम पर निर्भर करता है। विशिष्ट सुझावों के लिए हमारे भविष्यवाणी उपकरण देखें!',
        'खाद': 'खाद की आवश्यकता मिट्टी परीक्षण और फसल पर निर्भर करती है। व्यक्तिगत सुझावों के लिए हमारी सलाहकार सुविधाओं का उपयोग करें।',
        'मौसम': 'खेती के लिए मौसम निगरानी जरूरी है। मौसम पूर्वानुमान देखें और हमारे जोखिम मूल्यांकन उपकरण का उपयोग करें।',
        'भाव': 'बाजार भाव रोज बदलते हैं। स्थानीय मंडी दरें और eNAM जैसे सरकारी पोर्टल देखें।',
        'पानी': 'जल प्रबंधन अच्छी पैदावार की कुंजी है। फसल-विशिष्ट सिंचाई कार्यक्रम का पालन करें।',
        'कीट': 'कीट प्रबंधन के लिए नियमित निगरानी जरूरी है। IPM तकनीक अपनाएं और स्थानीय कृषि विशेषज्ञों से सलाह लें।',
        'बीमा': 'फसल बीमा नुकसान से बचाता है। अधिकांश फसलों के लिए PMFBY उपलब्ध है।'
      }
    };

    const currentKeywords = keywords[lang];
    for (const [keyword, response] of Object.entries(currentKeywords)) {
      if (userText.toLowerCase().includes(keyword.toLowerCase())) {
        return response;
      }
    }

    // Default response
    return lang === 'en' 
      ? "I'm here to help with farming questions! Try asking about planting, fertilizers, weather, prices, or pests. You can also use the buttons below for common questions."
      : "मैं खेती के सवालों में मदद के लिए यहां हूं! बुआई, खाद, मौसम, भाव या कीटों के बारे में पूछें। आम सवालों के लिए नीचे के बटन भी इस्तेमाल कर सकते हैं।";
  };

  if (!isOpen) return null;

  return (
    <Card className="fixed bottom-20 right-4 w-80 h-96 z-50 shadow-2xl border-primary/20">
      <CardHeader className="pb-2 bg-primary/5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <MessageCircle className="w-5 h-5 mr-2 text-primary" />
            Farming Assistant
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="h-7 px-2"
            >
              <Globe className="w-3 h-3 mr-1" />
              {language === 'en' ? 'हिं' : 'EN'}
            </Button>
            <Button variant="ghost" size="sm" onClick={onToggle}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-3 space-y-3 max-h-48">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-2 rounded-lg text-sm ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-3 border-t">
          <div className="grid grid-cols-2 gap-1 mb-3">
            {predefinedQuestions[language].slice(0, 4).map((question) => (
              <Button
                key={question}
                variant="outline"
                size="sm"
                className="text-xs h-7 px-2"
                onClick={() => handleSendMessage(question)}
              >
                {question.length > 15 ? question.substring(0, 15) + '...' : question}
              </Button>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={language === 'en' ? "Type your question..." : "अपना सवाल लिखें..."}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="text-sm"
            />
            <Button size="sm" onClick={() => handleSendMessage()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const ChatbotToggle = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-4 right-4 w-14 h-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 z-40"
      size="lg"
    >
      <MessageCircle className="w-6 h-6" />
    </Button>
  );
};