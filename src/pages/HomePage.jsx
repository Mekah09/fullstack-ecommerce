import FeaturedProducts from "../components/FeaturedProducts.jsx";
import Hero from "../components/Hero.jsx";
import MakersBanner from "../components/MakersBanner.jsx";
import Newsletter from "../components/Newsletter.jsx";
import ShoppingBenefits from "../components/ShoppingBenefits.jsx";

export default function HomePage() {
  return (
    <main id="main-content">
      <Hero />
      <ShoppingBenefits />
      <FeaturedProducts />
      <MakersBanner />
      <Newsletter />
    </main>
  );
}
