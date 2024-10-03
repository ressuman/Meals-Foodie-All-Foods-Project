To convert your `lib/meals/meals.js` file to use PostgreSQL via Supabase, you'll need to:

1. **Install Supabase and `pg` dependencies**: Supabase provides a JavaScript client library to interact with PostgreSQL.
   ```bash
   npm install @supabase/supabase-js pg
   ```

2. **Update the database queries**: Replace the SQLite queries with Supabase's PostgreSQL client.

Here’s the converted code:

```javascript
import { S3 } from "@aws-sdk/client-s3";
import { createClient } from '@supabase/supabase-js';
import slugify from "slugify";
import xss from "xss";

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

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

// Fetch all meals from the PostgreSQL database
export async function getMeals() {
  // Optional delay to simulate load time
  await new Promise((resolve) => setTimeout(resolve, 5000));

  const { data, error } = await supabase
    .from('meals')
    .select('*');

  if (error) {
    console.error("Error fetching meals:", error);
    throw new Error("Failed to fetch meals.");
  }

  return data;
}

// Fetch a single meal by slug from the PostgreSQL database
export async function getMeal(slug) {
  await new Promise((resolve) => setTimeout(resolve, 5000));

  const { data, error } = await supabase
    .from('meals')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error(`Error fetching meal with slug ${slug}:`, error);
    return null;
  }

  return data;
}

// Save a new meal to the PostgreSQL database and upload the image to S3
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

  // Insert the meal data into the PostgreSQL database
  const { error } = await supabase
    .from('meals')
    .insert({
      title: meal.title,
      summary: meal.summary,
      instructions: meal.instructions,
      creator: meal.creator,
      creator_email: meal.creator_email,
      image: meal.image,
      slug: meal.slug,
    });

  if (error) {
    console.error("Error saving meal to database:", error);
    throw new Error("Failed to save meal.");
  }
}
```

### Key Changes:
1. **Supabase Client**: The `supabase` client is used to interact with your PostgreSQL database.
2. **Database Queries**:
   - `getMeals()` uses `.select('*')` to fetch all meals.
   - `getMeal(slug)` uses `.eq('slug', slug)` to fetch a meal by its slug.
   - `saveMeal(meal)` inserts the new meal into the `meals` table after sanitizing the instructions and uploading the image to S3.
3. **S3 Logic**: Remains the same for handling image uploads.

### Environment Variables:
You'll need to add the following environment variables to your Vercel project:
```env
SUPABASE_URL=<your-supabase-url>
SUPABASE_KEY=<your-supabase-key>
```

Now your app should work with Supabase and PostgreSQL in production.


To convert your existing SQLite-based `meals.js` logic into PostgreSQL with Supabase, you'll need to replace SQLite operations with Supabase client methods and make sure the logic remains consistent. Here's how you can adapt your code:

1. **Install the Supabase Client**:
   First, install the Supabase client if you haven't already:
   ```bash
   npm install @supabase/supabase-js
   ```

2. **Replace SQLite Queries with Supabase Queries**:
   Supabase provides an easy-to-use API to interact with PostgreSQL databases.

Here’s the updated `lib/meals/meals.js` file that uses Supabase with PostgreSQL, while maintaining the same structure and logic:

```javascript
import { S3 } from "@aws-sdk/client-s3";
import { createClient } from "@supabase/supabase-js";
import slugify from "slugify";
import xss from "xss";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

// Fetch all meals from the PostgreSQL (Supabase) database
export async function getMeals() {
  // Simulate a delay (optional)
  await new Promise((resolve) => setTimeout(resolve, 5000));

  const { data, error } = await supabase
    .from("meals")
    .select("*");

  if (error) {
    throw new Error("Error fetching meals: " + error.message);
  }

  return data;
}

// Fetch a single meal by its slug from the PostgreSQL (Supabase) database
export async function getMeal(slug) {
  // Simulate a delay (optional)
  await new Promise((resolve) => setTimeout(resolve, 5000));

  const { data, error } = await supabase
    .from("meals")
    .select("*")
    .eq("slug", slug)
    .single(); // Return a single meal

  if (error) {
    throw new Error("Error fetching meal: " + error.message);
  }

  return data;
}

// Save a new meal to the PostgreSQL (Supabase) database
export async function saveMeal(meal) {
  // Generate a slug from the meal title
  meal.slug = slugify(meal.title, {
    lower: true,
  });

  // Sanitize the instructions to prevent XSS attacks
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

  // Save the image file name to the meal object
  meal.image = fileName;

  // Insert the new meal into the PostgreSQL database via Supabase
  const { data, error } = await supabase
    .from("meals")
    .insert([
      {
        title: meal.title,
        summary: meal.summary,
        instructions: meal.instructions,
        creator: meal.creator,
        creator_email: meal.creator_email,
        image: meal.image,
        slug: meal.slug,
      },
    ]);

  if (error) {
    throw new Error("Error saving meal: " + error.message);
  }

  return data;
}
```

### Explanation of Changes:

1. **Supabase Client Setup**:
   - The Supabase client is initialized using `createClient`, where `supabaseUrl` and `supabaseAnonKey` are environment variables for your Supabase project.

2. **Fetching Meals (`getMeals`)**:
   - We use Supabase's `from("meals").select("*")` to fetch all meals from the `meals` table in the PostgreSQL database.

