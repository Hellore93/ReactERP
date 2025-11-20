import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Spinner } from "../elements/Spinner";
import { useObjectStore } from "../store/DataStore";
import { Product } from "../forms/Product";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, IconButton } from "@mui/material";
import { ConfirmDialog } from "../elements/ConfirmDialog";

export function Products() {
  const {
    items: products,
    picklists,
    loading,
    error,
    load,
    initialized,
    update,
    insert,
    remove,
    uploadImage,
  } = useObjectStore("Product");

  const [search, setSearch] = useState("");
  const [searchParams] = useSearchParams();
  const [openInsertModal, setOpenInsertModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!initialized) load();
  }, [initialized]);

  const prodId = searchParams.get("id");
  const clickedProduct = useMemo(() => {
    if (!prodId) return null;
    if (!products || products.length === 0) return null;
    return products.find((item) => String(item.id) === String(prodId)) || null;
  }, [products, prodId]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    const query = search.trim().toLowerCase();
    if (!query) return products;
    const words = query.split(/\s+/).filter(Boolean);
    return products.filter((p) => {
      const text = `${p.name ?? ""} ${p.description ?? ""}`.toLowerCase();
      return words.every((w) => text.includes(w));
    });
  }, [products, search]);

  const handleCloseModal = () => {
    navigate("/products", { replace: true });
    setOpenInsertModal(false);
  };

  const handleProductSave = async (updatedProduct, imageFile) => {
    let recordId;
    if (imageFile != undefined && imageFile != null) {
      recordId = await uploadImage(
        imageFile,
        updatedProduct.id || products.length + 1,
        "ProductImage"
      );
      updatedProduct.pictureUrl = recordId;
    }
    if (updatedProduct.id != undefined) {
      await update(updatedProduct);
    } else {
      await insert(updatedProduct);
    }
    handleCloseModal();
  };

  const handleDeleteClick = (product) => {
    setDeleteTarget(product);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    await remove(deleteTarget);
    setDeleteTarget(null);
    setDeleteOpen(false);
  };

  const handleDeleteCancel = () => {
    setDeleteTarget(null);
    setDeleteOpen(false);
  };

  return (
    <section style={{ position: "relative", minHeight: "150px" }}>
      {loading && <Spinner />}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <h1 style={{ margin: 0 }}>Products</h1>

        <IconButton color="primary" onClick={() => setOpenInsertModal(true)}>
          <AddIcon />
        </IconButton>
      </Box>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name"
          style={{
            width: "100%",
            maxWidth: "400px",
            padding: "0.5rem 0.75rem",
            borderRadius: "0.5rem",
            border: "1px solid #d1d5db",
            fontSize: "0.95rem",
          }}
        />
      </div>

      {error && (
        <p style={{ color: "red", marginBottom: "0.75rem" }}>
          Błąd podczas ładowania produktów: {error.message}
        </p>
      )}

      {filteredProducts.length === 0 && !loading ? (
        <p>Brak produktów spełniających kryteria wyszukiwania.</p>
      ) : (
        <ul>
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "0.75rem",
              }}
            >
              <div style={{ width: 80 }}>
                {p.pictureUrl ? (
                  <img
                    src={p.pictureUrl}
                    alt={p.name}
                    style={{
                      width: "100%",
                      height: "auto",
                      borderRadius: "6px",
                    }}
                  />
                ) : (
                  <div style={{ width: 80, height: 1 }}></div>
                )}
              </div>

              <div style={{ flex: 1 }}>
                <Link to={`/products?id=${p.id}`} className="product-link">
                  {p.name}
                </Link>
                {p.description && (
                  <>
                    {" – "}
                    <span>{p.description}</span>
                  </>
                )}
                {p.quantityOwned && (
                  <>
                  {", "}
                    <strong>{p.quantityOwned}</strong>
                  </>
                )}
                {p.unit && (
                  <>
                  {" " }
                    <strong>{p.unit}</strong>
                  </>
                )}
              </div>

              <IconButton
                aria-label="Delete"
                size="small"
                onClick={() => handleDeleteClick(p)}
                style={{ marginLeft: "auto" }}
              >
                <DeleteIcon fontSize="small" style={{ color: "red" }}/>
              </IconButton>
            </div>
          ))}
        </ul>
      )}
      {(clickedProduct || openInsertModal) && (
        <Product
          isOpen={true}
          closeEvent={handleCloseModal}
          clickedProduct={clickedProduct}
          onSave={handleProductSave}
          picklists={picklists}
        ></Product>
      )}
      {(clickedProduct || openInsertModal) && (
        <Product
          isOpen={true}
          closeEvent={handleCloseModal}
          clickedProduct={clickedProduct}
          onSave={handleProductSave}
          picklists={picklists}
        />
      )}

      <ConfirmDialog
        open={deleteOpen}
        title="Delete product?"
        message={
          deleteTarget
            ? `Are you sure for delete "${deleteTarget.name}"?`
            : ""
        }
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </section>
  );
};
