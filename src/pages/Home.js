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
      <Navbar />
      <div style={{ padding: '2rem' }}>
        <h1>Featured Products</h1>
        {products.length === 0 ? (
          <p>No products available.</p>
        ) : (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1.5rem',
            marginTop: '1rem'
          }}>
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

