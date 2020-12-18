const express = require('express');
const https = require('https');

const PORT = 8000;

const app = express();


function fetchTitle(address, resolves, rejects){
    https.get(address, res => {

        let chunks = "";

        res.on('data', chunk => {
            chunks+=chunk;
        });

        res.on('end', () => {
            resolves(chunks);
        })

    }).on('error', err => {
        rejects(err);
    })
}

function renderResponse(title, address){
    const htmlRes = `<html><head></head><body><h1> Following are the titles of the given website: </h1> <ul><li>${address} - ${title}</li></ul> </body></html>`;
    return htmlRes;
}


app.get('/I/want/title/', async (req, res) => {
    try {
        let titles = [];
        let rawHTML = await new Promise( (resolves, rejects ) => {

            let address = req.query.address;

            fetchTitle(address, resolves, rejects);
        });

        const title = rawHTML.split('<title>')[1].split('</title>')[0];
        console.log('title' + title);

        const htmlRes = renderResponse(title, req.query.address);

        res.send(htmlRes);

    } catch (err) {
        res.status(400).send(`Unable to fetch the title: ${err.stack}`);
    }
});


app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`)
})