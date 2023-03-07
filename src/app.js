import express from "express";
import cartsRouter from './routes/carts.router.js'
import productRouter from './routes/products.router.js'
import __dirname from "./utils.js"
import handlebars from 'express-handlebars';
import viewsRouter from './routes/views.router.js'
import { Server } from "socket.io";

const app = express();
const server_port = 8080;

//configuracion para recibir objetos json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//uso de carpeta public
app.use(express.static(`${__dirname}/public`));

//uso de vistas de  plantillas 
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + "/views");
app.set('view engine', 'handlebars');

app.use('/api/products', productRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

const server = app.listen(server_port, () => console.log(`Conectado desde el puerto: ${server_port}`));

export const io = new Server(server);