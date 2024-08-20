import ImageSlideShow from "@/components/images/images-slide-show/images-slide-show";
import styles from "./page.module.css";

import Link from "next/link";

export default function Home() {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.slideshow}>
          <ImageSlideShow />
        </div>
        <div>
          <div className={styles.hero}>
            <h1>Transform Your Cooking Passion into Culinary Masterpieces</h1>
            <p>
              Join a global community of food lovers—explore, create, and share
              your culinary journey.
            </p>
          </div>
          <div className={styles.cta}>
            <Link href="/community">Join our Vibrant Community</Link>
            <Link href="/meals">Explore Meals and Recipes</Link>
          </div>
        </div>
      </header>
      <main>
        <section className={styles.section}>
          <h2>How It Works</h2>
          <p>
            Imagine turning your everyday meals into extraordinary moments that
            linger in memory. At NextLevel Food, we believe every dish has a
            story to tell. Our platform empowers you to craft those
            stories—whether it’s the joy of a family recipe passed down through
            generations or the thrill of discovering a new, exotic flavor.
          </p>
          <p>
            Sharing your culinary creations isn’t just about showcasing your
            skills—it’s about connecting with others who understand that food is
            a universal language. When you cook, you’re not just feeding the
            body; you’re nourishing the soul. Let NextLevel Food be your
            companion on this flavorful journey.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Why NextLevel Food?</h2>
          <p>
            Because at NextLevel Food, we know that cooking is more than just a
            task—it’s a form of self-expression, a way to show love, and a means
            to connect deeply with others. Our platform is designed for those
            who see the kitchen as a space of creativity, exploration, and
            emotional fulfillment.
          </p>
          <p>
            Food is powerful. It can evoke memories, create bonds, and transform
            moods. Whether you’re cooking to unwind after a long day, impressing
            guests, or simply trying to make someone smile, we provide the
            inspiration and tools you need to make every meal an unforgettable
            experience.
          </p>
          <p>
            Join a community that celebrates the art of cooking not just as a
            skill but as an emotional experience. Together, we can turn every
            dish into a masterpiece, every meal into a celebration, and every
            connection into a cherished memory.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Join the Movement</h2>
          <p>
            Cooking isn’t just about following recipes—it’s about creating
            memories that last a lifetime. With NextLevel Food, you’re not just
            a user; you’re part of a movement that believes in the power of food
            to bring people together. Our community is here to support, inspire,
            and share in the joy of cooking.
          </p>
          <p>
            Imagine the excitement of discovering a new recipe that becomes your
            go-to comfort food, or the pride of perfecting a dish that wows your
            friends and family. These aren’t just meals; they’re experiences
            that enrich your life. NextLevel Food is here to make sure you never
            cook alone—because every culinary journey is better when shared.
          </p>
          <p>
            Are you ready to elevate your cooking and your life? Join NextLevel
            Food today, and let’s create something extraordinary together.
          </p>
        </section>
      </main>
    </>
  );
}
