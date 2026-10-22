import { BrowserRouter, useLocation, useNavigate } from "react-router-dom";
import { RouteContext } from "../context/RouteContext.jsx";

function RouterState({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  return <RouteContext.Provider value={{ location, navigate }}>{children}</RouteContext.Provider>;
}

export default function AppRouter({ children }) {
  return <BrowserRouter><RouterState>{children}</RouterState></BrowserRouter>;
}
