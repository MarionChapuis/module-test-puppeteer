const timeout = 15000

// série de tests sur la page d'accueil
describe("Acceder aux stats des url avec un compte utilisateur", () => {
    let page

    // Se connecter à un compte utilisateur
    test('Acceder aux stats des url avec un compte utilisateur', async () => {
        //******************************* Se connecter en tant qu'utilisateur ***********************************
        await page.goto('http://polr.campus-grenoble.fr');
        await page.waitForSelector('#navbar li a');
        // click sur le lien "Sign In" de la navigation
        await page.click(".dropdown-toggle");
        //Attendre que le menu déroulant s'ouvre
        await page.waitForSelector('.login-dropdown-menu');
        //Renseigner les champs de connexion
        await page.type('input[name="username"]', 'wxcv');
        await page.type('input[name="password"]', 'toto');
        //Cliquer sur "Sign In" dans le menu déroulant
        await page.click('input[name="login"]');
        //Attendre que dans la nouvelle page il y est bien la partie "login-name"
        await page.waitForSelector('.login-name');
        //Vérifier que le nom utilisateur soit bien le bon
        // on récupère le code HTML
        const htmlAdmin = await page.$eval('.login-name', e => e.innerHTML);
        // on vérifie qu'il contient la bonne chaîne de caractères
        expect(htmlAdmin).toContain("wxcv");

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
        //Faire un screenshot de la partie Links du dashboard
        await page.screenshot({path: './tests/img/Links_user.png'});


        //******************************* Vérifier qu'il y a des url dans le tableau ***********************************
        await page.waitForSelector(".sorting_1");
        //Compter le nombre de td dans la partie tbody du tableau (si supérieur à 1 alors il y a des urls)
        const tdCounts = await page.$$eval('#user_links_table_wrapper tbody td', tds => tds.length);
        console.log(tdCounts);
        //Vérifier que le nb de colonnes est > à 2 (quand il n'y a pas d'url il y a qu'une colonne)
        expect(tdCounts).toBeGreaterThanOrEqual(2);
        await page.screenshot({path: './tests/img/user_stats.png'});

    }, timeout)

    // cette fonction est lancée avant chaque test de cette
    // série de tests
    beforeAll(async () => {
        // ouvrir un onglet dans le navigateur
        page = await global.__BROWSER__.newPage()

    }, timeout)

})
