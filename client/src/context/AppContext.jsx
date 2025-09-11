import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.withCredentials = true;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showHotelReg, setShowHotelReg] = useState(false);
  const [searchedCities, setSearchedCities] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();

  const fetchRooms = async () => {
    try {
      const { data } = await axios.get("/api/rooms");
      if (data.success) {
        setRooms(data.rooms);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
   console.log(user);
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user");
      if (data.success) {
        console.log("Fetched user data:", data.userData);
        setUser(data.userData);
        setIsAuthenticated(true);
        setIsOwner(data.userData?.role === "hotelOwner");
        setSearchedCities(data.userData?.recentSearchCities || []);
      } else {
        //Retry fetching user details after 5 seconds
        setTimeout(() => {
          fetchUser();
        }, 5000);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const logout = async () => {
    try {
      console.log("Logging out user...");
      await axios.post("/api/user/logout");
    } catch (error) {
      console.log("Logout failed");
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setIsOwner(false);
      setIsLogin(false);
      document.body.style.overflow = "unset";
      setSearchedCities([]);
      toast.success("Logged out successfully");
      navigate("/");
    }
  };

 

  useEffect(() => {
    fetchRooms();
    fetchUser();
  }, []);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (
          error.response?.status === 401 &&
          isAuthenticated &&
          !error.config.url.includes("/login") &&
          !error.config.url.includes("/register") &&
          !error.config.url.includes("/logout")
        ) {
          setIsAuthenticated(false);
          setUser(null);
          setIsOwner(false);
          toast.error("Session expired. Please login again.");
          navigate("/");
        }
        return Promise.reject(error);
      }
    );

    // Cleanup interceptor on unmount
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [isAuthenticated, navigate]);
  const value = {
    currency,
    navigate,
    user,
    setUser,
    isAuthenticated,
    setIsAuthenticated,
    loading,
    isOwner,
    setIsOwner,
    axios,
    showHotelReg,
    setShowHotelReg,
    searchedCities,
    setSearchedCities,
    rooms,
    setRooms,
    fetchUser,
    fetchRooms,
    logout,
    isLogin,
    setIsLogin,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
export const useAppContext = () => useContext(AppContext);
