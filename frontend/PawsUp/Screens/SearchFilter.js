
import React,{useState, useContext}from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, SafeAreaView } from 'react-native';
import Button from '../components/Button';
import ServiceListPet from './ServiceListPet';
import { ip, AuthContext } from '../global';
import {RadioButton} from 'react-native-paper';
import { restElement } from '@babel/types';

function SearchFilter({navigation, route}) {
    const [filters, setFilters] = useState('')
    const [value, setValue] = useState('');

    
    //Tokens and stuff

    const {logout, id, token } = useContext(AuthContext)
    const Token = token
    console.log(route);

    const FullToken = 'Token ' + Token

    function goBack() {
        setFilters(value);
        console.log("THIS IS FILTERS")
        navigation.push('ServiceScreen', {filters: value, search: route.params.search})
    }

    function reset() {
        setFilters("");
        setValue("");
    }

    return(                        
        <ScrollView>
        <View style={styles.container}> 

        <Text style = {styles.title}> Add filters</Text>

        <Text style = {styles.text}> Pet Type </Text>
        <RadioButton.Group onValueChange={value => setValue(value)} value={value}>
            <RadioButton.Item label="Cat" value="cat" />
            <RadioButton.Item label="Dog" value="dog" />
        </RadioButton.Group>
            
            <Button style={styles.searchButton} color='#34BDC3' title='Apply Filters' onPress={() => goBack()}/>

            <Button style={styles.searchButton} color='#34BDC3' title='Reset' onPress={() => reset()}/>
        </View>


        </ScrollView>
    )
        
}

const styles = StyleSheet.create({
    
title: {
    fontSize: 40, 
    color: '#d68a2d',
    textAlign:'center'
},
container: {
    margin:20
},
row: {
    flexDirection: 'row',
    margin: 10,
    marginLeft:20, 
 }, 
 searchButton: {
     flex: 1
 },
 text: {
     margin: 10,
     marginBottom: 0,
     fontSize: 20,
     color:'#d68a2d'
 }
})

export default SearchFilter