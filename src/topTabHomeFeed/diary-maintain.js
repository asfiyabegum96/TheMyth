import React, { Component } from 'react';
import {
    ActivityIndicator, View, ScrollView, Alert,
    FlatList,
    StyleSheet,
    Text,
    Image
} from 'react-native';
import MasonryList from "react-native-masonry-list";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    listenOrientationChange as loc,
    removeOrientationListener as rol
}
    from 'react-native-responsive-screen';
import firebase from 'react-native-firebase';
import main from '../authentication/styles/main'
export default class DiaryMaintain extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user: '',
            images: [],
            loading: true,
            feedRefresh: false,
            data: [],
            isListView: false
        }
        this.baseState = this.state;
    }


    componentDidMount() {
        loc(this);
        this.props.navigation.setParams({
            onFocus: () => { this.fetchUserDetails() }
        })
        this.fetchUserDetails();
    }

    fetchUserDetails() {
        const context = this;
        let db = firebase.firestore();
        let photosRef = db.collection('signup');
        photosRef.where('email', '==', this.props.screenProps.email).get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                let data;
                const docNotEmpty = (doc.id, " => ", doc.data() != null);
                if (docNotEmpty) data = (doc.id, " => ", doc.data());
                context.setState({ user: doc.data(), });
                context.fetchImages();
            })
        })
    }

    // Cover the timestamp to show in real minutes
    pluralCheck = (s) => {
        if (s == 1) {
            return ' ago';
        } else {
            return 's ago';
        }
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

    fetchImages() {
        const context = this;
        context.setState({ feedRefresh: true, images: [], isListView: false })
        const image = [];
        const fetchData = [];
        let db = firebase.firestore();
        let photosRef = db.collection('diary');
        photosRef.where('email', '==', this.props.screenProps.email).where('isDeleted', '==', false).get().then(function (querySnapshot) {
            let data;
            querySnapshot.forEach(function (doc) {
                const docNotEmpty = (doc.id, " => ", doc.data() != null);
                if (docNotEmpty) data = (doc.id, " => ", doc.data());
                fetchData.push(doc.data());
                image.push({
                    URL: doc.data().url,
                    dimensions: { width: 900, height: 1050 },
                    item: doc.data()
                });
            })
            context.setState({ images: image, data: fetchData, loading: false, feedRefresh: false, isListView: false })
        })
    }

    confirmDelete(item, index) {
        Alert.alert(
            //title
            'Confirmation',
            //body
            'Are you sure to delete this memory?',
            [
                { text: 'Yes', onPress: () => this.deletePost(item) },
                { text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel' },
            ],
            { cancelable: false }
            //clicking out side of alert will not cancel
        );
    }

    deletePost(selectedItem) {
        this.setState({ loading: true })
        let db = firebase.firestore();
        db.collection("diary").doc(selectedItem.item.docRef).update({
            isDeleted: true
        }).then(() => {
            this.fetchImages();
        })
    }

    render() {
        return (
            <>
                <View style={main.header}>
                    <Text style={main.inputText}
                    >Diary</Text>
                    {/* <TouchableOpacity onPress={() => this.props.screenProps.navigateToOther.navigate('profile', { email: this.state.email.trim(), searchedEmail: this.state.email.trim(), privateAccount: false, isSameProfile: true })}>
                      <FontAwesome5 style={styles.profile} name={'user'} />
                  </TouchableOpacity> */}
                </View>
                <ScrollView style={{ backgroundColor: '#fff6f2' }}>
                    <View style={{ padding: 10, minHeight: hp('50%') }}>
                        {this.state.loading == true ? (
                            <View style={{ flex: 1, marginBottom: '40%', justifyContent: 'center', alignItems: 'center' }}>
                                <ActivityIndicator size="large" color='red' />
                            </View>
                        ) : (
                                <MasonryList
                                    masonryFlatListColProps={{ refreshing: this.state.feedRefresh, onRefresh: () => this.fetchImages() }}
                                    backgroundColor={'#fff6f2'}
                                    listContainerStyle={{ marginLeft: wp('3%') }}
                                    imageContainerStyle={main.imagesContainer}
                                    spacing={2}
                                    columns={3}
                                    images={this.state.images}
                                    keyExtractor={(item, index) => index.toString()}
                                    onPressImage={(item) => this.props.screenProps.navigation.navigate('mainFeed', { selectedItem: item, email: this.props.screenProps.navigation.state.params.email.trim(), isDiary: true })}
                                    onLongPressImage={(item, index) => this.confirmDelete(item, index)}
                                />
                            )}
                    </View>
                </ScrollView>
            </>
        )
    }
}


const styles = StyleSheet.create({
    feedBorder: {
        paddingBottom: '2%',
        borderBottomWidth: wp('0.1%'),
        borderBottomColor: '#121212'
    },
    listHeader: {
        flexDirection: 'row',
        marginTop: hp('1%')
    },
    listProfileName: {
        fontSize: hp('3%'),
        fontWeight: 'bold',
        color: '#22222C',
    },
    listProfileSubName: {
        color: '#22222C'
    },
    listViewImg: {
        paddingVertical: wp('2%'),
    },
    listViewInlineImg: {
        width: wp('89%'),
        height: wp('60%'),
        marginLeft: wp('2.5%'),
        // height: 275, 
        // resizeMode:'center',
        borderWidth: 1,
        borderRadius: wp('3%'),
        // borderColor: '#FCD705',
    },
    foodNameDiv: {
        left: 16,
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    foodNameText: {
        fontSize: hp('2.5%'),
    },
    locationDiv: {
        left: 16,
        flexDirection: 'row',
        alignItems: 'baseline'
    },
    locationText: {
        fontSize: hp('2.5%'),
        fontWeight: 'bold'
    },
});