import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import BannerAdComponent from './src/components/BannerAd';

export default function App() {
  // 상태 관리: 금액, 팁 퍼센트, 계산 결과
  const [bill, setBill] = useState('');
  const [percent, setPercent] = useState('15');
  const billNum = parseFloat(bill) || 0;
  const percentNum = parseFloat(percent) || 0;
  const tip = billNum * (percentNum / 100);
  const total = billNum + tip;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tip Calculator</Text>
      <TextInput
        style={styles.input}
        placeholder="Bill Amount"
        keyboardType="numeric"
        value={bill}
        onChangeText={setBill}
      />
      <TextInput
        style={styles.input}
        placeholder="Tip %"
        keyboardType="numeric"
        value={percent}
        onChangeText={setPercent}
      />
      <Button title="Calculate" onPress={() => {}} />
      <Text style={styles.result}>Tip: ${tip.toFixed(2)}</Text>
      <Text style={styles.result}>Total: ${total.toFixed(2)}</Text>
      <View style={styles.banner}>
        <BannerAdComponent />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  title: { fontSize: 24, marginBottom: 16 },
  input: { width: '80%', padding: 8, borderWidth: 1, borderColor: '#ccc', marginBottom: 12 },
  result: { fontSize: 18, marginTop: 8 },
  banner: { position: 'absolute', bottom: 0, width: '100%' },
});
