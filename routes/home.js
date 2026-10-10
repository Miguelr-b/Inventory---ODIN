const express = require("express");
const router = express.Router();

router.route("/").get((req, res) => {
  res.render("home", { products: "/products", categories: "categories" });
});

module.exports = router;