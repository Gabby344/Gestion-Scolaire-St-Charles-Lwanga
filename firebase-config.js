// firebase-config.js - CONFIGURATION UNIFIÉE

// Configuration Firebase CORRECTE
const firebaseConfig = {
    apiKey: "AIzaSyDTM4gdOs_Ud3DC49pmammYMlDH3cSSgZs",
    authDomain: "gestion-scolaire-st-charles.firebaseapp.com",
    projectId: "gestion-scolaire-st-charles",
    storageBucket: "gestion-scolaire-st-charles.appspot.com", // CORRIGÉ
    messagingSenderId: "1033368821503",
    appId: "1:1033368821503:web:a4ba1c8d439193c5f336ca"
};

// Vérifier si Firebase est déjà initialisé
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app(); // Utiliser l'instance existante
}

// Références globales
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

console.log('✅ Firebase configuré avec succès');
