import React, { createContext, useContext, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [student, setStudent] = useState(null);

  // ✅ Login using rollNo & password
  const login = async (rollNo, password) => {
    try {
      const { data } = await axios.get("http://localhost:5008/api/students");
      const found = data.find((s) => s.rollNo === rollNo && s.password === password);
      if (found) {
        setStudent(found);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Login error:", err);
      return false;
    }
  };

  const logout = () => setStudent(null);

  return (
    <AuthContext.Provider value={{ student, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
