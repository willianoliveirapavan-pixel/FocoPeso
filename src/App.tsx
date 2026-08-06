/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserProfile, PlanType, TabType } from './types';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import {
  getUser,
  saveUser,
  isLoggedIn as checkLoggedIn,
  setLoggedIn,
  updateUserPlan,
  clearStorage,
} from './utils/storage';
import { logoutFirebase, getUserProfileFromFirestore, saveUserProfileToFirestore } from './services/firebaseService';
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
import { PlansModal } from './components/PlansModal';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('focopeso_dark_mode') === 'true';
  });

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authDefaultPlan, setAuthDefaultPlan] = useState<PlanType>('free');

  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [plansModalOpen, setPlansModalOpen] = useState(false);

  // Initialize auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is logged in, load profile
        const profile = await getUserProfileFromFirestore(firebaseUser.uid);
        if (profile) {
          setUser(profile);
          saveUser(profile);
          setIsAuth(true);
        } else {
          // Handle case where user auth exists but profile is missing
          await logoutFirebase();
          clearStorage();
          setIsAuth(false);
          setUser(null);
        }
      } else {
        // User is logged out
        clearStorage();
        setIsAuth(false);
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('focopeso_dark_mode', darkMode ? 'true' : 'false');
  }, [darkMode]);

  useEffect(() => {
    if (isAuth && user) {
      getUserProfileFromFirestore(user.id).then((updatedUser) => {
        if (updatedUser) {
          setUser(updatedUser);
          saveUser(updatedUser);
        }
      });
    }
  }, [activeTab]);



  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

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
    clearStorage();
    setIsAuth(false);
    setUser(null);
  };

  const handleUpdateUser = async (updatedUser: UserProfile) => {
    setUser(updatedUser);
    saveUser(updatedUser);
    await saveUserProfileToFirestore(updatedUser);
  };

  // Plan Switcher (simulates plan changes live for testing locked/unlocked features)
  const handlePlanChange = (newPlan: PlanType) => {
    const updated = updateUserPlan(newPlan);
    setUser(updated);
    setActiveTab('overview');
  };

  const handleOpenPlansModal = () => {
    setPlansModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950 flex flex-col font-sans text-gray-800 dark:text-slate-100 antialiased selection:bg-emerald-500 selection:text-white transition-colors">
      {/* Top Header */}
      <Header
        user={user}
        isLoggedIn={isAuth}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        onSelectTab={setActiveTab}
        activeTab={activeTab}
        onPlanChange={handlePlanChange}
        onOpenPlansModal={handleOpenPlansModal}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
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
            onOpenUpgradeModal={handleOpenPlansModal}
            darkMode={darkMode}
            onToggleDarkMode={toggleDarkMode}
          />

          {/* Main Dashboard Content View */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {user && activeTab === 'overview' && (
              <OverviewTab
                user={user}
                onSelectTab={setActiveTab}
                onOpenUpgradeModal={handleOpenPlansModal}
              />
            )}

            {user && activeTab === 'profile' && (
              <ProfileGoalsTab user={user} onUpdateUser={handleUpdateUser} />
            )}

            {user && activeTab === 'calculator' && (
              <CalculatorTab
                user={user}
                onUpdateUser={handleUpdateUser}
                onOpenUpgradeModal={handleOpenPlansModal}
              />
            )}

            {user && activeTab === 'mealplan' && (
              <MealPlanTab
                user={user}
                onOpenUpgradeModal={handleOpenPlansModal}
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

      {/* Plans Modal */}
      {user && (
        <PlansModal
          isOpen={plansModalOpen}
          user={user}
          onClose={() => {
            setPlansModalOpen(false);
            setActiveTab('overview');
          }}
          onUpdatePlan={handlePlanChange}
        />
      )}

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
