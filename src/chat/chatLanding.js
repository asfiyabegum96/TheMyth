import React from 'react';
import {
    StyleSheet,
    Text,
    Image,
    View,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    FlatList,
    BackHandler
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    listenOrientationChange as loc,
    removeOrientationListener as rol
}
    from 'react-native-responsive-screen';
import firebase from 'react-native-firebase';
import Backend from './Backend';
export default class chatLanding extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            search: '',
            loading: true,
            feedRefresh: false,
            feedData: [],
            searchArray: [],
            pendingArray: [],
            email: props.navigation.state.params.email
        }
        this.baseState = this.state;
        this.props.navigation.addListener('willFocus', () => {
            this.fetchUserDetails();
        })
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
        loc(this);
        this.fetchUserDetails()
    }

    componentWillUnMount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
        rol();
    }

    handleBackButtonClick() {
        this.props.navigation.goBack(null);
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
        return true;
    }


    fetchUserDetails() {
        const context = this;
        let db = firebase.firestore();
        let photosRef = db.collection('signup');
        photosRef.where('email', '==', context.props.navigation.state.params.email).get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                let data;
                const docNotEmpty = (doc.id, " => ", doc.data() != null);
                if (docNotEmpty) data = (doc.id, " => ", doc.data());
                context.setState({ user: doc.data() })
                context.getFollowers();
            })
        })
    }

    getFollowers = () => {
        let isFollower = false, searchArray = [], emailArray = [];
        const context = this;
        this.setState({ feedData: [], feedRefresh: false, })
        let db = firebase.firestore();
        let photosRef = db.collection('signup');
        photosRef.doc(this.state.user.docRef).collection('followers').get().then(function (followerSnapshot) {
            followerSnapshot.forEach(function (followerDoc) {
                const docNotEmpty = (followerDoc.id, " => ", followerDoc.data() != null);
                if (docNotEmpty) {
                    followerDoc.data().isFollower = true;
                    emailArray.push(followerDoc.data().email);
                    searchArray.push(followerDoc.data())
                }
            });
            context.fetchFollowing(photosRef, emailArray, searchArray);
            context.setState({ searchArray: searchArray });
        });
    }

    fetchFollowing(photosRef, emailArray, searchArray) {
        const context = this;
        photosRef.doc(this.state.user.docRef).collection('following').get().then(function (followerSnapshot) {
            followerSnapshot.forEach(function (followerDoc) {
                const docNotEmpty = (followerDoc.id, " => ", followerDoc.data() != null);
                if (docNotEmpty) {
                    followerDoc.data().isFollowing = true;
                    if (!emailArray.includes(followerDoc.data().email)) {
                        searchArray.push(followerDoc.data());
                    } else {
                        if (searchArray.length) {
                            searchArray.forEach(element => {
                                if (element.email.trim() === followerDoc.data().email.trim()) {
                                    element.isFollowing = true;
                                }
                            });
                            context.setState({ searchArray: searchArray });
                        }
                    }
                }
            })
            context.setState({ searchArray: searchArray });
            context.fetchFollowers();
            context.fetchPendingFollowers(photosRef, emailArray);
        });
    }

    fetchPendingFollowers(photosRef, emailArray) {
        const context = this;
        const pendingArray = [];
        photosRef.doc(this.state.user.docRef).collection('pendingFollowers').get().then(function (followerSnapshot) {

            followerSnapshot.forEach(function (followerDoc) {
                const docNotEmpty = (followerDoc.id, " => ", followerDoc.data() != null);
                if (docNotEmpty) {
                    if (!emailArray.includes(followerDoc.data().email)) {
                        pendingArray.push(followerDoc.data());
                    }
                    context.setState({ pendingArray: pendingArray });
                }
            })
        });
    }

    fetchFollowers() {
        if (this.state.searchArray.length) {
            const context = this;
            let resultArray = []
            let db = firebase.firestore();
            let photosRef = db.collection('signup');
            this.state.searchArray.forEach(element => {
                photosRef.where('email', '==', element.email).get().then(function (querySnapshot) {
                    querySnapshot.forEach(function (doc) {
                        let data;
                        const docNotEmpty = (doc.id, " => ", doc.data() != null);
                        if (docNotEmpty) {
                            data = (doc.id, " => ", doc.data());
                            doc.data().isFollowing = element.isFollowing;
                            doc.data().isFollower = element.isFollower;
                            resultArray.push(doc.data())
                        }
                    });
                    context.setState({ feedData: resultArray });
                    context.setState({
                        feedRefresh: false,
                        loading: false,
                    });
                })
            });

        } else {
            this.setState({
                feedRefresh: false,
                loading: false,
            });
        }
    }

    navigateToChat(selectedItem) {
        const uri = this.props.navigation.state.params.selectedItem && this.props.navigation.state.params.selectedItem.item.url ? this.props.navigation.state.params.selectedItem.item.url : '';
        const item = selectedItem.item ? selectedItem.item : selectedItem;
        this.setState(this.baseState);
        if (uri) {
            const message = [{
                user: {
                    _id: Backend.getUid(),
                    name: this.state.user.fullName,
                    avatar: this.state.user.profilePicture
                }
            }]
            Backend.sendMessage(message, item.docRef, uri);
            this.props.navigation.goBack(null)
            alert('Post sent');

        }
        else {
            this.props.navigation.navigate('chatScreen', { selectedItem: item, email: this.state.email, userDetails: this.state.user })
        }
    }

    displayPendingMessageRequest() {
        this.setState({ searchArray: this.state.pendingArray });
        setTimeout(() => {
            this.fetchFollowers();
        }, 100);
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#fff6f2', }}>
                {this.state.loading == true ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff6f2', }}>
                        <ActivityIndicator size="large" color='red' />
                    </View>
                ) : (
                        <ScrollView>
                            <View style={{ flex: 1, }}>
                                {this.state.user.isPrivateAccount == true ?
                                    <TouchableOpacity onPress={() => { this.displayPendingMessageRequest() }}>
                                        <Text style={styles.butText}>Message request</Text>
                                    </TouchableOpacity>
                                    : <View></View>}
                                <FlatList
                                    style={{ flex: 1 }}
                                    refreshing={this.state.feedRefresh}
                                    onRefresh={this.getFollowers}
                                    data={this.state.feedData}
                                    extraData={this.state}
                                    ItemSeparatorComponent={
                                        () => { return <View style={styles.separator} /> }
                                    }
                                    keyExtractor={(item) => {
                                        return item.id;
                                    }}
                                    renderItem={(item) => {
                                        const Notification = item.item;
                                        return (
                                            <View style={styles.container}>
                                                <TouchableOpacity onPress={() => { }}>
                                                    <Image style={styles.image} source={{ uri: Notification.profilePicture }} />
                                                </TouchableOpacity>
                                                <View style={styles.content}>
                                                    <Text onPress={(selectedItem) => this.navigateToChat(item)} style={styles.name}>{Notification.fullName}</Text>
                                                </View>
                                            </View>
                                        );
                                    }} />
                            </View>
                        </ScrollView>)}
            </View>

        );
    }
}

const styles = StyleSheet.create({
    root: {
        backgroundColor: '#fff6f2',
        paddingTop: 10,
        paddingLeft: '5.5%',
    },

    container: {
        paddingLeft: 19,
        paddingRight: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'flex-start',

    },
    name: {
        fontSize: 15,
        fontWeight: "bold",
        color: '#FF7200',
        paddingTop: 10,
        color: 'black'
    },
    content: {
        marginLeft: 16,
        flex: 1,
    },
    image: {
        width: 45,
        height: 45,
        borderRadius: 10,
        marginLeft: 20
    },
    butText: {
        color: '#fff2e7',
        fontSize: hp('2%'),
        marginTop: 10,
        borderColor: '#A9A9A9',
        backgroundColor: '#FF7200',
        paddingVertical: 8,
        paddingHorizontal: 20,
        fontWeight: 'bold',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#FF7200'
    },
});