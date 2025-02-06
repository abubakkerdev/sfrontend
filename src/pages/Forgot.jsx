import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useResetPasswordMutation } from "../features/user/userAPISlice";
import { setForgotToken } from "../features/user/userSlice";
import { ToastContainer, toast } from "react-toastify";
import ErrorMessage from "../components/error/ErrorMessage";
import { useNavigate } from "react-router-dom";
import Loader from "../components/loader/Loader";
import "./css/Login.css";

const resetToken = import.meta.env.VITE_API_BACKEND_POST_TOKEN;

function Forgot() {
  const [resetPassword, { data, isLoading, isSuccess, isError }] =
    useResetPasswordMutation();
  const userAuth = useSelector(
    (state) => state.userInfo.userLoginInfo.infoUser
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (userAuth && "login" in userAuth) {
      if (userAuth.login) {
        navigate("/");
      }
    }
  }, [navigate, userAuth]);

  useEffect(() => {
    if (data && !isError) {
      if (data && "success" in data) {
        setEmail("");

        dispatch(setForgotToken(data.success.cookie));

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
            setMessage(data.error.message);
          } else {
            setMessage(data.error.message);
          }
        } else {
          setMessage(data.error);
        }
      }
    }

    if (isError) {
      setMessage("There was an server-side Error.");
    }
  }, [data, isSuccess, isError, navigate, dispatch]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await resetPassword({ data: { email }, token: resetToken }).unwrap();
    } catch (error) {
      // console.error("Error adding user:", error); // Catches the error directly
    }
  };

  return (
    <section className="container commonColor forms">
      <div className="form login">
        <div className="form-content  text-center">
          <form method="POST" onSubmit={handleResetPassword}>
            <div className=" form-group mt-3 ">
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => {
                  setMessage("");
                  setEmail(e.target.value);
                }}
                placeholder="Your Email"
              />
              {message && <ErrorMessage message={message} />}
            </div>

            {isLoading ? (
              <Loader />
            ) : (
              <div className="button-fieldC">
                <button className="button-fieldBTN">Reset Password</button>
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

export default Forgot;
