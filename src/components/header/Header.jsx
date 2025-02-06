import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserData } from "../../features/user/userSlice";

function destroyCookie(name) {
  document.cookie = name + "=; expires=Thu, 11 Jan 1971 00:00:00 UTC; path=/;";
}

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = () => {
    // destroyCookie("userAllInfo");
    dispatch(setUserData({ error: false }));
    navigate("/login");
  };

  return (
    <header id="header" className="header sticky-top">
      <div className="branding d-flex align-items-center">
        <div className="container position-relative d-flex align-items-center justify-content-end">
          <Link to="/" className="logo d-flex align-items-center me-auto">
            <h1 className="sitename">Deep Learning</h1>
          </Link>
          <nav id="navmenu" className="navmenu">
            <ul>
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/add"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Add Content
                </NavLink>
              </li>
            </ul>
            <i className="mobile-nav-toggle d-xl-none bi bi-list"></i>
          </nav>

          <span onClick={handleLogOut} className="cta-btn">
            Log Out
          </span>
        </div>
      </div>
    </header>
  );
}

export default Header;
