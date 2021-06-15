import { Avatar, IconButton } from '@material-ui/core';
import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import styled from 'styled-components';
import { auth, db } from '../firebase';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import { useCollection } from 'react-firebase-hooks/firestore';
import Message from './Message';
import { InsertEmoticon } from '@material-ui/icons';
import MicIcon from '@material-ui/icons/Mic';
import firebase from 'firebase';
import getRecipientEmail from '../utils/getRecipientEmail';
import TimeAgo from 'timeago-react';
const ChatScreen = ({chat, messages}) => {
    const [user] = useAuthState(auth);
    const [input, setInput] = useState("");
    const router = useRouter();
    const endOfMessageRef = useRef(null);
    const [messagesSnapshot] = useCollection(
        db
            .collection('chats')
            .doc(router.query.id)
            .collection('messages')
            .orderBy('timestamp', 'asc')
    );
    const [recipientSnapshot] = useCollection(
        db.collection('users').where('email', '==', getRecipientEmail(chat.users, user))
    );



    const showMessage = () => {
        if (messagesSnapshot) {
            return messagesSnapshot.docs.map(message => (
                <Message
                    key={message.id}
                    user={message.data().user}
                    message={{
                        ...message.data(),
                        timestamp: message.data().timestamp?.toDate().getTime()
                    }}
                />
            ));
        } else {
            return JSON.parse(messages).map(message => (
                <Message
                    key={message.id}
                    user={message.user}
                    message={message}
                />
            ));
        }
    }

    const ScrollToBottom = () => {
        endOfMessageRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }

    const sendMessage = (e) => {
        e.preventDefault();
        const timestamp = firebase.firestore.FieldValue.serverTimestamp();
        db.collection('users').doc(user.uid).set({
            lastSeen: timestamp
        }, {merge: true});

        db.collection('chats').doc(router.query.id).collection('messages').add({
            timestamp: timestamp,
            message: input,
            user: user.email,
            photoURL: user.photoURL
        });

        setInput('');
        ScrollToBottom();
    }

    const recipient = recipientSnapshot?.docs?.[0]?.data();
    const recipientEmail = getRecipientEmail(chat.users, user);

    return (
        <Container>
            <Header>
                {
                    recipient ? (
                        <Avatar src={recipient?.photoURL} />
                    ) : (
                        <Avatar>{recipientEmail[0]}</Avatar>
                    )
                }
                <HeaderInformation>
                    <h3>{recipientEmail}</h3>
                    {
                        recipientSnapshot ? (
                            <p>Last active: {' '}
                            {recipient?.lastSeen?.toDate() ? 
                                (
                                    <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
                                ) : "Unavailable"
                            
                            }
                            </p>
                        ) : (
                            <p>Loading last active . . .</p>
                        )
                    }
                </HeaderInformation>
                <HeaderIcons>
                    <IconButton>
                        <AttachFileIcon/>
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon/>
                    </IconButton>
                </HeaderIcons>
            </Header>
            <MessageContainer>
                {showMessage()}
                <EndOfMessage ref={endOfMessageRef}/>
            </MessageContainer>
            <InputContainer>
                <InsertEmoticon />
                <Input onChange={e => setInput(e.target.value)} value={input}/>
                <button hidden disabled={!input} type="submit" onClick={sendMessage}>Send Message</button>
                 <MicIcon />
            </InputContainer>
        </Container>
    )
}

export default ChatScreen;


const Container = styled.div`

`;


const Header = styled.div`
    position: sticky;
    background-color: white;
    z-index: 1000;
    top: 0;
    display: flex;
    padding: 11px;
    align-items: center;
    border-bottom: 1px solid whitesmoke;
`;

const HeaderInformation = styled.div`
    margin-left: 15px;
    flex: 1;
    > h3 {
        margin-bottom: 3px;

    }
    > p {
        font-size: 14px;
        color: gray;
    }
`;

const HeaderIcons = styled.div``;

const MessageContainer = styled.div`
    padding: 30px;
    background-color: #e5ded8;
    min-height: 90vh;
`;
const EndOfMessage = styled.div`
    margin-bottom: 50px;
`;
const InputContainer = styled.form`
    display: flex;
    align-items: center;
    position: sticky;
    padding: 10px;
    bottom: 0;
    background-color: white;
    z-index: 100;
`;
const Input = styled.input`
    flex: 1;
    align-items: center;
    padding: 10px;
    position: sticky;
    background-color: whitesmoke;
    z-index: 100;
`;