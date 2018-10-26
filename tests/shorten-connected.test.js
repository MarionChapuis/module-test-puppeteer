const timeout = 15000

// série de tests sur la page d'accueil
describe("Generer un url simplifié avec un compte utilisateur", () => {
    let page

    test('Generer un url simplifié avec un compte utilisateur', async () => {
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
        const htmlAdmin = await page.$eval('.login-name', e => e.innerHTML);
        expect(htmlAdmin).toContain("wxcv");


        //******************************* Créer un url simplifié  ***********************************
        await page.waitForSelector('.long-link-input');
        await page.type('.long-link-input', 'https://www.google.com/search?source=hp&ei=QQbPW52GC9CRlwSHw46oAg&q=puppeteer+jest&oq=puppeteer+jest&gs_l=psy-ab.3...2441.6095.0.6926.0.0.0.0.0.0.0.0..0.0....0...1c.1.64.psy-ab..0.0.0....0.qKd5wLlrTYk');
        await page.waitForSelector('#shorten');
        await page.$eval( '#shorten', el => el.click() );
        await page.waitForSelector('#short_url');
        const val = await page.$eval('#short_url', el => el.value);
        expect(val).toMatch(/^http:\/\/polr\.campus\-grenoble\.fr\/[0-9]+/);
        await page.screenshot({path: './tests/img/shorten_connected.png'});

    }, timeout)

    // cette fonction est lancée avant chaque test de cette
    // série de tests
    beforeAll(async () => {
        // ouvrir un onglet dans le navigateur
        page = await global.__BROWSER__.newPage()

    }, timeout)

})
