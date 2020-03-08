import React, { Component } from 'react';
import { ActivityIndicator, View, ScrollView, Alert } from 'react-native';
import MasonryList from "react-native-masonry-list";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    listenOrientationChange as loc,
    removeOrientationListener as rol
}
    from 'react-native-responsive-screen';
import firebase from 'react-native-firebase';
export default class SaveCollection extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user: '',
            images: [],
            loading: true,
            feedRefresh: false,
        }
        this.baseState = this.state;
    }


    componentDidMount() {
        loc(this);
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
                context.setState({ user: doc.data(), })
                context.fetchImages();
            })
        })
    }

    fetchImages() {
        const context = this;
        context.setState({ feedRefresh: true })
        const image = [];
        let db = firebase.firestore();
        let photosRef = db.collection('savedCollections');
        photosRef.where('email', '==', this.props.screenProps.email).where('isDeleted', '==', false).get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                let data;
                const docNotEmpty = (doc.id, " => ", doc.data() != null);
                if (docNotEmpty) data = (doc.id, " => ", doc.data());
                image.push({
                    URL: doc.data().url,
                    dimensions: { width: 900, height: 1050 },
                    item: doc.data()
                });
            })
            context.setState({ images: image, loading: false, feedRefresh: false, })
        })
    }

    confirmDelete(item, index) {
        Alert.alert(
            //title
            'Confirmation',
            //body
            'Are you sure to remove this post?',
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
        db.collection("savedCollections").doc(selectedItem.item.docRef).update({
            isDeleted: true
        }).then(() => {
            this.fetchImages();
        })
    }

    render() {
        return (
            <ScrollView style={{ backgroundColor: '#fff2e7' }}>
                <View style={{ padding: 10 }}>
                    {this.state.loading == true ? (
                        <View style={{ flex: 1, marginBottom: '40%', justifyContent: 'center', alignItems: 'center' }}>
                            <ActivityIndicator size="large" color='red' />
                        </View>
                    ) : (
                            <View style={{ flex: 1, }}>
                                <MasonryList
                                    masonryFlatListColProps={{ refreshing: this.state.feedRefresh, onRefresh: () => this.fetchImages() }}
                                    backgroundColor={'#fff2e7'}
                                    columns={3}
                                    images={this.state.images}
                                    keyExtractor={(item, index) => index.toString()}
                                    onPressImage={(item) => this.props.screenProps.navigation(item, false, true)}
                                    onLongPressImage={(item, index) => this.confirmDelete(item, index)}
                                />
                            </View>
                        )}
                </View>
            </ScrollView>
        )
    }
}