const fs = require('fs');
const http = require('http');
const url = require('url');

const slugify = require('slugify');

const replaceTemplate = require('./modules/replace_template')

// FILES
// Blocking, synchronous way
// const textIn = fs.readFileSync('paul.txt', 'utf-8');
// const textOut = `Are you stuck: ${textIn}.\nCreated on ${Date.now()}`;
// console.log(textOut);
// fs.writeFileSync('paul.txt', textOut);
// console.log('File written!');

// The non-blocking way
// fs.readFile('paul.txt', 'utf-8', (err, data) => {
//     console.log(data);
// });
// console.log("I will read the file \n\n");

// SERVER

const tempOverview = fs.readFileSync('templates/template_overview.html', 'utf-8');
const tempCard = fs.readFileSync('templates/template_card.html', 'utf-8');
const tempProduct = fs.readFileSync('templates/product.html', 'utf-8');
const data = fs.readFileSync('data.json', 'utf-8');
const dataObject = JSON.parse(data);

const slugs = dataObject.map(el => slugify(el.productName, {lower: true}));
console.log(slugs)

const server = http.createServer((req, res) => {
    // console.log(req.url);

    // const pathName = req.url;
    const {query, pathname} = url.parse(req.url, true);

    if (pathname === '/' || pathname === '/overview') {

        res.writeHead(200, {'content-type': 'text/html'});

        const cardsHTML = dataObject.map(el => replaceTemplate(tempCard, el)).join('');
        console.log(cardsHTML)
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHTML)

        res.end(output);

    } else if (pathname === '/product'){
        res.writeHead(200, {'content-type': 'text/html'});
        const product = dataObject[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);

    } else if (pathname === '/api') {
            res.writeHead(200, {'content-type': 'application/json'});
            res.end(data);     

    } else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'Hello world there'
        });
        res.end('<h1>Page not found</h1>');
    }
    // res.end("Hello from the server!");
});

server.listen(8000,'127.0.0.1', () => {
    console.log('Listening to request on port 8000');
});

