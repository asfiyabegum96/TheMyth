import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Animated 
} from 'react-native';

const Heart = ({ filled, style, ...props}) => {
    const centerNonFilled = (
        <View style={[StyleSheet.absoluteFill, styles.fit]}>
            <View style={[styles.leftHeart, styles.heartShape, styles.emptyFill]}></View>
            <View style={[styles.rightHeart, styles.heartShape, styles.emptyFill]}></View>
        </View>
    )
    const fillStyle = filled ? styles.filledHeart : styles.empty;

    return (
        <Animated.View {...props} style={[styles.heart, style]}>
            <View style={[styles.leftHeart, styles.heartShape, fillStyle]}></View>
            <View style={[styles.rightHeart, styles.heartShape, fillStyle]}></View>
            {!filled && centerNonFilled}
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    heart: {
        width: 30,
        height: 20,
        backgroundColor: 'transparent',
    },
    heartShape: {
        width: 15,
        height: 20,
        position: 'absolute',
        top:0,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    filledHeart: {
        // backgroundColor: '#e31745',
        backgroundColor: '#FF7200',
    },
    fit: {
        transform: [
            {scale: .9}
        ]
    },
    emptyFill: {
        backgroundColor: 'white'
    },
    empty: {
        backgroundColor:'#121212'
    },
    leftHeart: {
        transform: [
            {rotate: '-45deg'}
        ],
        left: 5
    },
    rightHeart:{
        transform:[
            {rotate: '45deg'}
        ],
        right: 5
    }
})

export default Heart;