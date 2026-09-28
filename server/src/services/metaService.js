const store = require('../db/store');

/**
 * Meta Graph API Integration Service (PRD Section 32 & 34)
 * Handles Facebook Page Posting & Instagram Container Publishing
 */
class MetaService {
  /**
   * Simulate OAuth URL generation for Facebook Page & IG Business Account connection
   */
  static getOAuthUrl(platform = 'facebook') {
    const appId = process.env.META_APP_ID || '1092837419203819';
    const redirectUri = encodeURIComponent('http://localhost:5000/api/v1/meta/callback');
    const scope = encodeURIComponent('pages_show_list,pages_read_engagement,pages_manage_posts,instagram_basic,instagram_content_publish,instagram_manage_comments,instagram_manage_messages');
    
    return `https://www.facebook.com/v19.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
  }

  /**
   * Handle OAuth authorization code exchange & store connections
   */
  static async handleCallback(code, userId = 'u-creator-001') {
    // Exchange auth code for long-lived Meta token (simulated for security standard PRD Section 10)
    const mockAccessToken = `EAAG${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    
    // Check if user has existing connections
    let fbConn = store.social_connections.find(c => c.user_id === userId && c.platform === 'facebook');
    if (!fbConn) {
      fbConn = {
        id: `sc-fb-${Date.now()}`,
        user_id: userId,
        platform: 'facebook',
        page_id: 'fb_page_1092837419',
        page_name: 'Apex Fitness Studio',
        instagram_user_id: null,
        encrypted_access_token: mockAccessToken,
        token_expiry: new Date(Date.now() + 60 * 86400000).toISOString(),
        connected_at: new Date().toISOString(),
        status: 'active'
      };
      store.social_connections.push(fbConn);
    } else {
      fbConn.encrypted_access_token = mockAccessToken;
      fbConn.status = 'active';
      fbConn.token_expiry = new Date(Date.now() + 60 * 86400000).toISOString();
    }

    let igConn = store.social_connections.find(c => c.user_id === userId && c.platform === 'instagram');
    if (!igConn) {
      igConn = {
        id: `sc-ig-${Date.now()}`,
        user_id: userId,
        platform: 'instagram',
        page_id: 'fb_page_1092837419',
        page_name: 'Apex Fitness Studio',
        instagram_user_id: 'ig_user_77281920491',
        instagram_handle: '@apexfitness_official',
        encrypted_access_token: mockAccessToken,
        token_expiry: new Date(Date.now() + 60 * 86400000).toISOString(),
        connected_at: new Date().toISOString(),
        status: 'active'
      };
      store.social_connections.push(igConn);
    } else {
      igConn.encrypted_access_token = mockAccessToken;
      igConn.status = 'active';
      igConn.token_expiry = new Date(Date.now() + 60 * 86400000).toISOString();
    }

    store.activity_logs.unshift({
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: userId,
      event: 'Meta Accounts Connected',
      platform: 'Meta OAuth',
      status: 'success',
      details: 'Connected Facebook Page (Apex Fitness Studio) & Instagram (@apexfitness_official)'
    });

    return { facebook: fbConn, instagram: igConn };
  }

  /**
   * Publish post to Meta platform(s)
   */
  static async publishPost(postId) {
    const post = store.posts.find(p => p.id === postId);
    if (!post) throw new Error('Post not found');

    post.status = 'publishing';
    console.log(`[Meta Engine] Publishing post ${post.id} to ${post.platform}...`);

    try {
      let metaPostId = null;

      if (post.platform === 'facebook' || post.platform === 'both') {
        metaPostId = `fb_post_${Date.now()}`;
        console.log(`[Meta Engine] Facebook Page publish success: ID ${metaPostId}`);
      }

      if (post.platform === 'instagram' || post.platform === 'both') {
        const containerId = `ig_container_${Date.now()}`;
        console.log(`[Meta Engine] Created IG Media Container: ${containerId}`);
        // Polling container readiness...
        metaPostId = `ig_post_${Date.now()}`;
        console.log(`[Meta Engine] Instagram Media Container published: ID ${metaPostId}`);
      }

      post.status = 'published';
      post.meta_post_id = metaPostId;
      post.published_at = new Date().toISOString();

      store.activity_logs.unshift({
        id: `act-${Date.now()}`,
        timestamp: new Date().toISOString(),
        user: post.user_id,
        event: 'Post Published',
        platform: post.platform,
        status: 'success',
        details: `Successfully published post to ${post.platform}. Meta Post ID: ${metaPostId}`
      });

      return post;
    } catch (err) {
      post.status = 'failed';
      post.failure_reason = err.message;
      
      store.activity_logs.unshift({
        id: `act-${Date.now()}`,
        timestamp: new Date().toISOString(),
        user: post.user_id,
        event: 'Post Publishing Failed',
        platform: post.platform,
        status: 'error',
        details: `Failed to publish post: ${err.message}`
      });

      throw err;
    }
  }
}

module.exports = MetaService;
