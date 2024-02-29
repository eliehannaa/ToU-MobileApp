import React from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import { Platform, StatusBar} from 'react-native';
import PendingOrderCard from '../../components/PendingOrderCard';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import axios from '../../api/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PendingOrdersScreen = ({ navigation }) => {

  const [products, setProducts] = useState(null);

  const handleProducts = async () => {
    try{
      console.log("We are here 7");
      const token = await AsyncStorage.getItem('AccessToken');
      console.log(token);
      const res = await axios.get('/client/home/pendingorders',//post request
      {
        headers: { 'Content-Type': 'application/json' ,
                    'Authorization': `Bearer ${token}`
                  }
      }
      );
      console.log(res.data[0])
      AsyncStorage.setItem("AccessToken", res.data[0].token);
      const list = []
      const pr = res.data[0].porders
      for(let i=0;i<res.data[0].porders.length;i++){
        list.push({id: pr[i].order._id, title: pr[i].product.title, price: pr[i].product.price, image: pr[i].product.image, url: pr[i].product.url, inStock: pr[i].product.inStock, quantity: pr[i].order.quantity})
      }
      console.log(list)

      return list;

    }catch(err){

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

  useEffect(() => {
    const fetchProducts = async () => {
      const products = await handleProducts();
      setProducts(products);
    };
    fetchProducts();
  }, []);



  //get list of json product objects from server (pending orders)
  // Backend API call to get pending orders

  // Render each product as a PendingOrderCard component
  const renderProduct = ({ item }) =>  <PendingOrderCard product={item} />;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Pending Orders</Text>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backContainer}>
        <View style={styles.backButtonContainer}>
          <Ionicons name="ios-close" size={28} color="#3274cb" />
        </View>
      </TouchableOpacity>
      <FlatList
        data={products} // replace with actual pending orders
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 20 ,
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#3274cb',
    textAlign: 'center',
  },
  backContainer: {
    position: 'absolute',
    top: 20,
    right: 10,
    zIndex: 9999,
  },
  backButtonContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PendingOrdersScreen;
