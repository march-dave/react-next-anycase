import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InterstitialManager from '../ads/InterstitialManager';
import useRewardedAd from '../hooks/useRewardedAd';

type ContextValue = {
  todayTask: { text: string };
  streak: number;
  completeTask: () => void;
  skipWithReward: () => Promise<void>;
};

const GlobalContext = createContext<ContextValue | undefined>(undefined);

export const GlobalProvider: React.FC<{ todayTask: { text: string } }> = ({ children, todayTask }) => {
  const [completedDates, setCompletedDates] = useState<string[]>([]);
  const [streak, setStreak] = useState(0);
  const [skipTokens, setSkipTokens] = useState(0);

  const showRewarded = useRewardedAd();

  useEffect(() => {
    const load = async () => {
      const data = await AsyncStorage.getItem('state');
      if (data) {
        const parsed = JSON.parse(data);
        setCompletedDates(parsed.completedDates || []);
        setStreak(parsed.streak || 0);
        setSkipTokens(parsed.skipTokens || 0);
      }
    };
    load();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('state', JSON.stringify({ completedDates, streak, skipTokens }));
  }, [completedDates, streak, skipTokens]);

  const completeTask = () => {
    const today = new Date().toISOString().slice(0, 10);
    if (!completedDates.includes(today)) {
      setCompletedDates([...completedDates, today]);
      setStreak(streak + 1);
      InterstitialManager.getInstance().showOnce();
    }
  };

  const skipWithReward = async () => {
    await showRewarded();
    setSkipTokens(skipTokens + 1);
  };

  return (
    <GlobalContext.Provider value={{ todayTask, streak, completeTask, skipWithReward }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => {
  const ctx = useContext(GlobalContext);
  if (!ctx) throw new Error('GlobalContext missing');
  return ctx;
};
