import React from 'react';
import { Diamond } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto bg-wedding-ivory px-6 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Diamond Separator */}
        <div className="relative flex items-center justify-center my-8">
          <div className="w-full border-t border-wedding-gold/40"></div>
          <div className="absolute bg-wedding-ivory px-4 py-1">
            <Diamond className="w-4 h-4 text-wedding-burgundy fill-wedding-gold/20 animate-pulse" />
          </div>
        </div>

        {/* Footer Links and Metadata */}
        <div className="flex flex-col md:flex-row items-center justify-between text-xs text-wedding-charcoal/60 font-sans mt-8 space-y-4 md:space-y-0">
          {/* Logo Name */}
          <div className="font-editorial text-lg font-semibold text-wedding-burgundy tracking-wide select-none">
            Hambalyo
          </div>

          {/* Copyright notice */}
          <div className="text-center">
            © 2024 Hambalyo Wedding Walls. Created with love.
          </div>

          {/* Legal / Info */}
          <div className="flex space-x-6">
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-wedding-burgundy transition-colors">
              Privacy
            </a>
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-wedding-burgundy transition-colors">
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
