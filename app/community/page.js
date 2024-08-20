import Image from "next/image";

import mealIcon from "@/assets/icons/meal.png";
import communityIcon from "@/assets/icons/community.png";
import eventsIcon from "@/assets/icons/events.png";
import classes from "./page.module.css";

export default function CommunityPage() {
  return (
    <>
      <header className={classes.header}>
        <h1>
          One shared passion: <span className={classes.highlight}>Food</span>
        </h1>
        <p>
          Welcome to our food lover’s haven! Whether you&apos;re a seasoned chef
          or an enthusiastic home cook, our community is here to fuel your
          passion for food. Join us to exchange recipes, make new friends, and
          be part of a culinary journey like no other.
        </p>
      </header>
      <main className={classes.main}>
        <h2>Community Perks</h2>
        <ul className={classes.perks}>
          <li>
            <Image src={mealIcon} alt="A delicious meal" priority />
            <p>
              <strong>Share & Discover Recipes:</strong> Explore an ever-growing
              collection of recipes from around the globe. Share your culinary
              creations and find inspiration for your next meal.
            </p>
          </li>
          <li>
            <Image
              src={communityIcon}
              alt="A crowd of people, cooking"
              priority
            />
            <p>
              <strong>Find New Friends & Like-Minded People:</strong> Connect
              with fellow food enthusiasts who share your love for cooking.
              Exchange tips, stories, and create lasting friendships.
            </p>
          </li>
          <li>
            <Image
              src={eventsIcon}
              alt="A crowd of people at a cooking event"
              priority
            />
            <p>
              <strong>Participate in Exclusive Events:</strong> Join
              members-only cooking challenges, live cooking demos, and special
              events featuring top chefs. Engage in exciting culinary
              experiences and expand your skills.
            </p>
          </li>
        </ul>

        <section className={classes.joinSection}>
          <h3>Why Join Our Community?</h3>
          <p>
            By joining our community, you’re not just becoming part of a group;
            you’re embarking on a flavorful journey that celebrates the art of
            cooking and the joy of sharing. Our members come together to explore
            new flavors, learn new techniques, and create unforgettable culinary
            experiences.
          </p>
          <p>
            Imagine discovering a new recipe that becomes a staple in your home,
            or connecting with others who share your passion for cooking. Our
            community is a space where every meal is an opportunity to learn,
            grow, and celebrate the joy of food.
          </p>
          <p>
            Ready to elevate your cooking and make lasting connections? Join us
            today and experience the true essence of culinary creativity and
            community.
          </p>
        </section>

        <section className={classes.testimonials}>
          <h3>What Our Members Are Saying</h3>
          <div className={classes.testimonial}>
            <p>
              &quot;Joining this community has been a game-changer for me. The
              support, inspiration, and friendships I&apos;ve gained are
              invaluable. It’s like having a global family that shares my love
              for cooking.&quot;
            </p>
            <span>- Alex, Home Chef</span>
          </div>
          <div className={classes.testimonial}>
            <p>
              &quot;The events and challenges are fantastic. They push me to try
              new things and connect with others who have the same passion. It’s
              more than just a community; it’s a culinary adventure.&quot;
            </p>
            <span>- Jamie, Food Enthusiast</span>
          </div>
        </section>
      </main>
    </>
  );
}
