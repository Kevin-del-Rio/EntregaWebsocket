import { Router } from 'express';
import ProductManager from '../service/classProduct.js';
import { io } from "../app.js";

const router = Router();
const pm = new ProductManager();


// MOSTAR TODOS LOS PRODUCTOS
router.get('/', async (req, res) => {
    try {    
        let products = await pm.getProduct()       
        res.status(200).send(products);
    }
    catch (e) {
        res.status(404).send({
            status: 'WRONG',
            code: 409,
            message: e.message,
            detail: e.detail
        });
    }
})
router.get('/query', async(req, res) => {
    try {    
        let products = await pm.getProduct() 
        let limit = req.query.limit;
        if (limit > 0) {
            let prod = products.slice(1, limit)
            res.send(JSON.stringify(prod));
        } else {
            res.send(JSON.stringify(products))
        }
    }
    catch (e) {
        res.status(404).send({
            status: 'WRONG',
            code: 409,
            message: e.message,
            detail: e.detail
        });
    }
});

// MOSTRAR UN PRODUCTO
router.get('/:pid', async (req, res) => {
    try {        
        let id = await parseInt(req.params.pid);
        let product = await pm.getProductById(id)
        console.log(product)
        res.status(200).send(product);
    }
    catch (e) {
        res.status(404).send({
            status: 'WRONG',
            code: e.code,
            message: e.message,
            detail: e.detail
        });
    }
})
// // AGREGAR UN PRODUCTO
router.post("/", async (req, res) => {
    try {
      const product = req.body;
      const response = await pm.addProduct(product);
      if (response.error)
        return res
          .status(400)
          .send({ status: "error", message: response.error.message });
  
      const products = await pm.getProduct();
      io.emit("realTimeProducts", products);
  
      res.send({ status: "success", message: "Product added" });
    } catch (error) {
      console.log(error);
    }
  });
// // ACTUALIZAR UN PRODUCTO
router.put('/:id', async (req, res) => {
    let id = parseInt(req.params.id)
    let updateProd = req.body;
    try {
        await pm.updateProductById(id, updateProd)
        res.status(200).send({
            status: 'OK',
            message: "Producto actualizado correctamente",
            data: updateProd
        })
    }
    catch (e) {
        res.status(200).send({
            message: "Producto actualizado correctamente",
            data: updateProd
        })
    }
})
// // BORRAR UN PRODUCTO
router.delete('/:id', async (req, res) => {
    let id = req.params.id;
    try {
        id = parseInt(id)
      const response = await pm.deleteProduct(id);
      if (response.status === "success") {
        const products = await pm.getProduct();
        console.log("hola perro")
        io.emit("realTimeProducts", products);
        return res.send({ status: "success", message: "Product delete" });
      }
      res.status(404).send({
        status: "error",
        message: response.error,
      });
    }
    catch (e) {
        res.status(409).send({
            status: 'WRONG',
            message: e.message,
            detail: e.detail,
            data: { id: id }
        })
    }

})

export default router;
