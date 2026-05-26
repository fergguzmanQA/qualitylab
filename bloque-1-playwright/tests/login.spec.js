const { test, expect } = require('@playwright/test');



test.describe('Flujo de Autenticación - MVP', () => {

    

    test('Debería iniciar sesión con credenciales válidas', async ({ page }) => {

        // 1. Navegar a la página de login de prueba de Playwright

        await page.goto('https://demo.playwright.dev/todomvc/');



        // 2. Validar que la página cargó correctamente verificando el título

        await expect(page).toHaveTitle(/Todo/);

        

        // Nota: En el próximo paso refinaremos este test agregando selectores

        // e interacciones reales con formularios (inputs y botones).

    });

});
