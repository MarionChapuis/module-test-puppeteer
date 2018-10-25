const timeout = 15000

// série de tests sur la page d'accueil
describe("Se connecter en utilisateur wxcv", () => {
    let page

    // Se connecter à un compte utilisateur
    test('Se connecter en utilisateur wxcv', async () => {
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
        //Faire un screenshot de la home page pour l'admin
        await page.screenshot({path: './tests/img/login_utilisateur.png'});

    }, timeout)

    // cette fonction est lancée avant chaque test de cette
    // série de tests
    beforeAll(async () => {
        // ouvrir un onglet dans le navigateur
        page = await global.__BROWSER__.newPage()

    }, timeout)

})
