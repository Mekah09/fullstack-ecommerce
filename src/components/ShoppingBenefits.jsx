import { FiPackage, FiShield, FiTruck } from "react-icons/fi";
import { LuLeaf } from "react-icons/lu";

const benefits = [
  {
    Icon: FiTruck,
    title: "A little delivery joy",
    text: "Delivery details at checkout",
  },
  {
    Icon: LuLeaf,
    title: "Thoughtfully selected",
    text: "Good quality. Great design.",
  },
  {
    Icon: FiShield,
    title: "Shop with confidence",
    text: "Secure & simple checkout",
  },
  {
    Icon: FiPackage,
    title: "Shop thoughtfully",
    text: "Store policies apply",
  },
];

export default function ShoppingBenefits() {
  return (
    <section className="benefits page-width" aria-label="Shopping benefits">
      {benefits.map(({ Icon, title, text }) => (
        <div key={title}>
          <Icon />
          <span>
            <b>{title}</b>
            <small>{text}</small>
          </span>
        </div>
      ))}
    </section>
  );
}
