import Layout from "../../components/Layout";
import "./Dashboard.css";

function AdminDashboard() {
  return (
    <Layout>
      <h1>Panel de Administración</h1>

      <div className="cards">
        <div className="card">
          <h2>Turnos Hoy</h2>
          <p>12</p>
        </div>

        <div className="card">
          <h2>Ingresos</h2>
          <p>$45.000</p>
        </div>
      </div>
    </Layout>
  );
}

export default AdminDashboard;