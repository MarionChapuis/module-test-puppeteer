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




    // cette fonction est lancée avant chaque test de cette
    // série de tests
    beforeAll(async () => {
        // ouvrir un onglet dans le navigateur
        page = await global.__BROWSER__.newPage()
    }, timeout)

})
