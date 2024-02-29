import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const ProductCard = ({ navigation, product }) => {
  const { imageSource, url, title, price, asin, dimensions, inStock } = product;

  // Variables for remaining details
  const productUrl = url;
  const productID = asin;
  const productDimensions = dimensions;
  const isProductInStock = inStock;

  return (
    <View style={styles.container}>
      <Image source={{ uri: imageSource }} style={styles.image} />
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.price}>{price}</Text>
        <Text style={styles.otherDetails}>ID: {productID}</Text>
        <Text style={styles.otherDetails}>Dimensions: {productDimensions}</Text>
        <Text style={styles.otherDetails}>
          In Stock: {isProductInStock ? 'Yes' : 'No'}
        </Text>
        <Text style={styles.url}>{productUrl}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderColor: '#3274cb', // Added border color
    borderWidth: 1, // Added border width
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 4,
    marginRight: 16,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  price: {
    fontSize: 14,
    color: '#000000',
    marginBottom: 8,
  },
  otherDetails: {
    fontSize: 12,
    color: '#000000',
    marginBottom: 4,
  },
  url: {
    fontSize: 12,
    color: '#3274cb', // Changed color to primary color
  },
});

export default ProductCard;
