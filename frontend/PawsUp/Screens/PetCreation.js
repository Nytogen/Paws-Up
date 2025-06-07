import React, {useState} from 'react';
import { ip } from '../global';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView, SafeAreaView, KeyboardAvoidingView } from 'react-native'
import { Dropdown } from 'react-native-material-dropdown-v2';

function PetCreation({ navigation, route}) {

    const [name, setName] = useState('')
    const [age, setAge] = useState('')
    const [species, setSpecies] = useState('')
    const [breed, setBreed] = useState('')
    const [weight_lbs, setWeight_lbs] = useState('')
    const [sex, setSex] = useState('')
    const [spayed_neutered, setSpayed] = useState('')
    /* const [lastName, setLastName] = useState('') */

   //Error Messages
   const[Error, setError] = useState()

    //Tokens and stuff
    const Token = route.params.token
    const UserId = route.params.userId

    const FullToken = 'Token ' + Token

   function Back(){
      navigation.navigate('Account', {token: Token, userId: UserId})
   }

    // function to connect ot backend
    const addCard = () => {
      const Checks = [name, age, species, breed, spayed_neutered, weight_lbs, sex]

      console.log(Checks.length)
      for(let i = 0; i < Checks.length; i++){
         
         console.log("this is " + i)
         console.log(Checks[i]);
          if(Checks[i].localeCompare('') == 0){
              setError("Fill in all mandatory sections")
              return
          }
      }

      //Check valid inputs
      if (sex.localeCompare('Male') !=0 && sex.localeCompare('Female') != 0){
          setError("Enter either 'Male' or 'Female' in the 'Gender' field")
          return            
      }
      if (spayed_neutered.localeCompare('True') == 0){
          setSpayed(true)
      }
      else if(spayed_neutered.localeCompare('False') == 0){
          setSpayed(false)
      }
      else{
          setError("Enter either 'True' or 'False' in the 'Spayed/Neutured' field")
          return            
      }

        fetch(`http://${ip}:8000/api/petcards/`, {
            method: 'POST',
            headers: {
            //bc we are sending JSON data
            'Content-Type': 'application/json',
            'Authorization': FullToken
            },
            //body of the JSON object we are sending
            body: JSON.stringify({
               name: name, 
               species: species, 
               breed: breed, 
               weight_lbs: weight_lbs, 
               age:age,
               gender: sex, 
               spayed_or_neutered: spayed_neutered})
    })
    .then(resp => resp.json())
    .then(data => {
        //checking if successful
        console.log(data)
        Back()
    })
    .catch(error => {
        console.log(error)
    })
    }
    
    let genderDrop =  [{value: 'Male'}, {value: 'Female'}];
    let spayedDrop =  [{value: 'True'}, {value: 'False'}];
    return (
        //this container will hold basic account information
        <ScrollView style={styles.container}>
            <KeyboardAvoidingView>
            <View>
            <Text style = {styles.title}> Create a Pet Card</Text>
            <Text style= {styles.fieldLabel}>Name</Text>
               <TextInput style = {styles.input}
                  underlineColorAndroid = "transparent"
                  placeholder = "Spot"
                  placeholderTextColor = "#9a73ef"
                  autoCapitalize = "none"
                  onChangeText = {text => setName(text)}/>
               
                  
               <Text style= {styles.fieldLabel}>Species</Text>
               <TextInput style = {styles.input}
                  underlineColorAndroid = "transparent"
                  placeholder = "Dog"
                  placeholderTextColor = "#9a73ef"
                  autoCapitalize = "none"
                  onChangeText = {text => setSpecies(text)}/>

               <Text style= {styles.fieldLabel}>Breed</Text>
               <TextInput style = {styles.input}
                  underlineColorAndroid = "transparent"
                  placeholder = "Dalmation"
                  placeholderTextColor = "#9a73ef"
                  autoCapitalize = "none"
                  onChangeText = {text => setBreed(text)}/>

            <Text style= {styles.fieldLabel}>Age                                  Weight (lbs)</Text>          
            </View>
            <View style={styles.ageRow}>
                  <TextInput style = {styles.ageRowInput}
                     underlineColorAndroid = "transparent"
                     placeholder = "10"
                     placeholderTextColor = "#9a73ef"
                     autoCapitalize = "none"
                     keyboardType = 'numeric'
                     onChangeText = {text => setAge(text)}/>

                  <TextInput style = {styles.ageRowInput}
                     underlineColorAndroid = "transparent"
                     placeholder = "10"
                     placeholderTextColor = "#9a73ef"
                     autoCapitalize = "none"
                     keyboardType = 'numeric'
                     onChangeText = {text => setWeight_lbs(text)}/>
            </View>

            <View>
               <Text style= {styles.fieldLabel}>Gender</Text>
               <Dropdown label = 'Select...' style = {styles.dropdown}
                  data={genderDrop}
                  onChangeText = {text => setSex(text)}/>

               <Text style= {styles.fieldLabel}>Spayed/Neutered?</Text>
               <Dropdown label = 'Select...' style = {styles.dropdown}
                  data={spayedDrop}
                  onChangeText = {text => setSpayed(text)}/>
               
               
               <Text style={{margin: 17, marginBottom: -10, color:'#FF0000'}}>
                {Error}
               </Text>

               <View style={styles.row}>
               <TouchableOpacity
                  style = {styles.cancelButton}
                  onPress = {
                     () => Back()
                  }>
                  <Text style = {styles.cancelButtonText}> Cancel </Text>
               </TouchableOpacity>
               <TouchableOpacity
                  style = {styles.submitButton}
                  onPress = {
                     () => addCard()
                  }>
                  <Text style = {styles.submitButtonText}> Submit </Text>
               </TouchableOpacity>
               </View>
            </View>
         </KeyboardAvoidingView>
         </ScrollView>
      )
   }

export default PetCreation

const styles = StyleSheet.create({
   container: {
      paddingTop: 30,
      paddingLeft: 30,
      paddingRight: 30,
   },
   title: {
    fontSize: 40, 
    color: '#d68a2d'
   },
   fieldLabel: {
     marginLeft: 15,
     marginTop: 15,
   },
   input: {
      margin: 15,
      marginTop: 8,
      marginBottom: -2,
      height: 40,
      paddingLeft: 10,
      borderColor: '#7a42f4',
      borderWidth: 1
   },
   dropdown: {
      margin: 15,
      marginTop: 10,
      marginBottom: -5,
      borderColor: '#7a42f4',
      borderWidth:1,
      height:60
   },
   submitButton: {
      backgroundColor: '#d68a2d',
      padding: 10,
      margin: 15,
      height: 40,
      flex: 3,
   },
   submitButtonText:{
      color: 'white',
      textAlign: 'center'
   },
   cancelButton: {
      backgroundColor: '#ffffff',
      borderColor: '#d68a2d',
      borderWidth: 1,
      padding: 10,
      margin: 15,
      height: 40,
      flex: 3
   },
   cancelButtonText:{
      color: '#d68a2d',
      textAlign: 'center'
   },
   row: {
      flex: 1,
      flexDirection: 'row',
      margin: 10,
      marginLeft:20, 
      width: 295,
   },
   ageRow: {
      flex: 1,
      flexDirection: "row",
      marginLeft: 6,
      marginTop: 15,
      marginBottom: 15,
      width: 300,
      marginRight: -10
   },
   ageRowInput: {
      height: 40,
      marginLeft: 10,
      marginRight: 15,
      marginBottom: -10,
      paddingLeft: 10,
      borderColor: '#7a42f4',
      borderWidth: 1,
      flex: 1,
   }
})

