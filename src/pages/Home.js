import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';

const Home = () => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const snapshot = await getDocs(collection(db, 'products'));
    const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProducts(items);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <div className="bg-card rounded-lg shadow-lg px-6 py-1 border border-customgray mb-6"  >
        <h1 className="Product-container" style={{color:'white', fontWeight:'bold'}}>Products</h1>
        {products.length === 0 ? (
          <p>No products available.</p>
        ) : (
          <div className='product-items' >
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Home;

