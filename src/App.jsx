import {
  Route,
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
} from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Home from "./pages/Home";
import UserAdd from "./pages/UserAdd";
import UserEdit from "./pages/UserEdit";
import Error from "./pages/Error";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import EmailConfirm from "./pages/EmailConfirm";
import Forgot from "./pages/Forgot";
import ChangePassword from "./pages/ChangePassword";
import ForgotError from "./pages/ForgotError";
import CustomerMain from "./pages/CustomerMain";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="add" element={<UserAdd />} />
          <Route path="view/:id" element={<CustomerMain />} />
          <Route path="edit/:id" element={<UserEdit />} />
        </Route>
 
        <Route path="/login" element={<Login />} />
        <Route path="/registrar" element={<Registration />} />
        <Route path="/emailconfirm" element={<EmailConfirm />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/forgot-error" element={<ForgotError />} />
        <Route path="/change-password/:token" element={<ChangePassword />} />
        <Route path="/*" element={<Error />} />
      </>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
