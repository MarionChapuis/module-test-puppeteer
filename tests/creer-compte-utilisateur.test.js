const timeout = 15000

// série de tests sur la page d'accueil
describe("Creer compte utilisateur", () => {
    let page

    // Créer un compte utilisateur
    test('Sign up', async () => {
        await page.goto('http://polr.campus-grenoble.fr')
        await page.waitForSelector('#navbar li a')
        // click sur le lien "Sign up" de la navigation
        await page.evaluate( () => {
            Array
                .from( document.querySelectorAll( '#navbar li a' ) )
                .filter( el => el.textContent === 'Sign Up' )[0].click();
        });
        // on attent que l'élément ".title" soit chargé
        await page.waitForSelector('.title');
        // on récupère le code HTML
        const html = await page.$eval('.title', e => e.innerHTML)
        // on vérifie qu'il contient la bonne chaîne de caractères
        expect(html).toContain("Register");
        // attendre que l'élément <form> soit chargé
        await page.waitForSelector('form')
        //Renseigner le champ "username", sélectionner le formulaire par son action puis l'input par son name
        await page.type('form[action="/signup"] input[name="username"]', "wxcv");
        await page.type('form[action="/signup"] input[name="password"]', "toto");
        await page.type('form[action="/signup"] input[name="email"]', "toto@marion.com");
        // vérifier avec un screenshot ce qu'on a renseigné
        await page.screenshot({path: './tests/img/username.png'});
        //Enregistrer le compte
        await page.click('form[action="/signup"] input[type="submit"]');
    }, timeout)

    // Supprimer un compte utilisateur
    test('Supprimer wxcv', async () => {
        //******************************* Se connecter en tant qu'admin ***********************************
        await page.goto('http://polr.campus-grenoble.fr');
        await page.waitForSelector('#navbar li a');
        // click sur le lien "Sign In" de la navigation
        await page.click(".dropdown-toggle");
        //Attendre que le menu déroulant s'ouvre
        await page.waitForSelector('.login-dropdown-menu');
        //Renseigner les champs de connexion
        await page.type('input[name="username"]', 'admin');
        await page.type('input[name="password"]', 'campus');
        //Cliquer sur "Sign In" dans le menu déroulant
        await page.click('input[name="login"]');
        //Attendre que dans la nouvelle page il y est bien la partie "login-name"
        await page.waitForSelector('.login-name');
        //Vérifier que le nom utilisateur soit bien "admin"
        // on récupère le code HTML
        const htmlAdmin = await page.$eval('.login-name', e => e.innerHTML);
        // on vérifie qu'il contient la bonne chaîne de caractères
        expect(htmlAdmin).toContain("admin");
        //Faire un screenshot de la home page pour l'admin
        await page.screenshot({path: './tests/img/login_admin.png'});

        //******************************* Se rendre dans le Dashboard de l'admin ***********************************
        //Cliquer sur "Dashboard" dans le dropdown menu de l'admin
        await page.evaluate( () => {
            Array
            .from( document.querySelectorAll( '.dropdown-menu li a' ) )
            .filter( el => el.textContent === 'Dashboard' )[0].click();
        });
        await page.waitForSelector("h2");
        //Vérifier que le titre "welcome to your Polr" soit bien chargée
        // on récupère le code HTML
        const hmtlDashboard = await page.$eval('h2', e => e.innerHTML);
        // on vérifie qu'il contient la bonne chaîne de caractères
        expect(hmtlDashboard).toContain("Welcome to your Polr");
        //Faire un screenshot du dashboard pour l'admin
        await page.screenshot({path: './tests/img/dashboard_admin.png'});


        //******************************* Se rendre sur la partie Admin du dashboard ***********************************
        //Cliquer sur "Dashboard" dans le dropdown menu de l'admin
        await page.evaluate( () => {
            Array
            .from( document.querySelectorAll( '.admin-nav-item a' ) )
            .filter( el => el.textContent === 'Admin' )[0].click();
        });
        //Vérifier que la partie "Users" soit bien chargée
        await page.waitForSelector(".users-heading");
        //Faire un screenshot de la partie Admin du dashboard
        await page.screenshot({path: './tests/img/AdminDashboard_admin.png'});


        //******************************* Supprimer l'utilisateur wxcv ***********************************
        // Entrer une recherche dans la table Users avec un délai pour laisser s'afficher le résultat
        await page.type('#admin_users_table_filter input[type="search"]', "toto@marion.com", {delay: 100});
        //Vérifier qu'il n'y a qu'un seul élément dans les résultats trouvés
        const htmlSearch =  await page.$eval('#admin_users_table_info', e => e.innerHTML);
        expect(htmlSearch).toContain("Showing 1 to 1 of 1 entries");
        //Faire un screenshot de la recherche
        await page.screenshot({path: './tests/img/search_admin.png'});
        //Vérifier que le bouton Delete pour supprimer l'utilisateur existe
        const htmlDelete = await page.$eval('#admin_users_table tr td .btn-danger', e => e.innerHTML);
        expect(htmlDelete).toContain("Delete");
        //Cliquer sur le btn Delete
        await page.click('#admin_users_table tr td .btn-danger');
    }, timeout)


    // cette fonction est lancée avant chaque test de cette
    // série de tests
    beforeAll(async () => {
        // ouvrir un onglet dans le navigateur
        page = await global.__BROWSER__.newPage()

        //Lorsqu'une boîte de dialogue s'ouvre, appuyer sur "ok" pour valider (très utile pour réussir à supprimer l'utilisateur)
        page.on('dialog', async dialog => {
            await dialog.accept();
        });

    }, timeout)

})
