import React from 'react';

interface HeaderProps {
  currentView: 'wall' | 'form' | 'admin';
  setView: (view: 'wall' | 'form' | 'admin') => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
  return (
    <header className="border-b border-[#E5E4E7] bg-white sticky top-0 z-30 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <div 
          onClick={() => setView('wall')} 
          className="font-editorial text-3xl font-semibold text-wedding-burgundy cursor-pointer hover:opacity-80 transition-opacity tracking-wide select-none"
        >
          Hambalyo
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8 font-sans text-sm font-medium text-wedding-charcoal/80">
          <button 
            onClick={() => setView('wall')} 
            className={`hover:text-wedding-burgundy transition-colors relative py-2 ${
              currentView === 'wall' ? 'text-wedding-burgundy border-b-2 border-wedding-gold' : ''
            }`}
          >
            Gallery
          </button>
          <button 
            onClick={() => setView('wall')} 
            className="hover:text-wedding-burgundy transition-colors py-2"
          >
            Messages
          </button>
          <button 
            onClick={() => {
              // Scroll to bottom or show info alert
              window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            }} 
            className="hover:text-wedding-burgundy transition-colors py-2"
          >
            About
          </button>
          <button 
            onClick={() => setView('admin')} 
            className={`hover:text-wedding-burgundy transition-colors py-2 ${
              currentView === 'admin' ? 'text-wedding-burgundy border-b-2 border-wedding-gold' : ''
            }`}
          >
            Moderation
          </button>
        </nav>

        {/* Action Button */}
        <div>
          <button
            onClick={() => setView(currentView === 'form' ? 'wall' : 'form')}
            className="bg-wedding-burgundy hover:bg-wedding-burgundy/90 text-white font-sans text-sm font-semibold px-6 py-2.5 rounded-md shadow-sm transition-all duration-200 hover:shadow-md transform active:scale-95"
          >
            {currentView === 'form' ? 'Back to Wall' : 'Post Message'}
          </button>
        </div>
      </div>
    </header>
  );
};
