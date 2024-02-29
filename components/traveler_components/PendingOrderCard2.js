import React, {useState} from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../../api/axios';


const PendingProductCard = ({ product }) => {
  const [url, setUrl] = useState(product.url);

  const handleRejectOrder = async () => {
    try{
      const token = await AsyncStorage.getItem('AccessToken');
      const res = await axios.post('/traveler/home/neworders/'+ product.id +'/reject', {},
      {
        headers: { 'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  }
      }
      );
      await AsyncStorage.setItem("AccessToken", res.data.token);
    }
    catch(err){
      if(err.status == 401){
        await AsyncStorage.removeItem('AccessToken');
        navigation.reset({
          index: 0,
          routes: [{ name: 'LoginScreen' }],
        })
      }
      else{
        await AsyncStorage.setItem('AccessToken', err.response.data.token);
      }
    }
  }

  const handleRejectClicked = () =>
    Alert.alert('Reject Product', 'Are you sure you want to reject this product?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
        color: 'red',
      },
      {text: 'YES', onPress: () => {
        console.log('YES Pressed');
        handleRejectOrder();
      }
    },

  ]);

  const handleAcceptOrder = async () => {

    try{
      const token = await AsyncStorage.getItem('AccessToken');
      const res = await axios.post('/traveler/home/neworders/'+ product.id +'/accept', {},
      {
        headers: { 'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                }
      }
      );
      await AsyncStorage.setItem("AccessToken", res.data.token);
      console.log(res)
    }
    catch(err){
      if(err.status == 401){
        console.log(err)
        await AsyncStorage.removeItem('AccessToken');
        navigation.reset({
          index: 0,
          routes: [{ name: 'LoginScreen' }],
        })
      }
      else{
        await AsyncStorage.setItem('AccessToken', err.response.data.token);
      }
    }

    
  }

  const handleAcceptClicked = () =>
    Alert.alert('Accept Product', 'Are you sure you want to accept this product?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
        color: 'red',
      },
      {text: 'YES', onPress: async () => {
        console.log('YES Pressed');
        handleAcceptOrder();
      }
    },

  ]);


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
        <Text style={styles.price}>Commission: ${product.commission}</Text>
        <TouchableOpacity onPress={() => Clipboard.setStringAsync(url)} style={styles.buttonContainer}>
          <Text style={styles.buttonText}>Copy Link</Text>
        </TouchableOpacity>
        <View style={styles.btnHolder}> 
          <TouchableOpacity onPress={ handleAcceptClicked } style={styles.buttonContainer}>
            <Text style={styles.buttonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={ handleRejectClicked } style={styles.buttonContainer}>
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
        </View>
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
  btnHolder: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 8,
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
