const db = require("../models/queries");

async function getProducts(req, res) {
    const search = req.query.search;

    if (!search) {
        const products = await db.filterProducts(req.query.category, req.query.sort, req.query.order);

        console.log("Products: ", products);
        return res.render("products", {products});
    } else {
        const products = await db.getSearch(req.query.name);

        console.log("Products: ", products);
        res.render("detailProduct", {products});
    }
}

async function addProducts(req, res) {
    const listedCategories = await db.getAllCategories();

    res.render("addProduct", { listedCategories });
}

async function postProducts(req, res) {
  await db.addProduct (req.body);
  res.redirect("/addProduct");
}

async function editProducts(req, res) {
    const id = req.params.id;
    const products = await db.search(id);      // wrong
    const listedCategories = await db.getAllCategories();
    const selectedCategory = getCategoryNameById(products.category_id);

    res.render("editProduct", {
        product: products,
        listedCategories,
        selectedCategory,
    });
}

async function updateProducts(req, res) {
    await db.updateProduct(req.body.id, req.body);    // req.body.id?
  
    res.redirect(`/detailProduct/${id}`);
}

async function deleteProducts(req, res) {
  await db.deleteProduct(req.body.id);    // or req.params.id;?
  res.redirect("/products");
}





module.exports = {

  getCategories,
  postCategories,
  updateCategories,
  deleteCategories,
};