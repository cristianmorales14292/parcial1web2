import express from 'express';
import { read, write } from '../src/utils/files.js'
import dayjs from 'dayjs';

export const motosFileRouter = express.Router();



// Middleware para agregar IP y timestamps
const addMetadata = (req, res, next) => {
  const fechayHora = dayjs().format('HH:mm DD-MM-YYYY');
  const ip = req.ip || req.connection.remoteAddress;

  if (req.method === 'POST') {
    req.body.created_at = fechayHora;
  } else if (req.method === 'PUT') {
    req.body.updated_at = fechayHora;
  }
  req.body.ip = ip; 
  next();
};





//obtener motos
motosFileRouter.get("/", (req, res) => {
    const motos = read();  
    let { atributo, valor, limit } = req.query; 
    
    let filteredMotos = motos;

    if (atributo && valor) {
        filteredMotos = motos.filter(moto => moto[atributo] === valor);
    }

    if (limit) {
        limit = parseInt(limit); 
        filteredMotos = filteredMotos.slice(0, limit);
    }

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(filteredMotos));
});




//obtener moto por id
motosFileRouter.get('/:id', (req, res) => {
    const motos = read();
    const moto = motos.find(moto => moto.id === parseInt(req.params.id));
    if(moto){
        res.json(moto);
    }else{
        res.status(404).end();
    }
})

//agregar moto
motosFileRouter.post('/', 
    (req, res, next) => {
        console.log('Middleware POST');
        next();
    },
    (req, res) => {
    const motos = read();
    //Añadir ID a los datos recibidos
    const moto = {
        ...req.body, //Spread operator
        id: tasks.length + 1
    }
    motos.push(moto);
    write(motos);
    //Código HTTP 201 Created
    res.status(201).json(motos);
})



//actualizar moto modificado punto 1 
motosFileRouter.put('/:id', addMetadata, (req, res) => {
    const motos = read();
    let moto = motos.find(moto => moto.id === parseInt(req.params.id));
    
    if (moto) {
        moto = {
            ...moto,
            ...req.body
        };
        motos[motos.findIndex(moto => moto.id === parseInt(req.params.id))] = moto;
        write(motos);
        res.json(moto);
    } else {
        res.status(404).end();
    }
});


//actualizar todos los registros de motos
motosFileRouter.put('/actualizartodo', (req, res) => {
    let motos = read();  
    const { atributo, valor } = req.body;
  
    const fechayHora = dayjs().format('HH:mm DD-MM-YYYY');

    if (!atributo || valor === undefined) {
        return res.status(400).json({ error: 'Debe proporcionar un campo y un valor para actualizar' });
    }

    motos = motos.map(moto => {
        return {
            ...moto,
            [atributo]: valor,  
            updated_at: fechayHora 
        };
    });

    write(motos);

    res.json(motos);
});




//eliminar motos
motosFileRouter.delete('/:id', (req, res) =>{
    const motos = read();
        const moto = motos.find(task => moto.id ===parseInt(req.params.id));
        if (task) {
        motos.splice(
            motos.findIndex(moto => moto.id === parseInt(req.params.id)),
            1
        );
        write(motos);
        res.json(moto);
        } else {
            res.status(404).end();
        }
    })



//punto 4 metodo archivo access_log.txt

    function logRequests(req, res, next) {
    const date = dayjs().format('DD-MM-YYYY HH:mm:ss');
    const method = req.method;
    const path = req.originalUrl;
    const headers = JSON.stringify(req.headers);
    const logLine = `${date} [${method}] [${path}] [${headers}]\n`;

    fs.appendFileSync('access_log.txt', logLine, (err) => {
        if (err) {
            console.error('Error al escribir en el archivo de log:', err);
        }
    });
    next();
}
    