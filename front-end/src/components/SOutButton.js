import { useAuth0 } from "@auth0/auth0-react";
import { React } from "react";

const SOutButton = () => {
    const { logout, isAuthenticated } = useAuth0();
  return (
    isAuthenticated && (
        <button onClick={() => logout()}>
            sign out
        </button>
    )
  )
};

export default SOutButton ;