const pool = require("./pool");


// GET ALL
async function getAllCategories() {
  const { rows } = await pool.query("SELECT * FROM category ORDER BY name");
  return rows;
}


// ADD
async function addProduct(product) {
  await pool.query(`INSERT INTO products (name, description, code, price, coin, rarity, image_url, stock_size, category_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`, 
    [ product.name,
      product.description, 
      product.code,
      product.price, 
      product.coin,
      product.rarity, 
      product.image_url,
      product.stock_size, 
      product.category_id, 
    ]);
}

async function addCategory(category) {
  await pool.query("INSERT INTO category (name) VALUES ($1)", 
    [ category.name, ]);
}


// UPDATE
async function updateProduct(id, product) {

  const { rowCount } = await pool.query(
    `UPDATE products
     SET name = $1,
         description = $2,
         code = $3,
         price = $4,
         coin = $5,
         rarity = $6,
         image_url = $7,
         stock_size = $8,
         category_id = $9
     WHERE id = $10`,
    [
      product.name,
      product.description,
      product.code,
      product.price,
      product.coin,
      product.rarity,
      product.image_url,
      product.stock_size,
      product.category_id,
      id,
    ]
  );

  if (rowCount === 0) {
    throw new Error("Product not Found.");
  }
}

async function updateCategory(category) {
  const { rowCount } = await pool.query(
    "UPDATE category SET name = $1 WHERE id = $2",
    [category.name, category.id]
  );

  if (rowCount === 0) {
    throw new Error("Category not Found.");
  }
}


// DELETE
async function deleteProduct(productId) {
  const { rowCount } = await pool.query(
    "DELETE FROM products WHERE id = $1",
    [productId]
  );

  if (rowCount === 0) {
    throw new Error("Product not Found.");
  }
}

const DEFAULT_CATEGORY_ID = 1;
async function deleteCategory(categoryId) {
  if (Number(categoryId) === DEFAULT_CATEGORY_ID) {
    throw new Error("The default category cannot be deleted.");
  }

  await pool.query(
    "UPDATE products SET category_id = $1 WHERE category_id = $2",
    [DEFAULT_CATEGORY_ID, categoryId]
  );

  const { rowCount } = await pool.query(
    "DELETE FROM category WHERE id = $1",
    [categoryId]
  );

  if (rowCount === 0) {
    throw new Error("Category not Found.");
  }

}


// SEARCH AND FILTER
async function getSearch(productName) {
  const search = `%${productName}%`;
  const { rows } = await pool.query(`SELECT p.*, c.name AS category_name  FROM products p  JOIN category c ON p.category_id = c.id WHERE p.name ILIKE ($1)`, [search]);
  return rows;
}

const SORT_COLUMNS = {
  name: "p.name",
  price: "p.price",
  rarity: `CASE p.rarity
    WHEN 'Common' THEN 1
    WHEN 'Uncommon' THEN 2
    WHEN 'Rare' THEN 3
    WHEN 'Very Rare' THEN 4
    WHEN 'Legendary' THEN 5
    WHEN 'Artifact' THEN 6
    ELSE 99
  END`,
};

async function filterProducts({ category, sort, order } = {}) {
  const conditions = [];
  const values = [];

  const categories = [].concat(category || []).filter(Boolean);
  if (categories.length > 0) {
    values.push(categories);
    conditions.push(`c.name = ANY($${values.length})`);
  }

  let sql = `SELECT p.*, c.name AS category_name
             FROM products p
             JOIN category c ON p.category_id = c.id`;

  if (conditions.length > 0) {
    sql += ` WHERE ${conditions.join(" AND ")}`;
  }

  const sortColumn = Object.hasOwn(SORT_COLUMNS, sort)
    ? SORT_COLUMNS[sort]
    : SORT_COLUMNS.name;
  const direction = String(order).toUpperCase() === "DESC" ? "DESC" : "ASC";

  sql += ` ORDER BY ${sortColumn} ${direction}, p.id`;

  const { rows } = await pool.query(sql, values);
  return rows;
}

async function getProductById(id) {
    const { rows } = await pool.query( 
      `SELECT p.*, c.name AS category_name FROM products p JOIN category c ON p.category_id = c.id WHERE p.id = $1`,[id]
    );

    
    return rows[0];
}

module.exports = {
  addProduct,
  updateProduct,
  deleteProduct,
  
  getAllCategories,
  addCategory,
  updateCategory,
  deleteCategory,

  getSearch,
  filterProducts,

  getProductById,
};