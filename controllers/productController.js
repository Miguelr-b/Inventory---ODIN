const db = require("../models/queries");
const { body, validationResult } = require("express-validator");

const RARITIES = ["Common", "Uncommon", "Rare", "Very Rare", "Legendary", "Artifact"];
const COINS = ["Copper (cp)", "Silver (sp)", "Electrum (ep)", "Gold (gp)", "Platinum (pp)"];
const DEFAULT_PRODUCT_LIMIT = 21;

const validateProduct = [
    body("name").trim().notEmpty().withMessage("Name is required."),
    body("code").trim().notEmpty().withMessage("Code is required."),
    body("coin").isIn(COINS).withMessage("Invalid coin."),
    body("rarity").isIn(RARITIES).withMessage("Invalid rarity."),
    body("price").isInt({ min: 0 }).withMessage("Price must be a whole number (0 or more)."),
    body("stock_size").isInt({ min: 0 }).withMessage("Stock size must be a whole number (0 or more)."),
    body("category_id").isInt({ min: 1 }).withMessage("Invalid category."),
];

function isDefaultProduct(id) {
    return Number(id) < DEFAULT_PRODUCT_LIMIT;
}

function getErrors(req) {
    return validationResult(req).array().map((e) => e.msg);
}

function isValidId(id) {
    return /^\d+$/.test(id) && Number(id) > 0 && Number(id) <= 2147483647;
}

async function getProducts(req, res, next) {
    const search = req.query.search;

    try {
        const listedCategories = await db.getAllCategories();
        const filters = req.query;

        if (!search) {
            const products = await db.filterProducts(req.query);

            return res.render("products", {products, listedCategories, filters});
        } else {
            const products = await db.getSearch(search);

            return res.render("products", {products, listedCategories, filters});
        }        
    }
    catch (err) {
        next(err);
    }

}

async function getAddProducts(req, res) {
    const listedCategories = await db.getAllCategories();

    res.render("addProduct", { listedCategories, product: {}, errors: [] });
}

async function postAddProducts(req, res) {
    const errors = getErrors(req);

    if (errors.length > 0) {
        const listedCategories = await db.getAllCategories();
        return res.status(400).render("addProduct", {
            listedCategories,
            product: req.body,
            errors,
        });
    }

    await db.addProduct (req.body);
    res.redirect("/products");
}

async function editProducts(req, res) {
    const id = req.params.id;
    
    if (Number(id) < DEFAULT_PRODUCT_LIMIT) {
        return res.status(403).send("Default products cannot be edited.");
    }
    if (!isValidId(id)) {return res.status(404).send("Page Not Found!");}

    const product = await db.getProductById(id);
    if (!product) {return res.status(404).send("Page Not Found!");}

    const listedCategories = await db.getAllCategories();


    res.render("editProduct", {
        product: product,
        listedCategories,
        category_name: product.category_name,
        errors: [],
    });
}

async function updateProducts(req, res) {
    const id = req.params.id
    if (!isValidId(id)) {return res.status(404).send("Page Not Found!");}

    const errors = getErrors(req);

    if (errors.length > 0) {
        const listedCategories = await db.getAllCategories();
        const category = listedCategories.find((c) => c.id === Number(req.body.category_id));

        return res.status(400).render("editProduct", {
            product: { ...req.body, id },
            listedCategories,
            category_name: category ? category.name : "",
            errors,
        });
    }


    await db.updateProduct(id, req.body);  
    res.redirect(`/products/${id}`);
}

async function deleteProducts(req, res) {
    const id = req.params.id;
    if (!isValidId(id)) {return res.status(404).send("Page Not Found!");}

    if (isDefaultProduct(id)) {return res.status(403).send("Default products cannot be deleted.");}

    await db.deleteProduct(req.params.id);  
    res.redirect("/products");
}

async function getDetailProducts(req, res) {
    const id =req.params.id;
    if (!isValidId(id)) {return res.status(404).send("Page Not Found!");}

    const product = await db.getProductById(id);
    if (!product) {return res.status(404).send("Page Not Found!");}

        res.render("detailProduct", { product, isDefault: isDefaultProduct(product.id) })
}



module.exports = {
  getProducts,
  getAddProducts,
  postAddProducts,
  editProducts,
  updateProducts,
  deleteProducts,
  getDetailProducts,
  validateProduct,
};