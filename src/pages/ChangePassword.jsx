import ErrorMessage from "../components/error/ErrorMessage";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setForgotToken } from "../features/user/userSlice";
import { ToastContainer, toast } from "react-toastify";
import { useChangePasswordMutation } from "../features/user/userAPISlice";
import Loader from "../components/loader/Loader";
import "./css/Login.css";

const changePasswordToken = import.meta.env.VITE_API_BACKEND_POST_TOKEN;
function destroyCookie(name) {
  document.cookie = name + "=; expires=Thu, 11 Jan 1971 00:00:00 UTC; path=/;";
}

function ChangePassword() {
  const [changePassword, { data, isLoading, isSuccess, isError }] =
    useChangePasswordMutation();
  let { token } = useParams();
  const userAuth = useSelector((state) => state.userInfo);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [changePasswordInfo, setChangePasswordInfo] = useState({
    password: "",
    cpassword: "",
  });
  const [changePasswordError, setChangePasswordError] = useState({
    password: "",
    cpassword: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (userAuth && "login" in userAuth.userLoginInfo.infoUser) {
      if (userAuth.userLoginInfo.infoUser.login) {
        navigate("/");
      }
    } else {
      if (
        userAuth &&
        token !== userAuth.userLoginInfo.forgotToken.forgotToken
      ) {
        navigate("/login");
      }
    }
  }, [token, navigate, userAuth]);

  useEffect(() => {
    if (data && !isError) {
      if (data && "success" in data) {
        setChangePasswordInfo({
          password: "",
          cpassword: "",
        });
        dispatch(setForgotToken({ forgotToken: "101010" }));
        // destroyCookie("forgotToken");

        toast.success(data.success.message, {
          position: "top-right",
          onClose: () => {
            navigate("/login");
          },
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        if (typeof data.error === "object") {
          if ("field" in data.error) {
            setChangePasswordError({
              [data.error.field]: data.error.message,
            });
          } else {
            setErrorMessage(data.error.message);
          }
        } else {
          setErrorMessage(data.error);
        }
      }
    }

    if (isError) {
      setErrorMessage("There was an server-side Error.");
    }
  }, [data, isSuccess, isError, navigate, dispatch]);

  const handleChange = (el) => {
    let { name, value } = el.target;
    setErrorMessage("");
    if (value !== "") {
      setChangePasswordError({ ...changePasswordError, [name]: "" });
    }
    setChangePasswordInfo({ ...changePasswordInfo, [name]: value });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      await changePassword({
        data: { ...changePasswordInfo },
        token: changePasswordToken,
      }).unwrap();
    } catch (error) {
      // console.error("Error adding user:", error); // Catches the error directly
    }
  };

  return (
    <section className="container commonColor forms">
      <div className="form login">
        <div className="form-content  text-center">
          <h2>Change Password</h2>
          <form method="POST" onSubmit={handleChangePassword}>
            <div className=" form-group mt-3 ">
              <input
                type="text"
                className="form-control"
                name="password"
                onChange={handleChange}
                value={changePasswordInfo.password}
                placeholder="Your password"
              />

              {changePasswordError?.password && (
                <ErrorMessage message={changePasswordError.password} />
              )}
            </div>

            <div className="mb-4 mt-4 form-group">
              <input
                type="text"
                name="cpassword"
                onChange={handleChange}
                value={changePasswordInfo.cpassword}
                className="form-control"
                placeholder="Confirm Password"
              />
              {changePasswordError?.cpassword && (
                <ErrorMessage message={changePasswordError.cpassword} />
              )}
              {errorMessage && <ErrorMessage message={errorMessage} />}
            </div>

            {isLoading ? (
              <Loader />
            ) : (
              <div className="button-fieldC">
                <button className="button-fieldBTN">Change Password</button>
              </div>
            )}
          </form>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </section>
  );
}

export default ChangePassword;
