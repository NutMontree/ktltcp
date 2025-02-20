import Image from "next/image";
import { Product } from "@/types/product";

const productData: Product[] = [
  {
    image: "/images/product/product-01.png",
    name: "Apple Watch Series 7",
    category: "Electronics",
    price: 296,
    sold: 22,
    profit: 45,
  },
  {
    image: "/images/product/product-02.png",
    name: "Macbook Pro M1",
    category: "Electronics",
    price: 546,
    sold: 12,
    profit: 125,
  },
  {
    image: "/images/product/product-03.png",
    name: "Dell Inspiron 15",
    category: "Electronics",
    price: 443,
    sold: 64,
    profit: 247,
  },
  {
    image: "/images/product/product-04.png",
    name: "HP Probook 450",
    category: "Electronics",
    price: 499,
    sold: 72,
    profit: 103,
  },
];

const TableTwo = () => {
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="px-4 py-6 md:px-6 xl:px-7.5">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          Top Products
        </h4>
      </div>

      <div className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
        <div className="col-span-3 flex items-center">
          <div className="font-medium">Product Name</div>
        </div>
        <div className="col-span-2 hidden items-center sm:flex">
          <div className="font-medium">Category</div>
        </div>
        <div className="col-span-1 flex items-center">
          <div className="font-medium">Price</div>
        </div >
        <div className="col-span-1 flex items-center">
          <div className="font-medium">Sold</div>
        </div >
        <div className="col-span-1 flex items-center">
          <div className="font-medium">Profit</div>
        </div >
      </div >

      {
        productData.map((product, key) => (
          <div
            className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
            key={key}
          >
            <div className="col-span-3 flex items-center">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="h-12.5 w-15 rounded-md">
                  <Image
                    src={product.image}
                    width={60}
                    height={50}
                    alt="Product"
                  />
                </div>
                <div className="text-sm text-black dark:text-white">
                  {product.name}
                </div>
              </div>
            </div>
            <div className="col-span-2 hidden items-center sm:flex">
              <div className="text-sm text-black dark:text-white">
                {product.category}
              </div>
            </div >
            <div className="col-span-1 flex items-center">
              <div className="text-sm text-black dark:text-white">
                ${product.price}
              </div>
            </div >
            <div className="col-span-1 flex items-center">
              <div className="text-sm text-black dark:text-white">{product.sold}</div>
            </div >
            <div className="col-span-1 flex items-center">
              <div className="text-sm text-meta-3">${product.profit}</div>
            </div >
          </div >
        ))
      }
    </div >
  );
};

export default TableTwo;
