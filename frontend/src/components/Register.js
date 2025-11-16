import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    mob: "",
    email: "",
    password: "",
    role: "user",
    restaurant: {
      name: "",
      phone: "",
      address: "",
      logo: "",
    },
    userDetails: {
      address: "",
      spiceLevel: "",
    },
  });

  const [formState, setFormState] = useState({
    isLoading: false,
    error: "",
    success: false,
  });

  const navigate = useNavigate();

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFormState((prev) => ({ ...prev, error: "" }));
  };

  const onRestaurantChange = (e) => {
    setForm((prev) => ({
      ...prev,
      restaurant: { ...prev.restaurant, [e.target.name]: e.target.value },
    }));
    setFormState((prev) => ({ ...prev, error: "" }));
  };

  const onUserDetailsChange = (e) => {
    setForm((prev) => ({
      ...prev,
      userDetails: { ...prev.userDetails, [e.target.name]: e.target.value },
    }));
    setFormState((prev) => ({ ...prev, error: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormState({ isLoading: true, error: "", success: false });

    try {
      let payload = { ...form };

      // Remove restaurant details if not selected
      if (form.role !== "restaurant") {
        delete payload.restaurant;
      }

      // Remove user details if not selected
      if (form.role !== "user") {
        delete payload.userDetails;
      }

      if (form.role === "restaurant" && !form.restaurant.name) {
        setFormState({
          isLoading: false,
          error: "Restaurant name is required",
          success: false,
        });
        return;
      }

      await axios.post("http://localhost:8080/registeruser", payload);
      setFormState({ isLoading: false, error: "", success: true });

      setTimeout(() => {
        navigate("/Login");
      }, 2000);
    } catch (err) {
      const msg = err?.response?.data?.error || "Registration failed";
      setFormState({ isLoading: false, error: msg, success: false });
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #fef5ee 0%, #fde8d7 25%, #fdd7ba 50%, #fcc89b 75%, #fbb87d 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "600px" }}>
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
            padding: "40px",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "64px",
                height: "64px",
                background: "rgba(254, 237, 220, 0.8)",
                borderRadius: "50%",
                marginBottom: "16px",
              }}
            >
              <span style={{ fontSize: "28px" }}>🌟</span>
            </div>
            <h1
              style={{
                fontSize: "28px",
                fontWeight: "bold",
                color: "#1f2937",
                marginBottom: "8px",
              }}
            >
              Join Indian Spice Hub
            </h1>
            <p style={{ color: "#6b7280", fontSize: "14px" }}>
              Create your account and start your culinary adventure
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            {formState.error && (
              <div
                style={{
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: "8px",
                  padding: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#dc2626",
                  fontSize: "14px",
                }}
              >
                <span>⚠️</span>
                <span>{formState.error}</span>
              </div>
            )}

            {formState.success && (
              <div
                style={{
                  background: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  borderRadius: "8px",
                  padding: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#16a34a",
                  fontSize: "14px",
                }}
              >
                <span>✅</span>
                <span>Registration successful! Redirecting to login...</span>
              </div>
            )}

            {/* User + Restaurant fields */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              {/* Username */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "6px",
                  }}
                >
                  Username
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Choose a username"
                  value={form.name}
                  onChange={onChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "14px",
                  }}
                />
              </div>

              {/* Email */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "6px",
                  }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={onChange}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "14px",
                  }}
                />
              </div>
            </div>

            {/* Mobile + Password */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              {/* Mobile */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "6px",
                  }}
                >
                  Mobile Number
                </label>
                <input
                  type="tel"
                  name="mob"
                  placeholder="Enter mobile number"
                  value={form.mob}
                  onChange={onChange}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "14px",
                  }}
                />
              </div>

              {/* Password */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "6px",
                  }}
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  value={form.password}
                  onChange={onChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "14px",
                  }}
                />
              </div>
            </div>

            {/* Role Selector */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Register as
              </label>
              <select
                name="role"
                value={form.role}
                onChange={onChange}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                <option value="user">User (Customer)</option>
                <option value="restaurant">Restaurant (Owner)</option>
              </select>
            </div>

            {/* USER DETAILS SECTION */}
            {form.role === "user" && (
              <div
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  padding: "24px",
                  marginTop: "24px",
                  background: "#fafafa",
                }}
              >
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    marginBottom: "16px",
                    color: "#1f2937",
                  }}
                >
                  User Details
                </h3>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "16px",
                  }}
                >
                  {/* ADDRESS */}
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "13px",
                        fontWeight: "500",
                        color: "#374151",
                        marginBottom: "6px",
                      }}
                    >
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      placeholder="Your Address"
                      value={form.userDetails.address}
                      onChange={onUserDetailsChange}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        fontSize: "14px",
                      }}
                    />
                  </div>

                  {/* SPICE LEVEL */}
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "13px",
                        fontWeight: "500",
                        color: "#374151",
                        marginBottom: "6px",
                      }}
                    >
                      Preferred Spice Level
                    </label>
                    <select
                      name="spiceLevel"
                      value={form.userDetails.spiceLevel}
                      onChange={onUserDetailsChange}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        fontSize: "14px",
                        background: "white",
                        cursor: "pointer",
                      }}
                    >
                      <option value="">Select level</option>
                      <option value="mild">Mild 🌶️</option>
                      <option value="medium">Medium 🌶️🌶️</option>
                      <option value="hot">Hot 🌶️🌶️🌶️</option>
                      <option value="extra_hot">Extra Hot 🔥🔥🔥</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* RESTAURANT DETAILS SECTION */}
            {form.role === "restaurant" && (
              <div
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  padding: "24px",
                  marginTop: "24px",
                  background: "#fafafa",
                }}
              >
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    marginBottom: "16px",
                    color: "#1f2937",
                  }}
                >
                  Restaurant Details
                </h3>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "16px",
                  }}
                >
                  {/* Name */}
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "13px",
                        fontWeight: "500",
                        color: "#374151",
                        marginBottom: "6px",
                      }}
                    >
                      Restaurant Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Restaurant Name"
                      value={form.restaurant.name}
                      onChange={onRestaurantChange}
                      required
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        fontSize: "14px",
                      }}
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "13px",
                        fontWeight: "500",
                        color: "#374151",
                        marginBottom: "6px",
                      }}
                    >
                      Phone
                    </label>
                    <input
                      type="text"
                      name="phone"
                      placeholder="Phone Number"
                      value={form.restaurant.phone}
                      onChange={onRestaurantChange}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        fontSize: "14px",
                      }}
                    />
                  </div>

                  {/* Address */}
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "13px",
                        fontWeight: "500",
                        color: "#374151",
                        marginBottom: "6px",
                      }}
                    >
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      placeholder="Address"
                      value={form.restaurant.address}
                      onChange={onRestaurantChange}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        fontSize: "14px",
                      }}
                    />
                  </div>

                  {/* Logo */}
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "13px",
                        fontWeight: "500",
                        color: "#374151",
                        marginBottom: "6px",
                      }}
                    >
                      Logo URL
                    </label>
                    <input
                      type="text"
                      name="logo"
                      placeholder="Logo URL"
                      value={form.restaurant.logo}
                      onChange={onRestaurantChange}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        fontSize: "14px",
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={formState.isLoading || formState.success}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "14px 24px",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "15px",
                border: "none",
                cursor:
                  formState.isLoading || formState.success
                    ? "not-allowed"
                    : "pointer",
                background:
                  formState.isLoading || formState.success
                    ? "#9ca3af"
                    : "#ea580c",
                color: "white",
              }}
            >
              {formState.isLoading ? (
                <>
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      border: "2px solid white",
                      borderTopColor: "transparent",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                    }}
                  ></div>
                  <span>Creating Account...</span>
                </>
              ) : formState.success ? (
                <>
                  <span>✅</span>
                  <span>Account Created!</span>
                </>
              ) : (
                <>
                  <span>🚀</span>
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          {/* FOOTER */}
          <div style={{ marginTop: "32px", textAlign: "center" }}>
            <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "12px" }}>
              Already have an account?{" "}
              <Link
                to="/Login"
                style={{
                  color: "#ea580c",
                  fontWeight: "600",
                  textDecoration: "none",
                }}
              >
                Sign in here
              </Link>
            </p>

            <Link
              to="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                color: "#9ca3af",
                fontSize: "14px",
                textDecoration: "none",
              }}
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
