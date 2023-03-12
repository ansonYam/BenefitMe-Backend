require('dotenv').config();
// console.log(process.env);

const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const fs = require('fs');

const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());

const uri = 'mongodb://localhost:27017';
const dbName = 'EmployeeBenefits';
const collectionName = 'Companies';

app.get('/companies', async (req, res) => {
    const client = new MongoClient(uri);

    try {
        await client.connect();

        const collection = client.db(dbName).collection(collectionName);
        const cursor = collection.find({}, { projection: { 'Company Name': 1 } });
        const companies = await cursor.toArray();

        await client.close();
        res.json(companies);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    } finally {
        await client.close();
    }
})

/** test endpoint, just to say hello */
app.get('/api', (req, res) => {
    res.json({ message: 'Hello from my server!' });
});

/** No longer using these endpoints */
app.get('/api/benefits/retail', (req, res) => {
    fs.readFile('./server/benefits/retail.json', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Server error');
        } else {
            // console.log(data);
            res.json(JSON.parse(data));
        }
    });
});

app.get('/api/benefits/tech', (req, res) => {
    fs.readFile('./server/benefits/tech.json', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Server error');
        } else {
            // console.log(data);
            res.json(JSON.parse(data));
        }
    });
});

app.get('/api/benefits/finance', (req, res) => {
    fs.readFile('./server/benefits/finance.json', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Server error');
        } else {
            res.json(JSON.parse(data));
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});