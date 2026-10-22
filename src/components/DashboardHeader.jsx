import { FiPlus } from "react-icons/fi";
import { getTitles, subtitles } from "./dashboardNavigation.jsx";

export default function DashboardHeader({
  admin,
  tab,
  navigation,
  onAddProduct,
}) {
  const titles = getTitles(admin);
  return (
    <>
      <div className="dash-breadcrumb flex items-center gap-2 text-[11px] text-[#839078] [&_span]:text-[#b2b9a9]">
        Workspace <span>/</span>{" "}
        {navigation.find((item) => item.id === tab)?.label}
      </div>
      <header className="dash-page-head flex flex-wrap items-center justify-between gap-5 py-1 [&_h1]:mt-2 [&_h1]:font-serif [&_h1]:text-3xl [&_h1]:leading-tight [&_h1]:tracking-[-0.03em] [&_p]:mt-2 [&_p]:text-xs [&_p]:leading-6 [&_p]:text-[#819075] sm:[&_h1]:text-4xl">
        <div>
          <span className="dash-eyebrow text-[9px] font-semibold tracking-[0.18em] text-[#7b8b6b]">
            {admin ? "MADE FOR YOUR COMMUNITY" : "A LITTLE SPACE TO GROW"}
          </span>
          <h1>{titles[tab]}</h1>
          <p>{subtitles[tab]}</p>
        </div>
        {["overview", "products"].includes(tab) && (
          <button className="dash-primary inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#234d39] px-5 py-3 text-xs font-medium text-white transition hover:bg-[#183e2b] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#769563] [&_svg]:size-4" onClick={() => onAddProduct()}>
            <FiPlus /> Add product
          </button>
        )}
      </header>
    </>
  );
}
