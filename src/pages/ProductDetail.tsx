import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { CirclePlus, CircleMinus } from "lucide-react";
import useCartStore from "../store/cartStore";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function ProductDetail() {
  const { id } = useParams();
  const { addToCart, loadCartFromLocalStorage } = useCartStore();
  const [product, setProduct] = useState<any>(null);
  const [counter, setCounter] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    loadCartFromLocalStorage();
  }, [loadCartFromLocalStorage]);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem("products-storage");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        const products = parsedData?.state?.products || [];
        const foundProduct = products.find(
          (item: { id: number }) => item.id === Number(id)
        );

        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          setIsError(true);
        }
      } else {
        setIsError(true);
      }

      setIsLoading(false);
    } catch (error) {
      setIsError(true);
      setIsLoading(false);
    }
  }, [id]);

  const increaseCounter = () => setCounter((prev) => prev + 1);
  const decreaseCounter = () => setCounter((prev) => Math.max(prev - 1, 1));

  const handleAddToCart = () => {
    if (product) {
      addToCart({ ...product, quantity: counter });
      toast("Ürün Sepete Eklendi", {
        description: `${counter} Adet "${product.title}" Ürünü Sepete Eklendi`,
        action: {
          label: "Kapat",
          onClick: () => console.log("Kapat"),
        },
      });
    }
  };

  if (isLoading) return <p className="text-center text-xl">Yükleniyor...</p>;

  if (isError)
    return <p className="text-center text-xl text-red-500">Ürün Bulunamadı</p>;

  return (
    <div>
      <Header />
      <div className="container mx-auto px-4 py-10 max-w-7xl pt-[90px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="relative">
            <img
              src={product.thumbnail}
              alt={product.title}
              className="rounded-xl shadow-lg object-cover w-full h-full max-h-[500px]"
            />
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-gray-800">
              {product.title}
            </h2>
            <p className="text-xl text-gray-600">{product.price} $</p>
            <p className="text-gray-700 text-lg">{product.description}</p>

            <div>
              <div className="flex items-center space-x-4 mt-4">
                <button
                  onClick={decreaseCounter}
                  className="bg-gray-200 p-2 rounded-full hover:bg-gray-300 transition-colors"
                >
                  <CircleMinus size={20} />
                </button>
                <p className="text-lg font-medium">{counter}</p>
                <button
                  onClick={increaseCounter}
                  className="bg-gray-200 p-2 rounded-full hover:bg-gray-300 transition-colors"
                >
                  <CirclePlus size={20} />
                </button>
              </div>

              <div className="mt-6">
                <Button onClick={handleAddToCart}>Sepete Ekle</Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 space-y-6">
          {product?.reviews?.map((item: any, index: number) => (
            <div
              key={index}
              className="border rounded-lg shadow-lg p-6 bg-white hover:bg-gray-50 transition duration-300"
            >
              <div className="flex items-start space-x-4">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {item.comment}
                  </h3>
                  <div className="text-yellow-500 flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`h-5 w-5 ${
                          i < item.rating ? "fill-current" : "text-gray-300"
                        }`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M10 15l-5.3 2.8 1-5.9L1 6.7l5.9-.9L10 1l2.1 4.9 5.9.9-3.7 5.2 1 5.9L10 15z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-600 mt-2">{item.reviewerName}</p>
                  <p className="text-gray-500 mt-1 text-sm">
                    {new Date(item.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ProductDetail;
