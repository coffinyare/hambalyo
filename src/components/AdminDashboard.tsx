import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Trash2, ShieldAlert, Filter, Lock, Unlock, ArrowLeft } from 'lucide-react';
import { RELATIONSHIP_LABELS } from '../types';
import type { GreetingMessage } from '../types';

interface AdminDashboardProps {
  messages: GreetingMessage[];
  onToggleApproval: (id: string) => void;
  onDeleteMessage: (id: string) => void;
  onBackToWall: () => void;
  isDbConnected?: boolean;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  messages,
  onToggleApproval,
  onDeleteMessage,
  onBackToWall,
  isDbConnected = false,
}) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState(false);
  
  const [filterType, setFilterType] = useState<'all' | 'approved' | 'pending'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Read query parameters to check for auto-login
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const passParam = params.get('pass');
    if (passParam === 'wedding2026') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'wedding2026') {
      setIsAuthenticated(true);
      setAuthError(false);
      
      // Update URL query parameter silently so refreshing keeps admin logged in
      const newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?pass=wedding2026';
      window.history.pushState({ path: newurl }, '', newurl);
    } else {
      setAuthError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    // Remove query parameter
    const newurl = window.location.protocol + "//" + window.location.host + window.location.pathname;
    window.history.pushState({ path: newurl }, '', newurl);
  };

  // Filter messages
  const filteredMessages = messages.filter((msg) => {
    // Tab Filter
    if (filterType === 'approved' && !msg.is_approved) return false;
    if (filterType === 'pending' && msg.is_approved) return false;
    
    // Search filter
    if (searchTerm.trim() !== '') {
      const search = searchTerm.toLowerCase();
      const nameMatch = msg.guest_name.toLowerCase().includes(search);
      const textMatch = msg.message_text.toLowerCase().includes(search);
      const relationMatch = (RELATIONSHIP_LABELS[msg.relationship] || '').toLowerCase().includes(search);
      return nameMatch || textMatch || relationMatch;
    }
    
    return true;
  });

  // Calculate statistics
  const totalCount = messages.length;
  const approvedCount = messages.filter(m => m.is_approved).length;
  const pendingCount = totalCount - approvedCount;

  // Unauthenticated Password Gate UI
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-6 py-20">
        <div className="bg-white border border-wedding-gold/60 rounded-xl p-8 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-wedding-burgundy"></div>
          
          <div className="text-center mb-6">
            <Lock className="w-8 h-8 text-wedding-gold mx-auto mb-3" />
            <h2 className="font-editorial text-2xl font-semibold text-wedding-burgundy mb-2">
              Admin Moderation Panel
            </h2>
            <p className="font-sans text-xs text-wedding-charcoal/60">
              Access is restricted. Enter coordinator password.
            </p>
          </div>

          {authError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 rounded-md mb-4 flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-red-500" />
              <span>Incorrect password. Hint: check your specification.</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="pass" className="block text-xs font-semibold text-wedding-burgundy/80 uppercase mb-2">
                Moderation Password
              </label>
              <input
                type="password"
                id="pass"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full bg-wedding-ivory/40 border border-wedding-gold/50 focus:border-wedding-burgundy outline-none p-2.5 rounded-md font-sans text-sm"
                required
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 bg-wedding-burgundy hover:bg-wedding-burgundy/90 text-white font-sans text-sm font-semibold py-2.5 rounded-md transition-all shadow-sm"
              >
                Unlock Dashboard
              </button>
              <button
                type="button"
                onClick={onBackToWall}
                className="border border-wedding-gold/50 text-wedding-burgundy hover:bg-wedding-goldLight/20 font-sans text-sm font-semibold py-2.5 px-4 rounded-md transition-all"
              >
                Back
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Authenticated Admin Dashboard UI
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {!isDbConnected && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs p-4 rounded-lg mb-6 flex items-start space-x-2">
          <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div>
            <span className="font-semibold block">Supabase Connection Offline (Running Local Sync fallback)</span>
            <span className="block mt-0.5 opacity-90">
              The application is currently running in local fallback mode using LocalStorage. To connect to a live Supabase project, configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in a `.env` file in the root.
            </span>
          </div>
        </div>
      )}
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-wedding-gold/20 pb-6 mb-8 gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <Unlock className="w-5 h-5 text-wedding-gold" />
            <h2 className="font-editorial text-3xl font-semibold text-wedding-burgundy">
              Moderation Dashboard
            </h2>
          </div>
          <p className="font-sans text-xs text-wedding-charcoal/60 mt-1">
            Toggle card visibility or delete messages live on the wedding wall.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onBackToWall}
            className="inline-flex items-center border border-wedding-gold/50 text-wedding-burgundy hover:bg-wedding-goldLight/20 font-sans text-xs font-semibold px-4 py-2 rounded-md transition-all"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            View Wall
          </button>
          <button
            onClick={handleLogout}
            className="bg-wedding-burgundy/10 text-wedding-burgundy hover:bg-wedding-burgundy/20 font-sans text-xs font-semibold px-4 py-2 rounded-md transition-all"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-4 mb-8 text-center">
        <div className="bg-white border border-wedding-gold/30 rounded-lg p-4 shadow-sm">
          <span className="text-2xl font-bold text-wedding-burgundy">{totalCount}</span>
          <p className="text-[10px] text-wedding-charcoal/50 font-semibold uppercase mt-1">Total Posts</p>
        </div>
        <div className="bg-white border border-wedding-gold/30 rounded-lg p-4 shadow-sm">
          <span className="text-2xl font-bold text-emerald-600">{approvedCount}</span>
          <p className="text-[10px] text-wedding-charcoal/50 font-semibold uppercase mt-1">Live Approved</p>
        </div>
        <div className="bg-white border border-wedding-gold/30 rounded-lg p-4 shadow-sm">
          <span className="text-2xl font-bold text-amber-600">{pendingCount}</span>
          <p className="text-[10px] text-wedding-charcoal/50 font-semibold uppercase mt-1">Flagged / Pending</p>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 bg-wedding-goldLight/20 border border-wedding-gold/20 p-4 rounded-lg">
        {/* View Tabs */}
        <div className="flex space-x-1.5 bg-white p-1 rounded-md border border-wedding-gold/25 w-full sm:w-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-all flex-1 sm:flex-initial ${
              filterType === 'all'
                ? 'bg-wedding-burgundy text-white'
                : 'text-wedding-charcoal/70 hover:text-wedding-burgundy'
            }`}
          >
            All Messages ({totalCount})
          </button>
          <button
            onClick={() => setFilterType('approved')}
            className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-all flex-1 sm:flex-initial ${
              filterType === 'approved'
                ? 'bg-wedding-burgundy text-white'
                : 'text-wedding-charcoal/70 hover:text-wedding-burgundy'
            }`}
          >
            Approved ({approvedCount})
          </button>
          <button
            onClick={() => setFilterType('pending')}
            className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-all flex-1 sm:flex-initial ${
              filterType === 'pending'
                ? 'bg-wedding-burgundy text-white'
                : 'text-wedding-charcoal/70 hover:text-wedding-burgundy'
            }`}
          >
            Flagged ({pendingCount})
          </button>
        </div>

        {/* Search input */}
        <div className="w-full sm:w-64 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, greeting..."
            className="w-full bg-white border border-wedding-gold/40 focus:border-wedding-burgundy outline-none pl-3 pr-8 py-2 rounded-md font-sans text-xs"
          />
          <Filter className="w-3.5 h-3.5 text-wedding-gold absolute right-3 top-2.5" />
        </div>
      </div>

      {/* Message List */}
      {filteredMessages.length === 0 ? (
        <div className="text-center py-16 bg-white border border-wedding-gold/20 rounded-lg p-6">
          <p className="text-wedding-charcoal/50 text-sm">No messages matching criteria.</p>
        </div>
      ) : (
        <div className="bg-white border border-wedding-gold/30 rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-wedding-goldLight/20 border-b border-wedding-gold/20 text-xs font-semibold text-wedding-burgundy/80 uppercase">
                  <th className="p-4 w-1/4">Guest</th>
                  <th className="p-4 w-1/6">Relation</th>
                  <th className="p-4 w-5/12">Greeting Card Text</th>
                  <th className="p-4 text-center w-1/6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-wedding-gold/10 font-sans text-xs">
                {filteredMessages.map((msg) => (
                  <tr 
                    key={msg.id} 
                    className={`hover:bg-wedding-goldLight/5 transition-colors ${
                      !msg.is_approved ? 'bg-amber-50/40' : ''
                    }`}
                  >
                    {/* Guest Name & Timestamp */}
                    <td className="p-4">
                      <div className="font-semibold text-wedding-charcoal text-sm">{msg.guest_name}</div>
                      <div className="text-[10px] text-wedding-charcoal/40 mt-0.5">
                        {new Date(msg.created_at).toLocaleString()}
                      </div>
                    </td>

                    {/* Relationship Badge */}
                    <td className="p-4">
                      <span className="inline-block bg-[#EAE1D1] text-wedding-burgundy text-[9px] font-bold px-2 py-0.5 rounded-full border border-wedding-gold/20 uppercase">
                        {msg.relationship}
                      </span>
                    </td>

                    {/* Greeting Content */}
                    <td className="p-4">
                      <p className="font-editorial text-sm italic text-wedding-charcoal leading-relaxed max-w-lg select-text">
                        “{msg.message_text}”
                      </p>
                    </td>

                    {/* Moderation Actions */}
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        {/* Toggle Approval Button */}
                        <button
                          onClick={() => onToggleApproval(msg.id)}
                          title={msg.is_approved ? 'Hide from Wall' : 'Approve for Wall'}
                          className={`p-2 rounded-md transition-all ${
                            msg.is_approved 
                              ? 'text-emerald-600 hover:bg-emerald-50' 
                              : 'text-amber-600 hover:bg-amber-50 border border-amber-300 bg-amber-50'
                          }`}
                        >
                          {msg.is_approved ? (
                            <Eye className="w-4 h-4" />
                          ) : (
                            <EyeOff className="w-4 h-4" />
                          )}
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete the greeting from "${msg.guest_name}"?`)) {
                              onDeleteMessage(msg.id);
                            }
                          }}
                          title="Delete Permanently"
                          className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
