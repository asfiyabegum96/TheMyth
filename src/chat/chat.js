import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import Backend from './Backend'

export default class chat extends React.Component {

    constructor(props) {
        super(props);
        this.state = { messages: [], email: props.navigation.state.params.email };
        this.onSend = this.onSend.bind(this);
    }
    componentWillMount() {
        // this.setState({
        //     messages: [
        //         {
        //             _id: 1,
        //             text: 'Hello developer',
        //             createdAt: new Date(),
        //             user: {
        //                 _id: 2,
        //                 name: 'React Native',
        //                 avatar: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
        //             },
        //         },
        //     ],
        // });
    }

    onSend(messages = []) {
        this.setState((previousState) => {
            return {
                messages: GiftedChat.append(previousState.messages, messages),
            };
        });
    }

    componentDidMount() {
        Backend.loadMessages((message) => {
            if (message._id === Backend.getUid() || message.user._id === Backend.getUid()) {
                this.setState((previousState) => {
                    return {
                        messages: GiftedChat.append(previousState.messages, message),
                    };
                });
            }
        });
    }

    componentWillUnmount() {
        Backend.closeChat()
    }

    render() {
        return (
            <GiftedChat
                messages={this.state.messages}
                onSend={(message) => {
                    Backend.sendMessage(message)
                }}
                // onSend={this.onSend}
                user={{
                    _id: Backend.getUid(),
                    name: 'Asfiya',
                    email: this.state.email
                }}
            />
        );
    }
}
