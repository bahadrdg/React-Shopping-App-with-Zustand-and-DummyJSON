import Footer from "./components/Footer";
import Header from "./components/Header";
import { Switch } from "@/components/ui/switch";
import Contents from "@/components/Contents";
import { useState } from "react";
import Products from "./components/Products";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

function App() {
  const [isContentView, setIsContentView] = useState(false); // New state to manage the switch

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 md:px-8 lg:px-16 py-5 pt-[90px]">
        <div className="flex items-center space-x-2 ">
          <div className="flex items-center space-x-4 border p-2 rounded-lg">
            <div className=" flex flex-col">
              <p className="text-sm text-opacity-80">
                Ana sayfa içerikleri ile içerik sayfaları arasında geçiş yapmak
                için switch'i kullanın.
              </p>
            </div>
            <div>
              <Switch
                checked={isContentView} // Bind switch state
                onCheckedChange={() => setIsContentView(!isContentView)} // Toggle content view state
              />
            </div>
          </div>
        </div>

        <div className="">
          {isContentView ? (
            <div className="col-span-4 text-center">
              <Contents></Contents>
            </div>
          ) : (
            <>
              <Products />
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default App;
