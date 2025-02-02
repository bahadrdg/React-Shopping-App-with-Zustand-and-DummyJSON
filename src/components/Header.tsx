import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import useCartStore from "../store/cartStore";
import Cookies from "js-cookie";
import { Button } from "./ui/button";
import { useNavigate } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { cart, removeFromCart, getTotalPrice } = useCartStore();
  const totalPrice = getTotalPrice();
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("accessToken");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    Cookies.remove("accessToken");
    setIsLoggedIn(false);

    window.location.reload();
  };

  return (
    <div className="fixed z-50 w-full bg-white">
      <div className="m-2 bg-teal-300 rounded-md ">
        <div className="container flex justify-between p-3 px-4 mx-auto text-white md:px-8 lg:px-16">
          <a className="flex items-center" href="/">
            <p className="text-2xl max-lg:text-xl">Dummy E-Ticaret</p>
          </a>

          <div className="flex items-center space-x-2 ">
            <div className={`${isLoggedIn ? "" : "hidden"}`}>
              <Popover>
                <PopoverTrigger>
                  <p className="relative flex items-center p-2 space-x-2 border rounded-lg">
                    <p>Sepetim</p>
                    <ShoppingCart />
                    <Avatar className="absolute -right-2 -top-2">
                      <AvatarImage />
                      <AvatarFallback className="text-red-600">
                        {cart.length}
                      </AvatarFallback>
                    </Avatar>
                  </p>
                </PopoverTrigger>
                <PopoverContent>
                  <ScrollArea className="h-[500px] w-[300px] px-2">
                    <div className="pb-2 font-semibold border-b ">
                      <div className="flex justify-between">
                        <h1 className="text-xl">Sepetim ({cart.length})</h1>
                        <h1>Toplam Fiyat: {totalPrice} $</h1>
                      </div>

                      {cart.length === 0 ? (
                        <p className="text-center text-gray-500">
                          Sepetiniz Boş
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {cart.map((item) => (
                            <div
                              className="flex items-center p-4 bg-white rounded-lg shadow-md"
                              key={item.id}
                            >
                              <img
                                src={item.thumbnail}
                                alt={item.title}
                                className="object-cover rounded-lg w-14 h-14"
                              />
                              <div className="flex-1">
                                <p className="font-semibold">{item.title}</p>
                                <p className="text-sm text-gray-600">
                                  {item.quantity} adet
                                </p>
                              </div>
                              <Button
                                variant={"destructive"}
                                onClick={() => removeFromCart(item.id)}
                                className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
                              >
                                Sil
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                  <div className="pt-2 ">
                    <Button
                      onClick={() => navigate("/my-card")}
                      className="w-full"
                    >
                      Sepeti Onayla
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger className="p-2 border rounded-lg">
                Hesabım
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {isLoggedIn ? (
                  <>
                    <DropdownMenuItem>
                      <button onClick={handleLogout}>Çıkış Yap</button>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuLabel>
                      <a onClick={() => navigate("/login")} href="">
                        Giriş Yap
                      </a>
                    </DropdownMenuLabel>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
