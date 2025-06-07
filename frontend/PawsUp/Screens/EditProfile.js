import { NavigationContainer } from '@react-navigation/native';
import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View, Button, ScrollView, TextInput, Alert } from 'react-native';
import {ip} from '../global'

/* Styles to change the look of the page */
const styles = StyleSheet.create({
    Editing: {
      paddingRight: 50,
      paddingLeft: 50
    },

    EditingBox:{
        borderWidth: 1,
    }
});

function EditProfile({navigation, route}) {

    //User Data
    const[Email, setEmail] = useState('')
    const[First, setFirst] = useState('')
    const[Last, setLast] = useState('')
    const[CurrPass, setCurrPass] = useState('')

    const Token = route.params.token
    const UserId = route.params.userId

    const FullToken = 'Token ' + Token
    const AccLocation = 'http://' + ip + ':8000/api/accounts/' + UserId

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
    
    /* This function updates the profile if the following conditions are fufilled
       1. Each field has something filled in
       2. They have enetered their current password in the "Current Password" field
       3. If they desired a password change then the new password and the confirmation field must be equal

       After this it will send a HTTP request to the backend api to update the profile
    */
    function UpdateProfile(){
        //Checking for every Field to be filled
        if(Email.localeCompare('') == 0){
            setError("'Email' field not filled out")
            return
        }
        else{
            let emailTest = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if(!emailTest.test(Email)){
                setError("'Email' is invalid")
                return
            }            
        }
        let nameTest = /^[a-zA-Z]+$/
        if(First.localeCompare('') == 0){
            setError("'First Name' field not filled out")
            return
        }
        else{
            if(!nameTest.test(First)){
                setError("'First Name' is invalid")
                return
            }
        }
        if(Last.localeCompare('') == 0){
            setError("'Last Name' field not filled out")
            return
        }
        else{
            if(!nameTest.test(Last)){
                setError("'Last Name' is invalid")
                return
            }
        }        
        
        fetch(AccLocation, 
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': FullToken
                },
                body: JSON.stringify({email:Email, first_name:First, last_name:Last})                
            }
            )
            .then(response => response.json())
            .then(
                navigation.navigate('Account', {token: Token, userId: UserId}))
            .catch(error => setError(error.message))
        }

    /* This function goes back to the previous page */    
    function Back(){
        navigation.navigate('Account', {token: Token, userId: UserId})
    }

    return (
        <ScrollView style={styles.Editing}>
            <Button onPress={() => Back()} color='#FE9834' title='Back'/>
            <View>
                <Text style={{textAlign: 'left'}}>Email</Text>
                <TextInput
                    style={styles.EditingBox} label='Email' defaultValue ={Email}
                    autoCorrect={false} autoCapitalize="none"
                    onChangeText={text => setEmail(text)}/>
            </View>

            <View>
                <Text style={{textAlign: 'left'}}>First Name</Text>
                <TextInput
                    style={styles.EditingBox} label="First_Name" defaultValue={First}
                    autoCorrect={false} autoCapitalize="sentences"
                    onChangeText={text => setFirst(text)}/>
            </View>

            <View>
                <Text style={{textAlign: 'left'}}>Last Name</Text>
                <TextInput
                    style={styles.EditingBox} label="Last_Name" defaultValue={Last}
                    autoCorrect={false} autoCapitalize="sentences"
                    onChangeText={text => setLast(text)}/>                
            </View>
            
            <Text style={{color:'#FF0000'}}>
                {Error}
            </Text>
            <Button onPress={() => UpdateProfile()} color='#34BDC3' title='Send'/>
        </ScrollView>       
    )
}

export default EditProfile