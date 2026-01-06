import Sidebar from "./Sidebar";
import "./layout.css";

const MainLayout = ({ children }) => {
  return (
    <div className="layout">
      <Sidebar />
      <main className="content">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
