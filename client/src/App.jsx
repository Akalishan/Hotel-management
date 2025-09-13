import Navbar from "./components/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import { Home } from "./pages/Home";
import { Footer } from "./components/Footer";
import { AllRooms } from "./pages/AllRooms";
import { RoomDetails } from "./pages/RoomDetails";
import { MyBooking } from "./pages/MyBooking";
import { HotelReg } from "./components/HotelReg";
import { Layout } from "./pages/HotelOwner/Layout";
import { Dashboard } from "./pages/HotelOwner/Dashboard";
import { AddRoom } from "./pages/HotelOwner/AddRoom";
import { ListRoom } from "./pages/HotelOwner/ListRoom";
import { Toaster } from "react-hot-toast";
import { useAppContext } from "./context/AppContext";
import { Login } from "./components/Login";
import Profile from "./pages/Profile";
import Experience from "./pages/Experience";
import About from "./pages/About";
import AdminExperiences from "./pages/HotelOwner/AdminExperiences";
import {Loader} from "./components/Loader";
const App = () => {
  const isOwnerPath = useLocation().pathname.includes("owner");
  const { showHotelReg, isLogin } = useAppContext();
  return (
    <div>
      <Toaster />
      {!isOwnerPath && <Navbar />}
      {showHotelReg && <HotelReg />}
      {isLogin && <Login />}
      <div className="min-h-[70vh]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<AllRooms />} />
          <Route path="/rooms/:id" element={<RoomDetails />} />
          <Route path="/my-bookings" element={<MyBooking />} />
          <Route path="/loader/:nextUrl" element={<Loader />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/Experience" element={<Experience />} />
          <Route path="/About" element={<About />} />
          <Route path="/owner" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="add-room" element={<AddRoom />} />
            <Route path="list-room" element={<ListRoom />} />
            <Route path="adminExperiences" element={<AdminExperiences />} />
          </Route>
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
