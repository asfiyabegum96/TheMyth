import React, { Component } from 'react';
import { ActivityIndicator, View, ScrollView } from 'react-native';
import MasonryList from "react-native-masonry-list";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    listenOrientationChange as loc,
    removeOrientationListener as rol
}
    from 'react-native-responsive-screen';
import firebase from 'react-native-firebase';
export default class DiaryMaintain extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user: '',
            images: [],
            loading: true
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
        photosRef.where('email', '==', 'asfiidarlachu@gmail.com').get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                let data;
                const docNotEmpty = (doc.id, " => ", doc.data() != null);
                if (docNotEmpty) data = (doc.id, " => ", doc.data());
                context.setState({ user: doc.data() })
                context.fetchImages();
            })
        })
    }

    fetchImages() {
        const context = this;
        const image = [];
        let db = firebase.firestore();
        let photosRef = db.collection('diary');
        photosRef.where('email', '==', 'asfiidarlachu@gmail.com').where('isDeleted', '==', false).get().then(function (querySnapshot) {
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
            context.setState({ images: image, loading: false })
        })
    }

    render() {
        return (
            <ScrollView>
                <View style={{ padding: 10 }}>
                    {this.state.loading == true ? (
                        <View style={{ flex: 1, marginBottom: '40%', justifyContent: 'center', alignItems: 'center' }}>
                            <ActivityIndicator size="large" color='red' />
                        </View>
                    ) : (
                            <MasonryList
                                backgroundColor={'#fff2e7'}
                                onRefresh={this.fetchImages}
                                columns={3}
                                images={this.state.images}
                            // onLongPressImage={(item, index) => this.confirmDelete(item, index)}
                            // onPressImage={(item) => this.props.navigation.navigate('comments', { selectedItem: item, email: this.props.navigation.state.params.email.trim() })}
                            />)}
                </View>
            </ScrollView>
        )
    }
}