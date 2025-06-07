import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../Screens/Home';
import Button from './Button';
import Account from '../Screens/Account';
import EditProfile from '../Screens/EditProfile';
import PetCreation from '../Screens/PetCreation';
import EditPetCard from '../Screens/EditPetCard';
import Services from '../Screens/Services';
import Products from '../Screens/Products';
import ServiceCreation from '../Screens/ServiceCreation'
import PetCardDetails from '../Screens/PetCardDetails'
import ServiceDetails from '../Screens/ServiceDetails'
import Checkout from '../Screens/Checkout';
import Ratings from './Ratings';
import EditService from '../Screens/EditService';
import ServiceDetailsPetOwner from '../Screens/ServiceDetailsPetOwner';
import DetailsMap from '../Screens/DetailsMap';
import PayPal from '../Screens/PayPal';
import fileUpload from '../Screens/FileUpload';
import SearchFilter from '../Screens/SearchFilter';
import ServiceProviderProfile from '../Screens/ServiceProviderProfile';
import ServiceListOther from '../Screens/ServiceListOther';
import PurchaseRecord from '../Screens/PurchaseRecord';
import ProductDetails from '../Screens/ProductDetails';
import Cart from '../Screens/Cart';

const Stack = createNativeStackNavigator()

const HomeScreen = () => {
    return(
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="HomeScreen" component={Home}></Stack.Screen>
            <Stack.Screen name="ServiceDetailsPetOwner" component={ServiceDetailsPetOwner}></Stack.Screen>
            <Stack.Screen name="ServiceProviderProfile" component={ServiceProviderProfile}></Stack.Screen>
            <Stack.Screen name="DetailsMap" component={DetailsMap}></Stack.Screen>
            <Stack.Screen name="Checkout" component={Checkout}></Stack.Screen>
            <Stack.Screen name="Rating" component={Ratings}></Stack.Screen>
            <Stack.Screen name="PayPal" component={PayPal}></Stack.Screen>  
            <Stack.Screen name="PetCardDetails" component={PetCardDetails}></Stack.Screen>
            <Stack.Screen name="ServiceListOther" component={ServiceListOther}></Stack.Screen>
            <Stack.Screen name="ServiceDetails" component={ServiceDetails}></Stack.Screen>      
            <Stack.Screen name="ServiceScreen" component={Services}></Stack.Screen>                
        </Stack.Navigator>
    )
}
export {HomeScreen}

const ServiceScreen = () => {
    return(
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="ServiceScreen" component={Services}></Stack.Screen>
            <Stack.Screen name="ServiceDetailsPetOwner" component={ServiceDetailsPetOwner}></Stack.Screen>
            <Stack.Screen name="ServiceProviderProfile" component={ServiceProviderProfile}></Stack.Screen>
            <Stack.Screen name="DetailsMap" component={DetailsMap}></Stack.Screen>
            <Stack.Screen name="Checkout" component={Checkout}></Stack.Screen>
            <Stack.Screen name="Rating" component={Ratings}></Stack.Screen>
            <Stack.Screen name="PayPal" component={PayPal}></Stack.Screen>
            <Stack.Screen name="SearchFilter" component={SearchFilter}></Stack.Screen>
            <Stack.Screen name="PetCardDetails" component={PetCardDetails}></Stack.Screen>
            <Stack.Screen name="ServiceListOther" component={ServiceListOther}></Stack.Screen>
            <Stack.Screen name="ServiceDetails" component={ServiceDetails}></Stack.Screen>
        </Stack.Navigator>
    )
}
export {ServiceScreen}

const ProductScreen = () => {
    return(
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="ProductScreen" component={Products}></Stack.Screen>
            <Stack.Screen name="ProductDetails" component={ProductDetails}></Stack.Screen>
            <Stack.Screen name="Cart" component={Cart}></Stack.Screen>
            <Stack.Screen name="PayPal" component={PayPal}></Stack.Screen> 
        </Stack.Navigator>
    )
}
export {ProductScreen}

const AccountScreen = () => {
    return(
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="Account" component={Account}></Stack.Screen>
            <Stack.Screen name="EditProfile" component={EditProfile}></Stack.Screen>
            <Stack.Screen name="PetCreation" component={PetCreation}></Stack.Screen>
            <Stack.Screen name="EditPetCard" component={EditPetCard}></Stack.Screen>
            <Stack.Screen name="ServiceCreation" component={ServiceCreation}></Stack.Screen>
            <Stack.Screen name="PetCardDetails" component={PetCardDetails}></Stack.Screen>
            <Stack.Screen name="EditService" component={EditService}></Stack.Screen>
            <Stack.Screen name="ServiceDetails" component={ServiceDetails}></Stack.Screen>
            <Stack.Screen name="FileUpload" component={fileUpload}></Stack.Screen>
            <Stack.Screen name="PurchaseRecord" component={PurchaseRecord}></Stack.Screen>
        </Stack.Navigator>
    )
}
export {AccountScreen}
