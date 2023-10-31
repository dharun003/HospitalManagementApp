import React, { createContext, useContext, useState } from "react";

// Create the context
const UserContext = createContext();

// Create a custom hook for accessing the user's email
export const useUserEmail = () => {
  return useContext(UserContext);
};

// Create a provider component
export const UserProvider = ({ children }) => {
  const [userEmail, setUserEmail] = useState(null);

  return (
    <UserContext.Provider value={{ userEmail, setUserEmail }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
