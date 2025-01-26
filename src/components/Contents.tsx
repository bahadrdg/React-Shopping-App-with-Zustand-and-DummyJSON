import { useState, useRef, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { ConfirmDialog } from 'primereact/confirmdialog';
import useProductsStore from "@/store/productsStore";

interface Product {
  id: number;
  title: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
  description: string;
  images: string[];
  warrantyInformation: string;
  brand: string;
  name: string;
  thumbnail: string;
  discountPercentage?: number;
  discountedPrice?: number;
}

const Contents = () => {
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const toast = useRef<Toast>(null);

  const { products, isLoading, error, fetchProducts, updateProduct, deleteProduct } = useProductsStore();

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, [fetchProducts, products.length]);

  const handleUpdate = () => {
    if (selectedProduct) {
      const updatedProduct = {
        ...selectedProduct,
        id: Number(selectedProduct.id),
        thumbnail: selectedProduct.images[0] || '',
        name: selectedProduct.title,
        discountPercentage: selectedProduct.discountPercentage || 0,
        discountedPrice: selectedProduct.price
      };
      updateProduct(updatedProduct);
      toast.current?.show({
        severity: "success",
        summary: "Başarılı",
        detail: "Ürün başarıyla güncellendi",
        life: 3000,
      });
      setDialogVisible(false);
    }
  };

  const handleDelete = () => {
    if (selectedProduct) {
      deleteProduct(Number(selectedProduct.id));
      toast.current?.show({
        severity: "success",
        summary: "Başarılı",
        detail: "Ürün başarıyla silindi",
        life: 3000,
      });
      setDeleteDialogVisible(false);
    }
  };

  const priceTemplate = (rowData: Product) => {
    return `$${rowData.price.toFixed(2)}`;
  };

  const stockTemplate = (rowData: Product) => {
    const severity = rowData.stock <= 10 ? "danger" : rowData.stock <= 20 ? "warning" : "success";
    return <Tag value={rowData.stock.toString()} severity={severity} />;
  };

  const ratingTemplate = (rowData: Product) => {
    return (
      <div className="flex items-center gap-2">
        <span className="text-yellow-500">★</span>
        <span>{rowData.rating}</span>
      </div>
    );
  };

  const actionTemplate = (rowData: Product) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-eye"
          className="p-button-rounded p-button-info p-button-outlined p-button-sm"
          tooltip="Detayları Göster"
          onClick={() => {
            setSelectedProduct(rowData);
            setIsEditing(false);
            setDialogVisible(true);
          }}
        />
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-warning p-button-outlined p-button-sm"
          tooltip="Düzenle"
          onClick={() => {
            setSelectedProduct(rowData);
            setIsEditing(true);
            setDialogVisible(true);
          }}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger p-button-outlined p-button-sm"
          tooltip="Sil"
          onClick={() => {
            setSelectedProduct(rowData);
            setDeleteDialogVisible(true);
          }}
        />
      </div>
    );
  };

  const renderDialog = () => {
    const categories = ["beauty", "electronics", "fashion", "home", "sports"];

    return (
      <Dialog
        visible={dialogVisible}
        style={{ width: "70vw" }}
        header={
          <div className="flex items-center gap-3">
            <i className={`pi ${isEditing ? "pi-pencil" : "pi-info-circle"} text-2xl`}></i>
            <span className="text-xl font-semibold">
              {isEditing ? "Ürün Düzenle" : "Ürün Detayları"}
            </span>
          </div>
        }
        modal
        className="p-fluid"
        footer={
          <div className="flex justify-end gap-2">
            
            {isEditing && (
              <Button
                label="Kaydet"
                icon="pi pi-check"
                onClick={handleUpdate}
                className="p-2 text-white bg-green-500 border"
              />
            )}
          </div>
        }
        onHide={() => setDialogVisible(false)}
      >
        {selectedProduct && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="col-span-2">
                <img
                  src={selectedProduct.images[0]}
                  alt={selectedProduct.title}
                  className="object-cover w-full h-64 rounded-lg shadow-lg"
                />
              </div>

              {isEditing ? (
                <>
                  <div className="field">
                    <label className="block mb-2 font-semibold">Başlık</label>
                    <InputText
                      value={selectedProduct.title}
                      onChange={(e) =>
                        setSelectedProduct({
                          ...selectedProduct,
                          title: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="field">
                    <label className="block mb-2 font-semibold">Kategori</label>
                    <Dropdown
                      value={selectedProduct.category}
                      options={categories}
                      onChange={(e) =>
                        setSelectedProduct({
                          ...selectedProduct,
                          category: e.value,
                        })
                      }
                      placeholder="Kategori seçin"
                    />
                  </div>
                  <div className="field">
                    <label className="block mb-2 font-semibold">Fiyat</label>
                    <InputNumber
                      value={selectedProduct.price}
                      onValueChange={(e) =>
                        setSelectedProduct({
                          ...selectedProduct,
                          price: e.value || 0,
                        })
                      }
                      mode="currency"
                      currency="USD"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <span className="font-semibold">Başlık:</span>
                    <p className="mt-1">{selectedProduct.title}</p>
                  </div>
                  <div>
                    <span className="font-semibold">Kategori:</span>
                    <p className="mt-1">{selectedProduct.category}</p>
                  </div>
                  <div>
                    <span className="font-semibold">Fiyat:</span>
                    <p className="mt-1">${selectedProduct.price.toFixed(2)}</p>
                  </div>
                </>
              )}
            </div>

            <div className="space-y-4">
              {isEditing ? (
                <>
                  <div className="field">
                    <label className="block mb-2 font-semibold">Stok</label>
                    <InputNumber
                      value={selectedProduct.stock}
                      onValueChange={(e) =>
                        setSelectedProduct({
                          ...selectedProduct,
                          stock: e.value || 0,
                        })
                      }
                    />
                  </div>
                  <div className="field">
                    <label className="block mb-2 font-semibold">Açıklama</label>
                    <InputTextarea
                      value={selectedProduct.description}
                      onChange={(e) =>
                        setSelectedProduct({
                          ...selectedProduct,
                          description: e.target.value,
                        })
                      }
                      rows={5}
                    />
                  </div>
                  <div className="field">
                    <label className="block mb-2 font-semibold">Marka</label>
                    <InputText
                      value={selectedProduct.brand}
                      onChange={(e) =>
                        setSelectedProduct({
                          ...selectedProduct,
                          brand: e.target.value,
                        })
                      }
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <span className="font-semibold">Stok:</span>
                    <p className="mt-1">{selectedProduct.stock}</p>
                  </div>
                  <div>
                    <span className="font-semibold">Açıklama:</span>
                    <p className="mt-1">{selectedProduct.description}</p>
                  </div>
                  <div>
                    <span className="font-semibold">Garanti:</span>
                    <p className="mt-1">{selectedProduct.warrantyInformation}</p>
                  </div>
                  <div>
                    <span className="font-semibold">Marka:</span>
                    <p className="mt-1">{selectedProduct.brand}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </Dialog>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        Error: {error instanceof Error ? error.message : "An error occurred"}
      </div>
    );
  }

  return (
    <div className="pt-5">
      <Toast ref={toast} />
      <ConfirmDialog
        visible={deleteDialogVisible}
        onHide={() => setDeleteDialogVisible(false)}
        message="Bu ürünü silmek istediğinizden emin misiniz?"
        header="Silme Onayı"
        icon="pi pi-exclamation-triangle"
        accept={handleDelete}
        reject={() => setDeleteDialogVisible(false)}
        acceptLabel="Evet"
        rejectLabel="Hayır"
        className=""
      />
      <div className="flex justify-start">
        <InputText
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Tabloda ara"
          className="p-2 my-2 border"
          
        />
      </div>
      <div>
        <DataTable
          value={products}
          tableStyle={{ minWidth: "50rem" }}
          paginator
          rows={rows}
          rowsPerPageOptions={[5, 10, 25, 50]}
          first={first}
          onPage={(e) => {
            setFirst(e.first);
            setRows(e.rows);
          }}
          sortMode="multiple"
          removableSort
          className="p-datatable-sm"
          globalFilter={globalFilter}
        >
          <Column field="title" header="Başlık" sortable />
          <Column field="category" header="Kategori" sortable />
          <Column field="price" header="Fiyat" body={priceTemplate} sortable />
          <Column field="stock" header="Stok" body={stockTemplate} sortable />
          <Column field="rating" header="Puan" body={ratingTemplate} sortable />
          <Column
            header="Aksiyonlar"
            body={actionTemplate}
            style={{ width: "180px" }}
          />
        </DataTable>
        {renderDialog()}
      </div>
    </div>
  );
};

export default Contents;
