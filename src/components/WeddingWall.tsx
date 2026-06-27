import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Megaphone, Tag, Home, Star, RefreshCw } from 'lucide-react';
import { RELATIONSHIP_SHORT_LABELS } from '../types';
import type { GreetingMessage } from '../types';

interface WeddingWallProps {
  messages: GreetingMessage[];
  onPostClick: () => void;
  resetToSeeds: () => void;
  isDbConnected?: boolean;
}

// Map relationships to icons
const getRelationshipIcon = (relationship: string, id: string) => {
  // Check seeds specifically to match pixel perfect screenshot
  if (id === '8a32a67e-e567-4d4b-9721-a5bf9fcd18e1') return <Heart className="w-5 h-5 text-wedding-gold" />;
  if (id === '7b6f6345-4de4-4824-b1c4-54c3755b768e') return <Sparkles className="w-5 h-5 text-wedding-gold" />;
  if (id === 'c2d46e12-8877-4b8c-a1de-508b98b9fcf8') return <Megaphone className="w-5 h-5 text-wedding-gold" />;
  if (id === 'ff454318-7b98-4c92-bd24-742a7da30ef9') return <Tag className="w-5 h-5 text-wedding-gold" />;
  if (id === 'e1b76e10-c4e8-466d-97e3-0dcd511ee1c4') return <Home className="w-5 h-5 text-wedding-gold" />;
  if (id === '5e1c4e70-a3fe-4a81-9b16-cdce5fcd8904') return <Star className="w-5 h-5 text-wedding-gold" />;

  // Default mappings for new submissions
  switch (relationship) {
    case 'waalid':
      return <Heart className="w-5 h-5 text-wedding-gold" />;
    case 'walaal':
      return <Sparkles className="w-5 h-5 text-wedding-gold" />;
    case 'saaxib':
      return <Megaphone className="w-5 h-5 text-wedding-gold" />;
    case 'ehel':
      return <Tag className="w-5 h-5 text-wedding-gold" />;
    case 'macallin':
      return <Star className="w-5 h-5 text-wedding-gold" />;
    case 'jaar':
      return <Home className="w-5 h-5 text-wedding-gold" />;
    default:
      return <Sparkles className="w-5 h-5 text-wedding-gold" />;
  }
};

export const WeddingWall: React.FC<WeddingWallProps> = ({ messages, onPostClick, resetToSeeds, isDbConnected = false }) => {
  const [pulseSync, setPulseSync] = useState(true);

  // Filter messages to show only approved ones on the wall
  const approvedMessages = messages.filter(msg => msg.is_approved);

  // Simulate real-time sync heartbeat
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseSync(prev => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12 wedding-bg-pattern min-h-screen">
      {/* Realtime Synced Badge */}
      <div className="flex justify-end mb-6 space-x-2">
        <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-wedding-gold/40 bg-wedding-goldLight/30 text-wedding-gold font-sans text-xs font-semibold tracking-wider uppercase select-none">
          <span className={`w-2.5 h-2.5 rounded-full bg-wedding-gold mr-2.5 ${pulseSync ? 'animate-ping' : ''}`}></span>
          Realtime Synced
        </div>
        <div className={`inline-flex items-center px-4 py-1.5 rounded-full border font-sans text-xs font-semibold tracking-wider uppercase select-none ${
          isDbConnected 
            ? 'border-emerald-500/40 bg-emerald-50 text-emerald-700' 
            : 'border-amber-500/40 bg-amber-50 text-amber-700'
        }`}>
          {isDbConnected ? 'Supabase (DB)' : 'Local Sync (No DB)'}
        </div>
      </div>

      {/* Main Title Section */}
      <div className="text-center mb-16">
        <h1 className="font-editorial text-5xl md:text-6xl font-semibold text-wedding-burgundy leading-tight tracking-wide mb-4">
          Samira & Khalid’s Wedding Wall
        </h1>
        <div className="flex items-center justify-center space-x-4">
          <div className="h-[1px] w-12 bg-wedding-gold/55"></div>
          <p className="font-sans text-xs md:text-sm font-semibold tracking-[0.25em] text-wedding-gold uppercase">
            Live Greetings from our Beloved Guests
          </p>
          <div className="h-[1px] w-12 bg-wedding-gold/55"></div>
        </div>
      </div>

      {/* Wall Grid (Masonry Columns Layout) */}
      {approvedMessages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-wedding-gold/40 rounded-xl bg-[#FAF9F6]/60 p-8">
          <Sparkles className="w-12 h-12 text-wedding-gold mb-4 animate-sparkle" />
          <p className="font-editorial text-2xl text-wedding-burgundy mb-2">No greetings yet</p>
          <p className="font-sans text-sm text-wedding-charcoal/60 mb-6 max-w-md">
            Be the first to leave a beautiful message for Samira & Khalid on their wedding wall.
          </p>
          <div className="flex space-x-4">
            <button 
              onClick={onPostClick}
              className="bg-wedding-burgundy text-white font-sans font-semibold px-6 py-2.5 rounded-md hover:bg-wedding-burgundy/90 transition-all shadow-sm"
            >
              Write Message
            </button>
            <button 
              onClick={resetToSeeds}
              className="border border-wedding-gold/50 text-wedding-burgundy font-sans font-semibold px-6 py-2.5 rounded-md hover:bg-wedding-goldLight/20 transition-all"
            >
              Reset to Defaults
            </button>
          </div>
        </div>
      ) : (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          <AnimatePresence mode="popLayout">
            {approvedMessages.map((msg) => (
              <motion.div
                key={msg.id}
                layoutId={`card-${msg.id}`}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 100, damping: 15 }}
                className="break-inside-avoid bg-wedding-ivory border border-wedding-gold/55 rounded-lg p-8 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[220px]"
              >
                {/* Card Top: Badge & Icon */}
                <div className="flex items-center justify-between mb-6">
                  <span className="bg-[#EAE1D1] text-wedding-burgundy text-[10px] font-sans font-bold px-3 py-1 rounded-full tracking-widest border border-wedding-gold/20">
                    {RELATIONSHIP_SHORT_LABELS[msg.relationship] || msg.relationship.toUpperCase()}
                  </span>
                  <div>
                    {getRelationshipIcon(msg.relationship, msg.id)}
                  </div>
                </div>

                {/* Card Message Content */}
                <div className="flex-grow mb-6">
                  <p className="font-editorial text-lg md:text-xl font-normal italic leading-relaxed text-wedding-charcoal text-left select-text">
                    “{msg.message_text}”
                  </p>
                </div>

                {/* Card Author */}
                <div className="text-right border-t border-wedding-gold/10 pt-4 mt-auto">
                  <span className="font-editorial text-base md:text-lg font-semibold italic text-wedding-burgundy">
                    — {msg.guest_name}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Floating Reset Button for testing/resetting local storage seeds */}
      <div className="mt-16 flex justify-center">
        <button 
          onClick={resetToSeeds} 
          title="Reset to default messages"
          className="inline-flex items-center text-xs text-wedding-gold hover:text-wedding-burgundy bg-wedding-ivory border border-wedding-gold/30 hover:border-wedding-burgundy/40 px-4 py-2 rounded-full transition-all duration-200"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-2 animate-sparkle" />
          Reset Demo Data
        </button>
      </div>
    </div>
  );
};
