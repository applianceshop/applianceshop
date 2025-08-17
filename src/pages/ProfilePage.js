import React, { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      const docRef = doc(db, 'users', user.uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        setName(data.name || '');
        setAddress(data.address || '');
        setPhone(data.phone || '');
      }
    };
    loadProfile();
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;

    await setDoc(doc(db, 'users', user.uid), {
      name,
      address,
      phone
    });

    alert('Profile updated!');
    navigate('/');
  };

  return (
    <div style={{ color: 'white', padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
      <h2>Update Your Profile</h2>
      <form onSubmit={handleSave}>
        <label>Name:</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} required style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', color: 'black' }} />

        <label>Phone:</label>
        <input type="text" value={phone} onChange={e => setPhone(e.target.value)} required style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', color: 'black' }} />

        <label>Address:</label>
        <textarea value={address} onChange={e => setAddress(e.target.value)} required rows="4" style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', color: 'black' }} />

        <button type="submit" style={{ padding: '0.5rem 1rem', backgroundColor: '#1f2937', color: 'white', border: 'none', borderRadius: '4px' }}>
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
