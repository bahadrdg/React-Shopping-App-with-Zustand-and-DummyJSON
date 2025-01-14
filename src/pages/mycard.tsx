import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import useCartStore from "@/store/cartStore";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

function Mycard() {
  const { cart, loadCartFromLocalStorage, removeFromCart, removeAllCart, getTotalPrice } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    loadCartFromLocalStorage();
  }, [loadCartFromLocalStorage]);

  const confirmCart = () => {
    removeAllCart();
    toast.success("Ürünler Başarıyla Satın Alındı", {
      action: {
        label: "Kapat",
        onClick: () => console.log("Kapatıldı"),
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 md:px-8 lg:px-16 py-5 pt-[90px]">
        {cart.length === 0 ? (
          <div className="text-center">
            <div className="text-xl font-semibold text-gray-700">Sepetiniz Boş</div>
            <Button onClick={() => navigate("/")} className="mt-4">
              Ana Sayfaya Dön
            </Button>
          </div>
        ) : (
          <div>
            <div className="py-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {cart?.map((item) => (
                <div
                  className="flex flex-col items-start p-5 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  key={item.id}
                >
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                  <div className="flex-1 w-full">
                    <p className="font-semibold text-lg text-gray-800">{item.title}</p>
                    <p className="text-sm text-gray-600">{item.quantity} adet</p>
                    <p className="mt-2 text-gray-900 font-bold">{(item.price * item.quantity).toFixed(2)} $</p>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() => removeFromCart(item.id)}
                    className="mt-4 text-white rounded-lg px-4 py-2 w-full"
                  >
                    Sil
                  </Button>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-between items-center bg-white p-5 rounded-lg shadow-md">
              <div className="text-lg font-semibold text-gray-800">Toplam:</div>
              <div className="text-xl font-bold text-gray-900">{getTotalPrice().toFixed(2)} $</div>
            </div>

            <div className="mt-6 flex justify-center">
              <Button onClick={confirmCart} className="">
                Sepeti Onayla
              </Button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Mycard;
