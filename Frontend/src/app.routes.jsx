import { createBrowserRouter } from "react-router-dom";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Protected from "./features/auth/components/Protected";
import Landing from "./pages/Landing.jsx";
import Dashboard from "./pages/Dashboard";
import Interview from "./features/interview/pages/Interview";
import Resume from "./pages/Resume";
import MockInterview from "./pages/MockInterview";
import AIInterview from "./pages/AIInterview";
import Profile from "./pages/Profile";
import Features from "./pages/Features";
import About from "./pages/About";
import Navbar from "./components/Navbar";

const Layout = ({ children }) => (
  <>
    <Navbar />
    {children}
  </>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout><Landing /></Layout>,
  },
  {
    path: "/features",
    element: <Layout><Features /></Layout>,
  },
  {
    path: "/about",
    element: <Layout><About /></Layout>,
  },
  {
    path: "/login",
    element: <Layout><Login /></Layout>,
  },
  {
    path: "/register",
    element: <Layout><Register /></Layout>,
  },
  {
    path: "/dashboard",
    element: (
      <Protected>
        <Layout><Dashboard /></Layout>
      </Protected>
    ),
  },
  {
    path: "/resume",
    element: (
      <Protected>
        <Layout><Resume /></Layout>
      </Protected>
    ),
  },
  {
    path: "/mock-interview",
    element: (
      <Protected>
        <Layout><MockInterview /></Layout>
      </Protected>
    ),
  },
  {
    path: "/ai-interview",
    element: (
      <Protected>
        <Layout><AIInterview /></Layout>
      </Protected>
    ),
  },
  {
    path: "/profile",
    element: (
      <Protected>
        <Layout><Profile /></Layout>
      </Protected>
    ),
  },
  {
    path: "/interview/:interviewId",
    element: (
      <Protected>
        <Layout><Interview /></Layout>
      </Protected>
    ),
  },
]);
