import {
    StyleSheet
} from 'react-native';

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    listenOrientationChange as loc,
    removeOrientationListener as rol
}
    from 'react-native-responsive-screen';
const main = StyleSheet.create({
    buttonContainer: {
        width: wp('80%'),
        marginLeft: wp('10%'),
        alignItems: 'center',
        marginTop: wp('3%'),
        borderRadius: wp('2%'),
        borderWidth: 2,
        borderColor: 'white',
    },
    primaryButtonContanier: {
        width: wp('80%'),
        color: '#ed5720',
        backgroundColor: 'white',
        marginLeft: wp('10%'),
        alignItems: 'center',
        marginTop: wp('3%'),
        borderRadius: wp('2%'),
        borderWidth: 2,
        borderColor: 'white',
    },
    buttonText: {
        color: 'white',
        width: wp('80%'),
        alignItems: 'center',
        fontSize: hp('2.5%'),
        marginLeft: wp('55%'),
        paddingVertical: 8,
        paddingHorizontal: 20,
        fontWeight: 'bold',
    },
    buttonText1: {
        color: 'white',
        width: wp('80%'),
        alignItems: 'center',
        fontSize: hp('2.5%'),
        marginLeft: wp('45%'),
        paddingVertical: 8,
        paddingHorizontal: 0,
        fontWeight: 'bold',
    },
    buttonContainer1: {
        width: wp('80%'),
        marginLeft: wp('10%'),
        alignItems: 'center',
        marginTop: wp('3%'),
        borderRadius: wp('2%'),
        borderWidth: 2,
        borderColor: 'white',
      },
    primaryButtonText: {
        color: '#ed5720',
        width: wp('80%'),
        alignItems: 'center',
        fontSize: hp('2.5%'),
        marginLeft: wp('55%'),
        paddingVertical: 8,
        paddingHorizontal: 20,
        fontWeight: 'bold',
    },

    leftBorderButton: {
        color: '#ed5720',
        fontSize: hp('2%'),
        marginTop: 10,
        borderColor: '#A9A9A9',
        backgroundColor: '#fff',
        paddingVertical: wp('3%'),
        paddingHorizontal: wp('10%'),
        fontWeight: 'bold',
        borderTopRightRadius: wp('8%'),
        borderBottomRightRadius: wp('8%'),
        borderWidth: 1,
        borderColor: '#fff'
    },

    rightBorderButton: {
        color: '#ed5720',
        fontSize: hp('2%'),
        marginTop: 10,
        borderColor: '#A9A9A9',
        backgroundColor: '#fff',
        paddingVertical: wp('3%'),
        paddingHorizontal: wp('9%'),
        fontWeight: 'bold',
        borderTopLeftRadius: wp('8%'),
        borderBottomLeftRadius: wp('8%'),
        borderWidth: 1,
        borderColor: '#fff'
    },

    inputContainer: {
        width: wp('80%'), height: hp('6%'), marginBottom: wp('3%'), color: '#fff', borderColor: 'white', borderWidth: 1.5, borderRadius: wp('2%'),
    },
    passwordContainer: {
        width: wp('80%'), height: hp('6%'), borderColor: 'white', marginBottom: wp('2%'),
        borderWidth: 1.5, borderRadius: wp('2%'), color: '#fff'
    },
    labelContainer: {
        textAlign: 'left', color: 'white', paddingBottom: wp('2%'), marginTop: wp('10%')
    },
    logo: {
        width: wp('50%'),
        height: hp('40%'),
        resizeMode: 'cover',
        marginLeft: wp('10%'),
    },
    passwordIconContainer: {
        width: wp('50%'), height: hp('6%'), borderColor: 'white', marginBottom: wp('2%'),
        borderWidth: 1.5, borderRadius: wp('2%'), color: '#fff'
    },
    imagesContainer: { borderRadius: 10, borderWidth: 1.5, borderColor: 'white', height: hp('15%'), width: wp('27%') },
    inputSearch: {
        width: wp('70%'),
        paddingVertical: 2,
        borderBottomWidth: wp('0.1%'),
        borderBottomColor: '#fff',
        fontSize: 30,
        color: '#fff',
        height: hp('7%'),
        paddingLeft: wp('45%'),
        marginTop: wp('2%'),
        backgroundColor: '#EE6E3D', borderBottomWidth: 0, borderTopWidth: 0,
        fontFamily: 'SEAFOOL',
    },
    inputText: {
        width: wp('70%'),
        paddingVertical: 2,
        borderBottomWidth: wp('0.1%'),
        borderBottomColor: '#fff',
        fontSize: 17,
        color: '#fff',
        height: hp('7%'),
        paddingLeft: wp('5%'),
        paddingTop: wp('3.5%'),
        fontWeight: 'bold',
        marginTop: wp('2%'),
        backgroundColor: '#EE6E3D', borderBottomWidth: 0, borderTopWidth: 0,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#EE6E3D',
        marginTop: wp('-3%')
    },
});

export default main;