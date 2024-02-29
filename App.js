import 'react-native-gesture-handler';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import SupportScreen from './screens/SupportScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
// const express = require('express');
// const app = express();

//Client Screens
import PasteLinkScreen from './screens/ClientScreens/PasteLinkScreen';
import ActiveOrdersScreen from './screens/ClientScreens/ActiveOrdersScreen';
import PendingOrdersScreen from './screens/ClientScreens/PendingOrdersScreen';
import ProductPage  from './screens/ClientScreens/ProductPage';
import SettingsScreen from './screens/ClientSettingsScreen';
import FeedbackScreen from './screens/ClientScreens/FeedbackScreen';


//Traveler Screens
import ApplyAsTravelerScreen from './screens/ApplyAsTravelerScreen';
import TravelerMainScreen from './screens/TravelerScreens/TravelerMainScreen';
import ActiveOrdersScreen2 from './screens/TravelerScreens/ActiveOrdersScreen2';
import PendingOrdersScreen2 from './screens/TravelerScreens/PendingOrdersScreen2';
import TravelerSettingsScreen from './screens/TravelerScreens/TravelerSettingsScreen';


import { NavigationContainer } from '@react-navigation/native';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen">
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RegisterScreen"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ApplyAsTravelerScreen"
          component={ApplyAsTravelerScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PasteLinkScreen"
          component={PasteLinkScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ActiveOrdersScreen"
          component={ActiveOrdersScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PendingOrdersScreen"
          component={PendingOrdersScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SettingsScreen"
          component={SettingsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SupportScreen"
          component={SupportScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProductPage"
          component={ProductPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TravelerMainScreen"
          component={TravelerMainScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ActiveOrdersScreen2"
          component={ActiveOrdersScreen2}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PendingOrdersScreen2"
          component={PendingOrdersScreen2}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TravelerSettingsScreen"
          component={TravelerSettingsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ForgotPasswordScreen"
          component={ForgotPasswordScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="FeedbackScreen"
          component={FeedbackScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// app.listen(3000, function(){
//   console.log("Server started on port 3000");
// })

