import "./globals.css";
import MainHeader from "@/components/header/main-header/main-header";
import PropTypes from "prop-types";

export const metadata = {
  title: "All Foodie Foods App",
  description: "Delicious meals, shared by a food-loving community.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <MainHeader />

        {children}
      </body>
    </html>
  );
}

RootLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
