import React from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
  FlatList,
  BackHandler,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import {SearchBar} from 'react-native-elements';
import firebase from 'react-native-firebase';
import {Header} from 'react-native-elements';
export default class search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      feedData: [],
      email: props.screenProps.email,
    };
    this.baseState = this.state;
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }
  componentDidMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
    loc(this);
  }

  componentWillUnMount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
    rol();
  }

  handleBackButtonClick() {
    this.props.navigation.goBack(null);
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
    return true;
  }

  updateSearch(text) {
    this.setState({search: text});
  }

  fetchSearchList() {
    const searchArray = [];
    const context = this;
    let db = firebase.firestore();
    let photosRef = db.collection('signup');
    photosRef
      .orderBy('fullName')
      .startAt(this.state.search)
      .endAt(this.state.search + '\uf8ff')
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          let data;
          const docNotEmpty = (doc.id, ' => ', doc.data() != null);
          if (docNotEmpty) {
            data = (doc.id, ' => ', doc.data());
            if (data.isDeleted === false) {
              searchArray.push(data);
            }
          }
        });
        context.getFollowers(searchArray);
      });
  }

  getFollowers(searchArray) {
    let isFollower = false;
    const context = this;
    let db = firebase.firestore();
    let photosRef = db.collection('signup');
    if (searchArray.length) {
      searchArray.forEach(searchElement => {
        photosRef
          .doc(searchElement.docRef)
          .collection('followers')
          .get()
          .then(function(followerSnapshot) {
            followerSnapshot.forEach(function(followerDoc) {
              const docNotEmpty = (followerDoc.id,
              ' => ',
              followerDoc.data() != null);
              if (docNotEmpty) {
                console.log(
                  'insiode follow',
                  context.state.email,
                  followerDoc.data(),
                );
                if (
                  context.state.email.trim() ===
                    followerDoc.data().email.trim() &&
                  followerDoc.data().isDeleted !== true
                ) {
                  isFollower = true;
                  searchElement.isFollowed = true;
                }
              }
            });
          });
        if (isFollower === false) {
          context.fetchPendingFollowers(photosRef, searchElement, searchArray);
        }
      });
      context.setState({feedData: searchArray});
    } else {
      this.setState({feedData: []});
    }
  }

  fetchPendingFollowers(photosRef, searchElement, searchArray) {
    const context = this;
    photosRef
      .doc(searchElement.docRef)
      .collection('pendingFollowers')
      .get()
      .then(function(pendingSnapshot) {
        pendingSnapshot.forEach(function(pendingDoc) {
          const docNotEmpty = (pendingDoc.id,
          ' => ',
          pendingDoc.data() != null);
          if (docNotEmpty) {
            if (
              context.state.email.trim() === pendingDoc.data().email.trim() &&
              pendingDoc.data().isDeleted === false
            ) {
              searchElement.isPending = true;
            } else {
              searchElement.isPending = false;
            }
          }
        });
        context.setState({feedData: searchArray});
      });
  }

  navigateToOtherUser(selectedItem) {
    const searchedEmail =
      selectedItem.item && selectedItem.item.email
        ? selectedItem.item.email
        : selectedItem.email;
    const isPrivateAccount = selectedItem.item
      ? selectedItem.item.isPrivateAccount
      : selectedItem.isPrivateAccount;
    const isFollowed = selectedItem.item
      ? selectedItem.item.isFollowed
      : selectedItem.isFollowed;
    const isPending = selectedItem.item
      ? selectedItem.item.isPending
      : selectedItem.isPending;
    const isSameProfile = this.state.email.trim() === searchedEmail.trim();
    this.setState(this.baseState);
    this.setState({feedData: []});
    this.props.screenProps.navigateToOther.navigate('profile', {
      email: this.state.email.trim(),
      searchedEmail: searchedEmail.trim(),
      privateAccount: isPrivateAccount,
      isSameProfile: isSameProfile,
      isFollowed: isFollowed,
      isPending: isPending,
    });
  }

  MyCustomCenterComponent = () => {
    return (
      <View>
        <SearchBar
          searchIcon={{color: 'white'}}
          containerStyle={{
            backgroundColor: '#EE6E3D',
            height: hp('5.1%'),
            borderBottomWidth: 0,
            borderTopWidth: 0,
          }}
          inputContainerStyle={styles.inputSearch}
          autoFocus="true"
          placeholderTextColor="#fff"
          inputStyle={{
            color: '#fff',
            fontSize: 15,
          }}
          clearIcon={{color: 'white'}}
          onChangeText={text => this.updateSearch(text)}
          onSubmitEditing={() => this.fetchSearchList()}
          onClear={() => this.setState({feedData: []})}
          placeholder="Search"
          value={search}
        />
      </View>
    );
  };

  render() {
    const {search} = this.state;
    return (
      <View style={{flex: 1}}>
        <View style={styles.header}>
          <SearchBar
            searchIcon={{color: 'white'}}
            containerStyle={{
              backgroundColor: '#EE6E3D',
              height: hp('5.1%'),
              borderBottomWidth: 0,
              borderTopWidth: 0,
            }}
            inputContainerStyle={styles.inputSearch}
            autoFocus="true"
            placeholderTextColor="#fff"
            inputStyle={{
              color: '#fff',
              fontSize: 15,
            }}
            clearIcon={{color: 'white'}}
            onChangeText={text => this.updateSearch(text)}
            onSubmitEditing={() => this.fetchSearchList()}
            onClear={() => this.setState({feedData: []})}
            placeholder="Search"
            value={search}
          />
          {/* <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate('homeFixed', {
                email: this.props.navigation.state.params.email,
              })
            }>
            <Icon name={'home'} size={30} color="#fff" />
          </TouchableOpacity> */}
          {/* <TouchableOpacity onPress={() => this.props.navigation.navigate('profile', { email: this.props.navigation.state.params.email.trim(), searchedEmail: this.props.navigation.state.params.email.trim(), privateAccount: false, isSameProfile: true })}>
                        <FontAwesome5 style={styles.profile} name={'user-alt'} />
                    </TouchableOpacity> */}
        </View>
        {/* <Header
          centerComponent={<this.MyCustomCenterComponent />}
          containerStyle={{
            backgroundColor: '#EE6E3D',
            borderColor: '#EE6E3D',
            justifyContent: 'center',
            alignItems: 'center',
            // height: 55,
          }}
          statusBarProps={{
            backgroundColor: '#000',
          }}
        /> */}
        <FlatList
          style={styles.root}
          data={this.state.feedData}
          extraData={this.state}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={() => {
            return <View style={styles.separator} />;
          }}
          keyExtractor={item => {
            return item.id;
          }}
          renderItem={item => {
            const Notification = item.item;
            return (
              <View style={styles.container}>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    margin: 10,
                  }}
                  onPress={selectedItem => this.navigateToOtherUser(item)}>
                  <Image
                    style={styles.image}
                    source={{
                      uri: Notification.profilePicture,
                    }}
                  />
                  <View
                    style={{
                      flexDirection: 'column',
                    }}>
                    <Text style={styles.name}>{Notification.fullName}</Text>
                    <Text style={styles.description}>
                      {Notification.description}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#fff',
    paddingTop: 10,
    // paddingLeft: '5.5%',
  },
  separator: {
    height: 1,
    backgroundColor: '#EE6E3D',
    width: wp('90%'),
    alignSelf: 'center',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginHorizontal: 5,
  },
  description: {
    fontSize: 12,
    fontWeight: '400',
    color: '#EE6E3D',
    marginHorizontal: 5,
  },
  content: {
    marginLeft: 16,
    flex: 1,
  },
  inputSearch: {
    width: wp('90%'),
    paddingVertical: 2,
    borderBottomWidth: wp('0.1%'),
    borderBottomColor: '#fff',
    backgroundColor: '#EE6E3D',
    fontSize: 20,
    color: '#EE6E3D',
    height: hp('4%'),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#EE6E3D',
    padding: 8,
  },
  image: {
    width: 45,
    height: 45,
    borderRadius: 10,
    // marginLeft: 20,
  },
  profile: {
    color: '#EE6E3D',
    fontSize: hp('3%'),
    backgroundColor: '#fff',
    paddingVertical: wp('0.5%'),
    paddingHorizontal: wp('0.8%'),
    marginTop: 5,
    marginRight: wp('1.5%'),
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },
});
