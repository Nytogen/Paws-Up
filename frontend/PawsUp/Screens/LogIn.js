import React, {useState, useContext} from 'react'
import {Card, TextInput} from 'react-native-paper'
import { StyleSheet, Text, View, FlatList, Alert, Button as Butt } from 'react-native';
import Button from '../components/Button';
import {ip, AuthContext} from '../global'
import Form, { FormContext } from '../components/Form';
import FormInput from '../components/FormInput';

function LogIn() {

    const [errorMsg, setErrorMsg] = useState(null)

    const {login} = useContext(AuthContext);

    const enterAccount = (form) => {
        //fetch from api using method post
        fetch(`http://${ip}:8000/api/accounts/login`, {
            method: 'POST',
            headers: {
                //bc we are sending JSON data
                'Content-Type': 'application/json'
            },
            //body of the JSON object we are sending
            body: JSON.stringify({email: form.email, password: form.password})
        })
        //convert data into JSON object
        .then(resp => resp.json())
        .then(data => {
            //checking if successful
            if ('id' in data) {
                login(data.token, data.id)
                console.log(data.token)
                //navigating to account page with userId and token
                //navigation.navigate('Account', {userId: data.id, token: data.token})
            } else {
                //an array to hold the errors if login is not successful
                let err_arr = []
                for (const key in data) {
                    if (key === 'non_field_errors') {
                        err_arr.push(`${data[key]}`)
                    }
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
        //this container holds the whole page
        <View style={styles.container}>
                {/* These are the fields, each one is wrapped in a view */}
                <Form submit={enterAccount} 
                    buttName="log in"
                    buttColour='#34BDC3'
                    formInitialValues={{
                        email: '',
                        password: '',
                    }}>
                    <View>
                        <FormInput label="email" name="email"/>
                        <FormInput label="password" name="password" secureTextEntry/>
                    </View>
                </Form>
                <Card style={styles.errorContainer}>
                    {errorMsg ? <Text style={styles.error}> { errorMsg } </Text> : null}
                </Card>
        </View>
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

{/* <FlatList data={errorMsg} renderItem={({item}) => {
                    <Card style={styles.errorContainer}>
                        <Text style={styles.error}> { item[0] } </Text>
                    </Card>
                }}/> */}

{/* <View>
            <Form signUp={false}></Form>
        </View> */}

export default LogIn
