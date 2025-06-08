import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { db, storage } from '../firebase/config';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
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
    const { name, category, price, imageFile } = newProduct;
    if (!newProduct.name || !newProduct.category || !newProduct.price) {
      alert("Fill all fields");
      return;
    }
    let imageUrl = null;

  // If an image is selected, upload it
    if (imageFile) {
      try {
        const imageRef = ref(storage, `products/${Date.now()}-${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(imageRef);
      } catch (err) {
        alert("Image upload failed, saving without image.");
      }
    }

    await addDoc(collection(db, 'products'), {
      name,
      category,
      price: Number(price),
      image: imageUrl || null
    });
    // Upload image
    //const imageRef = ref(storage, `products/${Date.now()}-${newProduct.imageFile.name}`);
    //await uploadBytes(imageRef, newProduct.imageFile);
    //const imageUrl = await getDownloadURL(imageRef);

    //await addDoc(collection(db, 'products'), {
     // name: newProduct.name,
      //category: newProduct.category,
      //price: Number(newProduct.price),
      //image: imageUrl,
    //});

    setNewProduct({ name: '', category: '', price: '', imageFile: null });
    fetchProducts();
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'products', id));
    fetchProducts();
  };

  return (
    <>
      <Navbar />
      <button onClick={() => signOut(auth)} style={{
  	position: 'absolute',
  	right: '2rem',
  	top: '1rem',
  	background: '#ef4444',
  	color: 'white',
  	border: 'none',
  	padding: '0.5rem 1rem',
  	borderRadius: '4px',
 	cursor: 'pointer'
	}}>
  	Logout
	</button>	  
      <div style={{ padding: '2rem' }}>
        <h2>Admin Dashboard</h2>

        <h3>Add New Product</h3>
        <input
          type="text"
          placeholder="Name"
          value={newProduct.name}
          onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Category"
          value={newProduct.category}
          onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          value={newProduct.price}
          onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
        />
        <input
          type="file"
          onChange={e => setNewProduct({ ...newProduct, imageFile: e.target.files[0] })}
        />
        <button onClick={handleAddProduct}>Add Product</button>

        <h3 style={{ marginTop: '2rem' }}>Existing Products</h3>
        <ul>
          {products.map(product => (
            <li key={product.id}>
              <img src={product.image} alt={product.name} style={{ height: 50, marginRight: 10 }} />
              {product.name} — ${product.price} ({product.category})
              <button onClick={() => handleDelete(product.id)} style={{ marginLeft: '1rem' }}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default AdminDashboard;

