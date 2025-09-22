// Real-time Notification Service for CropYieldAI
// Provides live weather alerts, market price notifications, seasonal farming tips, and government scheme updates

export interface NotificationConfig {
  userId: string;
  preferences: {
    weatherAlerts: boolean;
    priceAlerts: boolean;
    seasonalTips: boolean;
    governmentUpdates: boolean;
    diseaseAlerts: boolean;
    irrigationReminders: boolean;
  };
  location: {
    latitude: number;
    longitude: number;
    state: string;
    district: string;
  };
  crops: string[];
  priceThresholds: { [commodity: string]: { min: number; max: number } };
  alertFrequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
  quietHours: {
    enabled: boolean;
    start: string; // HH:MM format
    end: string;   // HH:MM format
  };
}

export interface Notification {
  id: string;
  type: 'weather' | 'price' | 'seasonal' | 'government' | 'disease' | 'irrigation' | 'general';
  category: 'alert' | 'warning' | 'info' | 'tip' | 'update';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  detailedMessage?: string;
  timestamp: Date;
  expiresAt?: Date;
  isRead: boolean;
  actionRequired: boolean;
  actionText?: string;
  actionUrl?: string;
  location?: {
    latitude: number;
    longitude: number;
    area: string;
  };
  relatedCrop?: string;
  data?: any; // Additional context data
  deliveryChannels: DeliveryChannel[];
}

export interface DeliveryChannel {
  channel: 'push' | 'sms' | 'email' | 'in-app';
  enabled: boolean;
  delivered: boolean;
  deliveredAt?: Date;
  error?: string;
}

export interface WeatherAlert {
  id: string;
  alertType: 'storm' | 'rain' | 'drought' | 'frost' | 'heatwave' | 'hail' | 'wind';
  severity: 'minor' | 'moderate' | 'severe' | 'extreme';
  startTime: Date;
  endTime: Date;
  affectedArea: string;
  description: string;
  recommendations: string[];
  impactOnCrops: {
    crop: string;
    impact: 'minimal' | 'moderate' | 'significant' | 'severe';
    recommendations: string[];
  }[];
}

export interface PriceAlert {
  id: string;
  commodity: string;
  variety: string;
  currentPrice: number;
  previousPrice: number;
  change: number;
  changePercentage: number;
  marketName: string;
  alertTrigger: 'threshold-reached' | 'sudden-spike' | 'sudden-drop' | 'volatility' | 'target-achieved';
  recommendations: string[];
}

export interface SeasonalTip {
  id: string;
  season: 'spring' | 'summer' | 'monsoon' | 'winter';
  month: number;
  week: number;
  category: 'planting' | 'irrigation' | 'fertilization' | 'pest-control' | 'harvesting' | 'post-harvest';
  applicableCrops: string[];
  title: string;
  tip: string;
  timing: string;
  importance: 'optional' | 'recommended' | 'critical';
  resources?: {
    videos?: string[];
    articles?: string[];
    contacts?: string[];
  };
}

export interface GovernmentUpdate {
  id: string;
  scheme: string;
  updateType: 'new-scheme' | 'policy-change' | 'deadline-reminder' | 'application-open' | 'payment-released';
  title: string;
  description: string;
  eligibilityCriteria?: string[];
  applicationProcess?: string[];
  deadline?: Date;
  benefitAmount?: number;
  contactInfo?: {
    office: string;
    phone: string;
    website?: string;
  };
  applicableStates?: string[];
  targetBeneficiaries?: string[];
}

export interface NotificationSubscription {
  userId: string;
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  device: string;
  browser: string;
  subscribedAt: Date;
  isActive: boolean;
}

export interface NotificationAnalytics {
  totalSent: number;
  totalDelivered: number;
  totalRead: number;
  totalClicked: number;
  deliveryRate: number;
  readRate: number;
  clickRate: number;
  byType: { [type: string]: { sent: number; delivered: number; read: number } };
  byPriority: { [priority: string]: { sent: number; delivered: number; read: number } };
  engagement: {
    mostEngagingType: string;
    bestTimeToSend: string;
    userPreferences: { [preference: string]: number };
  };
}

class NotificationService {
  private notifications: Notification[] = [];
  private subscriptions: NotificationSubscription[] = [];
  private userConfigs: Map<string, NotificationConfig> = new Map();
  private isServiceWorkerSupported: boolean;
  private notificationPermission: NotificationPermission = 'default';

