const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

let comptes = [];

function afficherMenu() {
    console.log("\n--- Menu Banque ---");
    console.log("1. Créer un compte");
    console.log("2. Déposer de l'argent");
    console.log("3. Retirer de l'argent");
    console.log("4. Consulter le solde");
    console.log("5. Quitter");
    readline.question("Choisissez une option : ", (option) => {
        switch (option) {
            case '1':
                creerCompte();
                break;
            case '2':
                deposerArgent();
                break;
            case '3':
                retirerArgent();
                break;
            case '4':
                consulterSolde();
                break;
            case '5':
                quitter();
                break;
            default:
                console.log("Option invalide. Veuillez réessayer.");
                afficherMenu();
        }
    });
}

function creerCompte() {
    readline.question("Entrez un nom d'utilisateur pour créer un compte : ", (nom) => {
        const compteExiste = comptes.some(compte => compte.nom === nom);
        if (compteExiste) {
            console.log("Ce nom d'utilisateur existe déjà. Veuillez en choisir un autre.");
        } else {
            comptes.push({ nom: nom, solde: 0 });
            console.log(`Compte créé pour ${nom}.`);
        }
        afficherMenu();
    });
}

function deposerArgent() {
    readline.question("Entrez votre nom d'utilisateur : ", (nom) => {
        const compte = comptes.find(compte => compte.nom === nom);
        if (compte) {
            readline.question("Montant à déposer : ", (montant) => {
                const montantNum = parseFloat(montant);
                if (!isNaN(montantNum) && montantNum > 0) {
                    compte.solde += montantNum;
                    console.log(`Vous avez déposé ${montantNum}€. Solde actuel : ${compte.solde}€.`);
                } else {
                    console.log("Montant invalide.");
                }
                afficherMenu();
            });
        } else {
            console.log("Compte non trouvé.");
            afficherMenu();
        }
    });
}

function retirerArgent() {
    readline.question("Entrez votre nom d'utilisateur : ", (nom) => {
        const compte = comptes.find(compte => compte.nom === nom);
        if (compte) {
            readline.question("Montant à retirer : ", (montant) => {
                const montantNum = parseFloat(montant);
                if (!isNaN(montantNum) && montantNum > 0 && montantNum <= compte.solde) {
                    compte.solde -= montantNum;
                    console.log(`Vous avez retiré ${montantNum}€. Solde actuel : ${compte.solde}€.`);
                } else {
                    console.log("Montant invalide ou insuffisant.");
                }
                afficherMenu();
            });
        } else {
            console.log("Compte non trouvé.");
            afficherMenu();
        }
    });
}

function consulterSolde() {
    readline.question("Entrez votre nom d'utilisateur : ", (nom) => {
        const compte = comptes.find(compte => compte.nom === nom);
        if (compte) {
            console.log(`Solde actuel de ${nom} : ${compte.solde}€.`);
        } else {
            console.log("Compte non trouvé.");
        }
        afficherMenu();
    });
}

function quitter() {
    console.log("Merci d'avoir utilisé notre simulateur de banque. Au revoir !");
    readline.close();
}

afficherMenu();
