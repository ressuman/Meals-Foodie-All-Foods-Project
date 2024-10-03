//import fs from "node:fs";

import { S3 } from "@aws-sdk/client-s3";

import { createClient } from "@supabase/supabase-js";
//import sql from "better-sqlite3";

import slugify from "slugify";
import xss from "xss";

// const s3 = new S3({
//   region: "eu-north-1",
//   credentials: {
//     accessKeyId: process.env.AWS_CREDENTIALS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_CREDENTIALS_SECRET_ACCESS_KEY,
//   },
// });

// s3.listBuckets((err, data) => {
//   if (err) {
//     console.log("Error", err);
//   } else {
//     console.log("Success", data.Buckets);
//   }
// });

// const db = sql("meals.db");

// export async function getMeals() {
//   await new Promise((resolve) => setTimeout(resolve, 5000));

//   //throw new Error("Loading meals failed");
//   return db.prepare("SELECT * FROM meals").all();
// }

// export async function getMeal(slug) {
//   await new Promise((resolve) => setTimeout(resolve, 5000));

//   return db.prepare("SELECT * FROM meals WHERE slug = ?").get(slug);
// }

// export async function saveMeal(meal) {
//   meal.slug = slugify(meal.title, {
//     lower: true,
//   });
//   meal.instructions = xss(meal.instructions);

//   const extension = meal.image.name.split(".").pop();
//   const fileName = `${meal.slug}.${extension}`;

//   //const stream = fs.createWriteStream(`public/images/${fileName}`);

//   const bufferedImage = await meal.image.arrayBuffer();

//   // stream.write(Buffer.from(bufferedImage), (error) => {
//   //   if (error) {
//   //     throw new Error("Saving Image Failed");
//   //   }
//   // });

//   //meal.image = `/images/${fileName}`;

//   s3.putObject({
//     Bucket: process.env.AWS_BUCKET_NAME,
//     Key: fileName,
//     Body: Buffer.from(bufferedImage),
//     ContentType: meal.image.type,
//   });

//   meal.image = fileName;

//   db.prepare(
//     `
//     INSERT INTO meals
//       (title, summary, instructions, creator, creator_email, image, slug)
//     VALUES (
//       @title,
//       @summary,
//       @instructions,
//       @creator,
//       @creator_email,
//       @image,
//       @slug
//     )
//   `
//   ).run(meal);
// }

// import { S3 } from "@aws-sdk/client-s3";

// import sql from "better-sqlite3";

// import slugify from "slugify";
// import xss from "xss";

// const s3 = new S3({
//   region: "eu-north-1",
//   credentials: {
//     accessKeyId: process.env.AWS_CREDENTIALS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_CREDENTIALS_SECRET_ACCESS_KEY,
//   },
// });

// s3.listBuckets((err, data) => {
//   if (err) {
//     console.log("Error", err);
//   } else {
//     console.log("Success", data.Buckets);
//   }
// });

// const db = sql("meals.db");

// export async function getMeals() {
//   await new Promise((resolve) => setTimeout(resolve, 5000));

//   return db.prepare("SELECT * FROM meals").all();
// }

// export async function getMeal(slug) {
//   await new Promise((resolve) => setTimeout(resolve, 5000));

//   return db.prepare("SELECT * FROM meals WHERE slug = ?").get(slug);
// }

// export async function saveMeal(meal) {
//   meal.slug = slugify(meal.title, {
//     lower: true,
//   });
//   meal.instructions = xss(meal.instructions);

//   const extension = meal.image.name.split(".").pop();
//   const fileName = `${meal.slug}.${extension}`;

//   const bufferedImage = await meal.image.arrayBuffer();

//   s3.putObject({
//     Bucket: process.env.AWS_BUCKET_NAME,
//     Key: fileName,
//     Body: Buffer.from(bufferedImage),
//     ContentType: meal.image.type,
//   });

//   meal.image = fileName;

//   db.prepare(
//     `
//     INSERT INTO meals
//       (title, summary, instructions, creator, creator_email, image, slug)
//     VALUES (
//       @title,
//       @summary,
//       @instructions,
//       @creator,
//       @creator_email,
//       @image,
//       @slug
//     )
//   `
//   ).run(meal);
// }

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

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

  const { data, error } = await supabase.from("meals").select("*");

  if (error) {
    console.error("Error fetching meals:", error);
    throw new Error("Failed to fetch meals.");
  }
  console.log("Fetched meals:", data);

  return data;
}

// Fetch a single meal by slug from the PostgreSQL database
export async function getMeal(slug) {
  // Simulate a delay (optional)
  await new Promise((resolve) => setTimeout(resolve, 5000));

  const { data, error } = await supabase
    .from("meals")
    .select("*")
    .eq("slug", slug)
    .single(); // Return a single meal

  if (error) {
    console.error(`Error fetching meal with slug ${slug}:`, error);
    return null;
  }
  console.log(`Fetched meal with slug ${slug}:`, data);

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
  const extension = meal.image.name.split(".").pop();
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
  // const { error } = await supabase.from("meals").insert({
  //   title: meal.title,
  //   summary: meal.summary,
  //   instructions: meal.instructions,
  //   creator: meal.creator,
  //   creator_email: meal.creator_email,
  //   image: meal.image,
  //   slug: meal.slug,
  // });

  const { data, error } = await supabase.from("meals").insert([
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
    console.error("Error saving meal to database:", error);
    throw new Error("Failed to save meal.");
  }

  console.log(`Uploading image ${fileName} to S3...`);

  return data;
}
