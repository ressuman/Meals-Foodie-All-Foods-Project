To convert your `lib/meals/meals.js` file to use MySQL with PlanetScale, we'll replace the SQLite database with a MySQL client, such as `mysql2`, and update the queries accordingly. You will need to:

1. **Install MySQL client dependencies**:
   ```bash
   npm install mysql2
   ```

2. **Update database interaction**: Use `mysql2` for executing SQL queries.

Here's the updated code:

```javascript
import { S3 } from "@aws-sdk/client-s3";
import mysql from "mysql2/promise"; // Using mysql2 for async queries
import slugify from "slugify";
import xss from "xss";

// Initialize S3
const s3 = new S3({
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_CREDENTIALS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_CREDENTIALS_SECRET_ACCESS_KEY,
  },
});

s3.listBuckets((err, data) => {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Success", data.Buckets);
  }
});

// Initialize MySQL database connection pool
const pool = mysql.createPool({
  host: process.env.PLANETSCALE_HOST,
  user: process.env.PLANETSCALE_USERNAME,
  password: process.env.PLANETSCALE_PASSWORD,
  database: process.env.PLANETSCALE_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Fetch all meals from the MySQL database
export async function getMeals() {
  // Optional delay to simulate load time
  await new Promise((resolve) => setTimeout(resolve, 5000));

  try {
    const [rows] = await pool.query("SELECT * FROM meals");
    return rows;
  } catch (error) {
    console.error("Error fetching meals:", error);
    throw new Error("Failed to fetch meals.");
  }
}

// Fetch a single meal by slug from the MySQL database
export async function getMeal(slug) {
  await new Promise((resolve) => setTimeout(resolve, 5000));

  try {
    const [rows] = await pool.query("SELECT * FROM meals WHERE slug = ?", [slug]);

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  } catch (error) {
    console.error(`Error fetching meal with slug ${slug}:`, error);
    return null;
  }
}

// Save a new meal to the MySQL database and upload the image to S3
export async function saveMeal(meal) {
  // Generate the slug from the meal title
  meal.slug = slugify(meal.title, {
    lower: true,
  });

  // Sanitize the instructions to avoid XSS attacks
  meal.instructions = xss(meal.instructions);

  // Prepare image for S3 upload
  const extension = meal.image.name.split('.').pop();
  const fileName = `${meal.slug}.${extension}`;
  const bufferedImage = await meal.image.arrayBuffer();

  // Upload image to S3
  try {
    await s3.putObject({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: Buffer.from(bufferedImage),
      ContentType: meal.image.type,
    });
    meal.image = fileName; // Store the image file name for database reference
  } catch (error) {
    console.error("Error uploading image to S3:", error);
    throw new Error("Failed to upload image.");
  }

  // Insert the meal data into the MySQL database
  try {
    await pool.query(
      `INSERT INTO meals (title, summary, instructions, creator, creator_email, image, slug)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [meal.title, meal.summary, meal.instructions, meal.creator, meal.creator_email, meal.image, meal.slug]
    );
  } catch (error) {
    console.error("Error saving meal to database:", error);
    throw new Error("Failed to save meal.");
  }
}
```

### Key Changes:
1. **MySQL Connection**:
   - Replaced SQLite with MySQL using the `mysql2/promise` module.
   - We use `pool.query()` to interact with the database.
   - Added MySQL connection pool configuration based on PlanetScale credentials (`PLANETSCALE_HOST`, `PLANETSCALE_USERNAME`, `PLANETSCALE_PASSWORD`, `PLANETSCALE_DATABASE`).

2. **Environment Variables**:
   You’ll need to add these to your `.env` file or Vercel environment variables:
   ```env
   PLANETSCALE_HOST=<your-planetscale-host>
   PLANETSCALE_USERNAME=<your-planetscale-username>
   PLANETSCALE_PASSWORD=<your-planetscale-password>
   PLANETSCALE_DATABASE=<your-planetscale-database>
   ```

3. **Database Queries**:
   - `getMeals()`: Fetches all meals using `SELECT * FROM meals`.
   - `getMeal(slug)`: Fetches a single meal by slug using `SELECT * FROM meals WHERE slug = ?`.
   - `saveMeal(meal)`: Inserts a new meal into the database using `INSERT INTO meals`.

### S3 Logic:
The S3 logic remains unchanged for handling image uploads, and the file names are generated using the slug and image extension.

This should now work with MySQL and PlanetScale.

To migrate from SQLite to MySQL using PlanetScale, you'll replace SQLite operations with MySQL queries. Here’s how you can convert your existing `lib/meals/meals.js` file to use MySQL via a PlanetScale database.

### Steps:
1. **Install the MySQL Client**:
   Install `mysql2` or `planetscale` as a MySQL client. For this example, I’ll use `mysql2`:
   ```bash
   npm install mysql2
   ```

2. **Connect to PlanetScale**:
   You'll need to set up a connection to PlanetScale using the MySQL client.

Here’s how the converted `lib/meals/meals.js` file should look:

```javascript
import { S3 } from "@aws-sdk/client-s3";
import mysql from "mysql2/promise"; // MySQL client
import slugify from "slugify";
import xss from "xss";

