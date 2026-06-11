import { useState, useEffect } from "react";
import { Table, Tr, Td } from "../../components/ui/Table";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { useAuth } from "../../hooks/useAuth";
import {
  obtenerCategorias,
  crearCategoria,
  actualizarCategoria,
} from "../../api/services.api";

const CategoriaServiciosAdmin = () => {
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);

  // Modal de Formulario (Crear / Editar)
  const [modalFormAbierto, setModalFormAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [categoriaEditandoId, setCategoriaEditandoId] = useState(null);

  // Adaptamos el formData a lo que necesita una Categoría
  const [formData, setFormData] = useState({
    name: "",
    displayOrder: "",
  });

  const [errorForm, setErrorForm] = useState("");
  const [cargandoForm, setCargandoForm] = useState(false);

  const { token } = useAuth();

  // Muestra el mensaje real del backend (ej. el 409 de nombre duplicado)
  // en lugar del genérico "Request failed with status code 409" de axios.
  const mensajeDeError = (err) =>
    err.response?.data?.mensaje ||
    err.response?.data?.error ||
    err.message ||
    "Ocurrió un error inesperado";

  // OBTENER CATEGORÍAS

  const cargarCategorias = async () => {
    try {
      const data = await obtenerCategorias(token);
      setCategorias(data);
    } catch (err) {
      setError(mensajeDeError(err));
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (token) {
      cargarCategorias();
    }
  }, [token]);

  // MODAL CREAR

  const abrirModalCrear = () => {
    setModoEdicion(false);

    setCategoriaEditandoId(null);

    // Sugerimos el siguiente orden libre (el más alto + 1)
    const siguienteOrden =
      categorias.reduce((max, c) => Math.max(max, c.displayOrder || 0), 0) + 1;

    setFormData({
      name: "",
      displayOrder: String(siguienteOrden),
    });

    setErrorForm("");
    setModalFormAbierto(true);
  };

  // MODAL EDITAR

  const abrirModalEditar = (categoria) => {
    setModoEdicion(true);

    setCategoriaEditandoId(categoria.id);
    setFormData({
      name: categoria.name || "",
      displayOrder: String(categoria.displayOrder ?? ""),
    });

    setErrorForm("");
    setModalFormAbierto(true);
  };

  // GUARDAR

  const guardarCategoria = async (e) => {
    e.preventDefault();

    setErrorForm("");

    // Validaciones del lado del cliente
    if (!formData.name.trim()) {
      setErrorForm("El nombre es obligatorio");
      return;
    }

    const ordenNum = Number(formData.displayOrder);
    if (formData.displayOrder === "" || isNaN(ordenNum)) {
      setErrorForm("El orden debe ser un número");
      return;
    }

    // Evitamos que dos categorías queden con el mismo orden.
    // (En edición, ignoramos la categoría que estamos editando.)
    const ordenRepetido = categorias.some(
      (c) => c.displayOrder === ordenNum && c.id !== categoriaEditandoId
    );
    if (ordenRepetido) {
      setErrorForm(
        `El orden ${ordenNum} ya está usado por otra categoría. Elegí otro número.`
      );
      return;
    }

    setCargandoForm(true);

    try {
      const payload = {
        name: formData.name.trim(),
        displayOrder: ordenNum,
      };

      if (modoEdicion) {
        await actualizarCategoria(categoriaEditandoId, payload, token);
      } else {
        await crearCategoria(payload, token);
      }
      setModalFormAbierto(false);

      cargarCategorias();
    } catch (err) {
      setErrorForm(mensajeDeError(err));
    } finally {
      setCargandoForm(false);
    }
  };

  if (cargando) {
    return (
      <p style={{ textAlign: "center", marginTop: "50px" }}>
        Cargando categorías...
      </p>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ color: "#6b21a8" }}>Gestión de Categorías</h2>

        <Button onClick={abrirModalCrear}>+ Nueva Categoría</Button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <Table headers={["Orden", "Categoría", "Servicios activos", "Acciones"]}>
        {categorias.map((c) => (
          <Tr key={c.id}>
            <Td>{c.displayOrder}</Td>

            <Td>
              <strong>{c.name}</strong>
            </Td>

            <Td>{c.services?.length ?? 0}</Td>

            <Td>
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  justifyContent: "center",
                }}
              >
                <Button
                  style={{
                    padding: "6px 12px",
                    fontSize: "12px",
                    backgroundColor: "#64748b",
                  }}
                  onClick={() => abrirModalEditar(c)}
                >
                  Editar
                </Button>
              </div>
            </Td>
          </Tr>
        ))}
      </Table>

      {/* MODAL FORMULARIO */}

      <Modal
        isOpen={modalFormAbierto}
        onClose={() => setModalFormAbierto(false)}
        title={modoEdicion ? "Editar Categoría" : "Crear Nueva Categoría"}
      >
        {errorForm && (
          <p
            style={{
              color: "red",
              fontSize: "14px",
              textAlign: "center",
            }}
          >
            {errorForm}
          </p>
        )}

        <form
          onSubmit={guardarCategoria}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            marginTop: "10px",
          }}
        >
          <Input
            type="text"
            placeholder="Nombre de la categoría"
            value={formData.name}
            onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value,
              })
            }
            required
          />

          <Input
            type="number"
            placeholder="Orden de visualización (ej: 1, 2, 3...)"
            value={formData.displayOrder}
            onChange={(e) =>
              setFormData({
                ...formData,
                displayOrder: e.target.value,
              })
            }
            required
          />

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "10px",
              justifyContent: "flex-end",
            }}
          >
            <Button
              type="button"
              style={{
                backgroundColor: "#e2e8f0",
                color: "#475569",
              }}
              onClick={() => setModalFormAbierto(false)}
            >
              Cancelar
            </Button>

            <Button type="submit" disabled={cargandoForm}>
              {cargandoForm ? "Guardando..." : "Guardar Categoría"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CategoriaServiciosAdmin;