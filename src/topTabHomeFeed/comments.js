import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    FlatList,
    TextInput,
    ActivityIndicator,
    BackHandler
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
}
    from 'react-native-responsive-screen';
import firebase from 'react-native-firebase';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/Entypo';
import { ScrollView } from 'react-native-gesture-handler';
export default class Comments extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            commentText: '',
            feedData: [],
            selectedItem: props.navigation.state.params.selectedItem,
            email: props.navigation.state.params.email,
            feedRefresh: false,
            userDetails: ''
        }
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this)
        this.baseState = this.state;
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
        this.fetchUserDetails();
        this.fetchComments();
    }

    componentWillUnMount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
        this.setState(this.baseState)
    }

    handleBackButtonClick() {
        this.props.navigation.goBack(null);
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
        return true;
    }

    fetchUserDetails = () => {
        const context = this;
        let db = firebase.firestore();
        let photosRef = db.collection('signup');
        photosRef.where('email', '==', this.state.email).get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                let data;
                const docNotEmpty = (doc.id, " => ", doc.data() != null);
                if (docNotEmpty) {
                    data = (doc.id, " => ", doc.data());
                    context.setState({ userDetails: data });
                    const placeHolder = `Comment as ${data.fullName}...`
                    context.setState({ placeHolder: placeHolder })
                }
            });
        });
    }

    fetchComments = () => {
        this.setState({
            feedData: [],
            feedRefresh: true
        });
        let that = this;
        let db = firebase.firestore();
        let photosRef = db.collection('comments');
        photosRef.where('image', '==', this.state.selectedItem.item.url).get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                let data;
                const docNotEmpty = (doc.id, " => ", doc.data() != null);
                if (docNotEmpty) {
                    data = (doc.id, " => ", doc.data());
                }
                let feedData = that.state.feedData;
                let userRef = db.collection('signup');
                userRef.where('email', '==', that.state.email).get().then(function (userQuerySnapshot) {
                    userQuerySnapshot.forEach(function (doc) {
                        let userData;
                        const docNotEmpty = (doc.id, " => ", doc.data() != null);
                        if (docNotEmpty) {
                            userData = (doc.id, " => ", doc.data());
                            if (userData.email === data.email) {
                                that.addToFlatlist(feedData, data, userData);
                            } else {
                                userRef.where('email', '==', data.email.trim()).get().then(function (otheruserSnapshot) {
                                    otheruserSnapshot.forEach(function (otherDoc) {
                                        const docNotEmpty = (otherDoc.id, " => ", otherDoc.data() != null);
                                        if (docNotEmpty) {
                                            let otherUserData;
                                            otherUserData = (otherDoc.id, " => ", otherDoc.data());
                                            that.addToFlatlist(feedData, data, otherUserData);
                                        }
                                    })
                                })
                            }
                        }
                    });
                });
            });
        });
        that.setState({
            feedRefresh: false,
            loading: false,
        });
    }


    addToFlatlist = (feedData, data, userData) => {
        var that = this;
        feedData.push({
            name: userData.fullName,
            comment: data.comment,
            postedTime: that.timeConverter(data.postedTime),
            image: data.url,
            userAvatar: userData.profilePicture,
        });
        that.setState({
            feedRefresh: false,
            loading: false,
        });
    }

    timeConverter = (timestamp) => {
        let a = new Date(timestamp * 1000);
        let seconds = Math.floor((new Date() - a) / 1000);

        let interval = Math.floor(seconds / 31536000);
        if (interval > 1) {
            return interval + ' year' + this.pluralCheck(interval);
        }
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) {
            return interval + ' month' + this.pluralCheck(interval);
        }
        interval = Math.floor(seconds / 86400);
        if (interval > 1) {
            return interval + ' day' + this.pluralCheck(interval);
        }
        interval = Math.floor(seconds / 3600);
        if (interval > 1) {
            return interval + ' hour' + this.pluralCheck(interval);
        }
        interval = Math.floor(seconds / 60);
        if (interval > 1) {
            return interval + ' minute' + this.pluralCheck(interval);
        }
        return Math.floor(seconds) + ' second' + this.pluralCheck(seconds);
    }

    // Cover the timestamp to show in real minutes
    pluralCheck = (s) => {
        if (s == 1) {
            return ' ago';
        } else {
            return 's ago';
        }
    }

    // Generate random Id for images
    s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    uniqueId = () => {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
            this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4();
    }

    insertComment = () => {
        if (this.state.commentText) {
            const context = this;
            const docRef = this.uniqueId();
            let dateTime = Date.now();
            let timestamp = Math.floor(dateTime / 1000);
            const selectedItem = this.state.selectedItem.item;
            // Create object for firestore
            let commentObject = {
                comment: this.state.commentText,
                image: selectedItem.url,
                email: this.state.email,
                docRef: docRef,
                postedTime: timestamp,
            }

            firebase.firestore().collection('comments').doc(docRef).set(commentObject).then(function (docRef) {
                context.setState({ commentText: null });
                context.fetchComments();
            });
        }
    }

    render() {
        const { item } = this.state.selectedItem
        return (
            <View style={styles.mainContainer}>

                {this.state.loading == true ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" color='red' />
                    </View>
                ) : (<>
                    <View style={styles.header}>
                        <Text style={styles.inputSearch}
                        >myth</Text>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('homeFixed', { email: this.props.navigation.state.params.email })} >
                            <Icon name={'home'} size={30} color="#fff" />
                        </TouchableOpacity>
                    </View>
                    <ScrollView>
                        <View style={{ paddingHorizontal: wp('1%'), marginTop: hp('1%') }}>
                            <View style={styles.feedBorder}>
                                <View style={styles.listHeader}>
                                    <TouchableOpacity onPress={() => this.viewOtherUserProfiles({ item })} style={{ paddingHorizontal: 10, }}>
                                        <Image
                                            source={{ uri: item.userAvatar }}
                                            style={{
                                                width: wp('15%'),
                                                height: hp('8%'),
                                                resizeMode: 'cover',
                                                borderRadius: wp('3%'), borderWidth: 1, marginLeft: wp('2%'), marginTop: wp('-5%'),
                                            }} />
                                    </TouchableOpacity>

                                    <TouchableOpacity>
                                        <Text style={styles.listProfileName}>{item.author}</Text>
                                        <View style={styles.locationDiv}>
                                            <Text style={styles.locationText}>{item.location}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.listViewImg}>
                                    <Image style={styles.listViewInlineImg}
                                        source={{ uri: item.url }}
                                        loadingIndicatorSource={require('../images/loading.gif')}
                                    />
                                </View>
                            </View>
                            <View style={styles.foodNameDiv}>
                                <Text style={styles.listProfileName1}>{item.author}</Text>
                                <Text style={styles.foodNameText}>{item.caption}</Text>
                            </View>
                            <Text style={{ marginLeft: wp('5%'), marginBottom: wp('5%'), fontSize: hp('1.5%'), color: '#808080' }}>{item.postedTime}</Text>
                        </View>
                        <FlatList
                            style={styles.root}
                            refreshing={this.state.feedRefresh}
                            onRefresh={this.fetchComments}
                            data={this.state.feedData}
                            extraData={this.state}
                            ItemSeparatorComponent={() => {
                                return (
                                    <View style={styles.separator} />
                                )
                            }}
                            keyExtractor={(item) => {
                                return item.id;
                            }}
                            renderItem={(item) => {
                                const Notification = item.item;
                                return (
                                    <View style={styles.container}>
                                        <TouchableOpacity onPress={() => { }}>
                                            <Image style={styles.image} source={{ uri: Notification.userAvatar }} />
                                        </TouchableOpacity>
                                        <View style={styles.content}>
                                            <View style={styles.contentHeader}>
                                                <Text style={styles.name}>{Notification.name}</Text>
                                                <Text style={styles.commentSection} rkType='primary3 mediumLine'>{Notification.comment}</Text>
                                            </View>

                                            <Text style={styles.time}>
                                                {Notification.postedTime}
                                            </Text>
                                        </View>
                                    </View>
                                );
                            }} /></ScrollView></>
                    )}

                <View style={styles.viewcomment}>
                    <Image style={styles.myimage} source={{ uri: this.state.userDetails.profilePicture }} />
                    <TextInput value={this.state.commentText}
                        onChangeText={(commentText) => { this.setState({ commentText }) }} placeholder={this.state.placeHolder} placeholderTextColor='#808080' multiline={true} style={styles.inputStyle} />
                    <TouchableOpacity onPress={this.insertComment} style={styles.butText}>
                        <Text style={styles.buttonText}>Comment</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        backgroundColor: 'white',
        paddingTop: wp('1%'),
        maxHeight: hp('80%'),
    },
    container: {
        // paddingLeft: 19,
        paddingRight: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    content: {
        marginLeft: wp('4%'),
        flex: 1,
    },
    contentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6
    },
    separator: {
        height: wp('0.1%'),
        marginLeft: wp('20%'),
        backgroundColor: 'white',
        width: wp('71%'),
    },
    image: {
        width: 45,
        height: 45,
        borderRadius: 10,
        marginLeft: wp('8%')
    },
    time: {
        fontSize: 11,
        color: "#808080",
        marginRight: wp('5%')
    },
    name: {
        fontSize: 14,
        fontWeight: "bold",
        color: 'black',
        width: 70
    },
    commentSection: {
        color: "black",
        marginRight: wp('50%'),
        marginTop: wp('0%'),
        fontSize: 14
    },
    viewcomment: {
        backgroundColor: '#fff6f2',
        borderRadius: 10,
        flexDirection: 'row',
        left: '2%',
        marginRight: wp('8%'),
        paddingBottom: wp('2%')
    },
    butText: {
        color: '#22222C',
        marginTop: wp('5%'),

    },
    inputStyle: {
        marginLeft: wp('4%'),
        width: wp('55%'),
        color: 'black',

    },
    buttonText: {
        color: '#EE6E3D',
        marginLeft: wp('-6%')
    },
    myimage: {
        width: 45,
        height: 45,
        borderRadius: 10,
        marginLeft: wp('4%'),
        marginTop: wp('2%'),
    },
    mainContainer: {
        height: 762
    },
    listHeader: {
        flexDirection: 'row',
        marginTop: hp('3%')
    },
    listProfileName: {
        fontSize: hp('2%'),
        fontWeight: 'bold',
        color: '#22222C',
        marginRight: wp('5%'),
        marginTop: wp('-3%'),
    },
    listProfileName1: {
        fontSize: hp('2%'),
        fontWeight: 'bold',
        color: '#22222C',
        marginLeft: wp('3%'),
        marginTop: wp('-5%')
    },
    listProfileSubName: {
        color: '#22222C',
        marginRight: wp('15%'),
    },
    listViewImg: {
        paddingVertical: wp('2%'),
    },
    listViewInlineImg: {
        width: wp('90%'),
        height: wp('90%'),
        marginLeft: wp('4%'),
        borderWidth: 1,
        borderRadius: wp('3%'),
        marginBottom: wp('5%')
    },
    foodNameDiv: {
        left: 1,
        padding: 7,
        flexDirection: 'row',
    },
    foodNameText: {
        fontSize: hp('2%'),
        left: 5,
        marginTop: wp('-5%'),
    },
    locationDiv: {
        left: 1,
        flexDirection: 'row',
        alignItems: 'baseline'
    },
    locationText: {
        fontSize: hp('1.5%'),
        color: '#EE6E3D',
    },
    comment: {
        paddingHorizontal: wp('2%')
    },
    more: {
        marginLeft: wp('60%'),
    },
    likeText: {
        marginRight: wp('45%'),
        paddingBottom: wp('4%'),
        marginTop: wp('-1%'),
    },
    fabIcon: {
        color: '#EE6E3D',
        fontSize: hp('2.5%'),
        marginLeft: wp('55%'),
        fontSize: 26,
    },
    profile: {
        color: '#fff',
        fontSize: hp('3%'),
        paddingVertical: wp('0.5%'),
        paddingHorizontal: wp('0.8%'),
        marginTop: 5,
        marginRight: wp('1.5%'),
    },
    inputSearch: {
        width: wp('70%'),
        paddingVertical: 2,
        borderBottomWidth: wp('0.1%'),
        borderBottomColor: '#fff',
        backgroundColor: '#EE6E3D',
        fontSize: 20,
        color: '#fff',
        height: hp('4%'),
        fontStyle: 'italic',
        paddingLeft: wp('40%'),
        backgroundColor: '#EE6E3D', height: hp('4%'), borderBottomWidth: 0, borderTopWidth: 0
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#EE6E3D',
        padding: 10,
    },
});  