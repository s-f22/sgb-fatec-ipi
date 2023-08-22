import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { Image } from "primereact/image";

const maxChar = 10;

const truncate = (str, maxChar) => {
    return str.length > maxChar ? str.substring(0, maxChar - 3) + "..." : str;
}

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    isAuthenticated && (
      <div>
       {user.picture && <Image src={user.picture} alt={user?.name} width={23} />}
       <h4 style={styles.userName}>{truncate(user.name, maxChar)}</h4>
      </div>
    )
  );
};

const styles = {
  userName: {
      color: '#335259',
      fontSize: 13,
      marginTop: -25,
      marginLeft: 30,
  }

}




export default Profile;