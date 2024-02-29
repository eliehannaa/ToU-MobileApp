import React, {useState} from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import * as Clipboard from 'expo-clipboard';


const PendingProductCard = ({ product }) => {
  const [url, setUrl] = useState(product.url);

  

  return (
    <View style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.price}>{product.price}</Text>
        <Text style={product.inStock ? styles.inStock : styles.outOfStock}>
          {product.inStock == true ? 'In Stock' : 'Out of Stock'}
        </Text>
        <Text style={styles.price}>Qty: {product.quantity}</Text>
        <TouchableOpacity onPress={() => Clipboard.setStringAsync(url)} style={styles.buttonContainer}>
          <Text style={styles.buttonText}>Copy Link</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 4,
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  price: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  inStock: {
    fontSize: 14,
    color: '#3274cb',
    marginTop: 4,
  },
  outOfStock: {
    fontSize: 14,
    color: 'red',
    marginTop: 4,
  },
  buttonContainer: {
    backgroundColor: '#3274cb',
    padding: 8,
    borderRadius: 4,
    marginTop: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
});

export default PendingProductCard;
