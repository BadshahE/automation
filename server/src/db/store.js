// In-memory persistent data store with Supabase PostgreSQL schema model
// Auto-populates realistic data for demonstration and runtime API backend functionality

const store = {
  users: [
    {
      id: 'u-admin-001',
      email: 'admin@platform.com',
      password: 'admin123',
      role: 'admin',
      name: 'System Admin',
      created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
      active: true
    },
    {
      id: 'u-creator-001',
      email: 'creator@brand.com',
      password: 'creator123',
      role: 'creator',
      name: 'Alex Vance (Apex Fitness)',
      created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
      active: true
    },
    {
      id: 'u-creator-002',
      email: 'sarah@techinsights.io',
      password: 'creator123',
      role: 'creator',
      name: 'Sarah Chen (Tech Insights)',
      created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
      active: true
    }
  ],

  social_connections: [
    {
      id: 'sc-001',
      user_id: 'u-creator-001',
      platform: 'facebook',
      page_id: 'fb_page_1092837419',
      page_name: 'Apex Fitness Studio',
      instagram_user_id: null,
      encrypted_access_token: 'enc_fb_token_88291047293819',
      token_expiry: new Date(Date.now() + 60 * 86400000).toISOString(),
      connected_at: new Date(Date.now() - 14 * 86400000).toISOString(),
      status: 'active'
    },
    {
      id: 'sc-002',
      user_id: 'u-creator-001',
      platform: 'instagram',
      page_id: 'fb_page_1092837419',
      page_name: 'Apex Fitness Studio',
      instagram_user_id: 'ig_user_77281920491',
      instagram_handle: '@apexfitness_official',
      encrypted_access_token: 'enc_ig_token_99281726481023',
      token_expiry: new Date(Date.now() + 45 * 86400000).toISOString(),
      connected_at: new Date(Date.now() - 14 * 86400000).toISOString(),
      status: 'active'
    }
  ],

  content_preferences: [
    {
      id: 'cp-001',
      user_id: 'u-creator-001',
      niche: 'Fitness & Health',
      tone: 'Inspirational',
      posting_frequency: 'Twice Daily',
      topics: ['Strength Training', 'High Protein Diet', 'Morning Routine', 'Mental Resilience'],
      language: 'English',
      style: 'Vibrant & Modern',
      hashtag_preference: 'Automatic',
      updated_at: new Date().toISOString()
    }
  ],

  posts: [
    {
      id: 'post-001',
      user_id: 'u-creator-001',
      platform: 'both',
      image_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=80',
      caption: 'Consistency is your only competition! 🔥 Start your morning with 20 minutes of movement and feel the energy shift for the rest of your day. What workout are you crushing today? Drop it in the comments! 👇\n\n#FitnessMotivation #MorningRoutine #ApexFitness #WorkoutGoals #HealthFirst',
      status: 'published',
      meta_post_id: 'fb_post_88392019482',
      created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
      published_at: new Date(Date.now() - 1.5 * 86400000).toISOString(),
      scheduled_at: new Date(Date.now() - 1.5 * 86400000).toISOString(),
      failure_reason: null
    },
    {
      id: 'post-002',
      user_id: 'u-creator-001',
      platform: 'instagram',
      image_url: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1000&q=80',
      caption: 'Fueling your body right is 80% of the game 🥗 Here is our quick 15-minute high protein prep guide for busy schedules! Comment "RECIPE" below to get the full nutritional breakdown sent straight to your DMs! 📩\n\n#MealPrep #HealthyEating #HighProtein #NutritionTips #ApexFitness',
      status: 'published',
      meta_post_id: 'ig_post_99201847291',
      created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
      published_at: new Date(Date.now() - 0.8 * 86400000).toISOString(),
      scheduled_at: new Date(Date.now() - 0.8 * 86400000).toISOString(),
      failure_reason: null
    },
    {
      id: 'post-003',
      user_id: 'u-creator-001',
      platform: 'both',
      image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=80',
      caption: 'Weekend Power Push 🏋️‍♂️ Don’t lose momentum on Saturday. Remember why you started and keep pushing past your comfort zone.\n\nWant our exclusive 30-Day VIP Pass? Comment "VIP" below! ⚡\n\n#WeekendWorkout #MindsetShift #NoExcuses #ApexFitness',
      status: 'scheduled',
      meta_post_id: null,
      created_at: new Date(Date.now() - 0.5 * 86400000).toISOString(),
      published_at: null,
      scheduled_at: new Date(Date.now() + 1 * 86400000).toISOString(),
      failure_reason: null
    },
    {
      id: 'post-004',
      user_id: 'u-creator-001',
      platform: 'facebook',
      image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1000&q=80',
      caption: 'Recovery is just as important as training hard 🧘 Take time to stretch, hydrate, and get quality sleep tonight.',
      status: 'scheduled',
      meta_post_id: null,
      created_at: new Date(Date.now() - 0.1 * 86400000).toISOString(),
      published_at: null,
      scheduled_at: new Date(Date.now() + 2 * 86400000).toISOString(),
      failure_reason: null
    }
  ],

  comment_automations: [
    {
      id: 'auto-001',
      user_id: 'u-creator-001',
      post_id: 'post-002',
      post_title: 'Meal Prep High Protein Guide',
      name: 'Recipe DM Automation',
      keywords: ['recipe', 'prep', 'food', 'nutrition'],
      dm_message: 'Hey there! Thanks for commenting on our meal prep post. Here is your instant link to download the high-protein recipe guide:',
      dm_link: 'https://apexfitness.com/recipes-pdf',
      active: true,
      created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
      triggered_count: 34,
      dms_sent_count: 34
    },
    {
      id: 'auto-002',
      user_id: 'u-creator-001',
      post_id: 'post-003',
      post_title: 'Weekend Power Push',
      name: '30-Day VIP Pass Lead Gen',
      keywords: ['vip', 'pass', 'join', 'price'],
      dm_message: 'Awesome to see your interest! Here is your exclusive 30-Day VIP Pass link with 20% off your first month:',
      dm_link: 'https://apexfitness.com/vip-pass',
      active: true,
      created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
      triggered_count: 19,
      dms_sent_count: 18
    }
  ],

  automation_logs: [
    {
      id: 'log-001',
      automation_id: 'auto-001',
      automation_name: 'Recipe DM Automation',
      commenter_id: 'ig_user_10293',
      commenter_handle: '@fit_life_john',
      comment_text: 'Please send me the RECIPE! Looks delicious 🥗',
      comment_id: 'cmt_88291039471',
      dm_sent: true,
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    {
      id: 'log-002',
      automation_id: 'auto-001',
      automation_name: 'Recipe DM Automation',
      commenter_id: 'ig_user_88392',
      commenter_handle: '@maria_runner',
      comment_text: 'I need this prep food guide!',
      comment_id: 'cmt_88291039472',
      dm_sent: true,
      timestamp: new Date(Date.now() - 3600000 * 5).toISOString()
    },
    {
      id: 'log-003',
      automation_id: 'auto-002',
      automation_name: '30-Day VIP Pass Lead Gen',
      commenter_id: 'ig_user_44129',
      commenter_handle: '@david_lifts',
      comment_text: 'VIP pass please! What is the price?',
      comment_id: 'cmt_88291039473',
      dm_sent: true,
      timestamp: new Date(Date.now() - 3600000 * 8).toISOString()
    }
  ],

  api_providers: [
    {
      id: 'prov-001',
      provider_name: 'OpenAI (GPT-4o)',
      type: 'text',
      status: 'active',
      daily_usage: 1240,
      quota_limit: 10000,
      priority: 1,
      encrypted_api_key: 'sk-proj-****8829'
    },
    {
      id: 'prov-002',
      provider_name: 'Google Gemini 1.5 Pro',
      type: 'text',
      status: 'active',
      daily_usage: 850,
      quota_limit: 15000,
      priority: 2,
      encrypted_api_key: 'AIzaSy****9921'
    },
    {
      id: 'prov-003',
      provider_name: 'Anthropic Claude 3.5 Sonnet',
      type: 'text',
      status: 'active',
      daily_usage: 410,
      quota_limit: 8000,
      priority: 3,
      encrypted_api_key: 'sk-ant-****1102'
    },
    {
      id: 'prov-004',
      provider_name: 'Stability AI (SDXL)',
      type: 'image',
      status: 'active',
      daily_usage: 620,
      quota_limit: 5000,
      priority: 1,
      encrypted_api_key: 'sk-sec-****7721'
    },
    {
      id: 'prov-005',
      provider_name: 'DALL-E 3 (OpenAI)',
      type: 'image',
      status: 'active',
      daily_usage: 390,
      quota_limit: 3000,
      priority: 2,
      encrypted_api_key: 'sk-proj-****8829'
    }
  ],

  activity_logs: [
    {
      id: 'act-001',
      timestamp: new Date(Date.now() - 60000 * 10).toISOString(),
      user: 'System Worker',
      event: 'Scheduled Job Execution',
      platform: 'Instagram',
      status: 'success',
      details: 'Post #post-002 published successfully to @apexfitness_official'
    },
    {
      id: 'act-002',
      timestamp: new Date(Date.now() - 60000 * 25).toISOString(),
      user: '@apexfitness_official',
      event: 'Comment DM Automation Triggered',
      platform: 'Instagram',
      status: 'success',
      details: 'DM sent to @fit_life_john (Keyword: recipe)'
    },
    {
      id: 'act-003',
      timestamp: new Date(Date.now() - 60000 * 45).toISOString(),
      user: 'AI Engine',
      event: 'AI Content Generation',
      platform: 'Meta',
      status: 'success',
      details: 'Generated post using OpenAI GPT-4o & Stability AI (SDXL)'
    },
    {
      id: 'act-004',
      timestamp: new Date(Date.now() - 60000 * 90).toISOString(),
      user: 'System Admin',
      event: 'Provider Failover Priority Updated',
      platform: 'AI Pool',
      status: 'info',
      details: 'Promoted OpenAI GPT-4o to Priority 1'
    }
  ]
};

module.exports = store;
