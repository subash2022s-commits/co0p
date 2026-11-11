import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase.js';
import { apiService } from '../services/api.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    async function initializeAuth() {
      try {
        const storedToken = localStorage.getItem('agroai_token');
        const storedUser = localStorage.getItem('agroai_user');

        if (isSupabaseConfigured && supabase) {
          const { data: { session: currentSession } } = await supabase.auth.getSession();
          if (currentSession) {
            setSession(currentSession);
            setUser(currentSession.user);
            localStorage.setItem('agroai_token', currentSession.access_token);
            await fetchProfile();
          } else if (storedToken && storedUser) {
            // Restore demo or local session
            setUser(JSON.parse(storedUser));
            setIsDemo(true);
            await fetchProfile();
          }
        } else if (storedToken && storedUser) {
          setUser(JSON.parse(storedUser));
          setIsDemo(true);
          await fetchProfile();
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setLoading(false);
      }
    }

    initializeAuth();

    // Listen for auth state changes if Supabase is active
    if (isSupabaseConfigured && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
        if (newSession) {
          setSession(newSession);
          setUser(newSession.user);
          localStorage.setItem('agroai_token', newSession.access_token);
          await fetchProfile();
        } else {
          setSession(null);
          setUser(null);
          setProfile(null);
          localStorage.removeItem('agroai_token');
          localStorage.removeItem('agroai_user');
        }
      });
      return () => subscription.unsubscribe();
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await apiService.getProfile();
      if (res.success && res.data) {
        setProfile(res.data);
      }
    } catch (err) {
      console.warn('Could not fetch user profile:', err);
    }
  };

  const login = async (email, password) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      setSession(data.session);
      setUser(data.user);
      localStorage.setItem('agroai_token', data.session.access_token);
      await fetchProfile();
      return data;
    } else {
      // Demo / Offline login mode
      const demoUser = {
        id: '00000000-0000-0000-0000-000000000001',
        email,
        user_metadata: { full_name: email.split('@')[0], preferred_language: 'en' },
      };
      const demoToken = 'demo-token-' + btoa(JSON.stringify({ sub: demoUser.id, email }));
      localStorage.setItem('agroai_token', demoToken);
      localStorage.setItem('agroai_user', JSON.stringify(demoUser));
      setUser(demoUser);
      setIsDemo(true);
      await fetchProfile();
      return { user: demoUser };
    }
  };

  const register = async (email, password, fullName, preferredLanguage = 'en') => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            preferred_language: preferredLanguage,
          },
        },
      });
      if (error) throw error;
      if (data.session) {
        setSession(data.session);
        setUser(data.user);
        localStorage.setItem('agroai_token', data.session.access_token);
        await fetchProfile();
      }
      return data;
    } else {
      const demoUser = {
        id: crypto.randomUUID ? crypto.randomUUID() : '00000000-0000-0000-0000-000000000001',
        email,
        user_metadata: { full_name: fullName, preferred_language: preferredLanguage },
      };
      const demoToken = 'demo-token-' + btoa(JSON.stringify({ sub: demoUser.id, email }));
      localStorage.setItem('agroai_token', demoToken);
      localStorage.setItem('agroai_user', JSON.stringify(demoUser));
      setUser(demoUser);
      setIsDemo(true);
      await apiService.updateProfile({
        full_name: fullName,
        preferred_language: preferredLanguage,
      });
      await fetchProfile();
      return { user: demoUser };
    }
  };

  const loginDemo = async () => {
    const demoUser = {
      id: '00000000-0000-0000-0000-000000000001',
      email: 'farmer.demo@agroai.in',
      user_metadata: { full_name: 'Ramesh Patel (Demo Farmer)', preferred_language: 'en' },
    };
    const demoToken = 'demo-token-' + btoa(JSON.stringify({ sub: demoUser.id, email: demoUser.email }));
    localStorage.setItem('agroai_token', demoToken);
    localStorage.setItem('agroai_user', JSON.stringify(demoUser));
    setUser(demoUser);
    setIsDemo(true);
    await apiService.updateProfile({
      full_name: 'Ramesh Patel',
      state: 'Karnataka',
      district: 'Mandya',
      land_area: 4.5,
      land_unit: 'acre',
      farming_type: 'Mixed Crop-Livestock',
      irrigation_available: true,
      preferred_language: 'en',
    });
    await fetchProfile();
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('agroai_token');
    localStorage.removeItem('agroai_user');
    setUser(null);
    setSession(null);
    setProfile(null);
    setIsDemo(false);
  };

  const updateProfileData = async (updatedData) => {
    const res = await apiService.updateProfile(updatedData);
    if (res.success && res.data) {
      setProfile(res.data);
    }
    return res;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        isDemo,
        isSupabaseConfigured,
        login,
        register,
        loginDemo,
        logout,
        updateProfile: updateProfileData,
        refreshProfile: fetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

