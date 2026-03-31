import Sidebar from "./Sidebar";
import "./Layout.css";

function Layout({ children }) {
  return (
    <div className="layout">
      <Sidebar />
      <div className="contenido">
        {children}
      </div>
    </div>
  );
}

export default Layout;