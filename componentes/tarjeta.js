import React, { useState } from "react";
import productos from "./productos";

const TELEFONO_WHATSAPP = "18492143712";

export default function Ventas() {
  const [cantidades, setCantidades] = useState({});
  const [carrito, setCarrito] = useState([]);
  const [verCarrito, setVerCarrito] = useState(false);

  const cambiarCantidad = (id, v) => {
    setCantidades(prev => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + v)
    }));
  };

  const agregar = p => {
    const cantidad = cantidades[p.id] || 1;
    const existe = carrito.find(i => i.id === p.id);

    if (existe) {
      setCarrito(
        carrito.map(i =>
          i.id === p.id ? { ...i, cantidad: i.cantidad + cantidad } : i
        )
      );
    } else {
      setCarrito([...carrito, { ...p, cantidad }]);
    }
  };

  const total = carrito.reduce(
    (s, p) => s + p.precio * p.cantidad,
    0
  );

  const formatoRD = n =>
    `RD$ ${n.toLocaleString("es-DO", {
      minimumFractionDigits: 2
    })}`;

  // 👉 MENSAJE WHATSAPP
  const confirmarPedido = () => {
    if (carrito.length === 0) return;

    let mensaje = " *NUEVO PEDIDO*%0A%0A";

    carrito.forEach(p => {
      mensaje += `• ${p.producto}%0A`;
      mensaje += `  Cantidad: ${p.cantidad}%0A`;
      mensaje += `  Precio: ${formatoRD(p.precio)}%0A%0A`;
    });

    mensaje += ` *TOTAL: ${formatoRD(total)}*%0A%0A`;
    mensaje += " Pedido generado desde la app";

    const url = `https://wa.me/${TELEFONO_WHATSAPP}?text=${mensaje}`;
    window.open(url, "_blank");

    // Opcional: limpiar carrito
    setCarrito([]);
    setCantidades({});
    setVerCarrito(false);
  };

  return (
    <div style={styles.app}>
      {/* HEADER */}
      <div style={styles.header}>
        <button style={styles.btnVentas}>Ventas</button>
        <button style={styles.btnSalir}>Salir</button>
      </div>

      <h2 style={styles.titulo}>🛒 Productos</h2>

      {/* GRID */}
      <div style={styles.grid}>
        {productos.map(p => (
          <div key={p.id} style={styles.card}>
            <img src={p.imagen} alt={p.producto} style={styles.img} />
            <h4 style={styles.nombre}>{p.producto}</h4>
            <p style={styles.precio}>{formatoRD(p.precio)}</p>

            <div style={styles.selector}>
              <button onClick={() => cambiarCantidad(p.id, -1)}>−</button>
              <span>{cantidades[p.id] || 1}</span>
              <button onClick={() => cambiarCantidad(p.id, 1)}>+</button>
            </div>

            <button style={styles.btnAgregar} onClick={() => agregar(p)}>
              ➕ Agregar
            </button>
          </div>
        ))}
      </div>

      {/* BOTÓN FLOTANTE */}
      <div style={styles.flotante} onClick={() => setVerCarrito(true)}>
        🛒
        {carrito.length > 0 && (
          <span style={styles.badge}>
            {carrito.reduce((a, p) => a + p.cantidad, 0)}
          </span>
        )}
      </div>

      {/* PANEL CARRITO */}
      {verCarrito && (
        <div style={styles.panel}>
          <span style={styles.cerrar} onClick={() => setVerCarrito(false)}>✖</span>

          <h3>🧾 Mi carrito</h3>

          {carrito.length === 0 ? (
            <p>No hay productos</p>
          ) : (
            <>
              {carrito.map(p => (
                <div key={p.id} style={styles.item}>
                  <span>{p.producto}</span>
                  <span>{p.cantidad} × {formatoRD(p.precio)}</span>
                  <b>{formatoRD(p.precio * p.cantidad)}</b>
                </div>
              ))}

              <h3 style={{ textAlign: "right" }}>
                Total: {formatoRD(total)}
              </h3>

              <button style={styles.btnConfirmar} onClick={confirmarPedido}>
                📦 Confirmar pedido
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}


const styles = {
  app: {
    minHeight: "100vh",
    background: "#f2f2f2",
    paddingBottom: 40
  },

  header: {
    background: "#000",
    padding: 10,
    display: "flex",
    justifyContent: "space-between"
  },

  btnVentas: {
    background: "#2d9cdb",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: 20
  },

  btnSalir: {
    background: "#eb5757",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: 20
  },

  titulo: {
    textAlign: "center",
    margin: "15px 0"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: 15,
    padding: "0 15px"
  },

  card: {
    background: "#fff",
    borderRadius: 14,
    padding: 15,
    textAlign: "center",
    boxShadow: "0 5px 15px rgba(0,0,0,.1)"
  },

  img: {
    width: "100%",
    height: 200,
    objectFit: "cover",
    borderRadius: 10
  },

  nombre: { fontSize: 14, fontWeight: "bold" },

  precio: {
    color: "#27ae60",
    fontWeight: "bold",
    margin: "6px 0"
  },

  selector: {
    display: "flex",
    justifyContent: "center",
    gap: 10,
    marginBottom: 10
  },

  btnAgregar: {
    width: "100%",
    padding: 10,
    background: "#2d9cdb",
    color: "#fff",
    border: "none",
    borderRadius: 8
  },

  flotante: {
    position: "fixed",
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    background: "#000",
    color: "#fff",
    borderRadius: "50%",
    fontSize: 24,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer"
  },

  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    background: "red",
    color: "#fff",
    borderRadius: "50%",
    padding: "3px 7px",
    fontSize: 12
  },

  panel: {
    position: "fixed",
    top: 0,
    right: 0,
    width: 300,
    height: "100%",
    background: "#fff",
    padding: 15,
    boxShadow: "-5px 0 15px rgba(0,0,0,.3)"
  },

  cerrar: {
    cursor: "pointer",
    color: "#e74c3c",
    fontSize: 18
  },

  item: {
    display: "grid",
    gridTemplateColumns: "1fr auto auto",
    gap: 6,
    borderBottom: "1px solid #eee",
    padding: "6px 0",
    fontSize: 13
  },

  btnConfirmar: {
    width: "100%",
    padding: 12,
    marginTop: 10,
    background: "#27ae60",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontWeight: "bold"
  }
};