3. **Fetching a Single Meal (`getMeal`)**:
   - We use Supabase's `from("meals").select("*").eq("slug", slug).single()` to fetch a single meal based on the `slug` field. The `.single()` method ensures that only one record is returned.

4. **Saving a Meal (`saveMeal`)**:
   - Before saving, the meal slug is generated using `slugify`, and meal instructions are sanitized using `xss`.
   - The image is uploaded to S3 as before.
   - We use Supabase's `from("meals").insert([...])` method to insert the meal into the PostgreSQL database.

### Required Changes in the Environment Variables:
Make sure to add the following environment variables to your `.env` file or Vercel's environment variable settings:
```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
AWS_CREDENTIALS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_CREDENTIALS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_BUCKET_NAME=your-s3-bucket-name
```

### PostgreSQL Schema for Supabase:
If you haven't created the `meals` table in Supabase, here’s the SQL schema that you can use to create it:

```sql
CREATE TABLE meals (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  summary TEXT,
  instructions TEXT,
  creator VARCHAR(255),
  creator_email VARCHAR(255),
  image VARCHAR(255),
  slug VARCHAR(255) UNIQUE NOT NULL
);
```

### Testing the Functions:
- **Test in local development** by creating some meals and retrieving them using the provided functions.
- Ensure that Supabase is properly connected, and the images are uploaded to S3 successfully.

This setup should work well with Supabase and Vercel in production! Let me know if you encounter any issues during the transition.

To convert your `meals.js` file from SQLite to PostgreSQL using Supabase, the core structure of the code will remain the same, but the database access logic will change. Below is how you can rewrite it to work with Supabase (PostgreSQL):

### Key Changes:
1. Replace SQLite queries with `pg` (PostgreSQL) queries.
2. Use `@supabase/supabase-js` to connect to Supabase.
3. Adjust the SQL query syntax for PostgreSQL compatibility.
4. Maintain S3 functionality as is.

Here’s the updated version:

```js
import { S3 } from "@aws-sdk/client-s3";
import { createClient } from "@supabase/supabase-js";
import slugify from "slugify";
import xss from "xss";

// Supabase client setup
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

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

  const { data, error } = await supabase
    .from("meals")
    .select("*");

  if (error) {
    console.error("Error fetching meals:", error);
    return [];
  }

  return data;
}

// Function to fetch a meal by its slug
export async function getMeal(slug) {
  await new Promise((resolve) => setTimeout(resolve, 5000));

  const { data, error } = await supabase
    .from("meals")
    .select("*")
    .eq("slug", slug)
    .single(); // Use single to return only one result

  if (error) {
    console.error("Error fetching meal:", error);
    return null;
  }

  return data;
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

  // Insert the meal data into Supabase (PostgreSQL)
  const { data, error } = await supabase
    .from("meals")
    .insert([{
      title: meal.title,
      summary: meal.summary,
      instructions: meal.instructions,
      creator: meal.creator,
      creator_email: meal.creator_email,
      image: meal.image,
      slug: meal.slug,
    }]);

  if (error) {
    console.error("Error saving meal:", error);
    return null;
  }

  return data;
}
```

### Changes Explained:
1. **Supabase Client**: The `supabase` client is initialized using your project’s URL and anon key, both of which are stored in environment variables.

2. **Database Queries**:
   - **getMeals**: This function now fetches all rows from the `meals` table in Supabase.
   - **getMeal**: This retrieves a single row using the `slug` column.
   - **saveMeal**: This inserts a new meal record into the Supabase `meals` table.

3. **S3 Interaction**: The S3 logic for uploading images remains the same.

### Make sure:
- You have the table `meals` in your Supabase PostgreSQL instance with the same structure as in SQLite.
- Your `.env` file includes `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `AWS_CREDENTIALS_ACCESS_KEY_ID`, `AWS_CREDENTIALS_SECRET_ACCESS_KEY`, and `AWS_BUCKET_NAME`.

To convert your `lib/meals/meals.js` file to use PostgreSQL with Supabase instead of SQLite, you can make the following changes while keeping the same functions and logic:

```javascript
import { S3 } from "@aws-sdk/client-s3";
import { createClient } from "@supabase/supabase-js"; // Import Supabase client
import slugify from "slugify";
import xss from "xss";

const s3 = new S3({
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_CREDENTIALS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_CREDENTIALS_SECRET_ACCESS_KEY,
  },
});

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

s3.listBuckets((err, data) => {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Success", data.Buckets);
  }
});

export async function getMeals() {
  await new Promise((resolve) => setTimeout(resolve, 5000));
  const { data, error } = await supabase
    .from("meals")
    .select("*");

  if (error) {
    console.error(error);
    return [];
  }
  return data;
}

export async function getMeal(slug) {
  await new Promise((resolve) => setTimeout(resolve, 5000));
  const { data, error } = await supabase
    .from("meals")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error(error);
    return null;
  }
  return data;
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

  const { error } = await supabase
    .from("meals")
    .insert([meal]);

  if (error) {
    console.error(error);
  }
}
```

### Key Changes:
1. **Database Connection**: Switched from `better-sqlite3` to Supabase using the `@supabase/supabase-js` package.
2. **Query Execution**: Updated to use Supabase's method for querying and inserting data.
3. **Error Handling**: Added error handling for database operations to ensure smooth execution.

Make sure to set the necessary environment variables for your Supabase project. This code maintains the same logic and functions as your original SQLite implementation.

kBl8epuXV9fcDA3a