import React, {useState, useContext} from 'react'
import {Card, TextInput} from 'react-native-paper'
import { StyleSheet, Text, View, FlatList, Alert, Button as Butt, ScrollView, KeyboardAvoidingView } from 'react-native';
import Form, { FormContext } from '../components/Form';
import Counter from 'react-native-counters'

function FormInput(props) {

    const formContext = useContext(FormContext);
    const { form, handleFormChange } = formContext;

    const {label, secureTextEntry, name, type, numeric, start, min} = props


    return (
        <View>
            {!numeric ? 
                <TextInput
                label={label}
                mode="outlined"
                secureTextEntry={secureTextEntry}
                placeholder={label}
                keyboardType={type ? type : 'default'}
                autoCorrect={false}
                autoCapitalize="none"
                style={styles.inputStyle}
                theme={{ colors: { primary: '#34BDC3',underlineColor:'transparent',}}}
                onChangeText={(text) => handleFormChange(name, text)}
                /> : 
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 10}}>
                    <Text style={{marginRight: 10}}>{label}</Text>
                    <Counter start={start ? start : 0} min={min? min : 0} max={null} onChange={(num) => handleFormChange(name, num)} />
                </View>}
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

export default FormInput