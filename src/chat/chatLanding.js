import React from 'react';
import {
    StyleSheet,
    Text,
    Image,
    View,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    FlatList
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    listenOrientationChange as loc,
    removeOrientationListener as rol
}
    from 'react-native-responsive-screen';
import firebase from 'react-native-firebase';
export default class chatLanding extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            search: '',
            loading: true,
            feedRefresh: false,
            feedData: [],
            searchArray: [],
            email: props.navigation.state.params.email
        }
        this.baseState = this.state;
        this.props.navigation.addListener('willFocus', () => {
            this.fetchUserDetails();
        })
    }
    componentDidMount() {
        loc(this);
        this.fetchUserDetails()
    }

    componentWillUnMount() {
        rol();
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
                    isFollower = true;
                    console.log(followerDoc.data())
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
                    console.log(emailArray)
                    if (!emailArray.includes(followerDoc.data().email)) {
                        searchArray.push(followerDoc.data());
                    }
                }
            })
            context.setState({ searchArray: searchArray });
            context.fetchFollowers();
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
        const item = selectedItem.item ? selectedItem.item : selectedItem;
        this.setState(this.baseState);
        this.props.navigation.navigate('chatScreen', { selectedItem: item, email: this.state.email })
    }

    render() {
        return (
            <View style={{ flex: 1, }}>
                {this.state.loading == true ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" color='red' />
                    </View>
                ) : (
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
                            }} />)}
            </View>

        );
    }
}

const styles = StyleSheet.create({
    root: {
        backgroundColor: '#fff',
        paddingTop: 10,
        paddingLeft: '5.5%',
    },
    separator: {
        height: 1,
        backgroundColor: '#FF7200',
        width: wp('90%')
    },
    container: {
        paddingLeft: 19,
        paddingRight: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    name: {
        fontSize: 16,
        fontWeight: "bold",
        color: '#FF7200',
    },
    content: {
        marginLeft: 16,
        flex: 1,
    },
    image: {
        width: 45,
        height: 45,
        borderRadius: 20,
        marginLeft: 20
    },
});