import React, {useState} from 'react'
import {TextInput, Card} from 'react-native-paper'
import { StyleSheet, Text, View, Button as Butt, FlatList, Alert, ScrollView, KeyboardAvoidingView} from 'react-native';
/* import FormButt from '../components/FormButt'; */
import Button from '../components/Button';
import {ip} from '../global'
import Form from '../components/Form';
import FormInput from '../components/FormInput';

function SignUp({ navigation }) {

    const [errorMsg, setErrorMsg] = useState(null)
    /* const [lastName, setLastName] = useState('') */

    const createUser = (form) => {
        //fetch from api using method post
        fetch(`http://${ip}:8000/api/accounts/register`, {
            method: 'POST',
            headers: {
                //bc we are sending JSON data
                'Content-Type': 'application/json'
            },
            //body of the JSON object we are sending
            body: JSON.stringify({email: form.email, password: form.password, password2: form.password2, first_name: form.firstName, last_name: form.lastName})
        })
        .then(resp => resp.json())
        .then(data => {
            //checking if successful
            if ('response' in data && data.response === "Successfully registered a new user. Please go to your email to verify the account.") {
                navigation.navigate('LogIn')
            } else {
                //an array to hold the errors if login is not successful
                let err_arr = []
                for (const key in data) {
                    err_arr.push(`${key}: ${data[key]}`)
                }
                setErrorMsg(err_arr[0])
            }
        })
        .catch(error => {
            setErrorMsg(error.message)
        })
    }

    return (
        //this container will hold basic account information
        <ScrollView style={styles.container}>
            <KeyboardAvoidingView>
            <Form submit={createUser} 
                    buttName="sign up"
                    buttColour='#FE9834'
                    formInitialValues={{
                        email: '',
                        password: '',
                        firstName: '',
                        lastName: '',
                        password2: ''
                    }}>
                    <View>
                        <FormInput label="email" name="email"/>
                        <FormInput label="first name" name="firstName"/>
                        <FormInput label="last name" name="lastName"/>
                        <FormInput label="password" name="password" secureTextEntry/>
                        <FormInput label="password2" name="password2" secureTextEntry/>
                    </View>
                </Form>
                {errorMsg ? <Card style={styles.errorContainer}>
                    <Text style={styles.error}> { errorMsg } </Text>
                </Card> : null}
            </KeyboardAvoidingView>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    inputStyle: {
        padding: 10,
        margin: 20,
        backgroundColor: 'white',
    },
    error: {
        color: 'white',
    },
    errorContainer: {
        backgroundColor: 'red',
        height: 20,
        alignSelf: 'center',
        margin: 10,
    },
})

{/* <View>
            <Form SignUp={true}/>
        </View> */}

export default SignUp
