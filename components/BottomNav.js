import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Linking, Alert, Image } from 'react-native';

//for navigation:
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation  } from '@react-navigation/native';


const BottomNav = ({navigation}) => {

  
  // Function to handle navigation to different screens
  const handleNavigation = (screenName) => {
    navigation.navigate(screenName);
  };

  return (
    <View style={styles.container}>
      {/* Include the bottom navigation bar */}
      <View style={styles.bottomNavigation}>
        {/* Pending Orders */}
          <TouchableOpacity style={styles.bottomNavigationButton} onPress={() => handleNavigation('PendingOrdersScreen')}>
            <Ionicons style={styles.bottomNavigationButtonIcon} name="ios-time-outline" size={30} color="#3274cb" />
            <Text style={styles.bottomNavigationButtonText}>Pending</Text>
          </TouchableOpacity>

        {/* Active Orders */}
        <TouchableOpacity style={styles.bottomNavigationButton} onPress={() => handleNavigation('ActiveOrdersScreen')}>
          <Ionicons style={styles.bottomNavigationButtonIcon} name="ios-list-outline" size={30} color="#3274cb" />
          <Text style={styles.bottomNavigationButtonText}>Active</Text>
        </TouchableOpacity>

        {/* Paste Link */}
        <TouchableOpacity style={styles.bottomNavigationButton} onPress={() => handleNavigation('PasteLinkScreen')}>
          <Image source={require('../assets/logo.png')} style={styles.logo} />
        </TouchableOpacity>

        {/* Support */}
        <TouchableOpacity style={styles.bottomNavigationButton} onPress={() => handleNavigation('SupportScreen')}>
          <Ionicons style={styles.bottomNavigationButtonIcon} name="ios-help-circle-outline" size={30} color="#3274cb" />
          <Text style={styles.bottomNavigationButtonText}>Support</Text>
        </TouchableOpacity>

        {/* Settings */}
        <TouchableOpacity style={styles.bottomNavigationButton} onPress={() => handleNavigation('SettingsScreen')}>
          <Ionicons style={styles.bottomNavigationButtonIcon} name="ios-settings-outline" size={30} color="#3274cb" />
          <Text style={styles.bottomNavigationButtonText}>Settings</Text>
        </TouchableOpacity>
      </View>
      {/* End of bottom navigation bar */}
    </View>

    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomNavigationButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomNavigationButtonText: {
    marginTop: 5, // Add some margin to the top of the button text
    color: '#333', // Change this to your desired text color
    fontSize: 12, // Change this to your desired font size
  },
  bottomNavigationButtonIcon: {
    marginBottom: 2, // Add some margin to the bottom of the button icon
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
});

export default BottomNav;
