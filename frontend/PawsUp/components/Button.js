import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

function Button({color, title, logout, onPress}) {
    return (
        <TouchableOpacity 
        onPress={onPress} 
        style={[styles.button, {backgroundColor: color}]}>
            <Text style={styles.buttonText}>
              {title}
            </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 12,
      margin: 10,
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      fontSize: 16,
      textAlign: 'center'
    },
});

export default Button
