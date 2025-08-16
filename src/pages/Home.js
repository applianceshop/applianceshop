import React, { use, useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories,setCategories] = useState([]);
  const [sortOrder, setSortOrder] = useState(''); 
  const fetchProducts = async () => {
   const categ = await getDocs(collection(db, 'categories'));
   const items = categ.docs.map(doc => ({ id: doc.id, ...doc.data() }));
   console.log("items"+items.length)
  //  if(items.length){
  //  console.log("items"+items.length)
   
  //    items.forEach(item => {
  // console.log("item"+item.category)
  // if(item.category){
  //       const option = document.createElement('option');
  //       option.value = item.category; // Set the value attribute
  //       option.textContent = item.category; // Set the visible text
  //       selectElement.appendChild(option); // Add the option to the select
  //       }
        

  //   });
  //   }
  setCategories(items)
    const snapshot = await getDocs(collection(db, 'products'));
    if(sortOrder){
    const items = snapshot.docs
  .filter(doc => doc.data().category.toUpperCase() === sortOrder.toUpperCase())
  .map(doc => ({ id: doc.id, ...doc.data() }));

setProducts(items);
}else{
   const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
setProducts(items);
}
  };

  useEffect(() => {
    fetchProducts();
  }, [sortOrder]);
  const selectElement = document.getElementById('catergory');

  return (
    <>
      <div className="bg-card rounded-lg shadow-lg px-6 py-1 border border-customgray mb-6"  >
        <h1 className="Product-container" style={{color:'white', fontWeight:'bold'}}>Products</h1>
        {/* Dropdown */}
      <label style={{ marginRight: '0.5rem',color:'white' }}>Sort by category:</label>
      <select id="catergory"
        value={sortOrder}
        onChange={e => {e.preventDefault();
          setSortOrder(e.target.value)}}
        style={{ padding: '0.25rem 0.5rem', marginBottom: '1rem' }}
      >
        <option key={0} value=""></option>
        {categories.length === 0 ? (<p>loading...</p>) : categories.map(category => (
          <option value={category.category}>{category.category}</option>
          ))}
          
       
          {/* <option key={1} value="cleaning">cleaning</option>
          <option key={2} value="test">test</option> */}
      </select>
        {products.length === 0 ? (
          <p style={{color:'white'}}>No products available.</p>
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

