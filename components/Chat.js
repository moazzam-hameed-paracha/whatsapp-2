import { Avatar } from "@material-ui/core";
import Link from 'next/link'
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import styled from "styled-components";
import { auth, db } from "../firebase";
import getRecipientEmail from "../utils/getRecipientEmail"

const Chat = ({ id, users }) => {

    const [user] = useAuthState(auth);
    const [recipientSnapshot] = useCollection(db.collection('users').where('email', '==', getRecipientEmail(users, user)));

    const recipient = recipientSnapshot?.docs?.[0]?.data();
    const recipientEmail = getRecipientEmail(users, user);


    return (
        <Link href={`/chat/${id}`} passHref={true}><Container>
            {recipient ? (
                <UserAvatar src={recipient.photoURL} />
            )
                :
                <UserAvatar />
            }
            <p>{recipientEmail}</p>
        </Container></Link>
    )
}

export default Chat

const Container = styled.a`
    display: flex;
    cursor: pointer;
    padding: 15px;
    word-break: break-word;

    :hover {
        background-color: #E9EAEB;
    }
`;

const UserAvatar = styled(Avatar)`
    margin: 5px;
    margin-right: 15px;
`;