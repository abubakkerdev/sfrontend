import { Outlet, useNavigate } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import { useSelector } from "react-redux";
import { useEffect } from "react";

function MainLayout() {
  const userAuth = useSelector(
    (state) => state.userInfo.userLoginInfo.infoUser
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (userAuth && "error" in userAuth) {
      if (!userAuth.error) {
        navigate("/login");
      }
    }
  }, [userAuth, navigate]);

  return (
    <>
      <Header />
      <main className="main">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default MainLayout;
