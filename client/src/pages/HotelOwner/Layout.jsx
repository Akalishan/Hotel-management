import React from "react";
import { Navbar } from "../../components/HotelOwner/Navbar";
import { SideBar } from "../../components/HotelOwner/SideBar";
import { Outlet } from "react-router-dom";

export const Layout = () => {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex h-full">
        <SideBar/>
        <div className="flex-1 p-4 pt-10 md:px-10 h-full">
            <Outlet/>
        </div>
      </div>
    </div>
  );
};
