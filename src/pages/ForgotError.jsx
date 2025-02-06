import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";

function ForgotError() {
  const userAuth = useSelector(
    (state) => state.userInfo.userLoginInfo.infoUser
  );
  const navigate = useNavigate();
 
  useEffect(() => {
    if (userAuth && "login" in userAuth) {
      if (userAuth.login) {
        navigate("/");
      }
    }
  }, [navigate, userAuth]);

  return (
    <section className="container commonColor forms">
      <div className="form login">
        <div className="form-content  text-center">
          <h2>Credential not match</h2>

          <div className="button-fieldC">
            <Link to="/login" className="button-fieldBTN">
              Back To Home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ForgotError;
