import React from 'react';
import { Facebook, Instagram, Share2 } from 'lucide-react';

export default function PlatformBadge({ platform }) {
  if (platform === 'facebook') {
    return (
      <span className="badge" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
        <Facebook size={12} /> Facebook Page
      </span>
    );
  }
  if (platform === 'instagram') {
    return (
      <span className="badge" style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#f472b6', border: '1px solid rgba(236, 72, 153, 0.3)' }}>
        <Instagram size={12} /> Instagram
      </span>
    );
  }
  return (
    <span className="badge" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#c084fc', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
      <Share2 size={12} /> FB + Instagram
    </span>
  );
}
