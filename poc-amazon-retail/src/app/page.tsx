import ProductList from "@/components/ProductList";
import SearchBox from "@/components/SearchBox";

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-xl font-semibold mb-4 text-black">Products</h1>
      <div className="mb-6">
        <SearchBox />
      </div>
      <ProductList />
    </main>
  );
}
