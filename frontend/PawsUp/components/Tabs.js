import React from 'react'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { HomeScreen, ServiceScreen, ProductScreen, AccountScreen } from './SignedInNav';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createMaterialBottomTabNavigator()

function Tabs() {
    return (
        <Tab.Navigator
        initialRouteName="Home"
        activeColor="#34BDC3"
        barStyle={{ backgroundColor: 'white' }}
        >
        <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="home" color={color} size={26} />
            ),
            }}
        />
        <Tab.Screen
            name="Services"
            component={ServiceScreen}
            options={{
            tabBarLabel: 'Services',
            tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="dog-service" color={color} size={26} />
            ),
            }}
        />
        <Tab.Screen
            name="Products"
            component={ProductScreen}
            options={{
            tabBarLabel: 'Products',
            tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="paw" color={color} size={26} />
            ),
            }}
        />
        <Tab.Screen
            name="Profile"
            component={AccountScreen}
            options={{
            tabBarLabel: 'Account',
            tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="account" color={color} size={26} />
            ),
            }}
        />
        </Tab.Navigator>    
    )
}

export default Tabs
