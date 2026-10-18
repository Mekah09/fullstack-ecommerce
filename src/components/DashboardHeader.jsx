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
      <div className="dash-breadcrumb">
        Workspace <span>/</span>{" "}
        {navigation.find((item) => item.id === tab)?.label}
      </div>
      <header className="dash-page-head">
        <div>
          <span className="dash-eyebrow">
            {admin ? "MADE FOR YOUR COMMUNITY" : "A LITTLE SPACE TO GROW"}
          </span>
          <h1>{titles[tab]}</h1>
          <p>{subtitles[tab]}</p>
        </div>
        {["overview", "products"].includes(tab) && (
          <button className="dash-primary" onClick={() => onAddProduct()}>
            <FiPlus /> Add product
          </button>
        )}
      </header>
    </>
  );
}
