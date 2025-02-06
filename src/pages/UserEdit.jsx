import { Link, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import {
  useGetCustomerQuery,
  useGetCustomersQuery,
  useUpdateCustomerMutation,
} from "../features/customer/customerAPISlice";
import { useEffect, useState } from "react";
import GlobalErrorMessage from "./../components/error/GlobalErrorMessage";
import ErrorMessage from "./../components/error/ErrorMessage";
import Loader from "./../components/loader/Loader";

const backendGetToken = import.meta.env.VITE_API_BACKEND_GET_TOKEN;
const backendPostToken = import.meta.env.VITE_API_BACKEND_POST_TOKEN;
const imageBaseURL = import.meta.env.VITE_API_IMAGE_URL_KEY;

function UserEdit() {
  const { id } = useParams();
  const [errorMessageTwo, setErrorMessageTwo] = useState("");
  const { data, isLoading, isSuccess, isError, refetch } = useGetCustomerQuery({
    token: backendGetToken,
    id,
  });
  const { refetch: customersRefetch } = useGetCustomersQuery(backendGetToken);

  const [
    updateCustomer,
    {
      data: customer,
      isLoading: customerIsLoading,
      isSuccess: customerIsSuccess,
      isError: customerIsError,
    },
  ] = useUpdateCustomerMutation();

  const [userInput, setUserInput] = useState({
    id: "",
    uname: "",
    email: "",
    phone: "",
    date: "",
    imageURL: "",
    subcontinents: "",
    description: "",
  });

  useEffect(() => {
    if (data && !isError) {
      if (data && "success" in data) {
        setErrorMessageTwo("");
        setUserInput({
          id: data.success.data[0]._id,
          uname: data.success.data[0].uname,
          email: data.success.data[0].email,
          phone: data.success.data[0].phone,
          date: data.success.data[0].date,
          imageURL: data.success.data[0].imageURL,
          subcontinents: data.success.data[0].subcontinents,
          description: data.success.data[0].description,
        });
      } else {
        if (typeof data.error === "object") {
          setErrorMessageTwo(data.error.message);
        } else {
          setErrorMessageTwo(data.error);
        }
      }
    }

    if (isError) {
      setErrorMessageTwo("There was an server-side Error.");
    }
  }, [data, isSuccess, isError]);

  const options = [
    { value: "", text: "Select Subcontinents" },
    { value: "Africa", text: "Africa" },
    { value: "Antarctica", text: "Antarctica" },
    { value: "Asia", text: "Asia" },
    { value: "Australia", text: "Australia" },
    { value: "Europe", text: "Europe" },
    { value: "North America", text: "North America" },
    { value: "South America", text: "South America" },
  ];

  const [errorMessage, setErrorMessage] = useState("");
  const [userErrorMessage, setUserErrorMessage] = useState({
    uname: "",
    email: "",
    phone: "",
    date: "",
    image: "",
    subcontinents: "",
    description: "",
  });

  const [imageInfo, setImageInfo] = useState({
    imageName: "",
    imageSize: "",
    imageType: "",
  });
  const [imageBase64Data, setImageBase64Data] = useState("");
  const [fileKey, setFileKey] = useState(0);

  const handleChangeInput = (el) => {
    let { name, value } = el.target;
    setErrorMessage("");
    if (value !== "") {
      setUserErrorMessage({ ...userErrorMessage, [name]: "" });
    }
    setUserInput({ ...userInput, [name]: value });
  };

  const handleInputFile = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Data = e.target.result;
        setImageBase64Data(base64Data);
      };

      reader.readAsDataURL(file);
    }

    setImageInfo({
      imageName: event.target.files[0].name,
      imageSize: event.target.files[0].size,
      imageType: event.target.files[0].type,
    });

    setUserErrorMessage({
      ...userErrorMessage,
      image: "",
    });
  };

  const handleUpdateInformation = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      await updateCustomer({
        data: {
          ...userInput,
          imageObj: [imageBase64Data, imageInfo, userInput.imageURL],
        },
        token: backendPostToken,
      }).unwrap();
    } catch (error) {
      // console.error("Error adding user:", error);
    }
  };

  useEffect(() => {
    if (customer && !customerIsError) {
      if (customer && "success" in customer) {
        refetch();
        customersRefetch();
        setUserErrorMessage({
          uname: "",
          email: "",
          phone: "",
          date: "",
          image: "",
          subcontinents: "",
          description: "",
        });

        setImageInfo({
          imageName: "",
          imageSize: "",
          imageType: "",
        });
        setImageBase64Data("");
        setFileKey((prevKey) => prevKey + 1);
        toast.success(customer.success.message, {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        if (typeof customer.error === "object") {
          if ("field" in customer.error) {
            setUserErrorMessage({
              [customer.error.field]: customer.error.message,
            });
          } else {
            setErrorMessage(customer.error.message);
          }
        } else {
          setErrorMessage(customer.error);
        }
      }
    }

    if (customerIsError) {
      setErrorMessage("There was an server-side Error.");
    }
  }, [customer, customerIsSuccess, customerIsError, refetch, customersRefetch]);

  return (
    <section id="appointment" className="appointment section light-background">
      <div className="container section-title" data-aos="fade-up">
        <h2>Edit Information</h2>
      </div>

      <div className="container" data-aos="fade-up" data-aos-delay="100">
        {isLoading && <h4 className="text-center">Loading...</h4>}
        {errorMessageTwo && (
          <>
            <GlobalErrorMessage message={errorMessageTwo} />
            <div className="customer-errorbtn">
              <Link to="/" className="customer-errorbtnEdit">
                Go To Homepage
              </Link>
            </div>
          </>
        )}
        {isSuccess && data && data?.success?.data.length > 0 && (
          <form
            method="post"
            onSubmit={handleUpdateInformation}
            className="php-email-form"
          >
            <div className="row">
              <div className="col-md-4 form-group">
                <input
                  type="text"
                  name="uname"
                  className="form-control"
                  value={userInput.uname}
                  onChange={handleChangeInput}
                  placeholder="piyush agarwal"
                />
                {userErrorMessage?.uname && (
                  <ErrorMessage message={userErrorMessage.uname} />
                )}
              </div>
              <div className="col-md-4 form-group mt-3 mt-md-0">
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={userInput.email}
                  disabled={true}
                  placeholder="demo@gmail.com"
                />
                {userErrorMessage?.email && (
                  <ErrorMessage message={userErrorMessage.email} />
                )}
              </div>
              <div className="col-md-4 form-group mt-3 mt-md-0">
                <input
                  type="number"
                  className="form-control"
                  name="phone"
                  value={userInput.phone}
                  onChange={handleChangeInput}
                  placeholder="01712345678"
                />
                {userErrorMessage?.phone && (
                  <ErrorMessage message={userErrorMessage.phone} />
                )}
              </div>
            </div>
            <div className="row">
              <div className="col-md-4 form-group mt-3">
                <input
                  type="datetime-local"
                  name="date"
                  onChange={handleChangeInput}
                  className="form-control datepicker"
                  value={userInput.date}
                  placeholder="Appointment Date"
                />
                {userErrorMessage?.date && (
                  <ErrorMessage message={userErrorMessage.date} />
                )}
              </div>
              <div className="col-md-4 form-group mt-3">
                <select
                  name="subcontinents"
                  onChange={handleChangeInput}
                  value={userInput.subcontinents}
                  className="form-select"
                >
                  {options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.text}
                    </option>
                  ))}
                </select>

                {userErrorMessage?.subcontinents && (
                  <ErrorMessage message={userErrorMessage.subcontinents} />
                )}
              </div>
              <div className="col-md-4 form-group mt-3 controlMainImg">
                <input
                  key={fileKey}
                  className="form-control"
                  type="file"
                  onChange={handleInputFile}
                />

                {userErrorMessage?.image && (
                  <ErrorMessage message={userErrorMessage.image} />
                )}

                {userInput.imageURL && (
                  <div className="controlMainbox controlMainChild">
                    <img
                      src={
                        userInput.imageURL
                          ? `${imageBaseURL}/${userInput.imageURL}`
                          : "/img/default.jpg"
                      }
                      className="img-thumbnail"
                      alt={userInput.imageURL}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="form-group mt-3">
              <textarea
                className="form-control"
                name="description"
                rows={5}
                value={userInput.description}
                onChange={handleChangeInput}
                placeholder="Bio (Optional)"
              />
              {userErrorMessage?.description && (
                <GlobalErrorMessage message={userErrorMessage.description} />
              )}
              {errorMessage && <GlobalErrorMessage message={errorMessage} />}
            </div>
            <div className="mt-3">
              <div className="text-center">
                {customerIsLoading ? (
                  <Loader />
                ) : (
                  <button type="submit">Edit Info</button>
                )}
              </div>
            </div>
          </form>
        )}
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

export default UserEdit;
