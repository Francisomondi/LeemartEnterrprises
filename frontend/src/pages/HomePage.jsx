import { useEffect } from "react";
import CategoryItem from "../components/CategoryItem";
import { useProductStore } from "../stores/useProductStore";
import FeaturedProducts from "../components/FeaturedProducts";
import { motion } from "framer-motion";



const categories = [
  { href: "/pants", name: "Pants", imageUrl: "/jeans.jpg" },
  { href: "/t-shirts", name: "Shirts", imageUrl: "/tshirts.jpg" },
  { href: "/shoes", name: "Shoes", imageUrl: "/shoes.jpg" },
  { href: "/sandals", name: "Sandals", imageUrl: "/glasses.png" },
  { href: "/jackets", name: "Jackets", imageUrl: "/jackets.jpg" },
  { href: "/suits", name: "Suits", imageUrl: "/suits.jpg" },
  { href: "/bags", name: "Bags", imageUrl: "/bags.jpg" },
  { href: "/dresses", name: "Dresses", imageUrl: "/dresses.jpg" },
  { href: "/twopiece", name: "two piece", imageUrl: "/twopiece.jpg" },
  { href: "/hoodies", name: "Hoodies", imageUrl: "/hoodies.jpg" },
  { href: "/shorts", name: "Shorts", imageUrl: "/shorts.jpg" },
  { href: "/hats", name: "Hats", imageUrl: "/hats.jpeg" },
 
];

const HomePage = () => {
  const { fetchFeaturedProducts, products, isLoading } = useProductStore();

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  return (
    <div className="relative min-h-screen text-white overflow-hidden bg-gray-900">
      
      {/* Hero Section */}
   
      <section
         className="
          relative
          h-[250px]
          sm:h-[400px]
          md:h-[520px]
          lg:h-[620px]
          xl:h-[720px]
          bg-no-repeat
          bg-center
          bg-contain
        "
        style={{
          backgroundImage: "url('/banner.png')",
          backgroundSize: "contain",
          backgroundPosition: "center",
        }}  
      >
        {/* Transparent Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Optional Emerald Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/40 via-black/20 to-transparent"></div>

        {/* Content */}
        <div className="relative z-10 w-full h-full flex items-center justify-center px-6">
       <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4">
          <a
            href="/products"
            className="
              px-4 py-2
              text-sm
              sm:px-4 sm:py-2
              sm:text-base
              bg-emerald-600
              hover:bg-emerald-700
              rounded-full
              font-semibold
              transition
              shadow-lg
            "
          >
            Shop Now
          </a>

          <a
            href="https://wa.me/254119712745"
            target="_blank"
            rel="noreferrer"
            className="
              px-5 py-2.5
              text-sm
              sm:px-4 sm:py-2
              sm:text-base
              bg-white/10
              backdrop-blur-md
              border
              border-white/30
              hover:bg-white/20
              rounded-full
              font-semibold
              transition
            "
          >
            WhatsApp Us
          </a>
        </div>
      </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <h2 className="text-3xl font-semibold text-emerald-400 mb-6 text-center mt-6">
          Shop by Category
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryItem 
              category={category} 
              key={category.name} 
              className="transform hover:scale-105 transition duration-300 ease-in-out"
            />
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        
        {isLoading ? (
          <p className="text-center text-gray-400">Loading featured products...</p>
        ) : (
          products.length > 0 && <FeaturedProducts featuredProducts={products} />
        )}
      </section>

    </div>
  );
};

const Badge = ({ icon, text }) => (
  <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-gray-800/70 text-gray-300 text-sm shadow">
    <span>{icon}</span>
    <span>{text}</span>
  </div>
);

export default HomePage;
