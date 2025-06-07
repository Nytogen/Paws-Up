import { NavigationContainer } from '@react-navigation/native';
import React, {useState, useEffect, useContext} from 'react'
import { StyleSheet, Text, View, ScrollView, TextInput, Alert, Image } from 'react-native';
import Button from '../components/Button'
import {ip, AuthContext} from '../global'
import PetList from './PetList';
import ServiceListOther from './ServiceListOther';

/* Styles to change the look of the page */
const styles = StyleSheet.create({
    border:{
        borderWidth: 3
    },    
    userImg: {
        height: 150,
        width: 150,
        borderRadius: 75,
        alignSelf: 'center'
    },
    Editing: {
      paddingRight: 50,     
      paddingLeft: 50
    },
    EditingBox:{
        borderWidth: 1,
    },
    title:{
        fontSize: 36,
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#34BDC3'
    },
    description:{
        fontSize: 26,
        textAlign: 'center',         
        color: '#FE9834'
    },
    text:{
        color: '#FE9834',
        fontSize: 20
    },
    heading:{
        color: '#34BDC3',
        fontSize: 24,
        textDecorationLine: 'underline'
    },
    row:{
        flexDirection:'row',
        justifyContent: 'space-evenly'
    },
    pad: {
        paddingRight: 25,
        paddingLeft: 25
    }    
});

function ServiceProviderProfile({navigation, route}) {
    //User Data
    const[Email, setEmail] = useState('')
    const[First, setFirst] = useState('')
    const[Last, setLast] = useState('')

    const {serviceId, userId, home} = route.params
    const {logout, id, token} = useContext(AuthContext);

    const AccLocation = 'http://' + ip + ':8000/api/accounts/' + userId

    const[Error, setError] = useState('')

    const retrieveData = () => {
        fetch(AccLocation, {
            method: 'GET',
        })
        .then(resp => resp.json())
        .then(data => {
            setEmail(data.email)
            setFirst(data.first_name)
            setLast(data.last_name)
        })
        .catch(error => Alert.alert('Error:', error.message))
    }

    useEffect(() => {
        retrieveData()
    }, [])

    /* This function goes back to the previous page */    
    function Back(){
        navigation.navigate('ServiceDetailsPetOwner', {userId: userId, serviceId:serviceId, home:home})
    }

    return (
        <ScrollView style={styles.pad}>
            <Button onPress={() => Back()} color='#FE9834' title='Back'/>
            <Image style={styles.userImg} source={ require('../img/noface-square.jpg')}/>
            <View>
                <Text style={styles.title}>{First + " " + Last}</Text>              
            </View>

            <View>
                <Text style={styles.description}>{Email}</Text>              
            </View>


            <Text style={{color:'#FF0000'}}>
                {Error}
            </Text>

            <Text style={{fontSize: 30, color: '#d68a2d'}}>Pets</Text>
            <PetList navigation={navigation} route={{userId:userId, token:token, serviceId:serviceId, own:false}}/>
            <Text style={{fontSize: 30, color: '#d68a2d'}}>Services</Text>
            <ServiceListOther navigation={navigation} route={{userId:userId, serviceId:serviceId}}/>


        </ScrollView>       
    )
}

export default ServiceProviderProfile