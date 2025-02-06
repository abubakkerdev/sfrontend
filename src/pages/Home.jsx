import { Link, NavLink } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import {
  useDeleteCustomerMutation,
  useGetCustomersQuery,
} from "../features/customer/customerAPISlice";
import { useEffect } from "react";

const backendGetToken = import.meta.env.VITE_API_BACKEND_GET_TOKEN;
const backendPostToken = import.meta.env.VITE_API_BACKEND_POST_TOKEN;
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

function Home() {
  const { data, isLoading, isSuccess, isError, refetch } =
    useGetCustomersQuery(backendGetToken);
  const [
    deleteCustomer,
    {
      data: customer,
      isLoading: customerIsLoading,
      isSuccess: customerIsSuccess,
      isError: customerIsError,
    },
  ] = useDeleteCustomerMutation();

  const handleDelete = async (id, imgURL) => {
    try {
      await deleteCustomer({
        data: { _id: id, imgURL },
        token: backendPostToken,
      }).unwrap();
    } catch (error) {
      // console.error("Error deleting customer:", error);
    }
  };

  useEffect(() => {
    if (customer && !customerIsError) {
      if (customer && "success" in customer) {
        refetch();
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
          toast.error(customer.error.message, {
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
          toast.error(customer.error, {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      }
    }

    if (customerIsError) {
      toast.error("There was an server-side Error.", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }, [customer, customerIsSuccess, customerIsError, refetch]);

  let content = "";

  if (isSuccess) {
    if (data) {
      if (data?.error?.message === "Failed to fetch Data") {
        content = (
          <tr>
            <td colSpan={9} className="text-center">
              <h4>Currently, there is no data to display.</h4>
            </td>
          </tr>
        );
      } else if (data?.success?.data.length > 0) {
        content = data?.success?.data?.map((customer, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>
              <div className="thumbnail-change">
                <img
                  src={
                    customer.imageURL
                      ? `${imageBaseURL}/${customer.imageURL}`
                      : "/img/default.jpg"
                  }
                  className="img-thumbnail"
                  alt={customer.imageURL || "default.jpg"}
                />
              </div>
            </td>
            <td>{customer.uname}</td>
            <td>{customer.email}</td>
            <td>{customer.phone}</td>
            <td>{formatDateTime(customer.date)}</td>
            <td>{customer.subcontinents}</td>
            <td>
              {customer.description.slice(0, 20)} ...
              <NavLink to={`/view/${customer._id}`}>more</NavLink>
            </td>
            <td>
              <div role="group" className="btn-group btn-group-sm commonBtn">
                <Link to={`/edit/${customer._id}`} className="btn btn-primary">
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(customer._id, customer.imageURL)}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ));
      } else {
        content = (
          <tr>
            <td colSpan={9} className="text-center">
              <h4>An issue occurred on the server. Please retry.</h4>
            </td>
          </tr>
        );
      }
    }
  }

  return (
    <>
      <section
        id="appointment"
        className="appointment section light-background"
      >
        <div className="container section-title" data-aos="fade-up">
          <h2>Information Table</h2>
        </div>

        <div className="container" data-aos="fade-up" data-aos-delay="100">
          <table className="table table-striped table-bordered table-hover">
            <thead>
              <tr>
                <th>#</th>
                <th>Photo</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Date</th>
                <th>Subcontinent</th>
                <th>Description</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={9} className="text-center">
                    <h4>Loading...</h4>
                  </td>
                </tr>
              )}

              {isError && (
                <tr>
                  <td colSpan={9} className="text-center">
                    <h4>Failed to fetch Data. Please try again later.</h4>
                  </td>
                </tr>
              )}
              {content}
            </tbody>
          </table>
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
    </>
  );
}

export default Home;
