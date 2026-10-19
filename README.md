# RPG Inventory

A small web app to browse and manage an inventory of tabletop RPG items (Dungeons & Dragons style). Built as a learning project for The Odin Project with Node.js, Express and PostgreSQL.

## Features

- List products as cards with image, name, price, coin, rarity, stock and category
- Filter by one or more categories
- Sort by name, price or rarity, ascending or descending
- Search products by name
- Product detail page
- Create, edit and delete products, with server-side validation
- Inventory limit of 100 products, with a counter and a warning when it is reached
- Categories page with one card per category, linking to the filtered product list
- Light and dark theme, following the system setting by default, with a manual toggle
- Responsive layout

## Live view (Railway)

- Access [Live view](https://inventory-odin-production.up.railway.app/products)

## Tech stack

- Node.js and Express 5
- PostgreSQL, using the `pg` package
- EJS for templates
- Plain CSS and a little vanilla JavaScript

## Getting started

### Requirements

- Node.js
- PostgreSQL

### Installation

```bash
git clone <your-repository-url>
cd <project-folder>
npm install
```

### Configuration

Create a `.env` file in the project root with the database connection string and, optionally, the port. Change according to your credentialsge :

```
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/DATABASE_NAME
PORT=3000
```

If `PORT` is not set, the app runs on port 3000. Special characters in the password must be URL-encoded.

### Database

Create two tables, `category` and `products`:

```sql
CREATE TABLE category (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name varchar(255) NOT NULL UNIQUE
);

CREATE TABLE products (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name varchar(255) NOT NULL,
    description text,
    code varchar(255) NOT NULL,
    price numeric(10,0) NOT NULL,
    coin varchar(100) NOT NULL,
    rarity varchar(255) NOT NULL,
    image_url varchar(1000),
    stock_size integer NOT NULL,
    category_id integer NOT NULL REFERENCES category (id)
);
```

Then insert the categories. The first one must be the default category (id 1), which receives the products of a deleted category:

```sql
INSERT INTO category (name) VALUES
    ('Miscellaneous'),
    ('Weapons'),
    ('Armor'),
    ('Potions'),
    ('Scrolls'),
    ('Wands & Staffs'),
    ('Rings'),
    ('Wondrous Items'),
    ('Adventuring Gear'),
    ('Tools');
```

### Run

```bash
npm start
```

Open `http://localhost:3000`.

## Limits

- The inventory holds at most 100 products, because of the deployment oon the railway. When the limit is reached, the new product button is disabled and the form shows a warning. The check also runs on the server when the form is submitted.
- Products below the id set by `DEFAULT_PRODUCT_LIMIT` in `productController.js` are treated as default and cannot be deleted. They can still be edited.

## Notes

- Categories are managed directly in the database. There is no page to create, rename or delete them.
- Product images are external URLs. If a site removes or blocks an image, the card shows a placeholder.
- There is no authentication, so anyone with access to the app can create, edit and delete products. Do not deploy it publicly as is.
- Valid rarities and coins are defined in `productController.js` and in the forms, and both places must match.

## Disclaimer

This is a personal learning project. Dungeons & Dragons is a trademark of Wizards of the Coast, and this project is not affiliated with or endorsed by them.