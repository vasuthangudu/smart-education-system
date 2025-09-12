import React, { createContext, useContext, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [student, setStudent] = useState(null);

  const login = async (email, password) => {
    try {
      // Fetch all students from the backend
      const res = await axios.get("http://localhost:5000/api/students");
      const students = res.data;

      // Find matching credentials
      const found = students.find(
        (s) => s.email === email && s.password === password
      );

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
