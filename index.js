const express = require('express');
const bodyParser = require('body-parser');

let myDataSource = require('./datasource');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use((req, res, next) => {
    console.log(`time=${Date.now()} path=${req.path}`);
    next();  
});

app.get('/people', (req, res) => {
    return res.json({
        data: myDataSource
    });
});

app.get('/people/:id', (req, res) => {
    res.json({
        data: myDataSource.find((item) => {
            return item.id === req.params.id;
        })
    })
})

app.post('/people', (req, res) => {
    if (req.body.name && req.body.job) {
        const newPerson = {
            id: req.body.name.toLowerCase().replace(' ', '-'),
            name: req.body.name,
            job: req.body.job
        };
        myDataSource.push(newPerson);
        res.json({
            data: newPerson
        });
    } else {
        res.status(400).json({ error: 'Please send both job and name properties.'})
    }
})

app.put('/people/:id', (req, res) => {
    myDataSource = myDataSource.map((item) => {
        if (item.id === req.params.id) {
            return Object.assign(item, req.body)
        } else {
            return item;
        }
    })
    res.json({
        data: myDataSource
    });
})

app.delete('/people/:id', (req, res) => {
    myDataSource = myDataSource.filter((item) => {
        return item.id !== req.params.id;
    })
    res.json({
        data: myDataSource
    });
})

app.listen(port, () => console.log('server is ready'));