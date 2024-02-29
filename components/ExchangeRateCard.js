import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ExchangeRateCard = ({ exchangeRate }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Exchange Rate</Text>
      <Text style={styles.rate}>{`1 USD = ${exchangeRate} LBP`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3274cb',
    marginBottom: 8,
  },
  rate: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
});

export default ExchangeRateCard;
