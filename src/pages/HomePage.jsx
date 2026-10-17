import FeaturedProducts from "../components/home/FeaturedProducts";
import Hero from "../components/home/Hero";
import MakersBanner from "../components/home/MakersBanner";
import Newsletter from "../components/home/Newsletter";
import ShoppingBenefits from "../components/home/ShoppingBenefits";

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
