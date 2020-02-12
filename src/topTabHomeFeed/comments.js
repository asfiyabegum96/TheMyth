import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    ScrollView,
    FlatList
} from 'react-native';
import { TextField } from 'react-native-material-textfield';
import {
    widthPercentageToDP as wp,
}
    from 'react-native-responsive-screen';

export default class Comments extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [
                { id: 1, image: "https://bootdey.com/img/Content/avatar/avatar1.png", name: "Frank Odalthh", comment: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor." },
                { id: 2, image: "https://bootdey.com/img/Content/avatar/avatar6.png", name: "John DoeLink", comment: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor." },
                { id: 3, image: "https://bootdey.com/img/Content/avatar/avatar7.png", name: "March SoulLaComa", comment: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor." },
                { id: 4, image: "https://bootdey.com/img/Content/avatar/avatar2.png", name: "Finn DoRemiFaso", comment: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor." },
                { id: 5, image: "https://bootdey.com/img/Content/avatar/avatar3.png", name: "Maria More More", comment: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor." },
                { id: 6, image: "https://bootdey.com/img/Content/avatar/avatar4.png", name: "Clark June Boom!", comment: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor." },
                { id: 7, image: "https://bootdey.com/img/Content/avatar/avatar5.png", name: "The googler", comment: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor." },
            ]
        }
    }

    render() {
        return (
            <ScrollView>
                <View style={styles.viewcomment}>
                    {/* <Image style={styles.image} source={{ uri: "https://bootdey.com/img/Content/avatar/avatar1.png" }} /> */}
                    <TextField
                        placeholder='Your comments...'
                        placeholderTextColor='#FCD705'
                        textColor='#FCD705'
                        baseColor="white"
                        tintColor="#FCD705"
                        style={styles.addcomment}
                    />
                </View>
                <FlatList
                    style={styles.root}
                    data={this.state.data}
                    extraData={this.state}
                    ItemSeparatorComponent={() => {
                        return (
                            <View style={styles.separator} />
                        )
                    }}
                    keyExtractor={(item) => {
                        return item.id;
                    }}
                    renderItem={(item) => {
                        const Notification = item.item;
                        return (
                            <View style={styles.container}>
                                <TouchableOpacity onPress={() => { }}>
                                    <Image style={styles.image} source={{ uri: Notification.image }} />
                                </TouchableOpacity>
                                <View style={styles.content}>
                                    <View style={styles.contentHeader}>
                                        <Text style={styles.name}>{Notification.name}</Text>
                                        <Text style={styles.time}>
                                            9:58 am
                  </Text>
                                    </View>
                                    <Text style={styles.commentSection} rkType='primary3 mediumLine'>{Notification.comment}</Text>
                                </View>
                            </View>
                        );
                    }} />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        backgroundColor: '#121212',
        paddingTop: 10,
    },
    container: {
        paddingLeft: 19,
        paddingRight: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    content: {
        marginLeft: 16,
        flex: 1,
    },
    contentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6
    },
    separator: {
        height: 1,
        backgroundColor: '#FCD705'
    },
    image: {
        width: 45,
        height: 45,
        borderRadius: 20,
        marginLeft: 20
    },
    time: {
        fontSize: 11,
        color: "#808080",
    },
    name: {
        fontSize: 16,
        fontWeight: "bold",
        color: '#FCD705'
    },
    commentSection: {
        color: "#cccccc",
    },
    addcomment: {
        // height: '40%',
        marginLeft: 100,
    },
    viewcomment: {
        backgroundColor: '#121212',
    }
});  