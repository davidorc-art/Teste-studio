import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Agenda } from './components/Agenda';
import { Bar } from './components/Bar';
import { Financials } from './components/Financials';
import { Clients } from './components/Clients';
import { AiAssistant } from './components/AiAssistant';
import { AppState, Professional } from './types';

function App() {
  const [view, setView] = useState<AppState['view']>('dashboard');
  const [currentUser, setCurrentUser] = useState<Professional>(Professional.ADMIN);

  const renderView = () => {
    switch (view) {
      case 'dashboard': return <Dashboard currentUser={currentUser} />;
      case 'agenda': return <Agenda currentUser={currentUser} />;
      case 'bar': return <Bar />;
      case 'financial': return <Financials />;
      case 'clients': return <Clients />;
      case 'ai': return <AiAssistant />;
      default: return <Dashboard currentUser={currentUser} />;
    }
  };

  return (
    <Layout 
      activeView={view} 
      onChangeView={setView}
      currentUser={currentUser}
      onSwitchUser={setCurrentUser}
    >
      {renderView()}
    </Layout>
  );
}

export default App;