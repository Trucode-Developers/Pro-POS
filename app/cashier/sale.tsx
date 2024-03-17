"use client";
import { useState, useRef, useEffect } from "react";
// import debounce from "lodash/debounce";
import Link from "next/link";
import { HiOutlineSearchCircle } from "react-icons/hi";

interface Product {
  name: string;
  price: number;
  brand: string;
}

function debounce(func: (...args: any[]) => void, delay: number) {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

export default function Sale() {
  const [searchTerm, setSearchTerm] = useState("");
  const [matchingProducts, setMatchingProducts] = useState<Product[]>([]);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [cache, setCache] = useState<Record<string, Product[]>>({});

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);
    setIsOverlayVisible(false); // Hide the overlay while loading the new matching products
    debouncedGetMatchingProducts(searchTerm);
  };

  const getMatchingProducts = async (searchTerm: string) => {
    if (cache[searchTerm]) {
      setMatchingProducts(cache[searchTerm]);
      setIsOverlayVisible(true);
      return;
    }
    // const response = await fetch(`/api/products?searchTerm=${searchTerm}`);
    // const matchingProducts = await response.json();
    const matchingProducts: Product[] = [
      { name: "Product 1", price: 10.99, brand: "Brand A" },
      { name: "Product 2", price: 20.99, brand: "Brand B" },
      { name: "Product 3", price: 30.99, brand: "Brand C" },
      { name: "Product 4", price: 40.99, brand: "Brand D" },
    ];
    setCache((prevCache) => ({
      ...prevCache,
      [searchTerm]: matchingProducts,
    }));
    setMatchingProducts(matchingProducts);
    setIsOverlayVisible(true);
  };
  const debouncedGetMatchingProducts = useRef(
    debounce(getMatchingProducts, 500)
  ).current;

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (!overlayRef.current?.contains(event.target as Node)) {
        setIsOverlayVisible(false);
      }
    };
    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  const handleProductSelect = (product: Product) => {
    // Do something with the selected product
    setIsOverlayVisible(false);
  };

  const renderMatchingProducts = () => {
    if (matchingProducts.length === 0) {
      return <p>No matching products found</p>;
    }
    return matchingProducts.map((product) => (
      <div
        key={product.name}
        onClick={() => handleProductSelect(product)}
        className="px-4 py-2 hover:bg-gray-100"
      >
        <p>{product.name}</p>
        <p>{product.brand}</p>
        <p>${product.price}</p>
      </div>
    ));
  };

  return (
    <div>
      <div className="relative">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="flex items-center justify-center w-full mt-5 lg:mt-10">
            <input
              type="search"
              className="border-2 border-gray-300 bg-white  sm:w-[90%] md:w-[70%] px-5 py-1 pr-16 rounded-lg focus:outline-none text-center"
              placeholder="Search for products, brands and more/ Scan barcode"
              value={searchTerm}
              onChange={handleInputChange}
            />
            <HiOutlineSearchCircle className="-ml-10 text-2xl font-bold text-gray-400 cursor-pointer md:text-3xl" />
          </div>
          {isOverlayVisible && (
            <div className="relative w-full sm:w-[90%] md:w-[70%]">
              <div
                ref={overlayRef}
                className="absolute bg-primary left-0 right-0 mt-1 bg-white border border-gray-300 divide-y divide-gray-300 w-full max-h-[300px] overflow-y-auto z-10"
              >
                {renderMatchingProducts()}
              </div>
            </div>
          )}

          <Link href="/" className="px-4 py-2 m-10 bg-yellow-500 rounded-xl">
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
