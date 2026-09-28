const store = require('../db/store');

/**
 * Comment-to-DM Automation Engine (PRD Section 33 & 34)
 * Handles incoming webhooks, keyword matching, idempotency, and Instagram Private Replies.
 */
class AutomationEngine {
  /**
   * Process incoming comment webhook event
   */
  static async processCommentWebhook(payload) {
    const { comment_id, comment_text, commenter_id, commenter_handle, post_id, user_id } = payload;

    // 1. Idempotency Check: Ignore if comment_id already processed
    const existingLog = store.automation_logs.find(l => l.comment_id === comment_id);
    if (existingLog) {
      console.log(`[Automation Engine] Duplicate webhook ignored for comment_id: ${comment_id}`);
      return { status: 'ignored', reason: 'duplicate_comment_id' };
    }

    // 2. Find active automation rules for this user & post
    const automations = store.comment_automations.filter(
      a => a.active && a.user_id === (user_id || 'u-creator-001') && (!a.post_id || a.post_id === post_id)
    );

    if (automations.length === 0) {
      console.log(`[Automation Engine] No active automation rules found for user ${user_id}`);
      return { status: 'no_rule_matched' };
    }

    // 3. Evaluate keyword matches
    const lowerComment = (comment_text || '').toLowerCase();
    let matchedAutomation = null;

    for (const auto of automations) {
      const hasMatch = auto.keywords.some(kw => lowerComment.includes(kw.toLowerCase()));
      if (hasMatch) {
        matchedAutomation = auto;
        break;
      }
    }

    if (!matchedAutomation) {
      console.log(`[Automation Engine] Comment "${comment_text}" did not match any trigger keywords.`);
      return { status: 'no_keyword_match' };
    }

    // 4. Trigger Instagram Private Reply DM
    console.log(`[Automation Engine] Keyword matched! Sending DM via Rule "${matchedAutomation.name}" to ${commenter_handle || commenter_id}`);

    const logEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      automation_id: matchedAutomation.id,
      automation_name: matchedAutomation.name,
      commenter_id: commenter_id || 'ig_user_anon',
      commenter_handle: commenter_handle || '@instagram_user',
      comment_text: comment_text,
      comment_id: comment_id,
      dm_sent: true,
      timestamp: new Date().toISOString()
    };

    store.automation_logs.unshift(logEntry);
    matchedAutomation.triggered_count = (matchedAutomation.triggered_count || 0) + 1;
    matchedAutomation.dms_sent_count = (matchedAutomation.dms_sent_count || 0) + 1;

    store.activity_logs.unshift({
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: user_id || 'u-creator-001',
      event: 'Comment DM Automation Triggered',
      platform: 'Instagram DM',
      status: 'success',
      details: `Sent Private DM to ${commenter_handle || commenter_id} (Triggered by keyword match in "${matchedAutomation.name}")`
    });

    return {
      status: 'dm_sent',
      log: logEntry,
      dm_message: matchedAutomation.dm_message,
      dm_link: matchedAutomation.dm_link
    };
  }
}

module.exports = AutomationEngine;
