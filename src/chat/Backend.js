import firebase from 'react-native-firebase';

class Backend {
    uid = '';
    messagesRef = null;
    allMessagesArray = [];
    constructor() {
        if (!firebase.apps.length) {
            firebase.initializeApp({
                apiKey: 'AIzaSyD9XyMwMHcM0xUu5HwWgZi1z5s8NA8XkKM',
                authDomain: "chatot-9ab9b.firebaseapp.com",
                databaseURL: "https://chatot-9ab9b.firebaseio.com",
                storageBucket: "chatot-9ab9b.appspot.com",
            });
        }
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setUid(user.uid)
            }
        });
        this.allMessages();
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
                image: message.image,
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

    allMessages() {
        this.allMessagesArray = [];
        firebase.database().ref('messages').orderByKey('createdAt').on('child_added', (data) => {
            const message = data.val();
            if (message.user._id === this.getUid() || message.userid === this.getUid()) {
                this.allMessagesArray.push(data);
            }
        });
    }

    // sends message
    sendMessage(message, uid, imageUrl) {
        for (let i = 0; i < message.length; i++) {
            this.messagesRef.push({
                userid: uid,
                text: message[i].text,
                image: imageUrl,
                user: message[i].user,
                createdAt: new Date(),
            });
        }
    }

    // closed backend connection
    closeChat() {
        if (this.messagesRef) {
            this.allMessagesArray = [];
            this.messagesRef.off()
        }
    }
}

export default new Backend()