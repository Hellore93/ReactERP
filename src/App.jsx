import { useEffect, useRef, useState } from "react";
import {
  Routes,
  Route,
  NavLink,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Home from "./pages/Home.jsx";
import { Products } from "./pages/Products.jsx";
import { LoginPage } from "./pages/LoginPage.jsx";
import AuthService from "./services/AuthService.jsx";
import logo from "./assets/logo.png";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const locationLogin = location.pathname.includes("login");
  const menuRef = useRef(null);
  const logoButtonRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const {
          data: { user },
        } = await AuthService.getUser();
        setUser(user);
      } catch (err) {
        console.log("User not logged in:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        logoButtonRef.current &&
        !logoButtonRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) {
    return <p>Ładowanie...</p>;
  }

  const handleLoginSuccess = (userFromLogin) => {
    setUser(userFromLogin);
    navigate("/", { replace: true });
  };

  const handleLogout = async () => {
    try {
      await AuthService.logout();
    } catch (e) {
      console.error("Logout error", e);
    } finally {
      setUser(null);
      setMenuOpen(false);
      navigate("/login", { replace: true });
    }
  };

  const handleTestClick = () => {
    alert("Test action");
    setMenuOpen(false);
  };

  return (
    <div className="app">
      {!locationLogin && (
        <nav className="navbar" style={{ padding: "0.5rem 1rem" }}>
          <div className="links">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/products"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Products
            </NavLink>
          </div>

          <div style={{ position: "relative" }}>
            <button
              type="button"
              ref={logoButtonRef}
              onClick={() => setMenuOpen((open) => !open)}
              style={{
                border: "none",
                background: "transparent",
                padding: 0,
                cursor: "pointer",
              }}
            >
              <img src={logo} alt="React ERP logo" style={{ height: "32px" }} />
            </button>

            {menuOpen && (
              <div
              ref={menuRef}
                style={{
                  position: "absolute",
                  top: "110%",
                  right: 0,
                  backgroundColor: "white",
                  borderRadius: "0.375rem",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                  minWidth: "140px",
                  zIndex: 1000,
                  overflow: "hidden",
                }}
              >
                {/* <button
                  type="button"
                  onClick={handleTestClick}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "0.5rem 0.75rem",
                    border: "none",
                    background: "white",
                    textAlign: "left",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                  }}
                >
                  Test
                </button> */}
                <button
                  type="button"
                  onClick={handleLogout}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "0.5rem 0.75rem",
                    border: "none",
                    background: "white",
                    textAlign: "left",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    color: "red",
                    borderTop: "1px solid #eee",
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </nav>
      )}

      <main className="content" style={{ padding: "1rem 2rem" }}>
        <Routes>
          <Route
            path="/"
            element={user ? <Home /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/products"
            element={user ? <Products /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/login"
            element={
              user ? (
                <Navigate to="/" replace />
              ) : (
                <LoginPage onLogin={handleLoginSuccess} />
              )
            }
          />
        </Routes>
      </main>
    </div>
  );
}
