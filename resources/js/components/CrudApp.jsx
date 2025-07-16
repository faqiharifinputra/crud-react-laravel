import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:8000/api/items';

const CrudApp = () => {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('default');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const navigate = useNavigate();

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error('Gagal ambil data:', err));
  }, []);

  const addItem = async () => {
    if (name.trim() !== '' && price) {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price, status: 'Pending' }),
      });
      const newItem = await res.json();
      setItems([...items, newItem]);
      setName('');
      setPrice('');
    }
  };

  const deleteItem = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    setItems(items.filter(item => item.id !== id));
  };

  const saveEdit = async (id) => {
    const item = items.find(i => i.id === id);
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: editName,
        price: editPrice,
        status: item.status
      }),
    });
    const updated = await res.json();
    setItems(items.map(i => i.id === id ? updated : i));
    setEditingId(null);
    setEditName('');
    setEditPrice('');
  };

  const toggleStatus = async (id, currentStatus, name, price) => {
    const newStatus = currentStatus === 'Published' ? 'Pending' : 'Published';
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, price, status: newStatus }),
    });
    const updated = await res.json();
    setItems(items.map(item => item.id === id ? updated : item));
  };

  const addToCart = (item) => {
    setCart(prev => [...prev, item]);
  };

  const totalPrice = cart.reduce((sum, item) => sum + parseFloat(item.price), 0);

  const handleBuyNow = () => {
    setCart([]);
    setShowCart(false);
    navigate('/success');
  };

  // FILTER + SORT
  let filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (sortOrder === 'az') {
    filteredItems.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOrder === 'za') {
    filteredItems.sort((a, b) => b.name.localeCompare(a.name));
  }

  // PAGINATION LOGIC
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  return (
    <div className="container mt-4">
      <h2>🛍️ CRUD React + Laravel: Status, Harga, & Keranjang</h2>

      {/* Search & Sort */}
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Cari item..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1); // reset ke halaman pertama saat search
        }}
      />
      <select
        className="form-select mb-3"
        value={sortOrder}
        onChange={(e) => {
          setSortOrder(e.target.value);
          setCurrentPage(1);
        }}
      >
        <option value="default">Urutan Default</option>
        <option value="az">A → Z</option>
        <option value="za">Z → A</option>
      </select>

      {/* Tambah item */}
      <div className="input-group mb-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="form-control"
          placeholder="Nama item"
        />
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="form-control"
          placeholder="Harga"
        />
        <button className="btn btn-primary" onClick={addItem}>Tambah</button>
      </div>

      {/* Tombol buka keranjang */}
      <button className="btn btn-outline-primary mb-4" onClick={() => setShowCart(true)}>
        🛒 Lihat Keranjang ({cart.length})
      </button>

      {/* Daftar item (Paginated) */}
      <ul className="list-group mb-4">
        {currentItems.map(item => (
          <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div style={{ flex: 1 }}>
              {editingId === item.id ? (
                <>
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="form-control mb-1"
                  />
                  <input
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="form-control"
                  />
                </>
              ) : (
                <>
                  <strong>{item.name}</strong> - Rp{item.price}
                  <span className={`badge ms-2 ${item.status === 'Published' ? 'bg-success' : 'bg-secondary'}`}>
                    {item.status}
                  </span>
                </>
              )}
            </div>
            <div className="ms-2">
              {editingId === item.id ? (
                <>
                  <button className="btn btn-success btn-sm me-1" onClick={() => saveEdit(item.id)}>Simpan</button>
                  <button className="btn btn-secondary btn-sm" onClick={() => setEditingId(null)}>Batal</button>
                </>
              ) : (
                <>
                  <button className="btn btn-warning btn-sm me-1" onClick={() => {
                    setEditingId(item.id);
                    setEditName(item.name);
                    setEditPrice(item.price);
                  }}>Edit</button>
                  <button
                    className={`btn btn-sm me-1 ${item.status === 'Published' ? 'btn-success' : 'btn-secondary'}`}
                    onClick={() => toggleStatus(item.id, item.status, item.name, item.price)}
                  >
                    {item.status === 'Published' ? '✅ Published' : '⏸ Pending'}
                  </button>
                  <button className="btn btn-info btn-sm me-1" onClick={() => addToCart(item)}>🛒</button>
                  <button className="btn btn-danger btn-sm" onClick={() => deleteItem(item.id)}>Hapus</button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>

      {/* Pagination Buttons */}
      {totalPages > 1 && (
        <div className="mb-4 d-flex justify-content-between">
          <button className="btn btn-outline-secondary" onClick={goToPrevPage} disabled={currentPage === 1}>
            ⬅️ Sebelumnya
          </button>
          <span className="align-self-center">Halaman {currentPage} dari {totalPages}</span>
          <button className="btn btn-outline-secondary" onClick={goToNextPage} disabled={currentPage === totalPages}>
            Selanjutnya ➡️
          </button>
        </div>
      )}

      {/* Pop-up keranjang */}
      {showCart && (
        <div className="modal d-block" tabIndex="-1" onClick={() => setShowCart(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">🛒 Keranjang Belanja</h5>
                <button type="button" className="btn-close" onClick={() => setShowCart(false)}></button>
              </div>
              <div className="modal-body">
                {cart.length === 0 ? (
                  <p>Keranjang kosong.</p>
                ) : (
                  <ul className="list-group mb-2">
                    {cart.map((item, i) => (
                      <li key={i} className="list-group-item d-flex justify-content-between">
                        {item.name} - Rp{item.price}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="alert alert-info">
                  Total: <strong>Rp{totalPrice.toLocaleString()}</strong>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-success" disabled={cart.length === 0} onClick={handleBuyNow}>
                  🛍️ Beli Sekarang
                </button>
                <button className="btn btn-secondary" onClick={() => setShowCart(false)}>
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrudApp;
