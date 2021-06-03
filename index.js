const express = require('express')
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser')
const puerto = 8080;
const ruta = "./productos.txt";
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

let productos = []

app.get('/api/productos/listar', (req, res) => {

    async function read(ruta) {
        try {
            const archivo = await fs.promises.readFile(ruta);
            res.send(JSON.parse(archivo));
        } catch (err) {
            res.send("No se encontraron productos");
        }
    }
    read(ruta);

});

app.post('/api/productos/guardar', (req, res) => {
    let { nombre, precio, thumbnail} = req.body
    let id = productos.length + 1;
    let producto = {
        id,
        nombre,
        precio,
        thumbnail
       
    }
    
    productos.push(producto)
    let data = JSON.stringify(productos,null,2);
    fs.writeFileSync(ruta, data, 'utf-8')
    
    res.send(producto)
})

app.get('/api/productos/listar/:id', (req,res) =>{
    const id = req.params.id
    const producto = productos.find(producto => producto.id == id)
    if (!producto){
        res.json({'error': 'Producto no encontrado'})
    }
    res.json(producto)
})
app.listen(puerto, ()=>{
    console.log(`El servidor esta escuchando en puerto ${puerto}`)
})