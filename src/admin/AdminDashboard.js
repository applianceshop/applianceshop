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
  const [addCategory, setAddCategory] = useState();	
  const [categToADD, setCategToADD] = useState();	
  
  
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    imageFile: null
  });
  const [categories,setCategories] = useState([]);
   
    const fetchCategories = async () => {
     const categ = await getDocs(collection(db, 'categories'));
     const items = categ.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    setCategories(items)
    }

  const fetchProducts = async () => {
    const snapshot = await getDocs(collection(db, 'products'));
    const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProducts(items);
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
    
  }, []);

  const handleAddProduct = async () => {
    const { name, category, price, imageFile, stock } = newProduct;
  
    if (!name || !category || !price || !stock ||!imageFile) {
      alert('Please fill all fields and the image.');
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
      <h2 style={{marginBottom:'10px'}}><b>Admin Dashboard</b></h2>

      <Link to="/admin/orders">
        <button className="text-sm font-medium text-button hover:text-white px-3 py-1 rounded hover:bg-gray-700 transition-colors border border-button focus:outline-none" style={{ marginBottom: '1rem', padding: '0.5rem 1rem' }}>
          View Orders
        </button>
      </Link>
       <button onClick={()=>setAddCategory(true)} className="text-sm font-medium text-button hover:text-white px-3 py-1 mx-3 rounded hover:bg-gray-700 transition-colors border border-button focus:outline-none" style={{ marginBottom: '1rem', padding: '0.5rem 1rem' }}>
          Add New Category
        </button>
        {addCategory ? <div>
          <label>Category To insert To DB</label>
          <input className="p-1 rounded w-80 text-sm text-gray-300 bg-panel focus:outline-none"
        type="text"
    style={{backgroundColor:'white' ,color:'black' ,marginLeft:'5px'}}
        value={categToADD}
        onChange={e => setCategToADD(e.target.value )}
      />
      <button onClick={async ()=>{
        await addDoc(collection(db, 'categories'), {
              category:categToADD
              
            })
            fetchCategories();
          alert("Category added Successfully")
          }
      } className="text-sm font-medium text-button hover:text-white px-3 py-1 mx-3 rounded hover:bg-gray-700 transition-colors border border-button focus:outline-none" style={{ marginBottom: '1rem', padding: '0.5rem 1rem' }}>
          Confirm
        </button>
        </div>: null}
<div className="bg-card rounded-lg shadow-lg px-6 py-1 border border-customgray mb-6">
              <div className="flex justify-between items-center space-x-4 py-4">
      <h3>Add New Product</h3>
      <label>Name</label>
      <input className="p-1 rounded w-80 text-sm text-gray-300 bg-panel focus:outline-none"
        type="text"
    
        value={newProduct.name}
        onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
      />
      {/* <input
        type="text" className="p-1 rounded w-80 text-sm text-gray-300 bg-panel focus:outline-none" 
        placeholder="Category"
        value={newProduct.category}
        onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
      /> */}
      <label>Category</label>
      <select id="catergory" placeholder="category"  style={{color:'white'}} className="p-1 rounded w-80 text-sm text-gray-300 bg-panel focus:outline-none" 
        value={newProduct.category}
        onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
      
      >
        <option key={0} value=""></option>
        {categories.length === 0 ? (<p>loading...</p>) : categories.map(category => (
          <option  value={category.category}>{category.category}</option>
          ))}
          
       
          {/* <option key={1} value="cleaning">cleaning</option>
          <option key={2} value="test">test</option> */}
      </select>
      <label>Price</label>
      <input
        type="number" className="p-1 rounded w-80 text-sm text-gray-300 bg-panel focus:outline-none"
        
        value={newProduct.price}
        onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
      />
      <div>
      <label className="text-sm font-medium text-button hover:text-white px-3 py-1 rounded hover:bg-gray-700 transition-colors border border-button focus:outline-none" for="files" style={{color:'white'}} >{newProduct.imageFile ? newProduct.imageFile.name : 'Add Image'}</label>
      <input  id="files" style={{display:"none"}}
     
        type="file" 
        onChange={e => setNewProduct({ ...newProduct, imageFile: e.target.files[0] })}
      />
      </div>
      <label>Stock</label>
      <input className="p-1 rounded w-80 text-sm text-gray-300 bg-panel focus:outline-none"
        type="number"
        value={newProduct.stock || ''}
        onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })}
      />
      <button className="text-sm font-medium text-button hover:text-white px-3 py-1 rounded hover:bg-gray-700 transition-colors border border-button focus:outline-none" onClick={handleAddProduct}>
        {editingProduct ? 'Update Product' : 'Add Product'}
      </button>
</div>
</div>
      <h3 style={{ marginTop: '2rem' }}>Existing Products</h3>
      <ul>
        {products.map(product => (
         
          <li key={product.id}>
             <div style={{display:'flex',flexDirection:'row', margin:'5px'}}>
            <img
              src={product.image}
              alt={product.name}
              style={{ height: 50, marginRight: 10 }}
            />
            <strong>{product.name}</strong> — ${product.price} ({product.category}) — Stock: {product.stock}
            <button className="text-sm font-medium text-button hover:text-white px-3 py-1 rounded hover:bg-gray-700 transition-colors border border-button focus:outline-none"
              onClick={() => {
                if (window.confirm(" you are abou to delete the product")) {
        // Perform the action
      handleDelete(product.id)
      } else {
        // User cancelled
        console.log("delete cancelled.");
      }
                }}
              style={{ marginLeft: '1rem' }}
            >
              Delete
            </button> 
			<button className="text-sm font-medium text-button hover:text-white px-3 py-1 rounded hover:bg-gray-700 transition-colors border border-button focus:outline-none" onClick={() => handleEdit(product)} style={{ marginLeft: '0.5rem' }}>
              Edit
            </button>
            </div>
          </li>
        
        ))}
      </ul>
    </div>
  </>
);
};

export default AdminDashboard;
