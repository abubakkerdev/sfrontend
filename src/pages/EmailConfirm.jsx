import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./css/Login.css";

function EmailConfirm() {
  const navigate = useNavigate();
  const userAuth = useSelector(
    (state) => state.userInfo.userLoginInfo.infoUser
  );
  const [message, setMessage] = useState("");
 
  useEffect(() => {
    if (userAuth && "login" in userAuth) {
      if (userAuth.login) {
        navigate("/");
      }
    }
  }, [navigate, userAuth]);

  useEffect(() => {
    let site_url = window.location.href;
    let data = new URL(site_url);

    let queryString = data.searchParams;

    let validNumber = Math.round(Date.now() / 1000);
    let checkNumber = queryString.get("id")
      ? queryString
          .get("id")
          .split("-")
          .map((el) => Number(el).valueOf())
      : [1682208000, 1687456800];

    if (queryString.get("email") && queryString.get("id")) {
      if (
        queryString.get("email") === "verify" &&
        checkNumber[0] < validNumber &&
        checkNumber[1] >= validNumber
      ) {
        setMessage("Your Email is verified.");
      } else {
        navigate("/registrar");
      }
    } else if (queryString.get("success") && queryString.get("id")) {
      if (
        queryString.get("success") === "done" &&
        checkNumber[0] < validNumber &&
        checkNumber[1] >= validNumber
      ) {
        setMessage("Email already verified.");
      } else {
        navigate("/registrar");
      }
    } else if (queryString.get("error") && queryString.get("id")) {
      if (queryString.get("error") === "nofound") {
        setMessage("Authorization Failed.");
      } else {
        navigate("/registrar");
      }
    } else {
      navigate("/registrar");
    }
  }, [navigate]);
 
  return (
    <section className="container commonColor forms">
      <div className="form login">
        <div className="form-content  text-center">
          <h2>Email Confirm</h2>

          <p className="message-email">{message != "" && message}</p>
          <div className="button-fieldC">
            <Link to="/login" className="button-fieldBTN">
              Login
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EmailConfirm;
