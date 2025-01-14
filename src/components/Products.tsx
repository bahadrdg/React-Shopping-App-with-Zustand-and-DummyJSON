import React, { useState, useEffect } from "react";
import { CirclePlus, CircleMinus, RefreshCw } from "lucide-react";
import useCartStore from "@/store/cartStore";
import useProductsStore from "@/store/productsStore";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface CounterState {
  [key: number]: number;
}

function Products() {
  const navigate = useNavigate();
  const { products, isLoading, error, fetchProducts } = useProductsStore();
  
  const [counters, setCounters] = useState<CounterState>({});
  const [search, setSearch] = useState("");

  const { addToCart, loadCartFromLocalStorage } = useCartStore();


  useEffect(() => {
    loadCartFromLocalStorage();
  }, [loadCartFromLocalStorage]);

  const increaseCounter = (cardId: number) => {
    setCounters((prev) => ({
      ...prev,
      [cardId]: (prev[cardId] || 1) + 1,
    }));
  };

  const decreaseCounter = (cardId: number) => {
    setCounters((prev) => ({
      ...prev,
      [cardId]: Math.max((prev[cardId] || 1) - 1, 1),
    }));
  };

  const handleAddToCart = (e: React.MouseEvent, card:any) => {
    e.stopPropagation();
    const quantity = counters[card.id] || 1;
    addToCart({ ...card, id: card.id, quantity });

    toast("Ürün Sepete Eklendi", {
      description: `${quantity} Adet "${card.title}" Ürünü Sepete Eklendi`,
      action: {
        label: "Kapat",
        onClick: () => console.log("Kapat"),
      },
    });
  };

  const filteredData = products?.filter((card) =>
    card.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleProductClick = (id: number) => {
    navigate(`/product/${id}`);
  };

  const handleRefresh = () => {
    fetchProducts();
  };

  if (error) return `Hata: ${error.message}`;

  return (
    <div>
      <div className="flex justify-between items-center my-5">
        <Input
          className="flex-1 mr-4"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Ürün Ara..."
        />
        <Button 
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={isLoading ? "animate-spin" : ""} size={16} />
          Yenile
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          yükleniyor..
        </div>
      ) : (
        <div className="grid grid-cols-4 max-lg:grid-cols-2 max-md:grid-cols-1 gap-4">
          {filteredData?.length === 0 ? (
            <p className="col-span-4 text-center text-gray-500">
              Sonuç bulunamadı
            </p>
          ) : (
            filteredData?.map((card) => (
              <div
                className="relative border rounded-lg shadow-lg p-4 bg-white hover:scale-105 transition-all duration-300"
                key={card.id}
                onClick={() => handleProductClick(card.id)}
              >
                <img
                  src={card.thumbnail}
                  alt={card.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <div className="flex justify-between mb-2">
                  <p className="font-semibold ">{card.title}</p>
                  <p className="font-bold text-primary">{card.price} $</p>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        decreaseCounter(card.id);
                      }}
                      className="text-gray-700 hover:text-primary transition-colors"
                    >
                      <CircleMinus />
                    </button>
                    <p>{counters[card.id] || 1}</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        increaseCounter(card.id);
                      }}
                      className="text-gray-700 hover:text-primary transition-colors"
                    >
                      <CirclePlus />
                    </button>
                  </div>
                  <Button onClick={(e) => handleAddToCart(e, card)}>
                    Sepete Ekle
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Products;