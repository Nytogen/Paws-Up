import { useState } from 'react';

export default function useTokenandId() {

    const getToken = () => {
        const token = sessionStorage.getItem('token')
        //if token is not set we will get null initially
        return token;
    }

    const getId = () => {
        const id = sessionStorage.getItem('id')
        //if id is not set we will get null initially
        return id;
    }

    const [token, setToken] = useState(getToken());
    const [id, setId] = useState(getId());

    const saveToken = (userToken) => {
        //using session storage method to save token even after refreshes.
        //sessionStorage takes key and string for args
        sessionStorage.setItem('token', userToken);
        setToken(userToken)
    }

    const saveId = (userId) => {
        //using session storage method to save id even after refreshes.
        //sessionStorage takes key and string for args
        sessionStorage.setItem('id', userId);
        setId(userId)
    }

    const removeInfo = () => {
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('id')
        setToken(null)
        setId(null)
    }

    return {
        setToken: saveToken,
        setId: saveId,
        removeInfo,
        token,
        id
    }

}