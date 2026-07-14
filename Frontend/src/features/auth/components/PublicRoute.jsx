import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";


const PublicRoute = ({ children }) => {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <main>
        <h1>Loading...</h1>
      </main>
    );
  }

  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Navigate to={"/dashboard"} />;
  }

  return children;
};

export default PublicRoute;
