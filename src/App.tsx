/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserProfile, PlanType, TabType } from './types';
import {
  getUser,
  saveUser,
  isLoggedIn as checkLoggedIn,
  setLoggedIn,
  updateUserPlan,
} from './utils/storage';
import { logoutFirebase } from './services/firebaseService';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { OverviewTab } from './components/OverviewTab';
import { ProfileGoalsTab } from './components/ProfileGoalsTab';
import { CalculatorTab } from './components/CalculatorTab';
import { MealPlanTab } from './components/MealPlanTab';
import { FoodDiaryTab } from './components/FoodDiaryTab';
import { PricingTab } from './components/PricingTab';
import { AiAssistantModal } from './components/AiAssistantModal';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authDefaultPlan, setAuthDefaultPlan] = useState<PlanType>('free');

  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);

  // Initialize stored state
  useEffect(() => {
    const storedUser = getUser();
    setUser(storedUser);
    const logged = checkLoggedIn();
    setIsAuth(logged);
  }, []);

  const handleOpenAuth = (mode: 'login' | 'register', defaultPlan: PlanType = 'free') => {
    setAuthMode(mode);
    setAuthDefaultPlan(defaultPlan);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (loggedUser: UserProfile) => {
    setUser(loggedUser);
    setIsAuth(true);
    setActiveTab('overview');
  };

  const handleLogout = () => {
    logoutFirebase();
    setLoggedIn(false);
    setIsAuth(false);
  };

  const handleUpdateUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    saveUser(updatedUser);
  };

  // Plan Switcher (simulates plan changes live for testing locked/unlocked features)
  const handlePlanChange = (newPlan: PlanType) => {
    const updated = updateUserPlan(newPlan);
    setUser(updated);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col font-sans text-gray-800 antialiased selection:bg-emerald-500 selection:text-white">
      {/* Top Header */}
      <Header
        user={user}
        isLoggedIn={isAuth}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        onSelectTab={setActiveTab}
        activeTab={activeTab}
        onPlanChange={handlePlanChange}
      />

      {/* Main Body Layout */}
      {!isAuth ? (
        <LandingPage onOpenAuth={handleOpenAuth} />
      ) : (
        <div className="max-w-7xl w-full mx-auto flex-1 flex flex-col lg:flex-row">
          {/* Dashboard Sidebar */}
          <Sidebar
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            userPlan={user?.plan || 'free'}
            onOpenUpgradeModal={() => setActiveTab('pricing')}
          />

          {/* Main Dashboard Content View */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {user && activeTab === 'overview' && (
              <OverviewTab
                user={user}
                onSelectTab={setActiveTab}
                onOpenUpgradeModal={() => setActiveTab('pricing')}
              />
            )}

            {user && activeTab === 'profile' && (
              <ProfileGoalsTab user={user} onUpdateUser={handleUpdateUser} />
            )}

            {user && activeTab === 'calculator' && (
              <CalculatorTab
                user={user}
                onUpdateUser={handleUpdateUser}
                onOpenUpgradeModal={() => setActiveTab('pricing')}
              />
            )}

            {user && activeTab === 'mealplan' && (
              <MealPlanTab
                user={user}
                onOpenUpgradeModal={() => setActiveTab('pricing')}
                onOpenAiAssistant={() => setAiAssistantOpen(true)}
              />
            )}

            {user && activeTab === 'diary' && <FoodDiaryTab user={user} />}

            {user && activeTab === 'pricing' && (
              <PricingTab user={user} onUpdatePlan={handlePlanChange} />
            )}
          </main>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        mode={authMode}
        defaultPlan={authDefaultPlan}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* AI Assistant Drawer Modal */}
      {user && (
        <AiAssistantModal
          isOpen={aiAssistantOpen}
          user={user}
          onClose={() => setAiAssistantOpen(false)}
        />
      )}
    </div>
  );
}
