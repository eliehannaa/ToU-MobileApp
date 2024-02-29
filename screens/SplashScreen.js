import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../api/axios';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      handleGetToken();
    }, 3000); // duration
  }, []);

  const handleGetToken = async () => {
    try{
      const token = await AsyncStorage.getItem('AccessToken');
      if(!token){
        navigation.replace('LoginScreen');
      }
      else{
        console.log("hi")
        const res = await axios.get('/checktokenmobile', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        console.log(res)
        if (res.data.status == 691){
          await AsyncStorage.setItem("AccessToken", res.data.token);
          navigation.replace('PasteLinkScreen');
        }
        else if(res.data.status == 690){
          await AsyncStorage.setItem("AccessToken", res.data.token);
          navigation.replace('TravelerMainScreen');
        }
        else{
          navigation.replace('LoginScreen');
        }
      }
    }
    catch(err){
      console.log(err);
      navigation.replace('LoginScreen')
    }
  }


  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.png')} // logo path
        style={styles.logo}
      />
    </View>
  );
};

SplashScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});

export default SplashScreen;
