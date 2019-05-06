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

    const user = myDataSource.find((item) => {
        return item.id === req.params.id;
    });

    if (user) {
        return res.json({
            data: user
        });
    } else {
        return res.status(404).json({
            error: 'user not found'
        });
    };

});

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
    
    const userIndex = myDataSource.findIndex((item) => {
        return item.id === req.params.id;
    });
    
    if (userIndex !== -1) {
        // User found
        myDataSource[userIndex] = Object.assign(myDataSource[userIndex], req.body);
        res.json({
            data: myDataSource[userIndex]
        });

    } else {
        // User not found
        return res.status(404).json({
            error: 'User has not been found'
        });
    };


});

app.delete('/people/:id', (req, res) => {
    myDataSource = myDataSource.filter((item) => {
        return item.id !== req.params.id;
    })
    res.json({
        data: myDataSource
    });
})

app.listen(port, () => console.log('server is ready'));