// Initialize S3 client for image uploads
const s3 = new S3({
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_CREDENTIALS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_CREDENTIALS_SECRET_ACCESS_KEY,
  },
});

s3.listBuckets((err, data) => {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Success", data.Buckets);
  }
});

// MySQL database connection
const dbConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
};

async function connectDB() {
  return await mysql.createConnection(dbConfig);
}

// Fetch all meals from MySQL (PlanetScale) database
export async function getMeals() {
  const connection = await connectDB();
  try {
    const [rows] = await connection.execute("SELECT * FROM meals");
    return rows;
  } catch (error) {
    throw new Error("Error fetching meals: " + error.message);
  } finally {
    await connection.end();
  }
}

// Fetch a single meal by its slug from MySQL (PlanetScale) database
export async function getMeal(slug) {
  const connection = await connectDB();
  try {
    const [rows] = await connection.execute("SELECT * FROM meals WHERE slug = ?", [slug]);
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    throw new Error("Error fetching meal: " + error.message);
  } finally {
    await connection.end();
  }
}

// Save a new meal to MySQL (PlanetScale) database
export async function saveMeal(meal) {
  meal.slug = slugify(meal.title, {
    lower: true,
  });
  meal.instructions = xss(meal.instructions);

  // Upload image to S3
  const extension = meal.image.name.split(".").pop();
  const fileName = `${meal.slug}.${extension}`;
  const bufferedImage = await meal.image.arrayBuffer();

  await s3.putObject({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: Buffer.from(bufferedImage),
    ContentType: meal.image.type,
  });

  meal.image = fileName;

  const connection = await connectDB();
  try {
    const query = `
      INSERT INTO meals
        (title, summary, instructions, creator, creator_email, image, slug)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      meal.title,
      meal.summary,
      meal.instructions,
      meal.creator,
      meal.creator_email,
      meal.image,
      meal.slug,
    ];

    await connection.execute(query, values);
  } catch (error) {
    throw new Error("Error saving meal: " + error.message);
  } finally {
    await connection.end();
  }
}
```

### Explanation of Changes:

1. **MySQL Client Setup (`mysql2`)**:
   - We're using `mysql2/promise` for promise-based queries to MySQL. PlanetScale uses MySQL under the hood, so this works well.
   - The `connectDB()` function creates and returns a new connection to the database using credentials from environment variables.

2. **Fetching Meals (`getMeals`)**:
   - The query `SELECT * FROM meals` fetches all the rows from the `meals` table.
   - `rows` will contain the list of meals retrieved from the database.

3. **Fetching a Single Meal (`getMeal`)**:
   - The query `SELECT * FROM meals WHERE slug = ?` retrieves a single meal by its slug. The slug is passed as a parameter to prevent SQL injection.
   - We use `rows[0]` to get the first meal in the result set.

4. **Saving a Meal (`saveMeal`)**:
   - The slug is generated using `slugify`, and instructions are sanitized using `xss`.
   - The image is uploaded to S3, and the file name is stored in the database.
   - The query `INSERT INTO meals` adds a new meal to the `meals` table, using placeholders for values to prevent SQL injection.

### Required Environment Variables:
Update your `.env` file or Vercel environment settings to include these:

```bash
MYSQL_HOST=your-planetscale-host
MYSQL_USER=your-database-username
MYSQL_PASSWORD=your-database-password
MYSQL_DATABASE=your-database-name

AWS_CREDENTIALS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_CREDENTIALS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_BUCKET_NAME=your-s3-bucket-name
```

### MySQL Schema for PlanetScale:
To create the `meals` table in your PlanetScale database, run the following SQL:

```sql
CREATE TABLE meals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  summary TEXT,
  instructions TEXT,
  creator VARCHAR(255),
  creator_email VARCHAR(255),
  image VARCHAR(255),
  slug VARCHAR(255) UNIQUE NOT NULL
);
```

### Testing:
1. **Test Locally**: Test fetching, saving, and uploading images to ensure everything works.
2. **Deploy**: When you deploy to Vercel, ensure your PlanetScale and AWS S3 credentials are set in the environment.

This should give you a fully working solution with MySQL on PlanetScale! Let me know if you encounter any issues.

To convert your `meals.js` file from SQLite to MySQL using PlanetScale, we will update the database queries and setup to use `mysql2` (a MySQL client) and adapt the structure for MySQL.

### Key Changes:
1. Replace SQLite database interaction with MySQL queries using `mysql2/promise` package for asynchronous database operations.
2. Connect to PlanetScale using the MySQL connection details.
3. Adjust the SQL query syntax to be MySQL-compatible.
4. Keep S3 functionality unchanged.

Here’s the updated code:

```js
import { S3 } from "@aws-sdk/client-s3";
import mysql from "mysql2/promise";
import slugify from "slugify";
import xss from "xss";

// PlanetScale MySQL connection setup
const connection = await mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  ssl: {
    rejectUnauthorized: true,
  },
});

// AWS S3 setup
const s3 = new S3({
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_CREDENTIALS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_CREDENTIALS_SECRET_ACCESS_KEY,
  },
});

s3.listBuckets((err, data) => {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Success", data.Buckets);
  }
});

// Function to fetch all meals
export async function getMeals() {
  await new Promise((resolve) => setTimeout(resolve, 5000));

  try {
    const [rows] = await connection.execute('SELECT * FROM meals');
    return rows;
  } catch (error) {
    console.error('Error fetching meals:', error);
    return [];
  }
}

// Function to fetch a meal by its slug
export async function getMeal(slug) {
  await new Promise((resolve) => setTimeout(resolve, 5000));

  try {
    const [rows] = await connection.execute('SELECT * FROM meals WHERE slug = ?', [slug]);
    return rows.length ? rows[0] : null;
  } catch (error) {
    console.error('Error fetching meal:', error);
    return null;
  }
}

// Function to save a new meal to the database
export async function saveMeal(meal) {
  meal.slug = slugify(meal.title, {
    lower: true,
  });
  meal.instructions = xss(meal.instructions);

  // Prepare the image upload to S3
  const extension = meal.image.name.split(".").pop();
  const fileName = `${meal.slug}.${extension}`;
  const bufferedImage = await meal.image.arrayBuffer();

  // Upload image to S3
  await s3.putObject({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: Buffer.from(bufferedImage),
    ContentType: meal.image.type,
  });

  meal.image = fileName;

  try {
    // Insert the meal data into MySQL (PlanetScale)
    await connection.execute(`
      INSERT INTO meals (title, summary, instructions, creator, creator_email, image, slug)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        meal.title,
        meal.summary,
        meal.instructions,
        meal.creator,
        meal.creator_email,
        meal.image,
        meal.slug
      ]
    );
    console.log("Meal saved successfully");
  } catch (error) {
    console.error('Error saving meal:', error);
  }
}
```

### Key Changes Explained:
1. **MySQL Connection**: We establish a connection to PlanetScale using `mysql2/promise` to support async operations. The connection credentials (host, user, password, database name) are stored in environment variables.

2. **Database Queries**:
   - **getMeals**: Fetches all rows from the `meals` table using `connection.execute()`.
   - **getMeal**: Fetches a meal by its `slug` using a prepared statement with placeholders (`?`).
   - **saveMeal**: Inserts a new meal into the `meals` table using a prepared SQL `INSERT` statement. The values are passed as an array in `connection.execute()`.

3. **S3 Interaction**: The logic for uploading images to AWS S3 remains unchanged.

### Make sure:
- You have the `meals` table properly set up in your PlanetScale MySQL database with fields like `title`, `summary`, `instructions`, `creator`, `creator_email`, `image`, and `slug`.
- Your `.env` file includes `DATABASE_HOST`, `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_NAME`, `AWS_CREDENTIALS_ACCESS_KEY_ID`, `AWS_CREDENTIALS_SECRET_ACCESS_KEY`, and `AWS_BUCKET_NAME`.

To convert your `lib/meals/meals.js` file to use MySQL with PlanetScale instead of SQLite, you'll need to make a few adjustments. Here’s how you can do it while maintaining the same functions and logic:

```javascript
import { S3 } from "@aws-sdk/client-s3";
import { connect } from "mysql2/promise"; // Use mysql2 for MySQL connection
import slugify from "slugify";
import xss from "xss";

