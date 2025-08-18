import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import ProductCard from '../components/ProductCard';

const SearchResultsPage = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q')?.toLowerCase() || '';
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const productsSnapshot = await getDocs(collection(db, 'products'));
      const matched = productsSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(product =>
          product.name.toLowerCase().includes(query)
        );
      setResults(matched);
    };
    if (query) fetchProducts();
  }, [query]);

  return (
    <div style={{ color: 'white', padding: '2rem' }}>
      <h2>Search Results for: "{query}"</h2>

      {results.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div
          style={{ color:'black',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginTop: '1rem'
          }}
        >
          {results.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;
