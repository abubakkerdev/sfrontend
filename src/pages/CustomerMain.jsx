import { Link, useParams } from "react-router-dom";
import { useGetCustomerQuery } from "../features/customer/customerAPISlice";
import { useEffect, useState } from "react";
import GlobalErrorMessage from "./../components/error/GlobalErrorMessage";

const backendGetToken = import.meta.env.VITE_API_BACKEND_GET_TOKEN;
const imageBaseURL = import.meta.env.VITE_API_IMAGE_URL_KEY;

function formatDateTime(timestamp) {
  const date = new Date(timestamp);
  const formatted = date
    .toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .replace(",", "")
    .replace(",", ",");

  return formatted;
}

function Customer() {
  const { id } = useParams();
  const [errorMessage, setErrorMessage] = useState("");
  const { data, isLoading, isSuccess, isError } = useGetCustomerQuery({
    token: backendGetToken,
    id,
  });

  const [customerInfo, setCustomerInfo] = useState({
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
        setCustomerInfo({
          id: data.success.data[0]._id,
          uname: data.success.data[0].uname,
          email: data.success.data[0].email,
          phone: data.success.data[0].phone,
          date: data.success.data[0].date,
          imageURL: data.success.data[0].imageURL,
          subcontinents: data.success.data[0].subcontinents,
          description: data.success.data[0].description,
        });
        setErrorMessage("");
      } else {
        if (typeof data.error === "object") {
          setErrorMessage(data.error.message);
        } else {
          setErrorMessage(data.error);
        }
      }
    }

    if (isError) {
      setErrorMessage("There was an server-side Error.");
    }
  }, [data, isSuccess, isError]);

  return (
    <section id="appointment" className="appointment section light-background">
      <div className="container" data-aos="fade-up" data-aos-delay="100">
        {errorMessage && (
          <>
            <GlobalErrorMessage message={errorMessage} />
            <div className="customer-errorbtn">
              <Link to="/" className="customer-errorbtnEdit">
                Go To Homepage
              </Link>
            </div>
          </>
        )}

        {isLoading && <h4 className="text-center">Loading...</h4>}

        {isSuccess && data && data?.success?.data.length > 0 && (
          <table className="table table-striped table-bordered table-hover">
            <tbody>
              <tr>
                <th>Photo</th>
                <td>
                  <div className="thumbnail-big">
                    <img
                      src={
                        customerInfo.imageURL
                          ? `${imageBaseURL}/${customerInfo.imageURL}`
                          : "/img/default.jpg"
                      }
                      className="img-thumbnail"
                      alt={customerInfo.imageURL || "default.jpg"}
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <th>Name</th>
                <td>{customerInfo.uname}</td>
              </tr>
              <tr>
                <th>Email</th>
                <td>{customerInfo.email}</td>
              </tr>
              <tr>
                <th>Phone</th>
                <td>{customerInfo.phone}</td>
              </tr>
              <tr>
                <th>Subcontinent</th>
                <td>{customerInfo.subcontinents}</td>
              </tr>
              <tr>
                <th>Description</th>
                <td>{customerInfo.description}</td>
              </tr>
              <tr>
                <th>Date</th>
                <td>{formatDateTime(customerInfo.date)}</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

export default Customer;
