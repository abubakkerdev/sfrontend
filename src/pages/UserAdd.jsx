import { useEffect, useState } from "react";
import ErrorMessage from "../components/error/ErrorMessage";
import { ToastContainer, toast } from "react-toastify";
import {
  useAddCustomerMutation,
  useGetCustomersQuery,
} from "../features/customer/customerAPISlice";
import Loader from "../components/loader/Loader";
import GlobalErrorMessage from "../components/error/GlobalErrorMessage";

const backendPostToken = import.meta.env.VITE_API_BACKEND_POST_TOKEN;
const backendGetToken = import.meta.env.VITE_API_BACKEND_GET_TOKEN;
 
function UserAdd() {
  const [addCustomer, { data, isLoading, isSuccess, isError }] =
    useAddCustomerMutation();
  const { refetch } = useGetCustomersQuery(backendGetToken);

  const [userInput, setUserInput] = useState({
    uname: "",
    email: "",
    phone: "",
    date: "",
    subcontinents: "",
    description: "",
  });
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

  const handleAddInformation = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      await addCustomer({
        data: {
          ...userInput,
          imageObj: [imageBase64Data, imageInfo],
        },
        token: backendPostToken,
      }).unwrap();
    } catch (error) {
      // console.error("Error adding user:", error);
    }
  };
  
  useEffect(() => {
    if (data && !isError) {
      if (data && "success" in data) {
        setUserInput({
          uname: "",
          email: "",
          phone: "",
          date: "",
          subcontinents: "",
          description: "",
        });
        setUserErrorMessage({
          uname: "",
          email: "",
          phone: "",
          date: "",
          image: "",
          subcontinents: "",
          description: "",
        });

        refetch();

        setImageInfo({
          imageName: "",
          imageSize: "",
          imageType: "",
        });
        setImageBase64Data("");
        setFileKey((prevKey) => prevKey + 1);

        toast.success(data.success.message, {
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
        if (typeof data.error === "object") {
          if ("field" in data.error) {
            setUserErrorMessage({
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
  }, [data, isSuccess, isError, refetch]);

  return (
    <section id="appointment" className="appointment section  light-background">
      <div className="container section-title" data-aos="fade-up">
        <h2>Add Information</h2>
      </div>

      <div className="container" data-aos="fade-up" data-aos-delay="100">
        <form
          method="post"
          onSubmit={handleAddInformation}
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
                onChange={handleChangeInput}
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
            <div className="col-md-4 form-group mt-3">
              <input
                key={fileKey}
                className="form-control"
                type="file"
                onChange={handleInputFile}
              />
              {userErrorMessage?.image && (
                <ErrorMessage message={userErrorMessage.image} />
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
              {isLoading ? <Loader /> : <button type="submit">Add Info</button>}
            </div>
          </div>
        </form>
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

export default UserAdd;
