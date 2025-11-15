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

  // 4. Orders State
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  
  // 5. UI Status
  const [status, setStatus] = useState({ isLoading: false, error: "", success: "" });
  const [isFetching, setIsFetching] = useState(true); // Auto-load on page start

  // --- ACTIONS ---

  // A. Auth Check & Auto-Fetch Menu & Orders
  useEffect(() => {
    const role = localStorage.getItem("ish_role");
    const savedName = localStorage.getItem("ish_name"); 

    if (role !== "restaurant" || !savedName) {
      setStatus({ ...status, error: "Please login as a restaurant owner." });
      setIsFetching(false);
      return;
    }

    setOwnerName(savedName);

    fetchMenu(savedName);
    fetchOrders(savedName);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // B. Fetch Menu Logic
  const fetchMenu = async (name) => {
    setIsFetching(true);
    setStatus(prev => ({ ...prev, error: "", success: "" }));

    try {
      const resList = await axios.get("http://localhost:8080/restaurants");
      const myRestaurant = resList.data.find(r => r.ownerName.toLowerCase() === name.toLowerCase());

      if (!myRestaurant) {
        setStatus({ ...status, error: "Restaurant not found. Please contact support." });
        setIsFetching(false);
        return;
      }

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

  // C. Fetch Orders Logic
 // C. Fetch Orders Logic
const fetchOrders = async (owner) => {
  setOrdersLoading(true);
  try {
    const res = await axios.get("http://localhost:8080/orders");

    // Filter by restaurant owner
    const filtered = res.data.filter(o => o.ownerName?.toLowerCase() === owner.toLowerCase());

    // Group orders by user_name (top-level)
    const grouped = filtered.reduce((acc, curr) => {
      const userKey = curr.user_name || "Unknown User";
      if (!acc[userKey]) {
        acc[userKey] = {
          user_name: curr.user_name,
          mob: curr.mob,
          email: curr.email,
          items: [],
          total: curr.total
        };
      }
      // Push all items of this order
      curr.items.forEach(item => {
        acc[userKey].items.push({
          Name: item.Name,
          Price: item.Price,
          Quantity: item.Quantity,
          Image: item.Image
        });
      });
      return acc;
    }, {});

    setOrders(Object.values(grouped));
  } catch (err) {
    console.error("Failed to fetch orders:", err);
  } finally {
    setOrdersLoading(false);
  }
};


  // D. Load Item into Form for Editing
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

  // E. Cancel Edit
  const handleCancelEdit = () => {
    setEditingItemName(null);
    setMenuItem({ name: "", price: "", description: "", image: "", type: "veg" });
    setStatus({ error: "", success: "" });
  };

  // F. Submit (Add or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!ownerName) {
      setStatus({ ...status, error: "Session invalid. Please login again." });
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
        payload.originalName = editingItemName;
        await axios.post("http://localhost:8080/editmenu", payload);
        setStatus({ isLoading: false, error: "", success: "Item updated!" });
      } else {
        await axios.post("http://localhost:8080/addmenu", payload);
        setStatus({ isLoading: false, error: "", success: "Item added!" });
      }

      handleCancelEdit();
      fetchMenu(ownerName);
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

  const handleCompleteOrder = async (userName) => {
  try {
    // Send request to backend to mark all orders of this user as completed
    await axios.post("http://localhost:8080/completeorder", { user_name: userName, ownerName });
    
    // Refresh orders after completion
    fetchOrders(ownerName);
  } catch (err) {
    console.error("Failed to complete order:", err);
  }
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
          <button onClick={handleLogout} style={btnStyleSecondary}>Logout</button>
        </div>

        {/* --- FORM SECTION --- */}
        <div style={{ background: "white", padding: "30px", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)", marginBottom: "30px", border: editingItemName ? '2px solid #2563eb' : 'none' }}>
          <h3 style={{ marginTop: 0, color: editingItemName ? "#2563eb" : "#374151" }}>
            {editingItemName ? `✏️ Editing: ${editingItemName}` : "➕ Add New Item"}
          </h3>

          {status.error && <div style={{color: "red", marginBottom: 10, background: '#fef2f2', padding: '10px', borderRadius: '6px'}}>⚠️ {status.error}</div>}
          {status.success && <div style={{color: "green", marginBottom: 10, background: '#f0fdf4', padding: '10px', borderRadius: '6px'}}>✅ {status.success}</div>}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>

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

            <div style={{ display: "flex", gap: "10px" }}>
              <button type="submit" disabled={status.isLoading || !ownerName} style={editingItemName ? btnStyleUpdate : btnStyleAdd}>
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

        {/* --- EXISTING MENU SECTION --- */}
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

        {/* --- CURRENT ORDERS SECTION --- */}
<div style={{ marginTop: "40px" }}>
  <h3 style={{ color: "#374151", marginBottom: "15px" }}>🛒 Your Current Orders</h3>

  {ordersLoading ? (
    <div style={{ textAlign: "center", color: "#6b7280" }}>Loading orders...</div>
  ) : orders.length === 0 ? (
    <div style={{ textAlign: "center", color: "#9ca3af", background: "white", padding: "20px", borderRadius: "12px" }}>
      No current orders yet.
    </div>
  ) : (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "20px" }}>
      {orders.map((user, idx) => {
        const totalAmount = user.items.reduce((sum, item) => sum + item.Price * item.Quantity, 0);
        return (
          <div key={idx} style={{ background: "white", borderRadius: "12px", padding: "20px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
            <h4 style={{ margin: 0, color: "#1f2937" }}>{user.user_name || "Unknown User"}</h4>
            <p style={{ margin: "4px 0", fontSize: "13px", color: "#6b7280" }}>📞 {user.mob || "No mobile"}</p>
            <p style={{ margin: "4px 0", fontSize: "13px", color: "#6b7280" }}>📧 {user.email || "No email"}</p>
            <p style={{ fontWeight: "bold", margin: "6px 0", color: "#ea580c" }}>Total: ${user.total}</p>

            <div style={{ marginTop: "12px", borderTop: "1px solid #f3f4f6", paddingTop: "12px" }}>
              {user.items.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
                  {item.Image && (
                    <img src={item.Image} alt={item.Name} style={{ width: "60px", height: "60px", borderRadius: "8px", objectFit: "cover" }} />
                  )}
                  <div>
                    <p style={{ margin: 0, fontWeight: "600" }}>{item.Name}</p>
                    <p style={{ margin: 0, fontSize: "13px", color: "#6b7280" }}>
                      Qty: {item.Quantity} × ${item.Price}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => handleCompleteOrder(user.user_name)}
              style={{ marginTop: "10px", padding: "10px", background: "#16a34a", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", width: "100%" }}
            >
              ✅ Completed
            </button>
          </div>
        );
      })}
    </div>
  )}
</div>


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
