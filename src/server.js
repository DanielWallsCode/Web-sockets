require('dotenv').config()

const express = require('express')
const rutas = require('./routes/index')
const path = require('path')
const port = 8080 //lee del archivo .env


const app = express()


const Contenedor = require('./controllers/contenedor')
const Mensajes = require('./controllers/mensajes')


app.use(express.static(path.join(__dirname,'../public')))


app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.use('/', rutas)

app.use((error, req, res, next)=>{    
    console.log(error.statusMessage)
    res.status(500).send(error.message)
})

const { Server: IOServer } = require('socket.io')
const expressServer=app.listen(port, (err) =>{
    console.log(`Servidor escuchando puerto ${port}`)
    if (err){
        console.log(`Hubo un error al iniciar el servidor: ${err}`)
    }else{
        console.log(`Servidor iniciado, escuchando en puerto: ${port}`)
    }
})

const io = new IOServer(expressServer)

io.on('connection', socket =>{
    console.log(`Se conectó un cliente con id: ${socket.id}`)
    const contenedor = new Contenedor(path.join(__dirname, './txtPersist/productos.txt'));
    contenedor.getAll().then(listProductos =>{
        socket.emit('server:ListProducts', listProductos)
    })
    
    socket.on('client:addProduct', productInfo => {
        contenedor.add(productInfo).then( ()=>{
            contenedor.getAll().then(listProductos =>{
                io.emit('server:ListProducts', listProductos)
            })
        })
    })

    const mensajes = new Mensajes(path.join(__dirname, './txtPersist/mensajes.txt'));
    mensajes.getAll().then(messagesArray =>{
        socket.emit('server:renderMessages', messagesArray)
    })
    socket.on('client:addMessage', messageInfo => {
        mensajes.add(messageInfo).then( ()=>{
            mensajes.getAll().then(messagesArray =>{
                io.emit('server:renderMessages', messagesArray)
            })
        })
    })
})

