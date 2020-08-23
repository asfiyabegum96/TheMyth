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

import RadialGradient from 'react-native-radial-gradient';

export default class notificationSettings extends React.Component {

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
            <RadialGradient style={{ width: '100%', height: '100%' }}
                colors={['#FE7948', '#E23E00']}
                stops={[0.1, 0.95]}
                center={[180, 270]}
                radius={400}>
                {
                    <View style={styles.container}>
                        <Text style={styles.name}>Push Notifications</Text>
                        <View style={styles.contentHeader}>
                            <Text style={styles.subname}>Pause all notifications</Text>
                            <View style={styles.time}>
                                <Switch
                                    trackColor={{ true: '#FF7200', false: 'grey' }}
                                    thumbColor={'#fff'}
                                    onValueChange={this.handleChange.bind(this)}
                                    value={this.state.switchValue} />
                            </View>
                        </View>
                    </View>
                }</RadialGradient>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: wp('10%'),
        marginLeft: wp('5%')
    },
    TitleDiv: {
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
        marginRight: wp('10%'),
        marginTop: wp('5%'),
    },
    name: {
        fontSize: 16,
        color: '#fff'
    },
    subname: {
        marginTop: wp('5%'),
        fontSize: 11,
        color: '#ccc',
        marginLeft: wp('3%')
    },
});