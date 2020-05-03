import firebase from 'react-native-firebase';

class Backend {
    uid = '';
    messagesRef = null;

    constructor() {
        firebase.initializeApp({
            apiKey: 'AIzaSyD9XyMwMHcM0xUu5HwWgZi1z5s8NA8XkKM',
            authDomain: "chatot-9ab9b.firebaseapp.com",
            databaseURL: "https://chatot-9ab9b.firebaseio.com",
            storageBucket: "chatot-9ab9b.appspot.com",
        });
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setUid(user.uid)
            } else {
                firebase.auth().signInAnonymously().catch((error) => console.log('error', error))
            }
        });
    }

    setUid(value) {
        this.uid = value;
    }

    getUid() {
        return this.uid;
    }

    // retrieve message
    loadMessages(callback) {
        this.messagesRef = firebase.database().ref('messages');
        this.messagesRef.off();
        const onReceive = (data) => {
            const message = data.val();
            callback({
                _id: data.key,
                userid: message.userid,
                text: message.text,
                createdAt: new Date(message.createdAt),
                user: {
                    _id: message.user._id,
                    name: message.user.name,
                    avatar: message.user.avatar,
                }
            });
        };
        this.messagesRef.limitToLast(20).on('child_added', onReceive);
    }

    // sends message
    sendMessage(message, uid) {
        for (let i = 0; i < message.length; i++) {
            this.messagesRef.push({
                userid: uid,
                text: message[i].text,
                user: message[i].user,
                createdAt: new Date(),
            });
        }
    }

    // closed backend connection
    closeChat() {
        if (this.messagesRef) {
            this.messagesRef.off()
        }
    }
}

export default new Backend()