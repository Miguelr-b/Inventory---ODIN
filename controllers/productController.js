const db = require("../models/queries");

async function getProducts(req, res, next) {
    const search = req.query.search;

    try {
        if (!search) {
            const products = await db.filterProducts(req.query);

            console.log("Products: ", products);
            return res.render("products", {products});
        } else {
            const products = await db.getSearch(search);

            console.log("Products: ", products);
            return res.render("detailProduct", {products});
        }        
    }
    catch (err) {
        next(err);
    }

}

async function getAddProducts(req, res) {
    const listedCategories = await db.getAllCategories();

    res.render("addProduct", { listedCategories });
}

async function postAddProducts(req, res) {
    
    //Validar dados

    await db.addProduct (req.body);
    res.redirect("/addProduct");
}

async function editProducts(req, res) {
    const id = req.params.id;
    const product = await db.getProductById(id);
    if (!product) {return res.status(404).send("Page Not Found!");}

    const listedCategories = await db.getAllCategories();
    const selectedCategory = product.category_name;


    res.render("editProduct", {
        product: product,
        listedCategories,
        selectedCategory,
    });
}

async function updateProducts(req, res) {
    const id = req.params.id

    // Validar os dados 

    await db.updateProduct(id, req.body);  
    res.redirect(`/detailProduct/${id}`);
}

async function deleteProducts(req, res) {
  await db.deleteProduct(req.params.id);  
  res.redirect("/products");
}

async function getDetailProducts(req, res) {
    const id =req.params.id;

    const products = await db.getProductById(id);
    if (!products) {return res.status(404).send("Page Not Found!");}

    return res.render(`/detailProduct/${id}`, {products});
}



module.exports = {
  getProducts,
  getAddProducts,
  postAddProducts,
  editProducts,
  updateProducts,
  deleteProducts,
  getDetailProducts,
};