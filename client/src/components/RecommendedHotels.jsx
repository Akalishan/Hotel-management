import React, { useEffect, useState } from "react";
import { HotelCard } from "./HotelCard";
import { Tittle } from "./Tittle";
import { useAppContext } from "../context/AppContext";

export const RecommendedHotels = () => {
  const { rooms, searchedCities } = useAppContext();
  const [recommended, setRecommended] = useState([]);

  const filterHotels = () => {
    if (searchedCities.length === 0) {
      // If no searched cities, show random/all hotels
      setRecommended(rooms.slice(0, 4));
    } else {
      const filteredHotels = rooms
        .slice()
        .filter((room) => searchedCities.includes(room.hotel.city));
      setRecommended(filteredHotels);
    }
  };

  useEffect(() => {
    filterHotels();
  }, [rooms, searchedCities]);

  if (recommended.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-20">
      <Tittle
        tittle="Recommended Hotels"
        subTittle="Discover our handpicked selection of exceptional properites around the world,offering unparalleled luxary and unforgettable experiences."
      />
      <div className="flex flex-wrap items-center justify-center gap-6 mt-20">
        {recommended.slice(0, 4).map((room, index) => (
          <HotelCard key={room._id} room={room} index={index} />
        ))}
      </div>
    </div>
  );
};
