import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { WeddingWall } from './components/WeddingWall';
import { GuestForm } from './components/GuestForm';
import { AdminDashboard } from './components/AdminDashboard';
import { useMessages } from './useMessages';

function App() {
  const { messages, addMessage, toggleApproval, deleteMessage, resetToSeeds, isDbConnected } = useMessages();
  const [view, setView] = useState<'wall' | 'form' | 'admin'>('wall');

  // Handle URL changes to support automatic admin login via ?pass=wedding2026
  useEffect(() => {
    const handleUrlCheck = () => {
      const params = new URLSearchParams(window.location.search);
      if (params.get('pass') === 'wedding2026') {
        setView('admin');
      }
    };
    handleUrlCheck();
    
    // Also listen to popstate if they go back/forward
    window.addEventListener('popstate', handleUrlCheck);
    return () => window.removeEventListener('popstate', handleUrlCheck);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-wedding-ivory">
      {/* Header */}
      <Header currentView={view} setView={setView} />

      {/* Main Content Area */}
      <main className="flex-grow">
        {view === 'wall' && (
          <WeddingWall 
            messages={messages} 
            onPostClick={() => setView('form')}
            resetToSeeds={resetToSeeds}
            isDbConnected={isDbConnected}
          />
        )}
        
        {view === 'form' && (
          <GuestForm 
            onAddMessage={addMessage} 
            onBackToWall={() => setView('wall')}
          />
        )}

        {view === 'admin' && (
          <AdminDashboard
            messages={messages}
            onToggleApproval={toggleApproval}
            onDeleteMessage={deleteMessage}
            onBackToWall={() => setView('wall')}
            isDbConnected={isDbConnected}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