const s3 = new S3({
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_CREDENTIALS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_CREDENTIALS_SECRET_ACCESS_KEY,
  },
});

// Connect to PlanetScale MySQL database
const db = await connect({
  host: process.env.PLANETSCALE_DB_HOST,
  user: process.env.PLANETSCALE_DB_USER,
  password: process.env.PLANETSCALE_DB_PASSWORD,
  database: process.env.PLANETSCALE_DB_NAME,
});

s3.listBuckets((err, data) => {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Success", data.Buckets);
  }
});

export async function getMeals() {
  await new Promise((resolve) => setTimeout(resolve, 5000));
  const [rows] = await db.execute("SELECT * FROM meals");
  return rows;
}

export async function getMeal(slug) {
  await new Promise((resolve) => setTimeout(resolve, 5000));
  const [rows] = await db.execute("SELECT * FROM meals WHERE slug = ?", [slug]);
  return rows[0];
}

export async function saveMeal(meal) {
  meal.slug = slugify(meal.title, {
    lower: true,
  });
  meal.instructions = xss(meal.instructions);

  const extension = meal.image.name.split(".").pop();
  const fileName = `${meal.slug}.${extension}`;
  const bufferedImage = await meal.image.arrayBuffer();

  await s3.putObject({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: Buffer.from(bufferedImage),
    ContentType: meal.image.type,
  });

  meal.image = fileName;

  await db.execute(
    `INSERT INTO meals (title, summary, instructions, creator, creator_email, image, slug)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [meal.title, meal.summary, meal.instructions, meal.creator, meal.creator_email, meal.image, meal.slug]
  );
}
```

### Key Changes:
1. **Database Connection**: Switched from `better-sqlite3` to `mysql2/promise` for connecting to PlanetScale.
2. **Query Execution**: Updated the syntax for executing queries to be compatible with MySQL.
3. **Environment Variables**: Make sure you have the necessary environment variables for connecting to your PlanetScale database.

This should maintain the same functionality as your original code while using MySQL on PlanetScale.