# Meals Project

Welcome to the Meals Project! This application allows users to browse, share, and explore a variety of meal recipes. Built with Next.js, React, and CSS modules, it integrates with AWS S3 for image storage and uses a SQLite database to manage meal data.

## Table of Contents

- [Meals Project](#meals-project)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Project Structure](#project-structure)
  - [Environment Variables](#environment-variables)
  - [Components](#components)
    - [`MainHeader`](#mainheader)
    - [`NavLink`](#navlink)
    - [`ImagePicker`](#imagepicker)
    - [`MealsItem`](#mealsitem)
    - [`MealsGrid`](#mealsgrid)
    - [`ImageSlideShow`](#imageslideshow)
    - [`MealsFormSubmit`](#mealsformsubmit)
  - [API](#api)
    - [Meals API](#meals-api)
  - [License](#license)
    - [Gif](#gif)
  - [](#)
  - [Start](#start)
  - [Learn More](#learn-more)
  - [Deploy on Vercel](#deploy-on-vercel)

## Features

- **Browse Meals:** View a list of meals with details including title, image, summary, and creator.
- **Meal Details:** View detailed information about a specific meal.
- **Share Meals:** Submit new meal recipes, including image upload.
- **Responsive Design:** Optimized for both desktop and mobile devices.

## Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS
- **Backend:** Node.js, SQLite
- **Image Storage:** AWS S3
- **Form Handling:** React Hook Form
- **State Management:** React's useState and useEffect

## Getting Started

### Prerequisites

- Node.js (>=14.x)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/meals-project.git
   cd meals-project
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Configure environment variables:
   Create a `.env` file in the root directory and add the following:

   ```env
   SERVER_IMAGE_URL=https://
   NAME=your-name
   ACCESS_KEY_ID=your-access-key-id
   SECRET_ACCESS_KEY=your-secret-access-key
   ```

4. Initialize the SQLite database:

   ```bash
   node initdb.js
   ```

5. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

   Navigate to `http://localhost:3000` to view the application.

## Project Structure

- **`/app`**: Contains the main application layout and routing.

  - `page.js`: Home page and other top-level routes.
  - `meals/page.js`: Meals list page.
  - `meals/[mealsSlug]/page.js`: Meal detail page.
  - `meals/share/page.js`: Share meal page.
  - `meals/[mealsSlug]/not-found.js`: Custom 404 page for meals.
  - `meals/share/error.js`: Error page for meal sharing.
  - `community/page.js`: Community page.

- **`/components`**: Reusable components used throughout the application.

  - `main-header.js`: Main header component with navigation.
  - `nav-link.js`: Navigation link component with active state handling.
  - `image-picker.js`: Component for picking and previewing images.
  - `meals-form-submit.js`: Submit button for meal forms.
  - `meals-grid.js`: Grid display for meal items.
  - `meals-item.js`: Item display for individual meals.
  - `images-slide-show.js`: Slideshow component for images.

- **`/lib`**: Utility functions and API calls.

  - `meals/meals.js`: Functions to fetch and manage meal data.
  - `actions/actions.js`: Functions for form handling and meal sharing.

- **`/public`**: Static files such as images.

- **`/styles`**: Global and component-specific CSS styles.

- **`initdb.js`**: Script to initialize the SQLite database with dummy data.

## Environment Variables

Ensure you have the following environment variables set in your `.env` file:

```env
SERVER_IMAGE_URL=https://
NAME=your-name
ACCESS_KEY_ID=your-access-key-id
SECRET_ACCESS_KEY=your-secret-access-key
```

## Components

### `MainHeader`

The header component of the application, including navigation links.

### `NavLink`

A navigation link component with active link styling.

### `ImagePicker`

Component for selecting and previewing images.

### `MealsItem`

Displays a single meal item with details and a link to view more.

### `MealsGrid`

Displays a grid of meal items.

### `ImageSlideShow`

Displays a slideshow of images.

### `MealsFormSubmit`

Submit button for forms with a pending state.

## API

### Meals API

- **GET /api/meals**: Fetch a list of meals.
- **GET /api/meals/:slug**: Fetch details for a specific meal.
- **POST /api/meals**: Create a new meal (requires authentication).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Gif

Here is an expected gif of the preview of the App(Meals Foodie App)

## ![Meals Foodie App gif](./assets/meals-foodie.gif)

---

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app)

## Start

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
