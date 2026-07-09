//import library
import React, { useEffect, useState } from 'react';
import { Search, MapPin, Calendar, Plus, Edit2, Trash2, CheckCircle, XCircle, Upload } from 'lucide-react';
import usersData from './data/users.json';

export default function App() {
  const [items, setItems] = useState([]);

  //tujuh search
  const [searchTerm, setSearchTerm] = useState("");
  
  // dua HALAMAN HOME TERGANTUNG CURRENT
  const [currentTab, setCurrentTab] = useState('home'); // 'home', 'lost', 'found'
  
  const [showForm, setShowForm] = useState(false);
  const [editItemId, setEditItemId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [authModal, setAuthModal] = useState('login'); // 'login' | null
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [authForm, setAuthForm] = useState({ npm: '', password: '', role: 'mahasiswa' });
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);

  const [formData, setFormData] = useState({ 
    title: '', description: '', location: '', status: 'lost', contact: '', image: '' 
  });

  //satu HALAMAN LOGIN TANPA RELOAD
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    
    // Check credentials against JSON data
    const foundUser = usersData.find(u => 
      u.role === authForm.role && 
      u.username === authForm.npm && 
      u.password === authForm.password
    );

    if (foundUser) {
      setIsLoggedIn(true);
      setUser(foundUser);
      setAuthModal(null);
      setShowWelcomePopup(true);
    } else {
      alert("Username/NPM atau password salah!");
    }
  };
  
  //delapan logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setAuthModal('login');
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', location: '', status: 'lost', contact: '', image: '' });
    setEditItemId(null);
    setShowForm(false);
  };

  // Minta data ke server pas pertama kali web dibuka
  //anna pertama kali dibuka react otomatis mengambil data dari api
  useEffect(() => {
    fetch('/api/items')
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error("Waduh, error ngambil data:", err));
  }, []);

  //empat CRUD FORM
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    if (editItemId) {
      // Update data yang udah ada
      const response = await fetch(`/api/items/${editItemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const updatedItem = await response.json();
      setItems(items.map(item => item.id === editItemId ? updatedItem : item));

    } else {

      // ===== TAMBAHAN =====
      console.log("DATA YANG DIKIRIM");
      console.log(formData);

      const response = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      // ===== TAMBAHAN =====
      console.log("STATUS:", response.status);

      const newItem = await response.json();

      // ===== TAMBAHAN =====
      console.log("RESPON SERVER");
      console.log(newItem);

      setItems([newItem, ...items]);
    }

    resetForm();

  } catch (error) {
    console.error('Gagal kirim laporan:', error);
  }
};
  //lima delete
  //anna1 react contoh delete 
  const handleDelete = async (id) => {
    // Tanya dulu sebelum dihapus, biar ga salah klik (analogi: pop-up konfirmasi di HP)
    if (!window.confirm('Yakin mau hapus laporan ini?')) return;
    try {
      await fetch(`/api/items/${id}`, { method: 'DELETE' });
      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      console.error('Gagal hapus data:', error);
    }
  };

  const handleToggleStatus = async (item, newStatus) => {
    try {
      const response = await fetch(`/api/items/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const updatedItem = await response.json();
      setItems(items.map(i => i.id === item.id ? updatedItem : i));
    } catch (error) {
      console.error('Gagal update status:', error);
    }
  };

  // --- KOMPONEN NAVBAR ---
  const renderNavbar = () => (
    <nav className="flex items-center justify-between py-5 px-8 max-w-7xl mx-auto w-full sticky top-0 bg-white/90 backdrop-blur-md z-40">
      {/* Logo */}
      <div 
        className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" 
        onClick={() => setCurrentTab('home')}
      >
        <div className="bg-purple-600 p-2 rounded-xl shadow-md shadow-purple-200">
          <Search className="w-5 h-5 text-white" />
        </div>
        <span className="font-extrabold text-xl text-slate-800 tracking-tight">Findly Friendly</span>
      </div>
      
      {/* Menu Links */}
      <div className="hidden md:flex items-center gap-2 font-bold text-sm text-slate-500">
        <button 
          onClick={() => setCurrentTab('home')} 
          className={`px-5 py-2 rounded-full transition-all duration-300 ${currentTab === 'home' ? 'bg-purple-100 text-purple-700' : 'hover:bg-slate-100 hover:text-slate-800'}`}
        >
          Home
        </button>
        <button 
          onClick={() => setCurrentTab('lost')} 
          className={`px-5 py-2 rounded-full transition-all duration-300 ${currentTab === 'lost' ? 'bg-purple-100 text-purple-700' : 'hover:bg-slate-100 hover:text-slate-800'}`}
        >
          Lost Items
        </button>
        <button 
          onClick={() => setCurrentTab('found')} 
          className={`px-5 py-2 rounded-full transition-all duration-300 ${currentTab === 'found' ? 'bg-purple-100 text-purple-700' : 'hover:bg-slate-100 hover:text-slate-800'}`}
        >
          Found Items
        </button>
        <button 
          onClick={() => setCurrentTab('history')} 
          className={`px-5 py-2 rounded-full transition-all duration-300 ${currentTab === 'history' ? 'bg-purple-100 text-purple-700' : 'hover:bg-slate-100 hover:text-slate-800'}`}
        >
          History
        </button>
      </div>

      {/* Search & Auth */}
      <div className="flex items-center gap-4">
        <div className="relative hidden lg:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-full border border-slate-200 bg-slate-50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all w-48"
          />
        </div>
        
        {isLoggedIn ? (
          <div className="flex items-center gap-3">
             <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold border border-purple-200 shadow-sm">
               {user?.name.charAt(0)}
             </div>
             <button 
               onClick={handleLogout} 
               className="text-sm font-bold text-slate-500 hover:text-red-500 transition-colors px-2"
             >
               Log out
             </button>
          </div>
        ) : (
          <>
            <button 
              onClick={() => setAuthModal('login')} 
              className="text-sm font-bold text-slate-700 hover:text-purple-600 transition-colors px-2"
            >
              Log in
            </button>
            <button 
              onClick={() => setAuthModal('signup')} 
              className="bg-purple-600 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 hover:shadow-purple-300 hover:-translate-y-0.5"
            >
              Sign up
            </button>
          </>
        )}
      </div>
    </nav>
  );

  // --- KOMPONEN HALAMAN HOME ---
  const renderHome = () => (
    <div className="max-w-7xl mx-auto px-8 py-20 flex flex-col lg:flex-row items-center justify-between min-h-[80vh] gap-12">
      {/* Teks sebelah kiri */}
      <div className="max-w-xl flex-1 animate-in slide-in-from-left-8 duration-700">
        <h1 className="text-6xl md:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-6 tracking-tight">
          Helping Lost<br />
          Items<br />
          <span className="text-purple-600">Find Their Way<br />Home</span>
        </h1>
        <p className="text-lg text-slate-500 mb-10 leading-relaxed font-medium max-w-md">
          Connect with your community to recover lost belongings. Report items, search listings, and reunite with what matters most to you.
        </p>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={() => { resetForm(); setFormData({...formData, status: 'lost'}); setCurrentTab('lost'); setShowForm(true); }} 
            className="bg-purple-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-purple-700 transition-all shadow-xl shadow-purple-200 hover:-translate-y-1"
          >
            Report Lost Item <span className="text-xl leading-none">→</span>
          </button>
          <button 
            onClick={() => { resetForm(); setFormData({...formData, status: 'found'}); setCurrentTab('found'); setShowForm(true); }} 
            className="border-2 border-slate-200 text-purple-600 bg-white px-8 py-4 rounded-2xl font-bold hover:border-purple-600 hover:bg-purple-50 transition-all"
          >
            Report Found Item
          </button>
        </div>
      </div>
      
      {/* Gambar card melayang sebelah kanan */}
      <div className="flex-1 flex justify-end relative animate-in fade-in zoom-in-95 duration-1000 delay-150">
        <div className="bg-white/40 p-3 rounded-[2.5rem] shadow-2xl backdrop-blur-xl border border-white/60 rotate-2 hover:rotate-0 transition-all duration-500">
          <img 
            src="https://akcdn.detik.net.id/community/media/visual/2022/08/02/adv-gunadarma.jpeg?w=700&q=90" 
            alt="Campus Building" 
            className="rounded-[2rem] w-[500px] h-[350px] object-cover shadow-inner" 
          />
        </div>
      </div>
    </div>
  );

  // --- KOMPONEN HALAMAN DIREKTORI (LOST/FOUND/HISTORY) ---
  const renderDirectory = (status) => {
    const filteredItems = items.filter(item => {
  // Filter berdasarkan halaman (Lost, Found, History)
  const statusMatch = item.status === status;

  // Filter berdasarkan kata yang diketik di Search
  //tujuh search
  const searchMatch =
    item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase());

  return statusMatch && searchMatch;
});
    
    let title = '';
    let subtitle = '';
    if (status === 'lost') {
      title = 'Lost Items Directory';
      subtitle = 'Recent reported missing items within the community.';
    } else if (status === 'found') {
      title = 'Found Items Directory';
      subtitle = 'Items recently found and waiting for their owners.';
    } else if (status === 'history') {
      title = 'History';
      subtitle = 'History of items that have been processed.';
    }
    // enam move history
    return (
      <div className="max-w-7xl mx-auto px-8 py-12 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-800 mb-2 tracking-tight">{title}</h2>
            <p className="text-slate-500 font-medium">{subtitle}</p>
          </div>
          {status !== 'history' && (
            <button 
              onClick={() => { resetForm(); setFormData({ title: '', description: '', location: '', status, contact: '', image: '' }); setShowForm(true); }} 
              className="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" /> Add {status === 'lost' ? 'Lost' : 'Found'} Item
            </button>
          )}
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map(item => (
            <div 
              key={item.id} 
              onClick={() => setSelectedItem(item)}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group relative flex flex-col cursor-pointer"
            >
              
              {/* Gambar Barang */}
              <div className="relative h-60 overflow-hidden">
                <img 
                  src={item.image || "https://images.unsplash.com/photo-1584905066893-7d5c142ba4e1?auto=format&fit=crop&q=80&w=400"} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                />
                
                {/* Badge Status Melayang */}
                <div className="absolute top-4 left-4">
                  {item.status === 'lost' ? (
                    <span className="bg-red-100/90 backdrop-blur-sm text-red-600 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Lost
                    </span>
                  ) : item.status === 'found' ? (
                    <span className="bg-emerald-100/90 backdrop-blur-sm text-emerald-700 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Found
                    </span>
                  ) : (
                    <span className="bg-slate-100/90 backdrop-blur-sm text-slate-700 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span> History
                    </span>
                  )}
                </div>

                {/* Tombol Aksi Melayang (Edit, Hapus, Ubah Status) */}
                {user?.role === 'admin' && (
                  <div 
                    className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    onClick={e => e.stopPropagation()} // Biar pas klik tombol, modal detailnya nggak ikut kebuka
                  >
                    {item.status !== 'history' && (
                      <button
                        onClick={() => handleToggleStatus(item, 'history')}
                        className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm text-slate-600 hover:text-emerald-600 flex items-center justify-center shadow-sm hover:scale-110 transition-all"
                        title="Move to history"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setFormData(item);
                        setEditItemId(item.id);
                        setShowForm(true);
                      }}
                      className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm text-slate-600 hover:text-blue-600 flex items-center justify-center shadow-sm hover:scale-110 transition-all"
                      title="Edit Data"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm text-slate-600 hover:text-red-600 flex items-center justify-center shadow-sm hover:scale-110 transition-all"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Konten Text */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-bold mb-3">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  {new Date(item.date).toLocaleDateString('en-US', { day: 'numeric', month: 'numeric', year: 'numeric' })}
                </div>
                
                <h3 className="text-xl font-bold text-slate-800 mb-3 line-clamp-1">{item.title}</h3>
                
                <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mt-auto">
                  <MapPin className="w-4 h-4 shrink-0 text-purple-400" />
                  <span className="truncate">{item.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#fafafc] font-sans selection:bg-purple-200">
      {/* Background Decorative Element mirip di mockup */}
      <div className="absolute inset-0 bg-[url('https://blue.kumparan.com/image/upload/fl_progressive,fl_lossy,c_fill,f_auto,q_auto:best,w_640/v1624199067/yya9l5kkppaytcdlb9xi.jpg')] bg-cover bg-center opacity-[0.03] pointer-events-none mix-blend-multiply"></div>
      
      <div className="relative z-10">
        {renderNavbar()}

        <main>
          {currentTab === 'home' && renderHome()}
          {currentTab === 'lost' && renderDirectory('lost')}
          {currentTab === 'found' && renderDirectory('found')}
          {currentTab === 'history' && renderDirectory('history')}
        </main>
      </div>

      {/* --- MODAL FORM --- */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-white">
              <h2 className="text-xl font-extrabold text-slate-800">
                {editItemId ? 'Edit Item' : formData.status === 'lost' ? 'Report Lost Item' : 'Report Found Item'}
              </h2>
              <button 
                onClick={resetForm} 
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Item Name</label>
                <input 
                  required type="text" 
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-50 transition-all bg-slate-50 focus:bg-white"
                  placeholder="e.g. iPhone 14 Pro - Space Black"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Upload Image</label>
                <div className="relative w-full rounded-xl border-2 border-dashed border-slate-300 hover:border-purple-500 hover:bg-purple-50 transition-all bg-slate-50 flex items-center justify-center overflow-hidden">
                  <input 
                    type="file" 
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={handleImageUpload}
                  />
                  {formData.image ? (
                    <div className="relative w-full h-40">
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <span className="text-white font-medium text-sm flex items-center gap-2"><Upload className="w-4 h-4" /> Change Image</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-slate-500">
                      <Upload className="w-8 h-8 mb-2 text-slate-400" />
                      <span className="text-sm font-medium">Click or drag image here</span>
                      <span className="text-xs text-slate-400 mt-1">JPEG, PNG, JPG (Max 5MB)</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Location</label>
                <input 
                  required type="text" 
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-50 transition-all bg-slate-50 focus:bg-white"
                  placeholder="Where was it lost/found?"
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Description</label>
                <textarea 
                  required
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-50 transition-all bg-slate-50 focus:bg-white resize-none"
                  placeholder="Provide details about the item..."
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Contact Number</label>
                <input 
                  required type="text" 
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-50 transition-all bg-slate-50 focus:bg-white"
                  placeholder="e.g. 08123456789"
                  value={formData.contact}
                  onChange={e => setFormData({...formData, contact: e.target.value})}
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={resetForm} 
                  className="px-6 py-3 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-3 text-sm font-bold bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200"
                >
                  {editItemId ? 'Save Changes' : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL DETAIL BARANG --- */}
      {selectedItem && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col md:flex-row">
            
            {/* Gambar Sebelah Kiri */}
            <div className="w-full md:w-2/5 h-64 md:h-auto relative bg-slate-100">
              <img 
                src={selectedItem.image || "https://images.unsplash.com/photo-1584905066893-7d5c142ba4e1?auto=format&fit=crop&q=80&w=400"} 
                alt={selectedItem.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                {selectedItem.status === 'lost' ? (
                  <span className="bg-red-100/90 backdrop-blur-sm text-red-600 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Lost
                  </span>
                ) : (
                  <span className="bg-emerald-100/90 backdrop-blur-sm text-emerald-700 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Found
                  </span>
                )}
              </div>
            </div>

            {/* Konten Kanan */}
            <div className="w-full md:w-3/5 p-8 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 text-slate-400 text-sm font-bold mb-2">
                    <Calendar className="w-4 h-4 text-purple-400" />
                    {new Date(selectedItem.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  <h2 className="text-2xl font-extrabold text-slate-800 leading-tight">{selectedItem.title}</h2>
                </div>
                <button 
                  onClick={() => setSelectedItem(null)} 
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors shrink-0"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4 mb-8 text-slate-600 font-medium">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Location</span>
                    <span className="text-slate-800">{selectedItem.location}</span>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-purple-400 font-serif text-lg leading-none">i</span>
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Description</span>
                    <span className="text-slate-700 leading-relaxed text-sm">
                      {selectedItem.description || "No description provided."}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Bawah */}
              <div className="mt-auto pt-6 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Contact</span>
                    <span className="font-bold text-slate-800">{selectedItem.contact || "No contact"}</span>
                  </div>
                  <a 
                    href={`https://wa.me/${selectedItem.contact?.replace(/\D/g, '').replace(/^0/, '62') || ''}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="bg-purple-100 text-purple-700 hover:bg-purple-200 px-5 py-2.5 rounded-xl font-bold transition-colors text-sm"
                  >
                    Chat Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* --- MODAL AUTH (LOGIN/SIGNUP) --- */}
      {authModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-extrabold text-slate-800">
                  Welcome Back!
                </h2>
                {isLoggedIn && (
                  <button 
                    onClick={() => setAuthModal(null)} 
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
              
              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {/* Pilihan Role */}
                <div className="mb-4">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Masuk Sebagai</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="role" 
                        value="mahasiswa"
                        checked={authForm.role === 'mahasiswa'}
                        onChange={e => setAuthForm({...authForm, role: e.target.value})}
                        className="text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm font-medium text-slate-700">Mahasiswa</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="role" 
                        value="admin"
                        checked={authForm.role === 'admin'}
                        onChange={e => setAuthForm({...authForm, role: e.target.value})}
                        className="text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm font-medium text-slate-700">Admin</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    {authForm.role === 'admin' ? 'Username' : 'NPM (Nomor Induk Mahasiswa)'}
                  </label>
                  <input 
                    required type="text" 
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-50 transition-all bg-slate-50 focus:bg-white"
                    placeholder={authForm.role === 'admin' ? "admin_utama" : "Contoh: 11122424"}
                    value={authForm.npm}
                    onChange={e => setAuthForm({...authForm, npm: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Password</label>
                  <input 
                    required type="password" 
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-50 transition-all bg-slate-50 focus:bg-white"
                    placeholder="••••••••"
                    value={authForm.password}
                    onChange={e => setAuthForm({...authForm, password: e.target.value})}
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="w-full mt-2 py-3 text-sm font-bold bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200"
                >
                  Log In
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL WELCOME --- */}
      {showWelcomePopup && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 text-center relative">
              <button 
                onClick={() => setShowWelcomePopup(false)} 
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
              >
                ✕
              </button>
              
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-5">
                <span className="text-3xl">👋</span>
              </div>
              
              <h2 className="text-2xl font-extrabold text-slate-800 mb-2 leading-tight">
                Selamat datang,<br />
                <span className="text-purple-600">{user?.name}</span>
              </h2>
              
              <p className="text-slate-500 font-medium mb-8">
                Ada yang mau dicari atau dilaporkan hari ini?
              </p>
              
              <button 
                onClick={() => setShowWelcomePopup(false)} 
                className="w-full py-3 text-sm font-bold bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200"
              >
                Lanjut
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
