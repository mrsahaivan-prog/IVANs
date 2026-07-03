/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import Hero from './components/Hero';
import Countdown from './components/Countdown';
import PlatformPreview from './components/PlatformPreview';
import AcademyView from './components/AcademyView';
import BusinessView from './components/BusinessView';
import CommunityView from './components/CommunityView';
import IntroModal from './components/IntroModal';
import WaitlistPage from './components/WaitlistPage';

export default function App() {
  const [view, setView] = useState<'home' | 'academy' | 'business' | 'community' | 'waitlist'>('home');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [waitlistSource, setWaitlistSource] = useState('general');
  const [highlightAcademy, setHighlightAcademy] = useState(false);
  const [hasHighlighted, setHasHighlighted] = useState(false);

  const handleShowModal = () => {
    setIsModalOpen(true);
  };

  const handleOpenWaitlist = (source: string) => {
    setWaitlistSource(source);
    setView('waitlist');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Scroll smoothly to preview section on the home page
    setTimeout(() => {
      const previewElement = document.getElementById('preview-section');
      if (previewElement) {
        previewElement.scrollIntoView({ behavior: 'smooth' });
        // Illuminate Academy card
        if (!hasHighlighted) {
          setHighlightAcademy(true);
          setHasHighlighted(true);
          // Turn off illumination after 6 seconds
          setTimeout(() => {
            setHighlightAcademy(false);
          }, 6000);
        }
      }
    }, 150);
  };

  const handleSelectAcademy = () => {
    setView('academy');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectBusiness = () => {
    setView('business');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCommunity = () => {
    setView('community');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden">
      {/* Decorative cyber grid or glowing lines */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.02),transparent_60%)] pointer-events-none" />
      
      {/* Main page content layout */}
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          {view === 'home' ? (
            <main key="home">
              {/* 1. Compte à Rebours Section (Sticky top warning bar on home view to remind members of the 150 places limit) */}
              <Countdown onJoinWaitlistClick={() => handleOpenWaitlist('countdown')} />

              {/* 2. Hero Section */}
              <Hero onShowPreviewClick={handleShowModal} onJoinWaitlistClick={() => handleOpenWaitlist('hero')} />

              {/* Decorative Divider */}
              <div className="w-full flex justify-center py-6">
                <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent" />
              </div>

              {/* 3. Aperçu de la plateforme Section */}
              <PlatformPreview 
                onSelectAcademy={handleSelectAcademy} 
                onSelectBusiness={handleSelectBusiness} 
                onSelectCommunity={handleSelectCommunity}
                highlightAcademy={highlightAcademy}
              />
            </main>
          ) : view === 'academy' ? (
            <main key="academy">
              {/* Immersive high-end Academy Plateforme View */}
              <AcademyView onBack={handleBackToHome} onJoinWaitlist={() => handleOpenWaitlist('academy')} />
            </main>
          ) : view === 'business' ? (
            <main key="business">
              {/* Immersive high-end Business Plateforme View */}
              <BusinessView onBack={handleBackToHome} onJoinWaitlist={() => handleOpenWaitlist('business')} />
            </main>
          ) : view === 'community' ? (
            <main key="community">
              {/* Immersive high-end Community Plateforme View */}
              <CommunityView onBack={handleBackToHome} onJoinWaitlist={() => handleOpenWaitlist('community')} />
            </main>
          ) : (
            <main key="waitlist">
              <WaitlistPage onBack={handleBackToHome} source={waitlistSource} />
            </main>
          )}
        </AnimatePresence>
      </main>

      {/* Intro pop-up with fluid entry animations */}
      <AnimatePresence>
        {isModalOpen && (
          <IntroModal isOpen={isModalOpen} onClose={handleCloseModal} />
        )}
      </AnimatePresence>
    </div>
  );
}
