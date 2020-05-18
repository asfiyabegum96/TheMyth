import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    Switch,
    Image,
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    listenOrientationChange as loc,
    removeOrientationListener as rol
}
    from 'react-native-responsive-screen';
import firebase from 'react-native-firebase';
import { ScrollView } from 'react-native-gesture-handler';

export default class account extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            switchValue: false,
            email: props.navigation.state.params.email
        }
    }

    componentDidMount() {
        loc(this);
        this.fetchCurrentUserDetails();
    }

    fetchCurrentUserDetails() {
        const context = this;
        let db = firebase.firestore();
        let userData;
        db.collection("signup").where('email', '==', this.state.email.trim()).get().then(function (userQuerySnapshot) {
            userQuerySnapshot.forEach(function (doc) {
                const docNotEmpty = (doc.id, " => ", doc.data() != null);
                if (docNotEmpty) {
                    userData = (doc.id, " => ", doc.data());
                    context.setState({ switchValue: userData.isPrivateAccount })
                }
            });
        });

    }

    componentWillUnMount() {
        rol();
    }

    handleChange() {
        if (this.state.switchValue === true) {
            this.setState({ switchValue: false });
        } else {
            this.setState({ switchValue: true });
        }
        this.updateValues();
    }

    updateValues() {
        const context = this;
        let db = firebase.firestore();
        let photosRef = db.collection('signup');
        photosRef.where('email', '==', this.props.navigation.state.params.email.trim()).get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                let data;
                const docNotEmpty = (doc.id, " => ", doc.data() != null);
                if (docNotEmpty) {
                    data = (doc.id, " => ", doc.data());
                    db.collection("signup").doc(data.docRef).update({ isPrivateAccount: context.state.switchValue })
                }
            })
        })
    }

    render() {
        return (
            <ScrollView style={{ backgroundColor: '#fff2e7' }}>
                <View style={styles.TitleDiv}>
                    <Image
                        source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTvAIbW8Ka6_KCCozwRCw2_lhWYqQUGyti9ZkVCQWqfeKElydG8" }}
                        style={{
                            width: wp('25%'),
                            height: hp('15%'),
                            borderRadius: wp('30%'),
                            resizeMode: 'cover',
                            marginTop: wp('10%')
                        }} />
                </View>
                <View style={styles.TitleDiv}>
                    <Text style={styles.title}>Account Settings</Text>
                </View>
                <View style={styles.container}>
                    <View style={styles.contentHeader}>
                        <Text style={styles.name}>Private Account</Text>
                        <View style={styles.time}>
                            <Switch
                                onValueChange={this.handleChange.bind(this)}
                                value={this.state.switchValue} />
                        </View>
                    </View>

                </View>
            </ScrollView>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff2e7',
        flex: 1,
        marginTop: 100,
        marginLeft: wp('10%')
    },
    TitleDiv: {
        backgroundColor: '#fff2e7',
        alignItems: 'center',
    },
    title: {
        color: '#FF7200',
        fontSize: hp('4%'),
        fontWeight: 'bold',
        marginTop: wp('5%')
    },
    contentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6
    },
    time: {
        fontSize: 11,
        color: "#808080",
        marginRight: wp('10%')
    },
    name: {
        fontSize: 20,
        color: '#FF7200'
    },
});