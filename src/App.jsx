import { useEffect, useRef, useState } from "react";
import {
  Routes,
  Route,
  NavLink,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Button, IconButton, Badge } from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import Home from "./pages/Home.jsx";
import { Products } from "./pages/Products.jsx";
import { LoginPage } from "./pages/LoginPage.jsx";
import AuthService from "./services/AuthService.jsx";
import logo from "./assets/Logo.png";
import { useDataStore } from "./store/DataStore.jsx";
import { Request } from "../src/forms/Request.jsx";
import { useObjectStore } from "../src/store/DataStore.jsx";

export default function App() {
  const { items: requests, load, initialized } = useObjectStore("Request");

  const { resetStore } = useDataStore();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);
  const [requestForm, setRequestForm] = useState(false);

  useEffect(() => {
    if (!initialized) fetchRecords();
  }, [initialized]);

  const location = useLocation();
  const navigate = useNavigate();
  const locationLogin = location.pathname.includes("login");
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const requestRef = useRef(null);
  const requestButtonRef = useRef(null);
  const requestForRecipienCount =
    user && Array.isArray(requests)
      ? requests.filter((item) => item.recipient === user.id).length
      : 0;

  const fetchRecords = async () => {
    setLoading(true);
    try {
      setUser(await AuthService.getUser());
    } catch (err) {
      console.log("User not logged in:", err);
      setUser(null);
    } finally {
      setLoading(false);
      load();
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      const target = event.target;

      if (
        requestOpen &&
        requestRef.current &&
        !requestRef.current.contains(target) &&
        requestButtonRef.current &&
        !requestButtonRef.current.contains(target)
      ) {
        setRequestOpen(false);
      }

      if (
        menuOpen &&
        menuRef.current &&
        !menuRef.current.contains(target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(target)
      ) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen, requestOpen]);

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
      resetStore();
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="app">
      {!locationLogin && (
        <nav
          className="navbar"
          style={{
            padding: "0.5rem 1rem",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
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

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              position: "relative",
            }}
          >
            <IconButton
              color="primary"
              sx={{ padding: "6px" }}
              onClick={() => setRequestOpen((open) => !open)}
              ref={requestButtonRef}
            >
              <Badge
                badgeContent={requestForRecipienCount}
                color="error"
                overlap="circular"
                max={99}
                invisible={requestForRecipienCount === 0}
              >
                <NotificationsActiveIcon sx={{ fontSize: 26 }} />
              </Badge>
            </IconButton>

            {requestOpen && (
              <div
                ref={requestRef}
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
                <p
                  style={{
                    fontWeight: "Bold",
                    color: "black",
                    textAlign: "center",
                  }}
                >
                  To Me
                </p>
                {requests
                  .filter((item) => item.recipient === user.id)
                  .map((item) => (
                    <p
                      key={item.id}
                      style={{
                        color: "black",
                        textAlign: "center",
                      }}
                    >
                      {item.title}
                    </p>
                  ))}
              </div>
            )}
            <button
              type="button"
              ref={menuButtonRef}
              onClick={() => setMenuOpen((open) => !open)}
              style={{
                border: "none",
                background: "transparent",
                padding: 0,
                cursor: "pointer",
                display: "flex",
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
                <p
                  style={{
                    fontWeight: "Bold",
                    color: "black",
                    textAlign: "center",
                  }}
                >
                  {user.name} {user.lastname}
                </p>
                <Button
                  variant="text"
                  onClick={() => setRequestForm(true)}
                  style={{
                    width: "100%",
                    textAlign: "center",
                    cursor: "pointer",
                    borderTop: "1px solid #eee",
                  }}
                >
                  Request
                </Button>
                <Button
                  variant="text"
                  onClick={handleLogout}
                  style={{
                    width: "100%",
                    cursor: "pointer",
                    color: "red",
                    borderTop: "1px solid #eee",
                  }}
                >
                  Logout
                </Button>
              </div>
            )}
          </div>
        </nav>
      )}

      <main className="content" style={{ padding: "1rem 2rem" }}>
        <Routes>
          <Route
            path="/"
            element={
              user ? <Home user={user} /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/products"
            element={
              user ? <Products user={user} /> : <Navigate to="/login" replace />
            }
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
          <Route
            path="*"
            element={<Navigate to={user ? "/" : "/login"} replace />}
          />
        </Routes>
      </main>

      {requestForm && (
        <Request
          closeEvent={() => {
            setRequestForm(false);
          }}
        />
      )}
    </div>
  );
}
