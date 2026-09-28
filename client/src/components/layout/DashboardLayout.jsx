import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import AIGenerationModal from '../common/AIGenerationModal';

export default function DashboardLayout({ children }) {
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-dark)' }}>
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Body */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Topbar onTriggerAIGenerate={() => setIsAIModalOpen(true)} />

        <main style={{ flex: 1, padding: '32px', minWidth: 0, maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
          {children}
        </main>
      </div>

      {/* AI Generator Stepper Modal */}
      <AIGenerationModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onPostGenerated={() => setIsAIModalOpen(false)}
      />
    </div>
  );
}
