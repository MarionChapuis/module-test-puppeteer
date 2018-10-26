const timeout = 17000

// série de tests sur la page d'accueil
describe("Acceder aux stats des url avec un compte utilisateur", () => {
    let page

    //Créer un compte utilisateur
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
        await page.type('form[action="/signup"] input[name="username"]', "marion1");
        await page.type('form[action="/signup"] input[name="password"]', "marion1");
        await page.type('form[action="/signup"] input[name="email"]', "marion1@marion.com");
        // vérifier avec un screenshot ce qu'on a renseigné
        await page.screenshot({path: './tests/img/acceder_stats_url/username_marion1.png'});
        //Enregistrer le compte
        await page.click('form[action="/signup"] input[type="submit"]');
    }, timeout)

    test('Acceder aux stats des url avec un compte utilisateur', async () => {
        //******************************* Se connecter en tant qu'utilisateur ***********************************
        await page.goto('http://polr.campus-grenoble.fr');
        await page.waitForSelector('nav[role="navigation"]');
        // click sur le lien "Sign In" de la navigation
        await page.click(".dropdown-toggle");
        //Attendre que le menu déroulant s'ouvre
        await page.waitForSelector('.login-dropdown-menu');
        //Renseigner les champs de connexion
        await page.type('input[name="username"]', 'marion1');
        await page.type('input[name="password"]', 'marion1');
        //Cliquer sur "Sign In" dans le menu déroulant
        await page.click('input[name="login"]');
        //Attendre que dans la nouvelle page il y est bien la partie "login-name"
        await page.waitForSelector('.login-name');
        //Vérifier que le nom utilisateur soit bien le bon
        // on récupère le code HTML
        const htmlAdmin = await page.$eval('.login-name', e => e.innerHTML);
        // on vérifie qu'il contient la bonne chaîne de caractères
        expect(htmlAdmin).toContain("marion1");

        //******************************* Créer un url simplifié  ***********************************
        await page.waitForSelector('.long-link-input');
        await page.type('.long-link-input', 'https://www.google.com/search?source=hp&ei=QQbPW52GC9CRlwSHw46oAg&q=puppeteer+jest&oq=puppeteer+jest&gs_l=psy-ab.3...2441.6095.0.6926.0.0.0.0.0.0.0.0..0.0....0...1c.1.64.psy-ab..0.0.0....0.qKd5wLlrTYk');
        await page.waitForSelector('#shorten');
        await page.$eval( '#shorten', el => el.click() );
        await page.waitForSelector('#short_url');
        const val = await page.$eval('#short_url', el => el.value);
        expect(val).toMatch(/^http:\/\/polr\.campus\-grenoble\.fr\/[0-9]+/);


        //******************************* Se rendre dans le Dashboard  ***********************************
        //Cliquer sur "Dashboard" dans le dropdown menu
        await page.evaluate( () => {
            Array
            .from( document.querySelectorAll( '.dropdown-menu li a' ) )
            .filter( el => el.textContent === 'Dashboard' )[0].click();
        });
        await page.waitForSelector("h2");
        //Vérifier que le titre "welcome to your Polr" soit bien chargée
        const hmtlDashboard = await page.$eval('h2', e => e.innerHTML);
        expect(hmtlDashboard).toContain("Welcome to your Polr");


        //******************************* Se rendre sur la partie Links du dashboard ***********************************
        //Cliquer sur "Dashboard" dans le dropdown menu de l'utilisateur
        await page.evaluate( () => {
            Array
            .from( document.querySelectorAll( '.admin-nav-item a' ) )
            .filter( el => el.textContent === 'Links' )[0].click();
        });
        //Vérifier que le tableau des url soit bien chargé
        await page.waitForSelector("#user_links_table_wrapper");


        //******************************* Vérifier qu'il y a des url dans le tableau ***********************************
        await page.waitForSelector(".sorting_1");
        //Compter le nombre de td dans la partie tbody du tableau (si supérieur à 1 alors il y a des urls)
        const tdCounts = await page.$$eval('#user_links_table_wrapper tbody td', tds => tds.length);
        //Vérifier que le nb de colonnes est > à 4 (quand il n'y a pas d'url il y a qu'une colonne)
        expect(tdCounts).toBeGreaterThanOrEqual(4);
        await page.screenshot({path: './tests/img/acceder_stats_url/marion1_stats.png'});

    }, timeout)

    test('se deconnecter de marion1', async () => {
        await page.click('.login-name');
        await page.waitForSelector('.dropdown-menu');
        await page.screenshot({path: './tests/img/acceder_stats_url/avant_logout_marion1.png'});
        await page.evaluate( () => {
            Array
            .from( document.querySelectorAll('.dropdown-menu li a'))
            .filter( el => el.textContent === 'Logout')[0].click();
        });
        await page.waitForSelector('nav[role="navigation"]');
        const htmlNavBar = await page.$eval('.dropdown-toggle', e => e.innerHTML);
        expect(htmlNavBar).toContain('Sign In');
        await page.screenshot({path: './tests/img/acceder_stats_url/logout_marion1.png'});
    }, timeout)

    // Supprimer un compte utilisateur
    test('Supprimer marion1', async () => {
        //******************************* Se connecter en tant qu'admin ***********************************
        await page.goto('http://polr.campus-grenoble.fr');
        await page.waitForSelector('nav[role="navigation"]');
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
        await page.screenshot({path: './tests/img/acceder_stats_url/login_admin_stats_url.png'});

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
        await page.screenshot({path: './tests/img/acceder_stats_url/dashboard_admin_stats_url.png'});


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
        await page.screenshot({path: './tests/img/acceder_stats_url/AdminDashboard_stats_url.png'});


        //******************************* Supprimer l'utilisateur marion1 ***********************************
        // Entrer une recherche dans la table Users avec un délai pour laisser s'afficher le résultat
        await page.type('#admin_users_table_filter input[type="search"]', "marion1@marion.com", {delay: 100});
        //Vérifier qu'il n'y a qu'un seul élément dans les résultats trouvés
        const htmlSearch =  await page.$eval('#admin_users_table_info', e => e.innerHTML);
        expect(htmlSearch).toContain("Showing 1 to 1 of 1 entries");
        //Faire un screenshot de la recherche
        await page.screenshot({path: './tests/img/acceder_stats_url/search_marion1.png'});
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
        await page.screenshot({path: './tests/img/acceder_stats_url/avant_logout_admin.png'});
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
        await page.screenshot({path: './tests/img/acceder_stats_url/logout_admin.png'});

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
