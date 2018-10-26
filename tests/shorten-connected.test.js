const timeout = 17000

// série de tests sur la page d'accueil
describe("Generer un url simplifié avec un compte utilisateur", () => {
    let page

    // Créer un compte utilisateur
    test('Sign up', async () => {
        await page.goto('http://polr.campus-grenoble.fr')
        await page.waitForSelector('nav[role="navigation"]')
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
        await page.waitForSelector('form[action="/signup"')
        //Renseigner le champ "username", sélectionner le formulaire par son action puis l'input par son name
        await page.type('form[action="/signup"] input[name="username"]', "marion4");
        await page.type('form[action="/signup"] input[name="password"]', "marion4");
        await page.type('form[action="/signup"] input[name="email"]', "marion4@marion.com");
        // vérifier avec un screenshot ce qu'on a renseigné
        await page.screenshot({path: './tests/img/shorten_connected/username_marion4.png'});
        //Enregistrer le compte
        await page.click('form[action="/signup"] input[type="submit"]');
    }, timeout)


    test('Generer un url simplifié avec un compte utilisateur', async () => {
        //******************************* Se connecter en tant qu'utilisateur ***********************************
        await page.goto('http://polr.campus-grenoble.fr');
        await page.waitForSelector('nav[role="navigation"]')
        // click sur le lien "Sign In" de la navigation
        await page.click(".dropdown-toggle");
        //Attendre que le menu déroulant s'ouvre
        await page.waitForSelector('.login-dropdown-menu');
        //Renseigner les champs de connexion
        await page.type('input[name="username"]', 'marion4');
        await page.type('input[name="password"]', 'marion4');
        //Cliquer sur "Sign In" dans le menu déroulant
        await page.click('input[name="login"]');
        //Attendre que dans la nouvelle page il y est bien la partie "login-name"
        await page.waitForSelector('.login-name');
        //Vérifier que le nom utilisateur soit bien le bon
        const htmlAdmin = await page.$eval('.login-name', e => e.innerHTML);
        expect(htmlAdmin).toContain("marion4");


        //******************************* Créer un url simplifié  ***********************************
        await page.waitForSelector('.long-link-input');
        await page.type('.long-link-input', 'https://www.google.com/search?source=hp&ei=QQbPW52GC9CRlwSHw46oAg&q=puppeteer+jest&oq=puppeteer+jest&gs_l=psy-ab.3...2441.6095.0.6926.0.0.0.0.0.0.0.0..0.0....0...1c.1.64.psy-ab..0.0.0....0.qKd5wLlrTYk');
        await page.waitForSelector('#shorten');
        await page.$eval( '#shorten', el => el.click() );
        await page.waitForSelector('#short_url');
        const val = await page.$eval('#short_url', el => el.value);
        expect(val).toMatch(/^http:\/\/polr\.campus\-grenoble\.fr\/[0-9]+/);
        await page.screenshot({path: './tests/img/shorten_connected/shorten_connected.png'});

    }, timeout)

    test('se deconnecter de marion4', async () => {
        await page.click('.login-name');
        await page.waitForSelector('.dropdown-menu');
        await page.screenshot({path: './tests/img/shorten_connected/avant_logout_shorten_connected.png'});
        await page.evaluate( () => {
            Array
            .from( document.querySelectorAll('.dropdown-menu li a'))
            .filter( el => el.textContent === 'Logout')[0].click();
        });
        await page.waitForSelector('nav[role="navigation"]')
        const htmlNavBar = await page.$eval('.dropdown-toggle', e => e.innerHTML);

        expect(htmlNavBar).toContain('Sign In');
        await page.screenshot({path: './tests/img/shorten_connected/logout_shortend_connected.png'});
    }, timeout)


    // Supprimer un compte utilisateur
    test('Supprimer marion4', async () => {
        //******************************* Se connecter en tant qu'admin ***********************************
        await page.goto('http://polr.campus-grenoble.fr');
        await page.waitForSelector('nav[role="navigation"]')
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
        await page.screenshot({path: './tests/img/shorten_connected/login_admin_shorten_connected.png'});

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
        await page.screenshot({path: './tests/img/shorten_connected/dashboard_admin_shorten_connected.png'});


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
        await page.screenshot({path: './tests/img/shorten_connected/AdminDashboard_shorten_connected.png'});


        //******************************* Supprimer l'utilisateur marion4 ***********************************
        // Entrer une recherche dans la table Users avec un délai pour laisser s'afficher le résultat
        await page.type('#admin_users_table_filter input[type="search"]', "marion4@marion.com", {delay: 100});
        //Vérifier qu'il n'y a qu'un seul élément dans les résultats trouvés
        const htmlSearch =  await page.$eval('#admin_users_table_info', e => e.innerHTML);
        expect(htmlSearch).toContain("Showing 1 to 1 of 1 entries");
        //Faire un screenshot de la recherche
        await page.screenshot({path: './tests/img/shorten_connected/search_marion4.png'});
        //Vérifier que le bouton Delete pour supprimer l'utilisateur existe
        const htmlDelete = await page.$eval('#admin_users_table tr td .btn-danger', e => e.innerHTML);
        expect(htmlDelete).toContain("Delete");
        //Cliquer sur le btn Delete
        await page.click('#admin_users_table tr td .btn-danger');

    }, timeout)

    //Se déconnecter du compte admin
    test('se deconnecter du compte admin', async () => {
        await page.click('.login-name', {delay : 500});
        await page.waitForSelector('.dropdown-menu');
        await page.screenshot({path: './tests/img/shorten_connected/avant_logout_admin.png'});
        await page.evaluate( () => {
            Array
            .from( document.querySelectorAll('.dropdown-menu li a'))
            .filter( el => el.textContent === 'Logout')[0].click();
        });
        //Attendre que l'écran soit sur la page principale (donc déconnectée)
        await page.waitForSelector('h1');
        //Vérifier qu'on est déconnecté en cherchant "sign in"
        const htmlLogout = await page.$eval('.dropdown-toggle', e => e.innerHTML);
        expect(htmlLogout).toContain('Sign In');
        //Screenshot déconnexion
        await page.screenshot({path: './tests/img/shorten_connected/logout_admin.png'});

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
