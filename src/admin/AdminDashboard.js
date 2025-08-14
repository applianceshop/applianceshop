import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { db, storage } from '../firebase/config';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { Link } from 'react-router-dom';
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  updateDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);	
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    imageFile: null
  });

  const fetchProducts = async () => {
    const snapshot = await getDocs(collection(db, 'products'));
    const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProducts(items);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async () => {
    const { name, category, price, imageFile, stock } = newProduct;
  
    if (!name || !category || !price || !stock) {
      alert('Please fill all fields.');
      return;
    }
  
    try {
      let imageUrl = editingProduct?.image || ''; // Default to existing image if editing
  
      // Upload new image only if user selected one
      if (imageFile) {
        const imageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(imageRef);
      }
  
      if (editingProduct) {
        // 🔄 Update existing product
        const productRef = doc(db, 'products', editingProduct.id);
        await updateDoc(productRef, {
          name,
          category,
          price: parseFloat(price),
          image: imageUrl, // will be either new or existing
          stock: parseInt(stock)
        });
        setEditingProduct(null);
      } else {
        // 🆕 Add new product
        await addDoc(collection(db, 'products'), {
          name,
          category,
          price: parseFloat(price),
          image: imageUrl || '', // will be empty string if no image uploaded
          stock: parseInt(stock)
        });
      }
  
      setNewProduct({ name: '', category: '', price: '', imageFile: null, stock: '' });
      fetchProducts();
    } catch (error) {
      console.error('Error adding/updating product:', error);
    }
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'products', id));
    fetchProducts();
  };
  const handleEdit = (product) => {
    setNewProduct({
      name: product.name,
      category: product.category,
      price: product.price,
      imageFile: null,
      stock: product.stock
    });
    setEditingProduct(product);
  };
  return (
  <>
    {/* <Navbar /> */}
    <button
      onClick={() => signOut(auth)}
      style={{color:'white',
        position: 'absolute',
        right: '2rem',
        top: '1rem',
        background: '#ef4444',
        color: 'white',
        border: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '4px',
        cursor: 'pointer'
      }}
    >
      Logout
    </button>

    <div style={{ padding: '2rem',color:'white' }}>
      <h2><b>Admin Dashboard</b></h2>

      <Link to="/admin/orders">
        <button class="text-sm font-medium text-button hover:text-white px-3 py-1 rounded hover:bg-gray-700 transition-colors border border-button focus:outline-none" style={{ marginBottom: '1rem', padding: '0.5rem 1rem' }}>
          View Orders
        </button>
      </Link>
<div class="bg-card rounded-lg shadow-lg px-6 py-1 border border-customgray mb-6">
              <div class="flex justify-between items-center space-x-4 py-4">
      <h3>Add New Product</h3>
      <input class="p-1 rounded w-80 text-sm text-gray-300 bg-panel focus:outline-none"
        type="text"
        placeholder="Name"
        value={newProduct.name}
        onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
      />
      <input
        type="text" class="p-1 rounded w-80 text-sm text-gray-300 bg-panel focus:outline-none" 
        placeholder="Category"
        value={newProduct.category}
        onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
      />
      <input
        type="number" class="p-1 rounded w-80 text-sm text-gray-300 bg-panel focus:outline-none"
        placeholder="Price"
        value={newProduct.price}
        onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
      />
      <input
        type="file"
        onChange={e => setNewProduct({ ...newProduct, imageFile: e.target.files[0] })}
      />
      <input class="p-1 rounded w-80 text-sm text-gray-300 bg-panel focus:outline-none"
        type="number"
        placeholder="Stock"
        value={newProduct.stock || ''}
        onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })}
      />
      <button onClick={handleAddProduct}>
        {editingProduct ? 'Update Product' : 'Add Product'}
      </button>
</div>
</div>
      <h3 style={{ marginTop: '2rem' }}>Existing Products</h3>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            <img
              src={product.image}
              alt={product.name}
              style={{ height: 50, marginRight: 10 }}
            />
            <strong>{product.name}</strong> — ${product.price} ({product.category}) — Stock: {product.stock}
            <button class="text-sm font-medium text-button hover:text-white px-3 py-1 rounded hover:bg-gray-700 transition-colors border border-button focus:outline-none"
              onClick={() => handleDelete(product.id)}
              style={{ marginLeft: '1rem' }}
            >
              Delete
            </button> 
			<button class="text-sm font-medium text-button hover:text-white px-3 py-1 rounded hover:bg-gray-700 transition-colors border border-button focus:outline-none" onClick={() => handleEdit(product)} style={{ marginLeft: '0.5rem' }}>
              Edit
            </button>
          </li>
        ))}
      </ul>
    </div>
  </>
);
};

export default AdminDashboard;
