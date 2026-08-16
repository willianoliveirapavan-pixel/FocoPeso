import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  MealLog,
  MealType,
  AiFoodAnalysisResult,
} from './types';
import {
  getLocalProfile,
  updateUserProfile,
  addMealLog,
  deleteMealLog,
  subscribeMealsByDate,
  subscribeAllMeals,
} from './services/storageService';
import { subscribeAuthState, logoutUser } from './services/authService';
import { Header } from './components/layout/Header';
import { Dashboard } from './components/dashboard/Dashboard';
import { ReportsView } from './components/history/ReportsView';
import { BottomNav } from './components/layout/BottomNav';
import { CameraModal } from './components/modals/CameraModal';
import { FoodConfirmationModal } from './components/modals/FoodConfirmationModal';
import { ManualAddModal } from './components/modals/ManualAddModal';
import { ProfileModal } from './components/modals/ProfileModal';
import { PlatformInfoModal } from './components/modals/PlatformInfoModal';
import { AdminModal } from './components/modals/AdminModal';
import { LoginView } from './components/auth/LoginView';
import { SubscriptionPaywallModal } from './components/auth/SubscriptionPaywallModal';
import { Utensils } from 'lucide-react';

export function App() {
  const [user, setUser] = useState<UserProfile>(getLocalProfile());
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [meals, setMeals] = useState<MealLog[]>([]);
  const [allMeals, setAllMeals] = useState<MealLog[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history' | 'profile'>(
    'dashboard'
  );

  // Modals state
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPlatformInfoOpen, setIsPlatformInfoOpen] = useState(false);
  const [platformInfoTab, setPlatformInfoTab] = useState<'planos' | 'funcionalidades' | 'ferramentas' | 'privacidade'>('planos');
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Analysis result passing
  const [aiResult, setAiResult] = useState<AiFoodAnalysisResult | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  // Initialize Auth listener
  useEffect(() => {
    const unsubscribeAuth = subscribeAuthState((profile, rawUser) => {
      if (profile && rawUser) {
        setUser(profile);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setAuthLoading(false);
    });
    return () => unsubscribeAuth();
  }, []);

  // Check for successful payment return parameter from Stripe
  useEffect(() => {
    if (!isAuthenticated || !user) return;
    
    const params = new URLSearchParams(window.location.search);
    if (params.get('paid') === 'true' || params.get('payment_success') === 'true') {
      const updatedUser: UserProfile = {
        ...user,
        isPaid: true,
        plan: 'beta',
      };
      setUser(updatedUser);
      updateUserProfile(updatedUser).then(() => {
        // Clean up URL query parameters to look clean
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
      });
    }
  }, [isAuthenticated, user]);

  // Subscribe to all meals for history view when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;
    const unsubscribeAll = subscribeAllMeals((userAllMeals) => {
      setAllMeals(userAllMeals);
    });
    return () => unsubscribeAll();
  }, [isAuthenticated]);

  // Subscribe to meals on selected date when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;
    const unsubscribeMeals = subscribeMealsByDate(selectedDate, (dateMeals) => {
      setMeals(dateMeals);
    });
    return () => unsubscribeMeals();
  }, [selectedDate, isAuthenticated]);

  // Handlers
  const handleSaveProfile = async (updated: UserProfile) => {
    setUser(updated);
    await updateUserProfile(updated);
  };

  const handleLogout = async () => {
    await logoutUser();
    setIsAuthenticated(false);
    setIsProfileOpen(false);
  };

  const handleAnalysisComplete = (
    result: AiFoodAnalysisResult,
    imageBase64: string
  ) => {
    setAiResult(result);
    setCapturedImage(imageBase64);
    setIsCameraOpen(false);
    setIsConfirmationOpen(true);
  };

  const handleSaveMeal = async (newMeal: MealLog) => {
    await addMealLog(newMeal);
  };

  const handleDeleteMeal = async (mealId: string) => {
    await deleteMealLog(mealId);
  };

  const handleConfirmPayment = async () => {
    const updatedUser: UserProfile = {
      ...user,
      isPaid: true,
      plan: 'beta',
    };
    setUser(updatedUser);
    await updateUserProfile(updatedUser);
  };

  // Loading screen during initial auth verification
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 animate-pulse">
            <Utensils className="w-8 h-8" />
          </div>
          <h1 className="text-lg font-bold text-white">FocoPeso</h1>
          <div className="w-6 h-6 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  // Gate app behind login screen
  if (!isAuthenticated) {
    return <LoginView />;
  }

  // Gate app behind mandatory plan subscription payment
  const isUserPaid = user.isPaid || user.email.toLowerCase().trim() === 'willianoliveirapavan@gmail.com' || user.role === 'admin';
  if (!isUserPaid) {
    return (
      <SubscriptionPaywallModal
        user={user}
        onConfirmPayment={handleConfirmPayment}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Off-Canvas Header */}
      <Header
        user={user}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        onOpenScan={() => setIsCameraOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenPlatformInfo={(tab) => {
          if (tab) setPlatformInfoTab(tab);
          setIsPlatformInfoOpen(true);
        }}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 lg:p-8">
        {activeTab === 'dashboard' && (
          <Dashboard
            user={user}
            meals={meals}
            onOpenScan={() => setIsCameraOpen(true)}
            onOpenManual={() => setIsManualOpen(true)}
            onDeleteMeal={handleDeleteMeal}
          />
        )}

        {activeTab === 'history' && (
          <ReportsView
            user={user}
            allMeals={allMeals}
            onSelectDate={(d) => {
              setSelectedDate(d);
              setActiveTab('dashboard');
            }}
            onDeleteMeal={handleDeleteMeal}
            onOpenScan={() => setIsCameraOpen(true)}
          />
        )}

        {activeTab === 'profile' && (
          <div className="pt-2">
            <ProfileModal
              isOpen={true}
              onClose={() => setActiveTab('dashboard')}
              user={user}
              onSaveProfile={handleSaveProfile}
            />
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (tab === 'profile') {
            setIsProfileOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        onOpenScan={() => setIsCameraOpen(true)}
      />

      {/* AI Camera Modal */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onAnalysisComplete={handleAnalysisComplete}
      />

      {/* AI Food Confirmation & Editing Modal (Step 3) */}
      <FoodConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        analysisResult={aiResult}
        selectedImage={capturedImage}
        selectedDate={selectedDate}
        onSaveMeal={handleSaveMeal}
      />

      {/* Manual Food Add Modal */}
      <ManualAddModal
        isOpen={isManualOpen}
        onClose={() => setIsManualOpen(false)}
        selectedDate={selectedDate}
        onSaveMeal={handleSaveMeal}
      />

      {/* Profile & Goals Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
        onSaveProfile={handleSaveProfile}
      />

      {/* Platform Info & Subscriptions Modal */}
      <PlatformInfoModal
        isOpen={isPlatformInfoOpen}
        onClose={() => setIsPlatformInfoOpen(false)}
        user={user}
        initialTab={platformInfoTab}
        onUpgradeToBeta={async () => {
          const updated: UserProfile = { ...user, plan: 'beta' };
          setUser(updated);
          await updateUserProfile(updated);
        }}
      />

      {/* Exclusive Admin Panel Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        user={user}
      />
    </div>
  );
}

export default App;
