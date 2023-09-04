import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { Button } from "primereact/button";

const SInButton = () => {
    const { loginWithRedirect } = useAuth0();

    const signUp = () => {
      loginWithRedirect ({
        initialScreen: "signUp",
      });
    };
  return (
    // !isAuthenticated && (
    //   <div className="flex flex-column justify-content-center  mx-8">
    //     <Button onClick={() => loginWithRedirect({screen_hint: "signup"})} style={styles.button} icon="pi pi-google" className="w-full flex flex-row  justify-content-center align-items-center" >
    //       <span className="ml-3">Sign In with Google </span>
    //     </Button>
    //   </div>
    
      
        <Button onClick={signUp} style={styles.button} icon="pi pi-google" className="w-full flex flex-row  justify-content-center align-items-center" >
          <span className="ml-3">Sign UP</span>
        </Button>
      
    
  )
};

const styles = {
    button: {
        backgroundColor: "#345059",
        color: "#FFFFFF",
        with: "100%",
    },
}

export default SInButton ;