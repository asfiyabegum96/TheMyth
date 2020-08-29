import React from 'react';
import {
    View,
    TouchableOpacity,
    ActivityIndicator,
    AsyncStorage,
    StyleSheet,
    Image,
    Text
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { GiftedChat, Bubble, InputToolbar, Composer, Time, Avatar, Message } from 'react-native-gifted-chat';
import ImagePicker from 'react-native-image-picker';
import Backend from './Backend'
import {
    heightPercentageToDP as hp, widthPercentageToDP,
}
    from 'react-native-responsive-screen';

import {
    widthPercentageToDP as wp,
    listenOrientationChange as loc,
    removeOrientationListener as rol
}
    from 'react-native-responsive-screen';
import firebase from 'react-native-firebase';

export default class chatScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: 'Chat',
        headerRight:
            <TouchableOpacity onPress={() => navigation.state.params.handleImageClick()}>
                <FontAwesome5 style={{
                    color: 'white',
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
            userEmail: props.navigation.state.params.email,
            email: props.navigation.state.params.selectedItem.email,
            docRef: props.navigation.state.params.selectedItem.docRef,
            selectedItem: props.navigation.state.params.selectedItem,
            userDetails: props.navigation.state.params.userDetails,
        };
        console.log(this.state.selectedItem)
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
                });
                this.proceedToSend();
            }
        });
    }

    proceedToSend() {
        const message = [{
            user: {
                _id: Backend.getUid(),
                name: this.state.userDetails.fullName,
                avatar: this.state.userDetails.profilePicture
            }
        }]
        Backend.sendMessage(message, this.state.docRef, this.state.uri);
        this.setState({ uri: '' })
    }

    componentDidMount() {
        this.firstTime = true;
        this.allMessages = [];
        this.messageIds = [];
        this.props.navigation.setParams({ handleImageClick: this.selectImage });
        this.setState({ messages: [] });
        this.checkUserAuthorization();
        Backend.loadMessages((message) => {
            if ((message.userid === this.state.docRef && message.user._id === Backend.getUid()) ||
                (message.userid === Backend.getUid() && message.user._id === this.state.docRef)) {
                this.setState({ uri: '' })
                this.messageIds.push(message._id);
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

    async checkUserAuthorization() {
        firebase.messaging().hasPermission()
            .then((enabled) => {
                if (enabled) {
                    console.log('user has permission');
                } else {
                    console.log('user does not have permission');
                    this.getPermission()
                }
            });
        let fcmToken = await AsyncStorage.getItem('fcmToken');
        this.setState({ token: fcmToken })
        console.log('token from async storage', fcmToken);
        if (!fcmToken) {
            fcmToken = await firebase.messaging().getToken();
            if (fcmToken) {
                console.log('token from firebase', fcmToken);
                this.setState({ token: fcmToken })
                await AsyncStorage.setItem("fcmToken", fcmToken, this.state.token); // store in db during installing and access that token
            }
        }
    }

    async getPermission() {
        firebase.messaging().requestPermission()
            .then(() => {
                console.log('user has authorized')
            })
            .catch(() => {
                console.log('rejected permission')
            })
    }

    componentWillUnmount() {
        this.messageIds = [];
        this.setState({ uri: '' })
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
                    right: {
                        color: 'white',
                    },
                }}

                wrapperStyle={{
                    right: {
                        backgroundColor: '#FF7200',
                        marginBottom: 8,
                    },
                    left: {
                        backgroundColor: 'white',
                        marginBottom: 8,
                    }
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
    customtInputToolbar = props => {
        return (
            <InputToolbar
                {...props}
                containerStyle={{
                    backgroundColor: "white",
                    borderColor: "white",
                    borderTopColor: 'white',
                    borderWidth: 1,
                    borderRadius: 14,
                    margin: 10,
                    paddingLeft: 10
                }}
            />
        );
    };

    renderAvatar(props) {
        return (
            <Avatar
                {...props}
                imageStyle={{
                    left: {
                        borderRadius: wp('3%'), borderWidth: 1,
                    },
                    right: {
                        borderRadius: wp('3%'), borderWidth: 1,
                    },
                }
                }
            />
        );
    }

    renderChatFooter(props) {
        return (
            <>
                {this.state.userDetails.isPrivateAccount === true ?
                    <View style={{ borderWidth: 1, borderColor: '#ff2700', margin: wp('5%'), borderRadius: 10 }}>
                        <View style={styles.whisper}>
                            <Text style={{ color: '#ccc', fontWeight: 'bold' }}>{this.state.selectedItem.fullName} has something to whisper!</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={styles.accept}>
                                <TouchableOpacity style={{ marginBottom: wp('25%'), flexDirection: 'row' }}>
                                    <Text style={styles.acceptText}>Accept</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.deny}>
                                <TouchableOpacity >
                                    <Text style={styles.denyText}>Deny</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View> : <></>}
            </>)
    }


    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#fff6f2' }}>
                {this.state.loading == true ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" color='red' />
                    </View>
                ) : (<>
                    <View style={
                        {
                            // flex: 1,
                            backgroundColor: '#fff6f2',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: widthPercentageToDP('40%'),
                            // marginBottom: 150
                        }}>
                        <Image
                            source={{ uri: this.state.selectedItem.profilePicture }}
                            style={{
                                width: wp('20%'),
                                height: hp('10%'),
                                resizeMode: 'cover',
                                borderRadius: wp('3%'), borderWidth: 1, marginLeft: wp('2%'),
                            }} />
                        <Text style={{ marginTop: wp('5%'), fontWeight: 'bold', fontSize: wp('4%'), marginBottom: wp('5%') }}>{this.state.selectedItem.fullName}</Text>
                        <View style={{
                            width: wp('90%'),
                            borderBottomColor: '#ccc', borderBottomWidth: 0.5,
                            marginLeft: wp('10%'),
                            marginRight: wp('10%')
                        }}></View>
                    </View>
                    <GiftedChat
                        messages={this.state.messages}
                        renderAvatarOnTop={true}
                        onSend={(message) => {
                            Backend.sendMessage(message, this.state.docRef, this.state.uri, this.state.token, this.state.selectedItem, this.state.userEmail)
                        }}
                        renderBubble={this.renderBubble}
                        user={{
                            _id: Backend.getUid(),
                            name: this.state.userDetails.fullName,
                            avatar: this.state.userDetails.profilePicture
                        }}
                        placeholder="Whisper here..."
                        showUserAvatar={true}
                        extraData={this.state}
                        loadEarlier={this.state.messages.length >= 9}
                        onLoadEarlier={this.onLoadEarlier}
                        isLoadingEarlier={this.state.isLoadingEarlier}
                        renderInputToolbar={props => this.customtInputToolbar(props)}
                        renderAvatar={props => this.renderAvatar(props)}
                        renderChatFooter={props => this.renderChatFooter(props)}
                    />
                </>
                    )
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    accept: {
        width: wp('38%'),
        height: hp('6%'),
        backgroundColor: '#FF7200',
        marginLeft: wp('5%'),
        alignItems: 'center',
        marginBottom: wp('8%'),
        borderRadius: wp('2%'),
        borderWidth: 2,
        borderColor: '#FF7200',
    },
    deny: {
        width: wp('38%'),
        height: hp('6%'),
        backgroundColor: '#ccc',
        marginLeft: wp('4%'),
        alignItems: 'center',
        marginBottom: wp('8%'),
        borderRadius: wp('2%'),
        borderWidth: 2,
        borderColor: '#ccc',
    },
    acceptText: {
        color: 'white',
        width: wp('80%'),
        alignItems: 'center',
        fontSize: hp('2%'),
        marginLeft: wp('55%'),
        paddingVertical: 8,
        paddingHorizontal: 25,
        fontWeight: 'bold',
    },
    denyText: {
        color: 'white',
        width: wp('80%'),
        alignItems: 'center',
        fontSize: hp('2%'),
        marginLeft: wp('58%'),
        paddingVertical: 8,
        paddingHorizontal: 25,
        fontWeight: 'bold',
    },
    whisper: {
        alignItems: 'center',
        paddingBottom: wp('5%'),
        paddingTop: wp('5%')
    }
})