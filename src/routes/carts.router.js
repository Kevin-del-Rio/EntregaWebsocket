import {Router} from 'express';
import cartManager from '../service/classCart.js'

const router = Router();
const cm = new cartManager();

// --------------------------------------------------
// AGREGAMOS UN CARRITO
router.post('/', async (req, res) => {
    let cart = req.body.products;
    try {
        await cm.addcart(cart)
        res.send(cart);
    }
    catch (e) {
        res.status(409).send({
            status: 'WRONG',
            code: 409,
            message: e.message,
            detail: e.detail
        }); 
    }
})

// --------------------------------------------------
// AGREGAMOS UN PRODUCTO AL UN CARRITO
router.post('/:cid/product/:pid', async (req, res) => {
  let cart_id = parseInt(req.params.cid); 
  let product_id = parseInt(req.params.pid);
  try {
      if(cart_id === undefined || product_id === undefined) {
          throw {
              code: 400,
              message: 'Error al agregar al carrito',
              detail: `Detalle del error: faltan alguno de los parámetros cid o pid`
          }
      }
      let result = await cm.addProductCart(cart_id, product_id);
      res.status(200).send(result)
  } 
  catch(e) {
      res.status(e.code).send({
          status: 'WRONG',
          code: e.code,
          message: e.message,
          detail: e.detail
      });
  }
})
// --------------------------------------------------
// MOSTRAMOS LOS PRODUCTOS DE UN CARRITO SELECCIONADO
router.get('/:cid', async (req, res) => {
  try {
      let id = parseInt(req.params.cid);
      let cart = await cm.getCartById(id);
      res.send(cart);
  }
  catch(e) {
      res.status(e.code? e.code : 500).send({
          status: 'WRONG',
          code: e.code,
          message: e.message,
          detail: e.detail
      }); 
  }
})

// BORRRAMOS UN CARRITO
router.delete('/:cid', async (req, res) => {
  try {
      let id = parseInt(req.params.cid);
      let cart = await cm.deleteCart(id);
      res.status(200).send({
          status: 'OK',
          message: "Carrito eliminado correctamente",
          data: {id: id, cart: cart}
      })
  }
  catch(e) {
      res.status(e.code? e.code : 500).send({
          status: 'WRONG',
          code: e.code,
          message: e.message,
          detail: e.detail
      }); 
  }
})

export default router;
