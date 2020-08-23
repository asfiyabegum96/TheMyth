import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    FlatList,
    TextInput,
    ActivityIndicator
} from 'react-native';
import {     widthPercentageToDP as wp,
    heightPercentageToDP as hp,
}
    from 'react-native-responsive-screen';
import firebase from 'react-native-firebase';
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
        this.baseState = this.state;
    }

    componentDidMount() {
        this.fetchUserDetails();
        this.fetchComments();
    }

    componentWillUnMount() {
        this.setState(this.baseState)
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
                    context.setState({ userDetails: data })
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
        return (
            <View style={styles.mainContainer}>
               
                {this.state.loading == true ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" color='red' />
                    </View>
                ) : (
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
                            }} />
                    )}
                     <View style={styles.viewcomment}>
                    <Image style={styles.myimage} source={{ uri: this.state.userDetails.profilePicture }} />
                    <TextInput value={this.state.commentText}
                        onChangeText={(commentText) => { this.setState({ commentText }) }} placeholder="Comment as Ashwin..." placeholderTextColor='#808080' multiline={true} style={styles.inputStyle} />
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
        marginLeft: 20
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
      marginBottom: wp('10%'),
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
        color: '#FF7200',
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
    }
});  