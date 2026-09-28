import React, { useState } from 'react';
import { HelpCircle, BookOpen, MessageSquare, ExternalLink, ChevronDown, ChevronUp, Send } from 'lucide-react';

export default function HelpSupport() {
  const [openFaq, setOpenFaq] = useState(0);
  const [ticketSent, setTicketSent] = useState(false);
  const [ticketText, setTicketText] = useState('');

  const faqs = [
    {
      q: 'How do I connect my Instagram Professional / Business Account?',
      a: '1. Convert your Instagram account to a Business or Creator account.\n2. Link your Instagram account to your official Facebook Page under Page Settings -> Linked Accounts -> Instagram.\n3. Click "Connect Facebook Page" on our Connect Accounts page, log in with Facebook, and grant permissions for both Facebook Page & Instagram.'
    },
    {
      q: 'Why did my scheduled post fail to publish?',
      a: 'Publishing can fail if:\n- The Meta Page access token expired or permissions were revoked.\n- Instagram image ratio does not meet Meta requirements (square 1:1, portrait 4:5, or landscape 1.91:1).\n- Temporary Meta API rate limits were exceeded. You can click "Retry" on any failed post to republish.'
    },
    {
      q: 'How does Comment-to-DM automation work?',
      a: 'When a user comments on your specified Instagram post or Facebook Page post containing your trigger keyword (e.g. "PRICE" or "LINK"), our Meta Webhook listener detects the comment and sends an automated private reply message directly to their inbox.'
    },
    {
      q: 'Is my Meta Access Token secure?',
      a: 'Yes. All long-lived Meta Page and Instagram tokens are encrypted on the backend server before storage. Tokens are never exposed to the frontend browser.'
    }
  ];

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    setTicketSent(true);
    setTicketText('');
    setTimeout(() => setTicketSent(false), 4000);
  };

  return (
    <div style={{ maxWidth: '900px' }}>
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <HelpCircle size={24} color="var(--primary)" />
          <h1 style={{ fontSize: '24px', fontWeight: 800 }}>Help & Knowledge Center</h1>
        </div>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
          Guides, Meta Graph API setup instructions, FAQs, and support ticketing.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '24px' }}>
        {/* Left Column: FAQ Accordion */}
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={20} color="var(--accent-pink)" /> Frequently Asked Questions
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {faqs.map((faq, idx) => (
              <div key={idx} className="glass-panel" style={{ overflow: 'hidden' }}>
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '14px',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  {faq.q}
                  {openFaq === idx ? <ChevronUp size={18} color="var(--primary)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
                </button>

                {openFaq === idx && (
                  <div style={{ padding: '0 20px 16px', fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.6, whitespace: 'pre-line', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Support Ticket Form */}
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={20} color="var(--primary)" /> Submit Support Ticket
          </h2>

          <div className="glass-panel" style={{ padding: '24px' }}>
            {ticketSent ? (
              <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--success)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>Support Ticket Received!</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Our team will review your query and reply within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleTicketSubmit}>
                <div style={{ marginBottom: '16px' }}>
                  <label className="form-label">Subject / Issue Area</label>
                  <select className="form-select" style={{ width: '100%' }}>
                    <option style={{ background: '#121826' }}>Meta OAuth / Account Connection</option>
                    <option style={{ background: '#121826' }}>AI Post Generation Error</option>
                    <option style={{ background: '#121826' }}>Comment-to-DM Webhook Trigger</option>
                    <option style={{ background: '#121826' }}>Other Question</option>
                  </select>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label className="form-label">Describe your question or error</label>
                  <textarea
                    required
                    rows={5}
                    value={ticketText}
                    onChange={(e) => setTicketText(e.target.value)}
                    placeholder="Provide details about the issue you are facing..."
                    className="form-textarea"
                    style={{ width: '100%' }}
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '14px', fontWeight: 700 }}>
                  <Send size={16} /> Submit Ticket
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
