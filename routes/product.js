const { Router } = require('express');
const productController = require('../controllers/productController');
const productRouter = Router();

productRouter.get('/', productController.getProducts);
productRouter.get('/search', productController.getProducts);
productRouter.get('/:id', productController.getDetailProducts);

productRouter.get('/new', productController.getAddProducts);
productRouter.post('/new', productController.postAddProducts);


productRouter.get('/edit/:id', productController.editProducts);
productRouter.post('/edit/:id', productController.updateProducts);
productRouter.post('/delete/:id', productController.deleteProducts);

module.exports = productRouter;
