import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LogIn from '../Screens/LogIn';
import SignUp from '../Screens/SignUp';
import Button from './Button';

function Welcome({ navigation }) {
  return (
      <View style={styles.container}>
          <Image source={require('../img/pawsup.jpg')}/>

          <Button color='#34BDC3' title='Log In' onPress={() => navigation.navigate('LogIn')}/>

          <Button color='#FE9834' title='Sign Up' onPress={() => navigation.navigate('SignUp')}/>


      </View>
  )
}

const Stack = createNativeStackNavigator();

function SignedOutNav() {
    return (
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Welcome" component={Welcome}></Stack.Screen>
        <Stack.Screen name="LogIn" component={LogIn}></Stack.Screen>
        <Stack.Screen name="SignUp" component={SignUp}></Stack.Screen>
      </Stack.Navigator>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
});

export default SignedOutNav
