import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Heart, CheckCircle2, AlertTriangle } from 'lucide-react';
import type { RelationshipType } from '../types';

interface GuestFormProps {
  onAddMessage: (name: string, relationship: RelationshipType, text: string) => { is_approved: boolean } | null;
  onBackToWall: () => void;
}

export const GuestForm: React.FC<GuestFormProps> = ({ onAddMessage, onBackToWall }) => {
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState<RelationshipType | ''>('');
  const [message, setMessage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState<{ is_approved: boolean } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Relationship definitions list
  const relationships: { value: RelationshipType; label: string }[] = [
    { value: 'waalid', label: 'Waalid (Parent)' },
    { value: 'walaal', label: 'Walaal (Sibling)' },
    { value: 'saaxib', label: 'Saaxib (Friend)' },
    { value: 'ehel', label: 'Ehel (Relative / Connection)' },
    { value: 'macallin', label: 'Macallin (Teacher)' },
    { value: 'jaar', label: 'Jaar (Neighbor)' },
  ];

  // Rate limiter helper: checks local storage for submissions count in the last 5 minutes
  const checkRateLimit = (): boolean => {
    const submissionsKey = 'hamblayo_submissions_timestamps';
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;
    
    let timestamps: number[] = [];
    const stored = localStorage.getItem(submissionsKey);
    if (stored) {
      try {
        timestamps = JSON.parse(stored);
      } catch (e) {
        timestamps = [];
      }
    }
    
    // Filter out timestamps older than 5 minutes
    const recentTimestamps = timestamps.filter(t => now - t < fiveMinutes);
    
    if (recentTimestamps.length >= 3) {
      return false; // rate limit exceeded
    }
    
    // Record current submission
    recentTimestamps.push(now);
    localStorage.setItem(submissionsKey, JSON.stringify(recentTimestamps));
    return true;
  };

  const triggerGoldConfetti = () => {
    const end = Date.now() + 1.5 * 1000;
    const colors = ['#D4AF37', '#FAF9F6', '#5B1E31', '#F3ECE0'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Basic Validations
    if (!name.trim()) {
      setErrorMsg('Please enter your name.');
      return;
    }
    if (name.length > 50) {
      setErrorMsg('Name must be 50 characters or less.');
      return;
    }
    if (!relationship) {
      setErrorMsg('Please select your relationship to the couple.');
      return;
    }
    if (!message.trim()) {
      setErrorMsg('Please write a congratulatory message.');
      return;
    }
    if (message.length > 300) {
      setErrorMsg('Message must be 300 characters or less to keep the card design readable.');
      return;
    }

    // Rate limiting simulation
    if (!checkRateLimit()) {
      setErrorMsg('Submission limit reached. You can post up to 3 greetings every 5 minutes to prevent spam.');
      return;
    }

    setIsSubmitting(true);

    // Simulate database/API delay
    setTimeout(() => {
      try {
        const result = onAddMessage(name, relationship, message);
        setIsSubmitting(false);
        setSubmittedMessage(result);
        
        // Fire confetti
        triggerGoldConfetti();
      } catch (err) {
        setIsSubmitting(false);
        setErrorMsg('An error occurred while posting your message. Please try again.');
      }
    }, 800);
  };

  const resetForm = () => {
    setName('');
    setRelationship('');
    setMessage('');
    setSubmittedMessage(null);
    setErrorMsg(null);
  };

  // Thank You State
  if (submittedMessage) {
    return (
      <div className="max-w-xl mx-auto px-6 py-16 text-center">
        <div className="bg-white border border-wedding-gold/60 rounded-xl p-10 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-wedding-gold via-wedding-burgundy to-wedding-gold"></div>
          
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-wedding-goldLight/40 flex items-center justify-center border border-wedding-gold/30">
              <CheckCircle2 className="w-8 h-8 text-wedding-burgundy" />
            </div>
          </div>

          <h2 className="font-editorial text-3xl font-semibold text-wedding-burgundy mb-4">
            Mahadsanid!
          </h2>
          
          {submittedMessage.is_approved ? (
            <p className="font-sans text-sm text-wedding-charcoal/80 leading-relaxed mb-8">
              Thank you for your beautiful message! Your congratulations have been successfully posted and will immediately slide onto the screen.
            </p>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-8 text-left">
              <div className="flex space-x-2">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-amber-800">Message Pending Approval</h4>
                  <p className="text-xs text-amber-700 mt-1">
                    Your message was received, but contains terms flagged for review. It will appear on the wall once approved by the administrator.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={onBackToWall}
              className="bg-wedding-burgundy hover:bg-wedding-burgundy/90 text-white font-sans text-sm font-semibold px-6 py-3 rounded-md shadow-sm transition-all"
            >
              View Wedding Wall
            </button>
            <button
              onClick={resetForm}
              className="border border-wedding-gold/50 text-wedding-burgundy hover:bg-wedding-goldLight/20 font-sans text-sm font-semibold px-6 py-3 rounded-md transition-all"
            >
              Post Another Message
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-12">
      <div className="bg-white border border-wedding-gold/60 rounded-xl p-8 md:p-10 shadow-lg relative overflow-hidden">
        {/* Subtle decorative gold top bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-wedding-gold"></div>

        {/* Heading */}
        <div className="text-center mb-8">
          <Heart className="w-6 h-6 text-wedding-gold mx-auto mb-2 animate-pulse" />
          <h2 className="font-editorial text-3xl font-semibold text-wedding-burgundy mb-2">
            Leave a Congratulatory Message
          </h2>
          <p className="font-sans text-xs text-wedding-charcoal/60 tracking-wider uppercase">
            No registration needed. Share your love.
          </p>
        </div>

        {/* Error notice */}
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-md mb-6 flex items-start space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Submission Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Guest Name */}
          <div>
            <label htmlFor="guest_name" className="block text-xs font-semibold tracking-wider text-wedding-burgundy/80 uppercase mb-2">
              Your Name / Magacaaga *
            </label>
            <input
              type="text"
              id="guest_name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Farah Ahmed or Hodan & Ali"
              className="w-full bg-wedding-ivory/30 border-b border-wedding-gold/55 focus:border-wedding-burgundy outline-none py-2 px-1 font-sans text-sm text-wedding-charcoal transition-all placeholder:text-wedding-charcoal/30"
              maxLength={50}
              disabled={isSubmitting}
            />
            <span className="text-[10px] text-wedding-charcoal/40 block mt-1 text-right">
              {name.length}/50 characters
            </span>
          </div>

          {/* Relationship selector */}
          <div>
            <label className="block text-xs font-semibold tracking-wider text-wedding-burgundy/80 uppercase mb-3">
              Relationship to Couple / Xiriirka Lammaanaha *
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {relationships.map((rel) => {
                const isSelected = relationship === rel.value;
                return (
                  <button
                    key={rel.value}
                    type="button"
                    onClick={() => setRelationship(rel.value)}
                    disabled={isSubmitting}
                    className={`text-xs font-medium py-3 px-2 rounded-full border text-center transition-all ${
                      isSelected
                        ? 'bg-wedding-burgundy border-wedding-burgundy text-white shadow-sm'
                        : 'border-wedding-gold/40 hover:border-wedding-gold bg-wedding-ivory/20 text-wedding-charcoal/80'
                    }`}
                  >
                    {rel.label.split(' ')[0]} {/* Somali word primarily */}
                    <span className="block text-[9px] opacity-60 font-normal">
                      {rel.label.includes('(') ? rel.label.substring(rel.label.indexOf('(')) : ''}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Message text */}
          <div>
            <label htmlFor="message_text" className="block text-xs font-semibold tracking-wider text-wedding-burgundy/80 uppercase mb-2">
              Message / Hambalyadaada *
            </label>
            <textarea
              id="message_text"
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="E.g. Hambalyo arooskiina! Waxaan idiin rajaynayaa guur khayr qaba..."
              rows={4}
              maxLength={300}
              className="w-full bg-wedding-ivory/30 border border-wedding-gold/45 focus:border-wedding-burgundy outline-none p-3 font-sans text-sm text-wedding-charcoal rounded-md transition-all placeholder:text-wedding-charcoal/30 resize-none leading-relaxed"
              disabled={isSubmitting}
            />
            <div className="flex justify-between items-center mt-1">
              <span className="text-[10px] text-wedding-charcoal/40">
                Somali or English greetings welcome
              </span>
              <span className="text-[10px] text-wedding-charcoal/40">
                {message.length}/300 characters
              </span>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-wedding-burgundy hover:bg-wedding-burgundy/90 text-white font-sans text-sm font-semibold py-3 rounded-md shadow-sm transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></span>
                  <span>Posting greeting...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-wedding-gold animate-sparkle" />
                  <span>Post to Wall</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onBackToWall}
              disabled={isSubmitting}
              className="sm:w-1/3 border border-wedding-gold/55 text-wedding-burgundy hover:bg-wedding-goldLight/25 font-sans text-sm font-semibold py-3 rounded-md transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
