import { NavigationContainer } from '@react-navigation/native';
import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View, Button, ScrollView, TextInput, Alert } from 'react-native';
import {ip} from '../global'
import { Dropdown } from 'react-native-material-dropdown-v2';

const location = "http://192.168.1.247:8000/"

//Placeholder data
const tempPet = {
    Name:"Pet",
    Age:"10",
    PetType:"Dog",
    Breed:"Golden Retriever",
    SpayedNeutured: "Yes",
    Weight: "15",
    Gender:"Male",
    Description:""
}

/* Styles to format the page */
const styles = StyleSheet.create({
    Editing: {
      paddingRight: 50,
      paddingLeft: 50
    },

    EditingBox:{
        borderWidth: 1,
    },

    dropdown: {
        margin: 15,
        marginTop: 10,
        marginBottom: 15,
        borderColor: '#7a42f4',
        borderWidth:1,
        height:60
     }
});

function EditPetCard({navigation, route}) {
    //Pet Info
    const[Name, setName] = useState('')
    const[Age, setAge] = useState('')
    const[Species, setSpecies] = useState('')
    const[Breed, setBreed] = useState('')
    const[Spayed, setSpayed] = useState('')
    const[Weight, setWeight] = useState('')
    const[Gender, setGender] = useState('')

    //Error Messages
    const[Error, setError] = useState()

    //Locations
    /*
    const Token = route.params.token.slice()
    const FullToken = 'Token ' + Token*/

    const PetID = route.params.id

    const location = 'http://' + ip + ':8000/api/petcards/' + PetID

    const retrieveData = () => {
        fetch(location, {
            method: 'GET',
        })
        .then(resp => resp.json())
        .then(data => {
            setSpecies(data.species)
            setName(data.name)
            setAge(data.age.toString())
            setBreed(data.breed)
            setWeight(data.weight_lbs)
            setGender(data.gender)


            if(data.spayed_or_neutered){
                setSpayed('True')
            }
            else{
                setSpayed('False')
            }

        })
        .catch(error => Alert.alert('Error:', error.message))
    }

    useEffect(() => {
        retrieveData()
    }, [])

    //WIP
    /*This functions sends a HTTP request to the backend api to delete a certain petcard*/ 
    function DeletePetCard(){
        fetch(location, 
            {
                method:"DELETE",
                headers:{
                    'Authorization': "Token " + route.params.token
                }
            })
        .then(response => response.json())
        .then(navigation.navigate('Account', {token: route.params.token, userId: route.params.userId}))
        .catch(error => setError(error.message))     
    }

    /* This function sends a HTTP request to the backend api to edit a certain petcard */
    function EditPetCard(){     
        //Check for filled in forms
        const Checks = [Name, Age, Species, Breed, Spayed, Weight, Gender]

        for(var i = 0; i < Checks.length; i++){
            if(Checks[i].localeCompare('') == 0){
                setError("Fill in all mandatory sections")
                return
            }
        }

        //Check valid inputs
        if (Gender.localeCompare('Male') !=0 && Gender.localeCompare('Female') != 0){
            setError("Enter either 'Male' or 'Female' in the 'Gender' field")
            return            
        }
        if (Spayed.localeCompare('True') == 0){
            setSpayed(true)
        }
        else if(Spayed.localeCompare('False') == 0){
            setSpayed(false)
        }
        else{
            setError("Enter either 'True' or 'False' in the 'Spayed/Neutured' field")
            return            
        }

        fetch(location, 
            {
                method:"PATCH",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Token " + route.params.token
                },

                //This needs to be edited later
                body: JSON.stringify({name: Name, age: parseInt(Age,10), species:Species, breed: Breed, weight_lb: parseFloat(Weight), gender: Gender, spayed_or_neutered: Spayed})                
            })
        .then(response => response.json())
        .then(navigation.navigate('Account', {token:route.params.token, userId: route.params.userId}))
        .catch(error => setError(error.message))
    }
    
    /* This function goes back to the previous page */
    function Back(){
        navigation.navigate('PetCardDetails', {token:route.params.token, id:PetID, userId:route.params.userId})
    }

    let genderDrop =  [{value: 'Male'}, {value: 'Female'}];
    let spayedDrop =  [{value: 'True'}, {value: 'False'}];
    return (
        <ScrollView style={styles.Editing}>
            <Button onPress={() => Back()} color='#FE9834' title='Back'/>
            <View>
                <Text style={{textAlign: 'left'}}>Name</Text>
                <TextInput
                    style={styles.EditingBox} label='Name' defaultValue ={Name}
                    autoCorrect={false} autoCapitalize="sentences"
                    onChangeText={text => setName(text)}/>
            </View>

            <View>
                <Text style={{textAlign: 'left'}}>Age</Text>
                <TextInput
                    style={styles.EditingBox} label="Age" keyboardType="numeric"
                    defaultValue={Age} autoCorrect={false} autoCapitalize="sentences"
                    onChangeText={text => setAge(text)}/>
            </View>

            <View>
                <Text style={{textAlign: 'left'}}>Species</Text>
                <TextInput
                    style={styles.EditingBox} label="Species" defaultValue={Species}
                    autoCorrect={false} autoCapitalize="sentences"
                    onChangeText={text => setSpecies(text)}/>                
            </View>

            <View>
                <Text style={{textAlign: 'left'}}>Breed</Text>
                <TextInput
                    style={styles.EditingBox} label="Breed" defaultValue={Breed}
                    autoCorrect={false} autoCapitalize="sentences"
                    onChangeText={text => setBreed(text)}/>                
            </View>

            <View>
                <Text style={{textAlign: 'left'}}>Spayed/Neutured</Text>
                <Dropdown label = 'Select...' style = {styles.dropdown}
                  data={spayedDrop}
                  onChangeText = {text => setSpayed(text)}/>                
            </View>

            <View>
                <Text style={{textAlign: 'left'}}>Weight(lbs)</Text>
                <TextInput
                    style={styles.EditingBox} keyboardType="numeric"
                    label="Weight" defaultValue={Weight}
                    autoCorrect={false} autoCapitalize="none"
                    onChangeText={text => setWeight(text)}/>                
            </View>

            <View>
                <Text style={{textAlign: 'left'}}>Gender</Text>
                <Dropdown label = 'Select...' style = {styles.dropdown}
                  data={genderDrop}
                  onChangeText = {text => setGender(text)}/>                
            </View>
            
            <Text style={{color:'#FF0000'}}>
                {Error}
            </Text>

            <Button onPress={() => DeletePetCard()} color='#FF7F7F' title='Delete'/>
            <Text></Text>
            <Button onPress={() => EditPetCard()} color='#34BDC3' title='Edit'/>       

        </ScrollView>       
    )
}

export default EditPetCard