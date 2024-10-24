import fs from 'fs';

const FILENAME = 'motos.json';

function read() {
    return JSON.parse(fs.readFileSync(FILENAME));
}

function write(data){
    fs.writeFileSync(FILENAME, JSON.stringify(data));
}

export {
    read,
    write
}