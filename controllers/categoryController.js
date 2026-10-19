const db = require("../models/queries");

const CATEGORY_COLORS = {
    "miscellaneous": { h: 220, s: 8 },       // neutral gray
    "weapons": { h: 20, s: 65 },             // rust orange
    "armor": { h: 215, s: 12 },              // silver (low saturation)
    "potions": { h: 355, s: 70 },            // red
    "scrolls": { h: 40, s: 50 },             // parchment
    "wands & staffs": { h: 275, s: 55 },     // arcane purple
    "rings": { h: 45, s: 75 },               // gold
    "wondrous items": { h: 175, s: 60 },     // teal, magical
    "adventuring gear": { h: 130, s: 40 },   // forest green
    "tools": { h: 28, s: 35 },               // brown
};

function hashHue(name) {
    let hash = 0;
    for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) % 360;
    return hash;
}

function getCategoryColor(name) {
    return CATEGORY_COLORS[name.toLowerCase()] || { h: hashHue(name), s: 45 };
}

async function getCategories(req, res) {
    const categories = (await db.getCategoriesAndCount()).map((category) => ({
        ...category,
        color: getCategoryColor(category.name),
    }));

    res.render("categories", { categories });
}

module.exports = {
    getCategories,
};