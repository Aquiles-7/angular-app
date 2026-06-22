const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function generatePDF() {
    try {
        console.log('Iniciando generación del PDF...');

        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();

        // Cargar el archivo HTML
        const htmlPath = path.resolve(__dirname, 'doc-template.html');
        const htmlContent = fs.readFileSync(htmlPath, 'utf-8');

        // Escribir contenido HTML a la página
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        // Generar PDF
        const pdfPath = path.resolve(__dirname, 'Catalogo_Tienda_de_Productos.pdf');

        await page.pdf({
            path: pdfPath,
            format: 'A4',
            margin: {
                top: '20mm',
                bottom: '20mm',
                left: '20mm',
                right: '20mm'
            },
            printBackground: true,
            scale: 1
        });

        await browser.close();

        console.log(`✓ PDF generado exitosamente en: ${pdfPath}`);
        console.log(`✓ Archivo: Catalogo_Tienda_de_Productos.pdf`);
        console.log(`✓ Tamaño del archivo: ${fs.statSync(pdfPath).size} bytes`);

        process.exit(0);
    } catch (error) {
        console.error('Error al generar el PDF:', error);
        process.exit(1);
    }
}

generatePDF();
