import { useState } from "react";
import { Link } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isVendor, setIsVendor] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      // TODO: Wire up to your backend signup endpoint
      // Example:
      // const res = await fetch(isVendor ? '/api/vendor/auth/signup' : '/api/auth/signup', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ name, email, password, role: isVendor ? 'vendor' : 'user' })
      // });
      await new Promise((r) => setTimeout(r, 600));
      // eslint-disable-next-line no-alert
      alert(`Registration submitted for ${name} as ${isVendor ? 'Vendor' : 'User'}`);
    } catch (err) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
      <div style={{ width: "100%", maxWidth: 480 }}>
        <h1
          style={{
            marginBottom: "1rem",
            textAlign: "center",
            color: "#f97316",
            fontWeight: 800,
            letterSpacing: 0.3,
          }}
        >
          Register
        </h1>

        <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
          {error ? (
            <div style={{
              background: "#fee2e2",
              color: "#991b1b",
              border: "1px solid #fecaca",
              padding: "0.5rem 0.75rem",
              borderRadius: 8,
              fontSize: 14,
            }}>
              {error}
            </div>
          ) : null}

          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ fontSize: 14, color: "#374151" }}>Name</span>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              style={{
                padding: "0.6rem 0.75rem",
                borderRadius: 8,
                border: "1px solid #d1d5db",
              }}
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ fontSize: 14, color: "#374151" }}>Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{
                padding: "0.6rem 0.75rem",
                borderRadius: 8,
                border: "1px solid #d1d5db",
              }}
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ fontSize: 14, color: "#374151" }}>Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                padding: "0.6rem 0.75rem",
                borderRadius: 8,
                border: "1px solid #d1d5db",
              }}
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ fontSize: 14, color: "#374151" }}>Re-enter Password</span>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                padding: "0.6rem 0.75rem",
                borderRadius: 8,
                border: "1px solid #d1d5db",
              }}
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 4,
              padding: "0.7rem 1rem",
              borderRadius: 8,
              border: "none",
              background: loading ? "#93c5fd" : "#2563eb",
              color: "#ffffff",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: 700,
            }}
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <div style={{ marginTop: 12 }}>
          <label style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={isVendor}
              onChange={(e) => setIsVendor(e.target.checked)}
            />
            <span style={{ fontSize: 14, color: "#374151" }}>Register as vendor</span>
          </label>
        </div>

        <div style={{
          marginTop: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          flexWrap: "wrap",
        }}>
          <span style={{ fontSize: 14, color: "#374151" }}>Already have an account?</span>
          <Link
            to="/login"
            style={{
              textDecoration: "none",
              background: "#fb923c",
              color: "#111827",
              padding: "0.45rem 0.8rem",
              borderRadius: 8,
              fontWeight: 700,
            }}
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}


