import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Platform, StatusBar} from 'react-native';
import StarRating from 'react-native-star-rating-widget';
import { useRoute } from '@react-navigation/native';
import axios from '../../api/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const FeedbackScreen = ({ navigation }) => {
  const [orderArrived, setOrderArrived] = useState(null);
  const [itemAsDescribed, setItemAsDescribed] = useState(null);
  const [serviceCourteous, setServiceCourteous] = useState(null);
  const [comments, setComments] = useState('');
  const [rating, setRating] = useState(0);

  const route = useRoute();

  const orderID= route.params.orderID;

  const handleFormSubmit = async () => {
    // Validate answers
    if (orderArrived === null || itemAsDescribed === null || serviceCourteous === null) {
      alert('Please answer all questions');
      return;
    }

    // Perform form submission logic here
    console.log('Form submitted:', {
      orderArrived,
      itemAsDescribed,
      serviceCourteous,
      comments
    });

    //BACKEND CALL TO SEND FEEDBACK TO SERVER AND TO UPDATE THE ORDER STATUS IN THE DATABASE THROUGH THE 
    
    try{
      console.log("We are here 8");
      const token = await AsyncStorage.getItem('AccessToken');
      const res = await axios.post('/client/home/activeorder/' + orderID + '/markascomplete/feedback',//post request
      JSON.stringify({rating, arrived_on_time: orderArrived, as_described: itemAsDescribed, good_service: serviceCourteous, message: comments}),
      {
        headers: { 'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`}
      }
      );
      await AsyncStorage.setItem("AccessToken", res.data.token);
      console.log(res.data);//for you to check what the server is responding with
      navigation.navigate('PasteLinkScreen');
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

    
  };

  

  return (
    <View style={styles.container}>
        <Text style={styles.header}>Feedback</Text>
        <View style={styles.ratingContainer}>
          <StarRating
          rating={rating}
          onChange={setRating}
          color='#3274cb'
          emptyColor='#d3d3d3'
        />
        </View>

      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>Order arrived by the given date?</Text>
        <View style={styles.radioContainer}>
          <TouchableOpacity
            style={[
              styles.radioBtn,
              orderArrived === true && styles.radioBtnSelected
            ]}
            onPress={() => setOrderArrived(true)}
          >
            <Text style={styles.radioBtnText}>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.radioBtn,
              orderArrived === false && styles.radioBtnSelected
            ]}
            onPress={() => setOrderArrived(false)}
          >
            <Text style={styles.radioBtnText}>No</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>Item as described by seller?</Text>
        <View style={styles.radioContainer}>
          <TouchableOpacity
            style={[
              styles.radioBtn,
              itemAsDescribed === true && styles.radioBtnSelected
            ]}
            onPress={() => setItemAsDescribed(true)}
          >
            <Text style={styles.radioBtnText}>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.radioBtn,
              itemAsDescribed === false && styles.radioBtnSelected
            ]}
            onPress={() => setItemAsDescribed(false)}
          >
            <Text style={styles.radioBtnText}>No</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>Service can be described as courteous?</Text>
        <View style={styles.radioContainer}>
        <TouchableOpacity
            style={[
              styles.radioBtn,
              serviceCourteous === true && styles.radioBtnSelected
            ]}
            onPress={() => setServiceCourteous(true)}
          >
            <Text style={styles.radioBtnText}>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.radioBtn,
              serviceCourteous === false && styles.radioBtnSelected
            ]}
            onPress={() => setServiceCourteous(false)}
          >
            <Text style={styles.radioBtnText}>No</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.commentsContainer}>
        <Text style={styles.commentsLabel}>Comments</Text>
        <TextInput
          style={styles.commentsInput}
          multiline
          maxLength={500}
          value={comments}
          onChangeText={setComments}
          placeholder="Add comments (optional)"
        />
      </View>
      <TouchableOpacity style={styles.submitBtn} onPress={handleFormSubmit}>
        <Text style={styles.submitBtnText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 20 ,
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    alignContent: 'center',
    justifyContent: 'center',
  },
  questionContainer: {
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  questionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
  },
  radioBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3274cb',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioBtnSelected: {
    backgroundColor: '#3274cb',
  },
  radioBtnText: {
    color: 'black',
    fontSize: 14,
  },
  commentsContainer: {
    marginBottom: 16,
  },
  commentsLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  commentsInput: {
    height: 100,
    borderWidth: 1,
    borderColor: '#3274cb',
    borderRadius: 8,
    padding: 12,
    textAlignVertical: 'top',
  },
  submitBtn: {
    backgroundColor: '#3274cb',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#3274cb',
    textAlign: 'center',
  },
  ratingContainer: {
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FeedbackScreen;