  constructor() {
    this.isServiceWorkerSupported = 'serviceWorker' in navigator;
    this.initializeService();
  }

  private async initializeService(): Promise<void> {
    // Check notification permission
    if ('Notification' in window) {
      this.notificationPermission = Notification.permission;
    }

    // Register service worker for push notifications
    if (this.isServiceWorkerSupported) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered:', registration);
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }

    // Start monitoring for real-time updates
    this.startRealTimeMonitoring();
  }

  // User configuration management
  public async updateUserConfig(config: NotificationConfig): Promise<void> {
    this.userConfigs.set(config.userId, config);
    
    // Save to localStorage for persistence
    localStorage.setItem(
      `notificationConfig_${config.userId}`,
      JSON.stringify(config)
    );

    console.log('Notification config updated for user:', config.userId);
  }

  public getUserConfig(userId: string): NotificationConfig | null {
    let config = this.userConfigs.get(userId);
    
    if (!config) {
      // Try to load from localStorage
      const stored = localStorage.getItem(`notificationConfig_${userId}`);
      if (stored) {
        config = JSON.parse(stored);
        this.userConfigs.set(userId, config!);
      }
    }
    
    return config || null;
  }

  // Notification permission management
  public async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.log('This browser does not support desktop notification');
      return false;
    }

    if (this.notificationPermission === 'granted') {
      return true;
    }

    const permission = await Notification.requestPermission();
    this.notificationPermission = permission;
    
    return permission === 'granted';
  }

  // Push notification subscription
  public async subscribeToPushNotifications(userId: string): Promise<boolean> {
    if (!this.isServiceWorkerSupported) {
      console.log('Service Worker not supported');
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(
          'BK8Rw5iDNRkfzQYwmVzLQ9gEQRVDCbvJ8zJfx6DQv1WZ4RfXXQXH-qWg8YNZQKrCEBFm9LBLKpLs8qNVuE7nVPA' // Example VAPID key
        ) as BufferSource
      });

      const subscriptionData: NotificationSubscription = {
        userId,
        endpoint: subscription.endpoint,
        keys: {
          p256dh: this.arrayBufferToBase64(subscription.getKey('p256dh')!),
          auth: this.arrayBufferToBase64(subscription.getKey('auth')!)
        },
        device: navigator.userAgent.includes('Mobile') ? 'mobile' : 'desktop',
        browser: this.getBrowserName(),
        subscribedAt: new Date(),
        isActive: true
      };

      this.subscriptions.push(subscriptionData);
      
      // In a real implementation, send this to your server
      console.log('Push subscription created:', subscriptionData);
      
      return true;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      return false;
    }
  }

  // Real-time monitoring
  private startRealTimeMonitoring(): void {
    // Simulate real-time data monitoring
    setInterval(() => {
      this.checkWeatherConditions();
    }, 300000); // Check every 5 minutes

    setInterval(() => {
      this.checkPriceChanges();
    }, 600000); // Check every 10 minutes

    setInterval(() => {
      this.checkSeasonalTips();
    }, 3600000); // Check every hour

    setInterval(() => {
      this.checkGovernmentUpdates();
    }, 1800000); // Check every 30 minutes
  }

  // Weather monitoring
  private async checkWeatherConditions(): Promise<void> {
    // In real implementation, this would integrate with weather-api.ts
    const simulatedWeatherAlerts = this.generateSimulatedWeatherAlerts();
    
    for (const alert of simulatedWeatherAlerts) {
      await this.createNotificationFromWeatherAlert(alert);
    }
  }

  private generateSimulatedWeatherAlerts(): WeatherAlert[] {
    const alerts: WeatherAlert[] = [];
    
    // Simulate random weather alerts (low probability for demo)
    if (Math.random() < 0.1) { // 10% chance
      const alertTypes = ['storm', 'rain', 'drought', 'frost', 'heatwave'] as const;
      const severities = ['moderate', 'severe'] as const;
      
      alerts.push({
        id: `weather_${Date.now()}`,
        alertType: alertTypes[Math.floor(Math.random() * alertTypes.length)],
        severity: severities[Math.floor(Math.random() * severities.length)],
        startTime: new Date(),
        endTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        affectedArea: 'Local region',
        description: 'Severe weather conditions expected in your area',
        recommendations: [
          'Secure loose farm equipment',
          'Check drainage systems',
          'Monitor crop conditions closely'
        ],
        impactOnCrops: [
          {
            crop: 'Rice',
            impact: 'moderate',
            recommendations: ['Ensure proper drainage', 'Monitor for diseases']
          }
        ]
      });
    }
    
    return alerts;
  }

  private async createNotificationFromWeatherAlert(alert: WeatherAlert): Promise<void> {
    const notification: Notification = {
      id: `notif_${alert.id}`,
      type: 'weather',
      category: alert.severity === 'extreme' ? 'alert' : 'warning',
      priority: alert.severity === 'extreme' ? 'critical' : 'high',
      title: `Weather Alert: ${alert.alertType.toUpperCase()}`,
      message: alert.description,
      detailedMessage: `${alert.description}\n\nRecommendations:\n${alert.recommendations.join('\n')}`,
      timestamp: new Date(),
      expiresAt: alert.endTime,
      isRead: false,
      actionRequired: true,
      actionText: 'View Details',
      data: alert,
      deliveryChannels: [
        { channel: 'push', enabled: true, delivered: false },
        { channel: 'in-app', enabled: true, delivered: false }
      ]
    };

    await this.sendNotification(notification);
  }

  // Price monitoring
  private async checkPriceChanges(): Promise<void> {
    // In real implementation, this would integrate with market-intelligence.ts
    const simulatedPriceAlerts = this.generateSimulatedPriceAlerts();
    
    for (const alert of simulatedPriceAlerts) {
      await this.createNotificationFromPriceAlert(alert);
    }
  }

  private generateSimulatedPriceAlerts(): PriceAlert[] {
    const alerts: PriceAlert[] = [];
    
    // Simulate random price alerts (low probability for demo)
    if (Math.random() < 0.15) { // 15% chance
      const commodities = ['Rice', 'Wheat', 'Onion', 'Potato'];
      const commodity = commodities[Math.floor(Math.random() * commodities.length)];
      const previousPrice = 2000 + Math.random() * 3000;
      const change = (Math.random() - 0.5) * 500;
      const currentPrice = previousPrice + change;
      
      alerts.push({
        id: `price_${Date.now()}`,
        commodity,
        variety: 'Standard',
        currentPrice: Math.round(currentPrice),
        previousPrice: Math.round(previousPrice),
        change: Math.round(change),
        changePercentage: Math.round((change / previousPrice) * 100 * 10) / 10,
        marketName: 'Local Mandi',
        alertTrigger: Math.abs(change) > 200 ? 'sudden-spike' : 'threshold-reached',
        recommendations: [
          change > 0 ? 'Consider selling if holding inventory' : 'Monitor for buying opportunities',
          'Check multiple markets for best prices',
          'Review storage and transportation costs'
        ]
      });
    }
    
    return alerts;
  }

  private async createNotificationFromPriceAlert(alert: PriceAlert): Promise<void> {
    const isIncrease = alert.change > 0;
    const changeText = isIncrease ? 'increased' : 'decreased';
    const emoji = isIncrease ? '📈' : '📉';
    
    const notification: Notification = {
      id: `notif_${alert.id}`,
      type: 'price',
      category: Math.abs(alert.changePercentage) > 10 ? 'alert' : 'info',
      priority: Math.abs(alert.changePercentage) > 15 ? 'high' : 'medium',
      title: `${emoji} ${alert.commodity} Price ${changeText.toUpperCase()}`,
      message: `${alert.commodity} price ${changeText} by ${Math.abs(alert.changePercentage)}% to ₹${alert.currentPrice}`,
      detailedMessage: `Market: ${alert.marketName}\nCurrent Price: ₹${alert.currentPrice}\nPrevious Price: ₹${alert.previousPrice}\nChange: ₹${alert.change} (${alert.changePercentage}%)\n\nRecommendations:\n${alert.recommendations.join('\n')}`,
      timestamp: new Date(),
      isRead: false,
      actionRequired: true,
      actionText: 'View Markets',
      relatedCrop: alert.commodity,
      data: alert,
      deliveryChannels: [
        { channel: 'push', enabled: true, delivered: false },
        { channel: 'in-app', enabled: true, delivered: false }
      ]
    };

    await this.sendNotification(notification);
  }

  // Seasonal tips
  private async checkSeasonalTips(): Promise<void> {
    const currentDate = new Date();
    const tips = this.generateSeasonalTips(currentDate);
    
    for (const tip of tips) {
      await this.createNotificationFromSeasonalTip(tip);
    }
  }

  private generateSeasonalTips(date: Date): SeasonalTip[] {
    const tips: SeasonalTip[] = [];
    const month = date.getMonth() + 1;
    const week = Math.ceil(date.getDate() / 7);
    
    // Generate tips based on current season and timing
    const seasonalTipsDatabase = [
      {
        season: 'monsoon' as const,
        months: [6, 7, 8, 9],
        tips: [
          {
            category: 'irrigation' as const,
            title: 'Monitor Rainfall and Drainage',
            tip: 'Ensure proper drainage in fields to prevent waterlogging during heavy rains',
            timing: 'During monsoon season',
            importance: 'critical' as const,
            applicableCrops: ['Rice', 'Sugarcane', 'Cotton']
          },
          {
            category: 'pest-control' as const,
            title: 'Pest Management in Humid Conditions',
            tip: 'Increase vigilance for pest attacks as humidity favors pest multiplication',
            timing: 'Weekly monitoring required',
            importance: 'recommended' as const,
            applicableCrops: ['Rice', 'Maize', 'Vegetables']
          }
        ]
      },
      {
        season: 'winter' as const,
        months: [12, 1, 2],
        tips: [
          {
            category: 'planting' as const,
            title: 'Winter Crop Sowing',
            tip: 'Optimal time for sowing winter crops like wheat, mustard, and gram',
            timing: 'November-December',
            importance: 'critical' as const,
            applicableCrops: ['Wheat', 'Mustard', 'Gram']
          }
        ]
      }
    ];

    // Find applicable tips for current month
    for (const seasonData of seasonalTipsDatabase) {
      if (seasonData.months.includes(month)) {
        seasonData.tips.forEach((tip, index) => {
          // Only show tips once per week (simulate frequency control)
          if (Math.random() < 0.1) { // 10% chance to show tip
            tips.push({
              id: `tip_${month}_${week}_${index}`,
              season: seasonData.season,
              month,
              week,
              category: tip.category,
              applicableCrops: tip.applicableCrops,
              title: tip.title,
              tip: tip.tip,
              timing: tip.timing,
              importance: tip.importance
            });
          }
        });
      }
    }
    
    return tips;
  }

  private async createNotificationFromSeasonalTip(tip: SeasonalTip): Promise<void> {
    const notification: Notification = {
      id: `notif_${tip.id}`,
      type: 'seasonal',
      category: 'tip',
      priority: tip.importance === 'critical' ? 'high' : 'medium',
      title: `🌱 Seasonal Tip: ${tip.title}`,
      message: tip.tip,
      detailedMessage: `${tip.tip}\n\nTiming: ${tip.timing}\nApplicable Crops: ${tip.applicableCrops.join(', ')}`,
      timestamp: new Date(),
      isRead: false,
      actionRequired: false,
      data: tip,
      deliveryChannels: [
        { channel: 'in-app', enabled: true, delivered: false },
        { channel: 'push', enabled: true, delivered: false }
      ]
    };

    await this.sendNotification(notification);
  }

  // Government updates
  private async checkGovernmentUpdates(): Promise<void> {
    const updates = this.generateGovernmentUpdates();
    
    for (const update of updates) {
      await this.createNotificationFromGovernmentUpdate(update);
    }
  }

  private generateGovernmentUpdates(): GovernmentUpdate[] {
    const updates: GovernmentUpdate[] = [];
    
    // Simulate government updates (low probability for demo)
    if (Math.random() < 0.05) { // 5% chance
      const schemes = [
        'PM-KISAN',
        'Pradhan Mantri Fasal Bima Yojana',
        'Soil Health Card Scheme',
        'National Agriculture Market (e-NAM)'
      ];
      
      const updateTypes = ['deadline-reminder', 'payment-released', 'application-open'] as const;
      const scheme = schemes[Math.floor(Math.random() * schemes.length)];
      const updateType = updateTypes[Math.floor(Math.random() * updateTypes.length)];
      
      updates.push({
        id: `gov_${Date.now()}`,
        scheme,
        updateType,
        title: `${scheme}: ${updateType.replace('-', ' ').toUpperCase()}`,
        description: this.getGovernmentUpdateDescription(scheme, updateType),
        deadline: updateType === 'deadline-reminder' ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : undefined,
        contactInfo: {
          office: 'District Agriculture Office',
          phone: '+91-1800-180-1551'
        }
      });
    }
    
    return updates;
  }

  private getGovernmentUpdateDescription(scheme: string, updateType: string): string {
    const descriptions: { [key: string]: { [key: string]: string } } = {
      'PM-KISAN': {
        'deadline-reminder': 'Reminder: Complete your KYC verification to receive the next installment',
        'payment-released': 'PM-KISAN 15th installment of ₹2,000 has been released',
        'application-open': 'New registrations are now open for PM-KISAN scheme'
      },
      'Pradhan Mantri Fasal Bima Yojana': {
        'deadline-reminder': 'Last date to enroll for Kharif season crop insurance',
        'payment-released': 'Crop insurance claims have been processed and payments released',
        'application-open': 'Enrollment open for Rabi season crop insurance'
      }
    };
    
    return descriptions[scheme]?.[updateType] || 'Government scheme update available';
  }

  private async createNotificationFromGovernmentUpdate(update: GovernmentUpdate): Promise<void> {
    const notification: Notification = {
      id: `notif_${update.id}`,
      type: 'government',
      category: 'update',
      priority: update.deadline ? 'high' : 'medium',
      title: `🏛️ ${update.title}`,
      message: update.description,
      detailedMessage: update.deadline 
        ? `${update.description}\n\nDeadline: ${update.deadline.toLocaleDateString()}\n\nContact: ${update.contactInfo?.office}\nPhone: ${update.contactInfo?.phone}`
        : `${update.description}\n\nContact: ${update.contactInfo?.office}\nPhone: ${update.contactInfo?.phone}`,
      timestamp: new Date(),
      expiresAt: update.deadline,
      isRead: false,
      actionRequired: !!update.deadline,
      actionText: update.deadline ? 'Apply Now' : 'Learn More',
      data: update,
      deliveryChannels: [
        { channel: 'push', enabled: true, delivered: false },
        { channel: 'in-app', enabled: true, delivered: false }
      ]
    };

    await this.sendNotification(notification);
  }

  // Notification delivery
  private async sendNotification(notification: Notification): Promise<void> {
    // Add to notifications list
    this.notifications.unshift(notification);
    
    // Limit notifications list size
    if (this.notifications.length > 100) {
      this.notifications = this.notifications.slice(0, 100);
    }

    // Deliver through enabled channels
    for (const channel of notification.deliveryChannels) {
      if (channel.enabled) {
        await this.deliverThroughChannel(notification, channel);
      }
    }

    // Save to localStorage for persistence
    this.saveNotificationsToStorage();
    
    // Emit event for UI updates
    this.emitNotificationEvent(notification);
  }

  private async deliverThroughChannel(
    notification: Notification,
    channel: DeliveryChannel
  ): Promise<void> {
    try {
      switch (channel.channel) {
        case 'push':
          await this.sendPushNotification(notification);
          break;
        case 'in-app':
          // In-app notifications are handled by UI components
          break;
        case 'sms':
          // SMS delivery would be implemented here
          console.log('SMS delivery not implemented in demo');
          break;
        case 'email':
          // Email delivery would be implemented here
          console.log('Email delivery not implemented in demo');
          break;
      }
      
      channel.delivered = true;
      channel.deliveredAt = new Date();
    } catch (error) {
      channel.error = error instanceof Error ? error.message : 'Delivery failed';
      console.error(`Failed to deliver notification via ${channel.channel}:`, error);
    }
  }

  private async sendPushNotification(notification: Notification): Promise<void> {
    if (this.notificationPermission !== 'granted') {
      return;
    }

    const options: NotificationOptions = {
      body: notification.message,
      icon: '/favicon.ico',
      badge: '/badge-72x72.png',
      tag: notification.id,
      requireInteraction: notification.priority === 'critical',
      data: {
        notificationId: notification.id,
        url: notification.actionUrl
      }
    };

    new Notification(notification.title, options);
  }

  // Notification management
  public getNotifications(
    userId: string,
    filters?: {
      type?: string;
      category?: string;
      isRead?: boolean;
      limit?: number;
    }
  ): Notification[] {
    let filtered = [...this.notifications];

    if (filters?.type) {
      filtered = filtered.filter(n => n.type === filters.type);
    }

    if (filters?.category) {
      filtered = filtered.filter(n => n.category === filters.category);
    }

    if (filters?.isRead !== undefined) {
      filtered = filtered.filter(n => n.isRead === filters.isRead);
    }

    if (filters?.limit) {
      filtered = filtered.slice(0, filters.limit);
    }

    return filtered;
  }

  public markAsRead(notificationId: string): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.isRead = true;
      this.saveNotificationsToStorage();
    }
  }

  public markAllAsRead(userId: string): void {
    this.notifications.forEach(notification => {
      notification.isRead = true;
    });
    this.saveNotificationsToStorage();
  }

  public deleteNotification(notificationId: string): void {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
    this.saveNotificationsToStorage();
  }

  public getUnreadCount(userId: string): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  // Analytics
  public getNotificationAnalytics(userId: string, timeframe: 'day' | 'week' | 'month' = 'week'): NotificationAnalytics {
    const now = new Date();
    const startDate = new Date();
    
    switch (timeframe) {
      case 'day':
        startDate.setDate(now.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
    }

    const relevantNotifications = this.notifications.filter(
      n => n.timestamp >= startDate
    );

    const totalSent = relevantNotifications.length;
    const totalDelivered = relevantNotifications.filter(
      n => n.deliveryChannels.some(c => c.delivered)
    ).length;
    const totalRead = relevantNotifications.filter(n => n.isRead).length;

    const byType = relevantNotifications.reduce((acc, n) => {
      if (!acc[n.type]) {
        acc[n.type] = { sent: 0, delivered: 0, read: 0 };
      }
      acc[n.type].sent++;
      if (n.deliveryChannels.some(c => c.delivered)) acc[n.type].delivered++;
      if (n.isRead) acc[n.type].read++;
      return acc;
    }, {} as { [type: string]: { sent: number; delivered: number; read: number } });

    const byPriority = relevantNotifications.reduce((acc, n) => {
      if (!acc[n.priority]) {
        acc[n.priority] = { sent: 0, delivered: 0, read: 0 };
      }
      acc[n.priority].sent++;
      if (n.deliveryChannels.some(c => c.delivered)) acc[n.priority].delivered++;
      if (n.isRead) acc[n.priority].read++;
      return acc;
    }, {} as { [priority: string]: { sent: number; delivered: number; read: number } });

    return {
      totalSent,
      totalDelivered,
      totalRead,
      totalClicked: 0, // Would be tracked with actual click events
      deliveryRate: totalSent > 0 ? (totalDelivered / totalSent) * 100 : 0,
      readRate: totalDelivered > 0 ? (totalRead / totalDelivered) * 100 : 0,
      clickRate: 0, // Would be calculated with actual click data
      byType,
      byPriority,
      engagement: {
        mostEngagingType: Object.keys(byType).reduce((a, b) => 
          (byType[a]?.read || 0) > (byType[b]?.read || 0) ? a : b, 'weather'
        ),
        bestTimeToSend: '08:00', // Would be calculated from actual data
        userPreferences: {
          weather: 85,
          price: 90,
          seasonal: 60,
          government: 70
        }
      }
    };
  }

  // Utility methods
  private saveNotificationsToStorage(): void {
    try {
      localStorage.setItem('notifications', JSON.stringify(this.notifications.slice(0, 50)));
    } catch (error) {
      console.error('Failed to save notifications to storage:', error);
    }
  }

  private loadNotificationsFromStorage(): void {
    try {
      const stored = localStorage.getItem('notifications');
      if (stored) {
        this.notifications = JSON.parse(stored).map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp),
          expiresAt: n.expiresAt ? new Date(n.expiresAt) : undefined
        }));
      }
    } catch (error) {
      console.error('Failed to load notifications from storage:', error);
    }
  }

  private emitNotificationEvent(notification: Notification): void {
    // Custom event for UI components to listen to
    window.dispatchEvent(new CustomEvent('newNotification', {
      detail: notification
    }));
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  private getBrowserName(): string {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown';
  }

  // Initialize with stored data
  public initialize(): void {
    this.loadNotificationsFromStorage();
  }

  // Cleanup method
  public cleanup(): void {
    // Clean up expired notifications
    const now = new Date();
    this.notifications = this.notifications.filter(
      n => !n.expiresAt || n.expiresAt > now
    );
    this.saveNotificationsToStorage();
  }
}

// Singleton instance
export const notificationService = new NotificationService();