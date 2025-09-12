import React, { createContext, useContext, useState } from "react";
import studentsData from "../data/students.json"; // your JSON file

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [student, setStudent] = useState(null);

  const login = (email, password) => {
    const found = studentsData.find(
      (s) => s.email === email && s.password === password
    );
    if (found) {
      setStudent(found);
      return true;
    }
    return false;
  };

  const logout = () => setStudent(null);

  return (
    <AuthContext.Provider value={{ student, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
