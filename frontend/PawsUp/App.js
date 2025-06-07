import React, {useEffect, useState, useMemo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator } from 'react-native-paper';
import { AuthContext } from './global';
import SignedOutNav from './components/SignedOutNav';
import Tabs from './components/Tabs';
import ServiceCreation from './Screens/ServiceCreation';
import EditService from './Screens/EditService';
import PetCardDetails from './Screens/PetCardDetails';
import DetailsMap from './Screens/DetailsMap';
import PurchaseRecord from './Screens/PurchaseRecord';

const Stack = createNativeStackNavigator();

export default function App() {

  const [isLoading, setIsLoading] = useState(true)
  const [userToken, setUserToken] = useState(null)
  const [userId, setUserId] = useState(null)

  const authContext = useMemo(() => ({
    logIn: (token, id) => {
      setUserToken(token),
      setUserId(id),
      setIsLoading(false)
    },
    logOut: () => {
      setUserToken(null),
      setUserId(null),
      setIsLoading(false)
    }
  }))

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  if (isLoading) {
    return (
      <View>
        <ActivityIndicator size="large"></ActivityIndicator>
      </View>
    )
  }

  return (

    <AuthContext.Provider value={{login: authContext.logIn, id: userId, token: userToken, logout: authContext.logOut}}>
      
      <NavigationContainer>
       {userToken ? (
          <Tabs/>
       ) : (
         <SignedOutNav/>
       )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});