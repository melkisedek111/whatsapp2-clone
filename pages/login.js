import { Button } from '@material-ui/core';
import Head from 'next/head';
import React from 'react'
import styled from 'styled-components';
import { auth, provider } from '../firebase';

const Login = () => {
    const signIn = () => {
        auth.signInWithPopup(provider);
    }
    return (
        <Container>
            <Head>
                <title>Login</title>
            </Head>
            <LoginContainer>
                <Logo src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"/>
                <Button onClick={signIn}>Sign in wisth Google</Button>
            </LoginContainer>
        </Container>
    )
};

export default Login;



const Container = styled.div`
    display: grid;
    place-items: center;
    height: 100vh;
    background-color: whitesmoke;

`;

const LoginContainer = styled.div`
    padding: 100px;
    align-items: center;
    display: flex;
    flex-direction: column;
    background-color: white;
    border-radius: 5px;
    box-shadow: 0px 4px 14px -3px rgba(0,0,0,0.7);
`;


const Logo = styled.img`
    height: 200px;
    width: 200px;
    margin-bottom: 50px;
`;