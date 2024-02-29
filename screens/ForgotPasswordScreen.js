import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from '../api/axios';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

  

  const handleResetPassword = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);

    if(email === "" || !isValid) {
        Alert.alert('Error', 'Please enter a valid email.');
        return;
    }
    else{
        // Perform reset password logic here

        try{
          console.log("We are here 5");
          const res = await axios.post('/forgot-password',//post request
          JSON.stringify({email}),//include email
          {
            headers: { 'Content-Type': 'application/json' }
          }
          );
          console.log(res.data);//for you to check what the server is responding with
    
          //send user to corresponding page
    
        }catch(err){
    
          console.log(err);
        }

        Alert.alert('Password Reset', `An email has been sent to ${email} with instructions to reset your password.`);
        
        // Navigate to the login screen
        navigation.navigate('LoginScreen');
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subtitle}>Enter your email to reset your password</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          maxLength={50}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3274CB',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    padding: 12,
    width: '100%',
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#3274CB',
    borderRadius: 8,
    padding: 16,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default ForgotPasswordScreen;
