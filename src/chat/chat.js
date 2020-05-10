import React from 'react';
import {
    View,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import ImagePicker from 'react-native-image-picker';
import Backend from './Backend'
import {
    heightPercentageToDP as hp,
}
    from 'react-native-responsive-screen';
export default class chatScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: (navigation.state.params || {}).selectedItem.fullName || 'Chat! ',
        headerRight:
            <TouchableOpacity onPress={() => navigation.state.params.handleImageClick()}>
                <FontAwesome5 style={{
                    color: '#FF7200',
                    fontSize: hp('3%'),
                    paddingRight: 8,
                    marginTop: 5,
                }} name={'camera'} />
            </TouchableOpacity>,
    });

    constructor(props) {
        super(props);
        this.state = {
            uri: '',
            loading: true, messages: [],
            email: props.navigation.state.params.selectedItem.email,
            docRef: props.navigation.state.params.selectedItem.docRef,
            selectedItem: props.navigation.state.params.selectedItem,
            userDetails: props.navigation.state.params.userDetails,
        };
    }

    onSend(messages = []) {
        this.setState((previousState) => {
            return {
                messages: GiftedChat.append(previousState.messages, messages),
            };
        });
    }

    selectImage = () => {
        const options = {
            title: 'Select photo',
            storageOptions: {
                skipBackup: true,
                path: 'images',
                allowsEditing: true,
            },
        };

        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);
            this.setState({ fieldNotEmpty: true })
            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);

            }
            else {
                this.setState({
                    path: response.path.toString(),
                    uri: response.uri,
                    text: '    '
                });
            }
        });
    }

    componentDidMount() {
        this.firstTime = true;
        this.allMessages = [];
        this.messageIds = [];
        this.props.navigation.setParams({ handleImageClick: this.selectImage });
        this.setState({ messages: [] });
        Backend.loadMessages((message) => {
            if ((message.userid === this.state.docRef && message.user._id === Backend.getUid()) ||
                (message.userid === Backend.getUid() && message.user._id === this.state.docRef)) {
                this.messageIds.push(message._id);
                this.setState({ uri: '' })
                this.setState((previousState) => {
                    return {
                        messages: GiftedChat.append(previousState.messages, message),
                    };
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
        this.messageIds = [];
        Backend.closeChat()
    }

    renderBubble = (props) => {

        return (
            <Bubble
                {...props}
                textStyle={{
                    right: {
                        color: 'white',
                    },
                }}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#FF7200',
                    },
                }}
            />
        );
    }

    onLoadEarlier = () => {
        this.setState(() => {
            return {
                isLoadingEarlier: true,
            }
        });
        const context = this;
        setTimeout(() => {
            this.setState((previousState) => {
                return {
                    messages: GiftedChat.prepend(
                        previousState.messages,
                        context.fetchEarlierMessages()
                        // {
                        //     _id: 1,
                        //     text: 'Hello developer',
                        //     createdAt: new Date(),
                        //     user: {
                        //         _id: 2,
                        //         name: 'React Native',
                        //         avatar: 'https://placeimg.com/140/140/any',
                        //     },
                        // },
                    ),
                    loadEarlier: true,
                    isLoadingEarlier: false,
                }
            })
        }, 1500) // simulating network
    }

    fetchEarlierMessages() {
        let counter = 0;
        const earlierMessage = [];
        if (this.firstTime === true) {
            this.firstTime = false;
            this.allMessages = Backend.allMessagesArray.reverse();
        }
        this.allMessages.forEach(element => {
            if (!this.messageIds.includes(element.key) && counter < 9) {
                counter++;
                let value = element.val();
                value['_id'] = element.key;
                earlierMessage.push(value);
                this.messageIds.push(element.key);
            }
        });
        return earlierMessage;
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
                            text={this.state.text}
                            onInputTextChanged={text => this.setState({ text: text })}
                            messages={this.state.messages}
                            onSend={(message) => {
                                Backend.sendMessage(message, this.state.docRef, this.state.uri)
                            }}
                            renderBubble={this.renderBubble}
                            user={{
                                _id: Backend.getUid(),
                                name: this.state.userDetails.fullName,
                                avatar: this.state.userDetails.profilePicture
                            }}
                            extraData={this.state}
                            loadEarlier={true}
                            onLoadEarlier={this.onLoadEarlier}
                            isLoadingEarlier={this.state.messages.length >= 20}
                            alwaysShowSend={
                                this.state.text ? true : false || this.state.uri ? true : false
                            }
                        />
                    )
                }
            </View>
        );
    }
}
