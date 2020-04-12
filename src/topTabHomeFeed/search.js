import React from 'react';
import {
    StyleSheet,
    Text,
    Image,
    View,
    Button,
    TextInput,
    TouchableOpacity,
    ScrollView,
    FlatList
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/Entypo';
import UserAvatar from 'react-native-user-avatar';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    listenOrientationChange as loc,
    removeOrientationListener as rol
}
    from 'react-native-responsive-screen';
import { SearchBar } from 'react-native-elements';
import firebase from 'react-native-firebase';

const Jaguar = '#22222C';

export default class search extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            search: '',
            feedData: [],
            email: props.navigation.state.params.email
        }
        this.baseState = this.state;
    }
    componentDidMount() {
        loc(this);
    }

    componentWillUnMount() {
        rol();
    }

    updateSearch(text) {
        this.setState({ search: text });
    }

    fetchSearchList() {
        const searchArray = [];
        console.log('submitted', this.state.search);
        const context = this;
        let db = firebase.firestore();
        let photosRef = db.collection('signup');
        photosRef.orderBy('fullName').startAt(this.state.search).endAt(this.state.search + "\uf8ff").get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                let data;
                const docNotEmpty = (doc.id, " => ", doc.data() != null);
                if (docNotEmpty) {
                    data = (doc.id, " => ", doc.data());
                    if (data.isDeleted === false) {
                        searchArray.push(data);
                    }
                }
            });
            context.getFollowers(searchArray);
        });
    }

    getFollowers(searchArray) {
        const context = this;
        let db = firebase.firestore();
        let photosRef = db.collection('signup');
        if (searchArray.length) {
            searchArray.forEach((searchElement) => {
                photosRef.doc(searchElement.docRef).collection('followers').get().then(function (followerSnapshot) {
                    followerSnapshot.forEach(function (followerDoc) {
                        const docNotEmpty = (followerDoc.id, " => ", followerDoc.data() != null);
                        if (docNotEmpty) {
                            if (context.state.email === followerDoc.data().email) {
                                searchElement.isFollowed = true
                            } else {
                                searchElement.isFollowed = false
                            }
                        }
                    })
                    context.setState({ feedData: searchArray })
                })
            });

        } else {
            this.setState({ feedData: [] })
        }

    }

    navigateToOtherUser(selectedItem) {
        const searchedEmail = selectedItem.item && selectedItem.item.email ? selectedItem.item.email : selectedItem.email;
        const isPrivateAccount
            = selectedItem.item
                ? selectedItem.item.isPrivateAccount
                : selectedItem.isPrivateAccount
            ;
        const isFollowed = selectedItem.item
            ? selectedItem.item.isFollowed
            : selectedItem.isFollowed
            ;
        const isSameProfile = this.state.email.trim() === searchedEmail.trim();
        this.setState(this.baseState);
        this.props.navigation.navigate('profile', { email: this.state.email.trim(), searchedEmail: searchedEmail.trim(), privateAccount: isPrivateAccount, isSameProfile: isSameProfile, isFollowed: isFollowed })
    }

    render() {
        const { search } = this.state;
        return (
            <View style={{ flex: 1, }}>
                <View style={styles.header}>
                    <TouchableOpacity style={{ marginTop: '3%', marginLeft: '3%' }} onPress={() => this.props.navigation.navigate('homeFixed', { email: this.props.navigation.state.params.email })} >
                        <Icon name={'home'} size={30} color="#FF7200" />
                    </TouchableOpacity>
                    <SearchBar containerStyle={{ backgroundColor: '#fff2e7', height: hp('8%'), borderBottomWidth: 0, borderTopWidth: 0 }} inputContainerStyle={styles.inputSearch}
                        placeholder="Search"
                        autoFocus="true"
                        placeholderTextColor="#FF7200"
                        inputStyle={{ color: '#FF7200' }}
                        onChangeText={(text) => this.updateSearch(text)}
                        onSubmitEditing={() => this.fetchSearchList()}
                        onClear={() => this.setState({ feedData: [] })}
                        value={search}
                    />
                </View>
                <FlatList
                    style={styles.root}
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
                                    <Text onPress={(selectedItem) => this.navigateToOtherUser(item)} style={styles.name}>{Notification.fullName}</Text>
                                </View>
                            </View>
                        );
                    }} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        backgroundColor: '#fff2e7',
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
    inputSearch: {
        width: wp('90%'),
        marginLeft: '4%',
        paddingVertical: 2,
        paddingLeft: '5%',
        borderBottomWidth: 1,
        borderBottomColor: '#FF7200',
        backgroundColor: '#fff2e7',
        fontSize: 20,
        color: '#FF7200',
        height: hp('6%')
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff2e7',
        padding: 5,
    },
    image: {
        width: 45,
        height: 45,
        borderRadius: 20,
        marginLeft: 20
    },
});

