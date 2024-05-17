const {initializeApp,cert} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");
const {service_acc_cred} = require("./service_account")

//Returns a credential created from the provided service account that grants admin access to Firebase services. This credential can be used in the call to firebase-admin.app#initializeApp .

const serviceAccount = require(JSON.stringify(service_acc_cred));

initializeApp({
    credential: cert(serviceAccount),
})

const db = getFirestore();

module.exports = {db};