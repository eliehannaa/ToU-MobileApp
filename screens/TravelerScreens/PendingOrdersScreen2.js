import React from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Platform, StatusBar} from 'react-native';
import PendingOrderCard2 from '../../components/traveler_components/PendingOrderCard2';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import axios from '../../api/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

//importing fake data for testing
import pendingProducts from '../../fake_data/pendingProducts'

const PendingOrdersScreen2 = ({ navigation }) => {
  const route = useRoute();
  const [products, setProducts] = useState([]);

  //get list of json product objects from server (pending orders)

  const handleProducts = async () => {
    try{
      console.log("We are here 11");
      const token = await AsyncStorage.getItem('AccessToken');
      console.log(token);
      const res = await axios.get('/traveler/home/pendingorders',
      {
        headers: { 
                    'Content-Type': 'application/json' ,
                    'Authorization': `Bearer ${token}`
                  }
      }
      );
      AsyncStorage.setItem("AccessToken",res.data[0].token)
      console.log(res.data)
      const list = []
      const pr = res.data[0].porders
      for(let i=0;i<res.data[0].porders.length;i++){
        list.push({id: pr[i].order._id, title: pr[i].product.title, price: pr[i].product.price, image: pr[i].product.image, url: pr[i].product.url, inStock: pr[i].product.inStock, status: pr[i].order.status, commission: pr[i].order.t_commission.toFixed(2), quantity: pr[i].order.quantity})
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


  // Render each product as a PendingOrderCard component
  const renderProduct = ({ item }) => <PendingOrderCard2 product={item} />;

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
        keyExtractor={(item) => item.id.toString()}
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

export default PendingOrdersScreen2;
