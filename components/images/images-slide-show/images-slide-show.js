"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import burgerImg from "@/assets/burger.jpg";
import curryImg from "@/assets/curry.jpg";
import dumplingsImg from "@/assets/dumplings.jpg";
import macncheeseImg from "@/assets/macncheese.jpg";
import pizzaImg from "@/assets/pizza.jpg";
import schnitzelImg from "@/assets/schnitzel.jpg";
import tomatoSaladImg from "@/assets/tomato-salad.jpg";

import classes from "./images-slide-show.module.css";

const images = [
  {
    id: 1,
    image: burgerImg,
    alt: "A delicious, juicy burger",
  },
  {
    id: 2,
    image: curryImg,
    alt: "A delicious, spicy curry",
  },
  {
    id: 3,
    image: dumplingsImg,
    alt: "Steamed dumplings",
  },
  {
    id: 4,
    image: macncheeseImg,
    alt: "Mac and cheese",
  },
  {
    id: 5,
    image: pizzaImg,
    alt: "A delicious pizza",
  },
  {
    id: 6,
    image: schnitzelImg,
    alt: "A delicious schnitzel",
  },
  {
    id: 7,
    image: tomatoSaladImg,
    alt: "A delicious tomato salad",
  },
];

export default function ImageSlideShow() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex < images.length - 1 ? prevIndex + 1 : 0
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={classes.slideshow}>
      {images.map((image) => (
        <Image
          key={image.id}
          src={image.image}
          className={image.id === currentImageIndex ? classes.active : ""}
          alt={image.alt}
          priority
        />
      ))}
    </div>
  );
}
