'use strict';
 
const ADODB = require('node-adodb');
const connection = ADODB.open('Provider=Microsoft.Jet.OLEDB.4.0;Data Source=db.mdb;');
const express = require("express");
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


app.post('/inst', (req, resp) => {
    console.log(req.body);
    req.body.cump = ((req.body.cump == 'on') ? true : false);
    const exe = `INSERT INTO Usuarios(Tareas, Users, Prioridad, Cumplida) VALUES ("${req.body.task}", "${req.body.usr}", ${req.body.prior}, ${req.body.cump})`;
    connection
    .execute(exe)
    .then(data => {
        console.log(JSON.stringify(data, null, 2));
    })
    .catch(error => {
        console.error(error);
    });
    
    
    resp.redirect('/');
});

app.post('/data', (req, resp) => {
    connection
    .query('SELECT * FROM Usuarios')
    .then(data => {
        resp.json({data: data});
    })
    .catch(error => {
        console.error(error);
    });
});

app.delete('/delrg', (req, resp) => {
    console.log(req.body.id);
    connection
    .execute(`DELETE FROM Usuarios WHERE Id = ${req.body.id}`)
    .then(data => {
        console.log(JSON.stringify(data, null, 2));
    })
    .catch(error => {
        console.error(error);
    });
    resp.json({status: "success"});
})

app.delete('/all', (req, resp) => {
    connection
    .execute(`DELETE * FROM Usuarios`)
    .then(data => {
        console.log(JSON.stringify(data, null, 2));
    })
    .catch(error => {
        console.error(error);
    });
    resp.json({status: "success"});
})

app.post('/act', (req, resp) => {
    //Tareas, Users, Prioridad, Cumplida
    const data = req.body.data;
    const exe = `UPDATE Usuarios
    SET Tareas = "${data.task}", Users= "${data.user}", Prioridad = ${data.prior}, Cumplida = ${data.cump}
    WHERE Id = ${data.id};`;
      connection
      .execute(exe)
      .then(data => {
        console.log("ACTUALIZADO");
      })
      .catch(error => {
        console.error(error);
      });

      resp.json({status:"success"});
});

app.post('/search', (req, resp) => {
    let query = "SELECT * FROM Usuarios WHERE ";
    if(req.body.db == 1)
        query += `Tareas = "${req.body.sh}"`;
    else if(req.body.db == 2)
        query += `Users = "${req.body.sh}"`;
    else if(req.body.db == 3)
        query += `Prioridad = ${req.body.sh}`;
    else if(req.body.db == 4)
        query += `Cumplida = ${req.body.sh}`;

        connection
        .query(query)
        .then(data => {
            resp.json({data: data});
        })
        .catch(error => {
            console.error(error);
        });

});



app.use(express.static('public'));

app.listen(3000, () => {
 console.log("Server running on port 3000");
});