function show(sh){
    document.getElementById('in').style.display = "none";
    document.getElementById('del').style.display = "none";
    document.getElementById('act').style.display = "none";
    document.getElementById('ser').style.display = "none";

    document.getElementById(sh).style.display = "block";
}


function range(){
    document.getElementById("rg").innerHTML = document.getElementById("inrg").value;
}


async function viewDel(){
    const options = { 
        method: 'POST',
        body: JSON.stringify({status:true}), 
        headers:{
            'Content-Type': 'application/json'
        }
    };
    
    const response = await fetch('/data', options).catch(error => console.error(error));
    const json = await response.json();
    let tb = document.getElementById("tb");
    tb.innerHTML = "";
    
    tb.innerHTML += "<tr><th>Tarea</th><th>Usuario</th><th>Prioridad</th><th>Cumplida</th><th>&nbsp;</th></tr>";
    for(let r of json.data){
        tb.innerHTML += `<tr>
        <td>${r.Tareas}</td>
        <td>${r.Users}</td> 
        <td>${r.Prioridad}</td>
        <td>${r.Cumplida}</td>
        <td><button onclick=(eliminarRg(${r.Id}))>DEL</button></td>
      </tr>`;
    }

}

function eliminarRg(id){
    console.log(id);
    fetch("/delrg", {
        method: 'DELETE', // or 'PUT'
        body: JSON.stringify({id:id}), // data can be `string` or {object}!
        headers:{
            'Content-Type': 'application/json'
        }
    }).then(res => location.href ="/")
    .catch(error => console.error('Error:', error));
}

function delall(){
    fetch("/all", {
        method: 'DELETE', // or 'PUT'
        body: JSON.stringify({id:"id"}), // data can be `string` or {object}!
        headers:{
            'Content-Type': 'application/json'
        }
    }).then(res => location.href ="/")
    .catch(error => console.error('Error:', error));
}

async function viewAct(){
    const options = { 
        method: 'POST',
        body: JSON.stringify({status:true}), 
        headers:{
            'Content-Type': 'application/json'
        }
    };
    
    const response = await fetch('/data', options).catch(error => console.error(error));
    const json = await response.json();
    console.log(json.data);
    let tb = document.getElementById("acttb");
    tb.innerHTML = "";
    
    tb.innerHTML += "<tr><th>Tarea</th><th>Usuario</th><th>Prioridad</th><th>Cumplida</th><th>&nbsp;</th></tr>";
    for(let r of json.data){
        if(r.Cumplida){
            tb.innerHTML += `<tr>
            <td><input type="text" id="task${r.Id}" value=${r.Tareas}></td>
            <td><input type="text" id="user${r.Id}" value=${r.Users}></td> 
            <td><input type="range" id="prior${r.Id}"min="1" max="10" value=${r.Prioridad}></td>
            <td><input type="checkbox" checked=${r.Cumplida} id="cump${r.Id}"</td>
            <td><button onclick="actualizar(${r.Id})">ACT</button></td>
            </tr>`;
        }else{
            tb.innerHTML += `<tr>
            <td><input type="text" id="task${r.Id}" value=${r.Tareas}></td>
            <td><input type="text" id="user${r.Id}" value=${r.Users}></td> 
            <td><input type="range" id="prior${r.Id}"min="1" max="10" value=${r.Prioridad}></td>
            <td><input type="checkbox" id="cump${r.Id}"</td>
            <td><button onclick="actualizar(${r.Id})">ACT</button></td>
            </tr>`;
        }
    }
    
}

function actualizar(id){
    const data = {
        id: id,
        task: document.getElementById("task"+id).value,
        user: document.getElementById("user"+id).value,
        prior: document.getElementById("prior"+id).value,
        cump: document.getElementById("cump"+id).checked
    };

    fetch("/act", {
        method: 'POST', // or 'PUT'
        body: JSON.stringify({data:data}), // data can be `string` or {object}!
        headers:{
            'Content-Type': 'application/json'
        }
    }).then(res => location.href ="/")
    .catch(error => console.error('Error:', error));
    
}

async function search(wh){
    let s;
    if(wh == 1)
        s = document.getElementById("stask").value;
    else if(wh == 2)
        s = document.getElementById("susr").value;
    else if(wh == 3)
        s = document.getElementById("spri").value;
    else if(wh == 4)
        s = document.getElementById("scump").checked;

    const options = { 
        method: 'POST',
        body: JSON.stringify({db:wh, sh:s}), 
        headers:{
            'Content-Type': 'application/json'
        }
    };
    
    const response = await fetch('/search', options).catch(error => console.error(error));
    const json = await response.json();

    let tb = document.getElementById("res");
    tb.style.display ="block";
    tb.innerHTML = "";
    
    tb.innerHTML += "<tr><th>Tarea</th><th>Usuario</th><th>Prioridad</th><th>Cumplida</th></tr>";
    for(let r of json.data){
        if(r.Cumplida){
            tb.innerHTML += `<tr>
            <td><input type="text" id="task${r.Id}" value=${r.Tareas}></td>
            <td><input type="text" id="user${r.Id}" value=${r.Users}></td> 
            <td><input type="range" id="prior${r.Id}"min="1" max="10" value=${r.Prioridad}></td>
            <td><input type="checkbox" checked=${r.Cumplida} id="cump${r.Id}"</td>
            <td><button onclick="actualizar(${r.Id})">ACT</button></td>
            </tr>`;
        }else{
            tb.innerHTML += `<tr>
            <td><input type="text" id="task${r.Id}" value=${r.Tareas}></td>
            <td><input type="text" id="user${r.Id}" value=${r.Users}></td> 
            <td><input type="range" id="prior${r.Id}"min="1" max="10" value=${r.Prioridad}></td>
            <td><input type="checkbox" id="cump${r.Id}"</td>
            </tr>`;
        }
    }
}