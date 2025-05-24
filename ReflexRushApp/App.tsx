import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BannerAdComponent from './src/components/BannerAd';
import InterstitialManager from './src/ads/InterstitialManager';

export default function App() {
  const [state, setState] = useState<'idle' | 'waiting' | 'go'>('idle');
  const [message, setMessage] = useState('Tap to start');
  const [time, setTime] = useState<number | null>(null);
  const [best, setBest] = useState<number | null>(null);
  const startRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 전면 광고 및 최고 기록 로드
    InterstitialManager.getInstance();
    AsyncStorage.getItem('bestTime').then(v => {
      if (v) setBest(Number(v));
    });
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const startGame = () => {
    setState('waiting');
    setMessage('Wait for green...');
    const delay = 1000 + Math.random() * 2000;
    timeoutRef.current = setTimeout(() => {
      startRef.current = Date.now();
      setState('go');
      setMessage('Tap!');
    }, delay);
  };

  const handlePress = () => {
    if (state === 'go') {
      const reaction = Date.now() - startRef.current;
      setTime(reaction);
      if (best === null || reaction < best) {
        setBest(reaction);
        AsyncStorage.setItem('bestTime', String(reaction));
      }
      setMessage('Tap to start');
      setState('idle');
      InterstitialManager.getInstance().showOnce();
    } else if (state === 'idle') {
      setTime(null);
      startGame();
    }
  };

  const backgroundColor = state === 'go' ? '#00AA00' : '#0044AA';

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={[styles.container, { backgroundColor }]}>        
        <Text style={styles.text}>{message}</Text>
        {time !== null && <Text style={styles.text}>Time: {time}ms</Text>}
        {best !== null && <Text style={styles.text}>Best: {best}ms</Text>}
        <View style={styles.banner}>
          <BannerAdComponent />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { color: '#fff', fontSize: 20, margin: 8 },
  banner: { position: 'absolute', bottom: 0, width: '100%' },
});
