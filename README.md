# RPG Inventory

A small web app to browse and manage an inventory of tabletop RPG items (Dungeons & Dragons style). Built as a learning project of The Odin Project.

## Features

- List products as cards with image, name, price, coin, rarity, stock and category
- Filter by one or more categories
- Sort by name, price or rarity, ascending or descending
- Search products by name
- Product detail page
- Create, edit and delete products, with server-side validation
- Categories page with one card per category, linking to the filtered product list
- Light and dark theme, following the system setting by default, with a manual toggle
- Responsive layout

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

Create a `.env` file in the project root with the database connection settings read by `models/pool.js`.

```
DATABASE_USER= user
DATABASE_PASSWORD= password
DATABASE_DATABASE= database
DATABASE_URL= url
```

If `PORT` is not set, the app runs on port 3000.

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
    description character varying(255),
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
node app.js
```

Open `http://localhost:3000`.


## Notes

- Products below the id set by `DEFAULT_PRODUCT_LIMIT` in `productController.js` are treated as default and cannot be deleted. They can still be edited.
- Categories are managed directly in the database. There is no page to create, rename or delete them.
- Product images are external URLs. If a site removes or blocks an image, the card shows a placeholder.
- There is no authentication, so anyone with access to the app can create, edit and delete products. Do not deploy it publicly as is.
- Valid rarities and coins are defined in `productController.js` and in the forms, and both places must match.

## Disclaimer

This is a personal learning project. Dungeons & Dragons is a trademark of Wizards of the Coast, and this project is not affiliated with or endorsed by them.