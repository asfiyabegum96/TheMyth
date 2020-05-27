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
        this.messagesRef.limitToLast(10).on('child_added', onReceive);
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
    sendMessage(message, uid, imageUrl, token, selectedItem, userEmail) {
        for (let i = 0; i < message.length; i++) {
            this.messagesRef.push({
                userid: uid,
                text: message[i].text,
                image: imageUrl,
                user: message[i].user,
                createdAt: new Date(),
            });
            this.handlePrivateAccount(selectedItem, userEmail)
            this.sendNotification(token, message[i].text, message[i].user.name);
        }
    }

    handlePrivateAccount(selectedItem, userEmail) {
        const saveObj = {
            email: userEmail.trim(),
        }
        let db = firebase.firestore();
        if (selectedItem.isPrivateAccount === true) {
            db.collection("signup").doc(selectedItem.docRef).collection('pendingFollowers').doc(userEmail.trim()).set(saveObj)
        }
    }
    async sendNotification(token, textMessage, name) {
        const FIREBASE_API_KEY = 'AAAAG7aHdPM:APA91bF4Yc6qbYxvK90mhU1XheWJbYFnCjVQ13RRUGoUT6oDcI5xiqgUZXsNzxuB0CFuflonomJbDoNtFm1hFyPSLWyAi1LGMAVJpUV_HOjN_xvYRzwrN4U7vw5TZU9x2PMRvcZoaBQ_';
        const message = {
            registration_ids: [token],
            notification: {
                title: name,
                body: textMessage,
                "vibrate": 1,
                "sound": 1,
                "show_in_foreground": true,
                "priority": "high",
                "content_available": true,
            }
        }

        let headers = new Headers({
            "Content-Type": "application/json",
            "Authorization": "key=" + FIREBASE_API_KEY
        });

        let response = await fetch("https://fcm.googleapis.com/fcm/send", { method: "POST", headers, body: JSON.stringify(message) })
        response = await response.json();
        if (response.success) {
            console.log(response);
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