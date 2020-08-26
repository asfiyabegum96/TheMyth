import React, { Component } from 'react';
import { ActivityIndicator, View, ScrollView, Alert, Text } from 'react-native';
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
        this.props.navigation.setParams({
            onFocus: () => { this.fetchImages() }
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
                context.setState({ user: doc.data(), })
                context.fetchImages();
            })
        })
    }

    fetchImages() {
        const context = this;
        context.setState({ feedRefresh: true, images: [] })
        const image = [];
        let db = firebase.firestore();
        let photosRef = db.collection('photos');
        photosRef.where('isDeleted', '==', false).get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                let data;
                const docNotEmpty = (doc.id, " => ", doc.data() != null);
                if (docNotEmpty) {
                    data = (doc.id, " => ", doc.data());
                    photosRef.doc(data.docRef).collection('savedUsers').get().then(function (savedSnapshot) {
                        savedSnapshot.forEach(function (savedDoc) {
                            let savedData;
                            const docNotEmpty = (savedDoc.id, " => ", savedDoc.data() != null);
                            if (docNotEmpty) {
                                savedData = (savedDoc.id, " => ", savedDoc.data());
                                if (savedData.email === context.props.screenProps.email) {
                                    image.push({
                                        URL: doc.data().url,
                                        dimensions: { width: 900, height: 1050 },
                                        item: doc.data()
                                    });
                                }
                                context.setPhoto(image)
                                context.setState({ loading: false, feedRefresh: false, });
                            } else {
                                context.setPhoto([])
                            }
                        })
                    })
                } else {
                    context.setPhoto([])
                }
            })
        })
    }

    setPhoto = (data) => {
        this.setState({ images: data });
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
        db.collection("photos").doc(selectedItem.item.docRef).collection('savedUsers').doc(this.props.screenProps.email).update({
            email: this.props.screenProps.email + '_deleted'
        }).then(() => {
            this.fetchImages();
        })
    }

    render() {
        return (
            <ScrollView style={{ backgroundColor: '#fff6f2' }}>
                <View style={{ padding: 10, minHeight: hp('50%') }}>
                    {this.state.loading == true ? (
                        <View style={{ flex: 1, marginBottom: '40%', justifyContent: 'center', alignItems: 'center' }}>
                            <ActivityIndicator size="large" color='red' />
                        </View>
                    ) : (
                            <View style={{ flex: 1 }}>
                                {this.state.images.length > 0 ?
                                    <MasonryList
                                        rerender={true}
                                        masonryFlatListColProps={{ refreshing: this.state.feedRefresh, onRefresh: () => this.fetchUserDetails() }}
                                        backgroundColor={'#fff6f2'}
                                        listContainerStyle={{ marginLeft: wp('3%') }}
                                        imageContainerStyle={main.imagesContainer}
                                        spacing={2}
                                        columns={3}
                                        images={this.state.images}
                                        keyExtractor={(item, index) => index.toString()}
                                        onPressImage={(item) => this.props.screenProps.navigation(item, false, true)}
                                        onLongPressImage={(item, index) => this.confirmDelete(item, index)}
                                    /> : <Text></Text>}
                            </View>
                        )}
                </View>
            </ScrollView>
        )
    }
}