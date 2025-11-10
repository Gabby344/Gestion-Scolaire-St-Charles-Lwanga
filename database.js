// database.js - TOUTES LES FONCTIONS POUR VOTRE APPLICATION

// ==================== FONCTIONS ÉLÈVES ====================
const ElevesManager = {
    // Ajouter un nouvel élève
    async ajouter(nouvelEleve) {
        try {
            const docRef = await db.collection('eleves').add({
                ...nouvelEleve,
                dateCreation: new Date(),
                statut: 'Actif',
                anneeScolaire: '2023-2024'
            });
            return { success: true, id: docRef.id };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Modifier un élève
    async modifier(eleveId, nouvellesDonnees) {
        try {
            await db.collection('eleves').doc(eleveId).update({
                ...nouvellesDonnees,
                dateModification: new Date()
            });
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Supprimer un élève (archivage)
    async supprimer(eleveId) {
        try {
            await db.collection('eleves').doc(eleveId).update({
                statut: 'Inactif',
                dateSuppression: new Date()
            });
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Récupérer tous les élèves actifs
    async tous() {
        try {
            const snapshot = await db.collection('eleves')
                .where('statut', '==', 'Actif')
                .orderBy('dateCreation', 'desc')
                .get();
            
            return {
                success: true,
                data: snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Rechercher des élèves
    async rechercher(term) {
        try {
            const snapshot = await db.collection('eleves')
                .where('statut', '==', 'Actif')
                .get();
            
            const eleves = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            const resultats = eleves.filter(eleve => 
                eleve.nom.toLowerCase().includes(term.toLowerCase()) ||
                eleve.prenom.toLowerCase().includes(term.toLowerCase()) ||
                eleve.matricule.toLowerCase().includes(term.toLowerCase())
            );

            return { success: true, data: resultats };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
};

// ==================== FONCTIONS NOTES ====================
const NotesManager = {
    // Ajouter une note
    async ajouter(noteData) {
        try {
            const docRef = await db.collection('notes').add({
                ...noteData,
                dateCreation: new Date(),
                anneeScolaire: '2023-2024',
                trimestre: '1er Trimestre'
            });
            return { success: true, id: docRef.id };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Récupérer les notes d'un élève
    async parEleve(eleveId) {
        try {
            const snapshot = await db.collection('notes')
                .where('eleveId', '==', eleveId)
                .orderBy('date', 'desc')
                .get();
            
            return {
                success: true,
                data: snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Récupérer les notes par classe
    async parClasse(classe) {
        try {
            const snapshot = await db.collection('notes')
                .where('classe', '==', classe)
                .orderBy('matiere', 'asc')
                .get();
            
            return {
                success: true,
                data: snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
};

// ==================== FONCTIONS FINANCES ====================
const FinancesManager = {
    // Ajouter un paiement
    async ajouterPaiement(paiementData) {
        try {
            const docRef = await db.collection('finances').add({
                ...paiementData,
                dateCreation: new Date(),
                anneeScolaire: '2023-2024',
                mois: new Date().getMonth() + 1
            });
            return { success: true, id: docRef.id };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Récupérer l'historique des paiements
    async historique() {
        try {
            const snapshot = await db.collection('finances')
                .orderBy('dateCreation', 'desc')
                .limit(50)
                .get();
            
            return {
                success: true,
                data: snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Récupérer les impayés
    async impayes() {
        try {
            const snapshot = await db.collection('finances')
                .where('statut', '==', 'Impayé')
                .get();
            
            return {
                success: true,
                data: snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
};

// ==================== FONCTIONS UTILISATEURS ====================
const AuthManager = {
    // Connexion utilisateur
    async connexion(email, password) {
        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            return { success: true, user: userCredential.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Déconnexion
    async deconnexion() {
        try {
            await auth.signOut();
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Vérifier si connecté
    verifierConnexion() {
        return new Promise((resolve) => {
            auth.onAuthStateChanged(user => {
                resolve(user);
            });
        });
    }
};

// ==================== FONCTIONS DONNÉES GLOBALES ====================
const DataManager = {
    // Initialiser les données de démonstration
    async initialiserDonneesDemo() {
        try {
            // Vérifier si des données existent déjà
            const snapshot = await db.collection('eleves').limit(1).get();
            
            if (snapshot.empty) {
                console.log('📦 Initialisation des données de démonstration...');
                
                // Élèves de démonstration
                const elevesDemo = [
                    {
                        matricule: "SCL2024-001",
                        nom: "Mbayo",
                        postnom: "Kabasele",
                        prenom: "Sarah",
                        classe: "4ème Scientifique",
                        dateNaissance: "2008-05-15",
                        lieuNaissance: "Kolwezi",
                        genre: "Féminin",
                        statut: "Actif"
                    },
                    {
                        matricule: "SCL2024-002",
                        nom: "Kalonga",
                        postnom: "Mwamba", 
                        prenom: "David",
                        classe: "3ème Commerciale",
                        dateNaissance: "2009-03-20",
                        lieuNaissance: "Kolwezi",
                        genre: "Masculin",
                        statut: "Actif"
                    }
                ];

                // Ajouter les élèves
                for (const eleve of elevesDemo) {
                    await ElevesManager.ajouter(eleve);
                }

                console.log('✅ Données de démonstration initialisées');
            }
            
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Récupérer les statistiques
    async statistiques() {
        try {
            const [elevesSnapshot, notesSnapshot, financesSnapshot] = await Promise.all([
                db.collection('eleves').where('statut', '==', 'Actif').get(),
                db.collection('notes').get(),
                db.collection('finances').where('statut', '==', 'Payé').get()
            ]);

            const totalEleves = elevesSnapshot.size;
            const totalNotes = notesSnapshot.size;
            const revenus = financesSnapshot.docs.reduce((sum, doc) => sum + (doc.data().montant || 0), 0);

            return {
                success: true,
                data: {
                    totalEleves,
                    totalNotes,
                    revenus,
                    tauxReussite: '78%'
                }
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
};

// ==================== EXPORT GLOBAL ====================
window.Database = {
    eleves: ElevesManager,
    notes: NotesManager,
    finances: FinancesManager,
    auth: AuthManager,
    data: DataManager
};

console.log('✅ Database Manager chargé avec succès');
