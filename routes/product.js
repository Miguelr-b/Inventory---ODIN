const { Router } = require('express');
const productController = require('../controllers/productController');
const productRouter = Router();

productRouter.get('/', productController.getProducts);
productRouter.get('/search', productController.getProducts);


productRouter.get('/new', productController.getAddProducts);
productRouter.post('/new',  productController.validateProduct, productController.postAddProducts);


productRouter.get('/edit/:id', productController.editProducts);
productRouter.post('/edit/:id',  productController.validateProduct, productController.updateProducts);
productRouter.post('/delete/:id', productController.deleteProducts);

productRouter.get('/:id', productController.getDetailProducts);

module.exports = productRouter;
