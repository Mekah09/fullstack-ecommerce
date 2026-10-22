import { FiPackage, FiShield, FiTruck } from "react-icons/fi";
import { LuLeaf } from "react-icons/lu";

const benefits = [
  { Icon: FiTruck, title: "A little delivery joy", text: "Delivery details at checkout" },
  { Icon: LuLeaf, title: "Thoughtfully selected", text: "Good quality. Great design." },
  { Icon: FiShield, title: "Shop with confidence", text: "Secure & simple checkout" },
  { Icon: FiPackage, title: "Shop thoughtfully", text: "Store policies apply" },
];

export default function ShoppingBenefits() {
  return <section className="benefits mx-auto mb-6 grid w-[calc(100%-36px)] max-w-[1200px] grid-cols-2 gap-x-5 gap-y-6 border-y border-[#e8eade] py-7 sm:w-[calc(100%-64px)] lg:grid-cols-4" aria-label="Shopping benefits">{benefits.map(({ Icon, title, text }) => <div className="flex items-center gap-3" key={title}><Icon className="h-5 w-5 shrink-0 text-[#8e9f79]" aria-hidden="true" /><span><b className="block text-[10px] font-medium text-[#536349] sm:text-[11px]">{title}</b><small className="mt-1 block text-[8px] leading-4 text-[#9a9f8f] sm:text-[9px]">{text}</small></span></div>)}</section>;
}
