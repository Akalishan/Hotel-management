import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext"; // your axios wrapper

const Experience = () => {
  const { axios } = useAppContext();
  const [experiences, setExperiences] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/experiences");
        if (res.data.success) {
          setExperiences(res.data.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [axios]);

  return (
    <div className="pt-20 px-6 md:px-16 lg:px-24 xl:px-32">
      <h1 className="text-3xl font-bold text-center mb-10">Experiences</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {experiences.map((exp) => (
          <div
            key={exp._id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition"
          >
            <img src={exp.image} alt={exp.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{exp.title}</h2>
              <p className="text-gray-600">{exp.description}</p>
              {exp.price && <p className="mt-2 font-bold">${exp.price}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Experience;
