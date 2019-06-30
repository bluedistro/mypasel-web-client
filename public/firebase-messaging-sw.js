importScripts('https://www.gstatic.com/firebasejs/5.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.8.1/firebase-messaging.js');

var config = {
	apiKey : "AIzaSyActd9Uo9vznMtsin3ufh-ONaeuwziNmnc",
	authDomain : "macro-incline-164306.firebaseapp.com",
	databaseURL : "https://macro-incline-164306.firebaseio.com",
	projectId : "macro-incline-164306",
	storageBucket : "macro-incline-164306.appspot.com",
	messagingSenderId : "296173793992"
};

firebase.initializeApp(config);
const messaging = firebase.messaging();
// messaging.setBackgroundMessageHandler((payload) => {
// 	console.log('message here too')
// 	console.log(payload)
// })
