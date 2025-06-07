import React, {Children,createContext, useState, } from 'react'
import {Card, TextInput} from 'react-native-paper'
import { StyleSheet, Text, View, FlatList, Alert, Button as Butt, ScrollView, KeyboardAvoidingView } from 'react-native';
import Button from '../components/Button';

//ADAPTED FROM THE FOLLOWING ARTICLE TO WORK ON REACT NATIVE: https://dev.to/trishathecookie/react-creating-a-reusable-form-using-react-context-5eof 

export const FormContext = React.createContext({
    form: {},
    handleFormChange: () => {}
});

function Form(props) {
    
      const { children, formInitialValues,  submit = () => {}, buttName, buttColour, cart, cartForm } = props;

    const [form, setForm] = useState(formInitialValues);

    const handleFormChange = (name, text) => {
        // Get the name of the field that caused this change event
        // Get the new value of this field

        // Assign new value to the appropriate form field
        setForm({
            ...form,
            [name]: text
        });

        //if we are calling from the cart, we don't want a submit button to give us the changed form, we want
        //the info to be updated in an object right away
        if (cart) {
            console.log({
                ...form,
                [name]: text
            })
            cartForm({
                ...form,
                [name]: text
            })
        }
    }

    return (
        <View>
            <FormContext.Provider value={{
                form,
                handleFormChange
                }}>
                {children}
            </FormContext.Provider>
            {cart ? null : <Button color={buttColour} title={buttName} onPress={() => submit(form)}/>}
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
        margin: 5,
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

export default Form