import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RestaurantDashboard = () => {
  const navigate = useNavigate();

  // 1. Owner Name (The key to finding your restaurant)
  const [ownerName, setOwnerName] = useState("");

  // 2. Form State (For adding OR editing)
  const [menuItem, setMenuItem] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    type: "veg",
  });

  // 3. Data State
  const [dbMenu, setDbMenu] = useState([]); // The menu fetched from DB
  const [editingItemName, setEditingItemName] = useState(null); // Track which item is being edited
  
  // 4. UI Status
  const [status, setStatus] = useState({ isLoading: false, error: "", success: "" });
  const [isFetching, setIsFetching] = useState(false);

  // Auth Check
  useEffect(() => {
    const role = localStorage.getItem("ish_role");
    // const savedName = localStorage.getItem("ish_user_name");
    // if (savedName) setOwnerName(savedName); // Optional: Auto-fill if saved
    if (role !== "restaurant") {
      // navigate("/Login");
    }
  }, [navigate]);

  // --- ACTIONS ---

  // A. Fetch the Menu from Database
  const handleFetchMenu = async () => {
    if (!ownerName) {
        setStatus({ ...status, error: "Please enter Owner Name first." });
        return;
    }
    setIsFetching(true);
    setStatus({ ...status, error: "" });

    try {
        // Step 1: Get all restaurants to find YOUR ID
        const resList = await axios.get("http://localhost:8080/restaurants");
        const myRestaurant = resList.data.find(r => r.ownerName === ownerName);

        if (!myRestaurant) {
            setStatus({ ...status, error: "Restaurant not found. Check Owner Name." });
            setIsFetching(false);
            return;
        }

        // Step 2: Get full details (including Menu) using the ID
        // Note: The ID might be mapped as 'id' or '_id' depending on your Go struct
        const resDetail = await axios.get(`http://localhost:8080/restaurants/${myRestaurant.id}`);
        
        setDbMenu(resDetail.data.menu || []); // Update the list
        setStatus({ ...status, success: "Menu loaded successfully!" });
    } catch (err) {
        console.error(err);
        setStatus({ ...status, error: "Failed to load menu." });
    } finally {
        setIsFetching(false);
    }
  };

  // B. Load Item into Form
  const handleEditClick = (item) => {
    setEditingItemName(item.name);
    setMenuItem({
        name: item.name,
        price: item.price,
        description: item.description || "",
        image: item.image || "",
        type: item.type || "veg",
    });
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to form
    setStatus({ error: "", success: `Editing "${item.name}" - Click Update when done.` });
  };

  // C. Cancel Edit
  const handleCancelEdit = () => {
    setEditingItemName(null);
    setMenuItem({ name: "", price: "", description: "", image: "", type: "veg" });
    setStatus({ error: "", success: "" });
  };

  // D. Submit (Add or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!ownerName) {
      setStatus({ ...status, error: "Owner Name is required." });
      return;
    }

    setStatus({ isLoading: true, error: "", success: "" });

    try {
      const payload = {
        ownerName: ownerName,
        menuItem: {
          ...menuItem,
          price: parseFloat(menuItem.price),
        },
      };

      if (editingItemName) {
        // === EDIT MODE ===
        payload.originalName = editingItemName;
        await axios.post("http://localhost:8080/editmenu", payload);
        setStatus({ isLoading: false, error: "", success: "Item updated successfully!" });
      } else {
        // === ADD MODE ===
        await axios.post("http://localhost:8080/addmenu", payload);
        setStatus({ isLoading: false, error: "", success: "Item added successfully!" });
      }

      // Reset Form
      handleCancelEdit();
      
      // Refresh the list automatically
      handleFetchMenu();

    } catch (err) {
      const msg = err?.response?.data?.error || "Operation failed.";
      setStatus({ isLoading: false, error: msg, success: "" });
    }
  };

  const handleChange = (e) => {
    setMenuItem((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/Login");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fdf2f8", padding: "24px" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ background: "white", padding: "20px", borderRadius: "12px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
                <h2 style={{ margin: 0, color: "#1f2937" }}>👨‍🍳 Chef's Dashboard</h2>
                <p style={{ margin: 0, color: "#6b7280", fontSize: "14px" }}>Manage your restaurant menu</p>
            </div>
            <button onClick={handleLogout} style={btnStyleSecondary}>Logout</button>
        </div>

        {/* --- FORM SECTION --- */}
        <div style={{ background: "white", padding: "30px", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)", marginBottom: "30px" }}>
            <h3 style={{ marginTop: 0, color: editingItemName ? "#ea580c" : "#374151" }}>
                {editingItemName ? `✏️ Editing: ${editingItemName}` : "➕ Add New Item"}
            </h3>

            {/* Status Messages */}
            {status.error && <div style={{color: "red", marginBottom: 10}}>⚠️ {status.error}</div>}
            {status.success && <div style={{color: "green", marginBottom: 10}}>✅ {status.success}</div>}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                
                {/* Owner Name + Fetch Button */}
                <div style={{ background: "#fff7ed", padding: "15px", borderRadius: "8px", border: "1px dashed #fdba74", display: "flex", gap: "10px", alignItems: "end" }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ fontSize: "12px", fontWeight: "bold", color: "#9a3412" }}>Owner Name (Required)</label>
                        <input 
                            type="text" 
                            value={ownerName} 
                            onChange={(e) => setOwnerName(e.target.value)} 
                            placeholder="Enter exact registered name"
                            style={{...inputStyle, borderColor: "#fdba74"}}
                            required 
                        />
                    </div>
                    <button 
                        type="button" 
                        onClick={handleFetchMenu}
                        disabled={isFetching || !ownerName}
                        style={{ padding: "10px 20px", background: "#9a3412", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", height: "42px" }}
                    >
                        {isFetching ? "Loading..." : "📂 Load My Menu"}
                    </button>
                </div>

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
                    <button type="submit" disabled={status.isLoading} style={editingItemName ? btnStyleUpdate : btnStyleAdd}>
                        {status.isLoading ? "Processing..." : (editingItemName ? "Update Item" : "+ Add Item to Database")}
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
        {dbMenu.length > 0 ? (
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
                                    style={{ width: "100%", padding: "8px", background: "white", border: "1px solid #d1d5db", borderRadius: "6px", cursor: "pointer", fontWeight: "600", color: "#374151" }}
                                >
                                    ✏️ Edit This Item
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        ) : (
            <div style={{ textAlign: "center", color: "#9ca3af", marginTop: "40px" }}>
                {ownerName ? "No items found. Click 'Load My Menu' or add your first item!" : "Enter your Owner Name above to load your menu."}
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