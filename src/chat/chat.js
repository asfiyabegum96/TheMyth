import React from 'react';
import {
    View,
    ActivityIndicator,
} from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import Backend from './Backend'

export default class chatScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true, messages: [],
            email: props.navigation.state.params.selectedItem.email,
            docRef: props.navigation.state.params.selectedItem.docRef,
            selectedItem: props.navigation.state.params.selectedItem
        };
    }

    onSend(messages = []) {
        this.setState((previousState) => {
            return {
                messages: GiftedChat.append(previousState.messages, messages),
            };
        });
    }

    componentDidMount() {
        this.setState({messages: []})
        Backend.loadMessages((message) => {
            if ((message.userid === this.state.docRef && message.user._id === Backend.getUid()) ||
                (message.userid === Backend.getUid() && message.user._id === this.state.docRef)) {
                this.setState((previousState) => {
                    return {
                        messages: GiftedChat.append(previousState.messages, message),
                    };
                });
                this.setState({
                    loading: false,
                });
            } else {
                this.setState({
                    loading: false,
                });
            }
        });
        this.setState({
            loading: false,
        });
    }

    componentWillUnmount() {
        Backend.closeChat()
    }

    render() {
        return (
            <View style={{ flex: 1, }}>
                {this.state.loading == true ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" color='red' />
                    </View>
                ) : (
                        <GiftedChat
                            messages={this.state.messages}
                            onSend={(message) => {
                                Backend.sendMessage(message, this.state.docRef)
                            }}
                            user={{
                                _id: Backend.getUid(),
                                name: this.state.selectedItem.fullName,
                                avatar: this.state.selectedItem.profilePicture
                            }}
                        />
                    )
                }
            </View>
        );
    }
}
