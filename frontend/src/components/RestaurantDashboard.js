import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RestaurantDashboard = () => {
  const navigate = useNavigate();

  // 1. Owner Name (now set from localStorage)
  const [ownerName, setOwnerName] = useState("");

  // 2. Form State
  const [menuItem, setMenuItem] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    type: "veg",
  });

  // 3. Data State
  const [dbMenu, setDbMenu] = useState([]);
  const [editingItemName, setEditingItemName] = useState(null);
  
  // 4. UI Status
  const [status, setStatus] = useState({ isLoading: false, error: "", success: "" });
  const [isFetching, setIsFetching] = useState(true); // Auto-load on page start

  // --- ACTIONS ---

  // A. Auth Check & Auto-Fetch Menu
  useEffect(() => {
    const role = localStorage.getItem("ish_role");
    // --- THIS IS THE FIX ---
    // Changed "ish_user_name" to "ish_name" to match your screenshot
    const savedName = localStorage.getItem("ish_name"); 

    if (role !== "restaurant" || !savedName) {
      setStatus({ ...status, error: "Please login as a restaurant owner." });
      setIsFetching(false);
      return;
    }

    // Set the secure name
    setOwnerName(savedName);
    
    // Auto-fetch menu
    fetchMenu(savedName);
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on page load

  // B. Fetch Menu Logic
  const fetchMenu = async (name) => {
    setIsFetching(true);
    setStatus(prev => ({ ...prev, error: "", success: "" }));

    try {
      // Step 1: Find Restaurant ID (Case-insensitive)
      const resList = await axios.get("http://localhost:8080/restaurants");
      const myRestaurant = resList.data.find(r => r.ownerName.toLowerCase() === name.toLowerCase());

      if (!myRestaurant) {
        setStatus({ ...status, error: "Restaurant not found. Please contact support." });
        setIsFetching(false);
        return;
      }

      // Step 2: Get full details using the found ID
      const resDetail = await axios.get(`http://localhost:8080/restaurants/${myRestaurant.id}`);
      
      setDbMenu(resDetail.data.menu || []);
      setStatus(prev => ({ ...prev, success: "Menu loaded successfully!" }));
    } catch (err) {
      console.error(err);
      setStatus({ ...status, error: "Failed to load menu." });
    } finally {
      setIsFetching(false);
    }
  };

  // C. Load Item into Form for Editing
  const handleEditClick = (item) => {
    setEditingItemName(item.name);
    setMenuItem({
      name: item.name,
      price: item.price,
      description: item.description || "",
      image: item.image || "",
      type: item.type || "veg",
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStatus({ error: "", success: `Editing "${item.name}"...` });
  };

  // D. Cancel Edit
  const handleCancelEdit = () => {
    setEditingItemName(null);
    setMenuItem({ name: "", price: "", description: "", image: "", type: "veg" });
    setStatus({ error: "", success: "" });
  };

  // E. Submit (Add or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!ownerName) {
      setStatus({ ...status, error: "Session invalid. Please login again." });
      return;
    }

    setStatus({ isLoading: true, error: "", success: "" });

    try {
      const payload = {
        ownerName: ownerName, // Uses the SECURE name from state
        menuItem: {
          ...menuItem,
          price: parseFloat(menuItem.price),
        },
      };

      if (editingItemName) {
        // === EDIT MODE ===
        payload.originalName = editingItemName;
        await axios.post("http://localhost:8080/editmenu", payload);
        setStatus({ isLoading: false, error: "", success: "Item updated!" });
      } else {
        // === ADD MODE ===
        await axios.post("http://localhost:8080/addmenu", payload);
        setStatus({ isLoading: false, error: "", success: "Item added!" });
      }

      handleCancelEdit(); // Reset form
      fetchMenu(ownerName); // Refresh list automatically

    } catch (err) {
      const msg = err?.response?.data?.error || "Operation failed.";
      setStatus({ isLoading: false, error: msg, success: "" });
    }
  };

  const handleChange = (e) => {
    setMenuItem((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  

  return (
    <div style={{ 
        minHeight: "100vh", 
        background: 'linear-gradient(135deg, #fef5ee 0%, #fde8d7 25%, #fdd7ba 50%, #fcc89b 75%, #fbb87d 100%)', 
        padding: "24px" 
    }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ background: "white", padding: "20px", borderRadius: "12px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ margin: 0, color: "#1f2937" }}>👨‍🍳 Chef's Dashboard</h2>
            <p style={{ margin: 0, color: "#6b7280", fontSize: "14px" }}>
              Editing Menu for: <strong style={{color: "#ea580c"}}>{ownerName || "Loading..."}</strong>
            </p>
          </div>
          
        </div>

        {/* --- FORM SECTION --- */}
        <div style={{ background: "white", padding: "30px", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)", marginBottom: "30px", border: editingItemName ? '2px solid #2563eb' : 'none' }}>
          <h3 style={{ marginTop: 0, color: editingItemName ? "#2563eb" : "#374151" }}>
            {editingItemName ? `✏️ Editing: ${editingItemName}` : "➕ Add New Item"}
          </h3>

          {status.error && <div style={{color: "red", marginBottom: 10, background: '#fef2f2', padding: '10px', borderRadius: '6px'}}>⚠️ {status.error}</div>}
          {status.success && <div style={{color: "green", marginBottom: 10, background: '#f0fdf4', padding: '10px', borderRadius: '6px'}}>✅ {status.success}</div>}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            
            {/* Item Fields */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "15px" }}>
              <div>
                <label style={labelStyle}>Item Name</label>
                <input type="text" name="name" value={menuItem.name} onChange={handleChange} placeholder="e.g. Butter Chicken" style={inputStyle} required />
              </div>
              <div>
                <label style={labelStyle}>Price</label>
                <input type="number" name="price" value={menuItem.price} onChange={handleChange} placeholder="14.99" style={inputStyle} required />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "15px" }}>
              <div>
                <label style={labelStyle}>Type</label>
                <select name="type" value={menuItem.type} onChange={handleChange} style={inputStyle}>
                  <option value="veg">Veg 🥬</option>
                  <option value="non-veg">Non-Veg 🍗</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Image URL</label>
                <input type="text" name="image" value={menuItem.image} onChange={handleChange} placeholder="https://..." style={inputStyle} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Description</label>
              <textarea name="description" value={menuItem.description} onChange={handleChange} placeholder="Dish description..." style={{...inputStyle, minHeight: "60px"}} />
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: "10px" }}>
              <button type="submit" disabled={status.isLoading || !ownerName} style={editingItemName ? btnStyleUpdate : btnStyleAdd}>
                {status.isLoading ? "Processing..." : (editingItemName ? "Update Item" : "+ Add Item to Menu")}
              </button>
              
              {editingItemName && (
                <button type="button" onClick={handleCancelEdit} style={btnStyleSecondary}>
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        {/* --- EXISTING MENU LIST SECTION --- */}
        {isFetching ? (
          <div style={{textAlign: 'center', color: '#6b7280'}}>Loading menu...</div>
        ) : dbMenu.length > 0 ? (
          <div>
            <h3 style={{ color: "#374151", marginBottom: "15px" }}>📋 Your Current Menu ({dbMenu.length} items)</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
              {dbMenu.map((item, idx) => (
                <div key={idx} style={{ background: "white", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                  {item.image && (
                    <div style={{ height: "140px", overflow: "hidden" }}>
                      <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  )}
                  <div style={{ padding: "16px", flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "8px" }}>
                      <h4 style={{ margin: 0, color: "#1f2937" }}>{item.name}</h4>
                      <span style={{ fontWeight: "bold", color: "#ea580c" }}>${item.price}</span>
                    </div>
                    <p style={{ fontSize: "13px", color: "#6b7280", margin: "0 0 12px 0" }}>{item.description}</p>
                    <span style={{ fontSize: "12px", background: item.type === 'veg' ? '#dcfce7' : '#fee2e2', color: item.type === 'veg' ? '#166534' : '#991b1b', padding: "2px 8px", borderRadius: "10px" }}>
                      {item.type}
                    </span>
                  </div>
                  <div style={{ padding: "12px 16px", borderTop: "1px solid #f3f4f6", background: "#f9fafb" }}>
                    <button 
                      onClick={() => handleEditClick(item)}
                      style={{ width: "100%", padding: "8px", background: "#eff6ff", border: "1px solid #dbeafe", borderRadius: "6px", cursor: "pointer", fontWeight: "600", color: "#2563eb" }}
                    >
                      ✏️ Edit This Item
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", color: "#9ca3af", marginTop: "40px", background: 'white', padding: '30px', borderRadius: '12px' }}>
            Your menu is empty. Add your first item using the form above!
          </div>
        )}

      </div>
    </div>
  );
};

// --- Styles ---
const labelStyle = { display: "block", fontSize: "13px", fontWeight: "500", color: "#374151", marginBottom: "6px" };
const inputStyle = { width: "100%", padding: "12px 16px", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", outline: "none", background: "#f9fafb", boxSizing: "border-box" };
const btnStyleAdd = { padding: "12px", background: "#ea580c", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", flex: 1, fontWeight: "bold", fontSize: "15px" };
const btnStyleUpdate = { padding: "12px", background: "#2563eb", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", flex: 1, fontWeight: "bold", fontSize: "15px" };
const btnStyleSecondary = { padding: "12px 20px", background: "#e5e7eb", color: "#374151", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" };

export default RestaurantDashboard;