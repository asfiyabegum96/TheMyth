import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import { ScrollView, Text, View, TouchableOpacity, Alert, BackHandler } from 'react-native';
import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp,
	listenOrientationChange as loc,
	removeOrientationListener as rol
}
	from 'react-native-responsive-screen';
import firebase from 'react-native-firebase';
import { StackActions } from 'react-navigation';
import RadialGradient from 'react-native-radial-gradient';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import main from "../authentication/styles/main";
import Toaster from 'react-native-toaster';

class accountSettings extends Component {
	constructor(props) {
		super(props)
		this.state = {
			uri: '',
			imagePath: '',
			imageSelected: false,
			radioState: ''
		}
		this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
	}
	componentDidMount() {
		BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
		loc(this);
		this.fetchUserDetails();
	}

	componentWillUnMount() {
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
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
		photosRef.where('email', '==', this.props.navigation.state.params.email.trim()).get().then(function (querySnapshot) {
			querySnapshot.forEach(function (doc) {
				let data;
				const docNotEmpty = (doc.id, " => ", doc.data() != null);
				if (docNotEmpty) data = (doc.id, " => ", doc.data());
				context.setState({ user: doc.data() })
			})
		})
	}

	navigateToRoute = (route) => {
		if (route === 'Home') {
			const resetAction = StackActions.reset({
				index: 0,
				actions: [NavigationActions.navigate({ routeName: route })],
			});
			this.props.navigation.dispatch(resetAction);
		} else {
			this.props.navigation.navigate(route, { email: this.props.navigation.state.params.email.trim(), navigation: this.props.navigation })
		}
	}

	navigation() {
		this.props.navigation.navigate('sideNavigator')
	}

	onBack = () => {
		this.props.navigation.navigate('profile', { email: this.props.screenProps.email.trim(), searchedEmail: this.props.screenProps.email.trim(), privateAccount: false, isSameProfile: true, isFollowed: true })
	}


	logout = () => {
		firebase.auth().signOut().then(() => {
			this.navigateToRoute('Home')
		})
	}

	confirmDeactivate = () => {
		Alert.alert(
			//title
			'Confirmation',
			//body
			'Are you sure to deactivate this account?',
			[
				{ text: 'Yes', onPress: () => this.deactivate() },
				{ text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel' },
			],
			{ cancelable: false }
			//clicking out side of alert will not cancel
		);
	}

	deactivate = () => {
		let db = firebase.firestore();
		firebase.auth().currentUser.delete().then(() => {
			db.collection("signup").doc(this.state.user.docRef).update({
				isDeleted: true,
				email: `${this.state.user.email}_deleted`
			})
			this.setState({
				message: {
					text: (
						<View styles={styles.toasterContainer}>
							<Text style={styles.text}>Thanks for using Myth!</Text>
						</View>
					),
					duration: 1000
				}, showAlert: true
			});
			setTimeout(() => {
				this.navigateToRoute('Home');
			}, 1000);
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
						<Toaster message={this.state.message} />
						{/* <View style={{ flexDirection: 'row' }}>
							<FontAwesome5 style={styles.fabIcon} name='bell' size={16} />
							<Text style={styles.navItemStyle} onPress={() => this.navigateToRoute('notificationsSettings')}>
								Notifications
                			</Text>
						</View> */}
						<View style={{ flexDirection: 'row' }}>
							<FontAwesome5 style={styles.fabIcon} name='user-shield' size={12} />
							<Text style={styles.navItemStyle} onPress={() => this.navigateToRoute('privacySettings')}>
								Privacy
                </Text>
						</View>
						<View style={{ flexDirection: 'row' }}>
							<FontAwesome5 style={styles.fabIcon} name='key' size={16} />
							<Text style={styles.navItemStyle} onPress={() => this.navigateToRoute('updatePassword')}>
								Update password
                </Text>
						</View>
						<View style={{ flexDirection: 'row' }}>
							<FontAwesome5 style={styles.fabIcon} name='gavel' size={16} />
							<Text style={styles.navItemStyle}>
								Terms & conditions
                </Text>
						</View>

						<View style={styles.separator}></View>
						<View style={{ flexDirection: 'row' }}>
							<Text style={styles.deactivateStyle} onPress={() => this.confirmDeactivate()}>
								Delete Account
                </Text>
						</View>

						{/* <Text style={styles.navItemStyle} onPress={() => this.navigateToRoute('updatePassword')}>
                  Update Password
                </Text>
                <Text style={styles.navItemStyle} onPress={() => this.confirmDeactivate()}>
                  De-activate Account
                </Text> */}

						{/* <Text style={styles.navItemStyle} onPress={() => this.navigateToRoute('account')}>
                  Account Settings
            </Text> */}
						{/* <View style={styles.footerContainer}>
              <View style={main.primaryButtonContanier}>
                <TouchableOpacity onPress={() => this.onBack()}>
                  <Text style={main.primaryButtonText}>Back</Text>
                </TouchableOpacity>
              </View>
            </View> */}
					</View>}
			</RadialGradient>
		);
	}
}

accountSettings.propTypes = {
	navigation: PropTypes.object
};

const styles = {
	container: {
		flex: 1,
	},
	navItemStyle: {
		padding: wp('6%'),
		paddingLeft: wp('2%'),
		color: 'white'
	},
	navSectionStyle: {
		padding: wp('10%'),
	},
	footerContainer: {
		marginTop: wp('40%')
	},
	header: {
		fontSize: hp('4%')
	},
	fabIcon: {
		color: '#fff',
		padding: wp('6%'),
		paddingLeft: wp('7%'),
	},
	deactivateStyle: {
		padding: wp('6%'),
		marginLeft: wp('30%'),
		color: 'white',
		fontWeight: 'bold'
	},
	separator: {
		borderTopColor: '#fff', borderTopWidth: 0.5,
		marginTop: wp('90%'),
		marginLeft: wp('10%'),
		marginRight: wp('10%')
	},
	toasterContainer: {
		backgroundColor: '#fff',
		paddingTop: 15,
		paddingRight: 15,
		paddingBottom: 15,
		paddingLeft: 15,
	},
	text: {
		backgroundColor: '#fff',
		color: '#000',
		height: hp('4%'),
		fontWeight: 'bold',
		textAlign: 'center',
		fontSize: wp('4%')
	},
};

export default accountSettings;