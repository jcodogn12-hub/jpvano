
import React, { useState, useEffect } from 'react';
import { db } from './services/db';
import { User, Product, Sale, AuthState, VirtualCard } from './types';

// Componentes corrigidos para caminhos relativos
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Products from './components/Products';
import AdminPanel from './components/AdminPanel';
import Financial from './components/Financial';
import VirtualCards from './components/VirtualCards';
import Settings from './components/Settings';

const App: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>({ user: null, isAuthenticated: false });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [virtualCards, setVirtualCards] = useState<VirtualCard[]>([]);

  useEffect(() => {
    const users = db.users();
    let master = users.find(u => u.role === 'ADMIN');
    
    if (!master) {
      master = {
        id: 'master-001',
        name: 'JP Vano Master',
        email: 'master@jpvano.com',
        balance: 999999999999,
        role: 'ADMIN',
        stripeConnected: true
      };
      db.saveUsers([...users, master]);
    }

    setAuthState({ user: master, isAuthenticated: true });
    setProducts(db.products());
    setSales(db.sales());
    setVirtualCards(db.virtualCards());
  }, []);

  const handleUpdateUserBalance = (userId: string, newBalance: number) => {
    const updatedUsers = db.users().map(u => u.id === userId ? { ...u, balance: newBalance } : u);
    db.saveUsers(updatedUsers);
    if (authState.user?.id === userId) {
      setAuthState(prev => ({ ...prev, user: { ...prev.user!, balance: newBalance } }));
    }
  };

  const handleIssueCard = (label: string, amount: number) => {
    if (!authState.user) return;
    const newCard: VirtualCard = {
      id: Math.random().toString(36).substr(2, 9),
      userId: authState.user.id,
      label,
      balance: amount,
      number: Array.from({length:4}, () => Math.floor(1000 + Math.random() * 9000)).join(' '),
      expiry: '12/29',
      cvv: Math.floor(100 + Math.random() * 899).toString(),
      status: 'ACTIVE',
      brand: 'VISA',
      createdAt: new Date().toISOString()
    };
    const updated = [...virtualCards, newCard];
    setVirtualCards(updated);
    db.saveVirtualCards(updated);
    if (authState.user.role !== 'ADMIN') {
      handleUpdateUserBalance(authState.user.id, authState.user.balance - amount);
    }
  };

  const renderContent = () => {
    if (!authState.user) return null;
    switch(activeTab) {
      case 'dashboard': return <Dashboard user={authState.user} sales={sales} />;
      case 'products': return <Products products={products} user={authState.user} />;
      case 'cards': return <VirtualCards user={authState.user} cards={virtualCards} onIssue={handleIssueCard} />;
      case 'financial': return <Financial user={authState.user} />;
      case 'admin': return <AdminPanel adminUser={authState.user} onUpdateBalance={handleUpdateUserBalance} />;
      case 'settings': return <Settings user={authState.user} />;
      default: return <Dashboard user={authState.user} sales={sales} />;
    }
  };

  if (!authState.isAuthenticated) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-[#D4AF37] font-black text-xl animate-pulse tracking-widest uppercase">
        JPVANO Infrastructure Loading...
      </div>
    </div>
  );

  return (
    <Layout 
      user={authState.user!} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      onLogout={() => window.location.reload()}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
