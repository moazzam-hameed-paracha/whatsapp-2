import { Avatar, IconButton } from "@material-ui/core";
import { InsertEmoticon, Mic } from "@material-ui/icons";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { useRouter } from "next/dist/client/router";
import { useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import styled from "styled-components";
import { auth, db } from "../firebase";
import Message from "./Message";
import { serverTimestamp } from "firebase/firestore"
import getRecipientEmail from "../utils/getRecipientEmail";
import TimeAgo from "timeago-react"

const ChatScreen = ({ chat, messages }) => {

    const [user] = useAuthState(auth);
    const [input, setInput] = useState('')
    const router = useRouter();
    const [messagesSnapShot] = useCollection(db.collection('chats').doc(router.query.id).collection('messages').orderBy('timestamp', 'asc'));
    const endOfMessage = useRef(null)

    const [recipientSnapshot] = useCollection(db.collection('users').where('email', '==', getRecipientEmail(chat.users, user)));

    const scrollToBottom = () => {
        endOfMessage.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
        })
    }

    const showMessages = () => {
        if (messagesSnapShot) {
            return messagesSnapShot.docs.map(message => (
                <Message
                    key={message.id}
                    user={message.data().user}
                    message={{
                        ...message.data(),
                        timestamp: message.data().timestamp?.toDate().getTime(),
                    }}
                />
            ))
        }
        else {
            return JSON.parse(messages).map(message => (
                <Message
                    key={message.id}
                    user={message.user}
                    message={message}
                />
            ))
        }
    }

    const sendMessage = (e) => {
        e.preventDefault();

        db.collection('users').doc(user.uid).set({
            lastScreen: serverTimestamp(),
        }, { merge: true })

        db.collection('chats').doc(router.query.id).collection('messages').add({
            timestamp: serverTimestamp(),
            message: input,
            user: user.email,
            photoURL: user.photoURL,
        });

        setInput("");
        scrollToBottom();
    }

    const recipient = recipientSnapshot?.docs?.[0]?.data();
    const recipientEmail = getRecipientEmail(chat.users, user);

    return (
        <Container>
            <Header>
                {recipient ? (
                    <Avatar src={recipient?.photoURL} />
                ) : (
                    <Avatar />
                )}

                <HeaderInformation>
                    <h3>{recipientEmail}</h3>
                    {recipientSnapshot ? (
                        <p>Last active: {' '}
                        {recipient?.lastScreen?.toDate() ? (
                            <TimeAgo datetime={recipient?.lastScreen?.toDate()} />
                        ) : "Unavaliable"}
                        </p>
                    ) : (
                        <p>loading last active</p>
                    )}
                </HeaderInformation>
                <HeaderIcons>
                    <IconButton>
                        <AttachFileIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </HeaderIcons>
            </Header>

            <MessageContainer>
                {showMessages()}
                <EndOfMessage ref={endOfMessage} />
            </MessageContainer>

            <InputContainer>
                <InsertEmoticon />
                <Input value={input} onChange={e => setInput(e.target.value)} />
                <button hidden disabled={!input} type="submit" onClick={sendMessage}>Send Message</button>
                <Mic />
            </InputContainer>
        </Container>
    )
}

export default ChatScreen

const Input = styled.input`
    flex: 1;
    outline: 0;
    border: none;
    border-radius: 10px;
    background-color: whitesmoke;
    padding: 20px;
    margin-left: 15px;
    margin-right: 15px;
`;

const InputContainer = styled.form`
    display: flex;
    align-items: center;
    padding: 10px;
    position: sticky;
    bottom: 0;
    background-color: white;
    z-index: 100;
`;

const HeaderIcons = styled.div``;

const HeaderInformation = styled.div`
    margin-left: 15px;
    flex: 1;

    > h3 {
        margin: 0px;
        margin-bottom: 3px;
    }

    > p {
        font-size: 14px;
        margin: 0px;
        margin-bottom: 10px;
        color: gray;
    }
`;

const Header = styled.div`
    display: flex;
    position: sticky;
    background-color: white;
    align-items: center;
    z-index: 100;
    top: 0;
    display: flex;
    padding: 11px;
    border-bottom: 1px solid whitesmoke;
`;

const Container = styled.div`
`;

const EndOfMessage = styled.div`
    margin-bottom: 50px;
`;

const MessageContainer = styled.div`
    padding: 30px;
    background-color: #E5DED8;
    min-height: calc(90vh - 90px);
    
`;
