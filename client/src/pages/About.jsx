import {
  FiAward,
  FiHeart,
  FiShield,
  FiUsers,
  FiStar,
  FiMapPin,
  FiPhone,
  FiMail,
} from "react-icons/fi";
import { FaLinkedin, FaTwitter, FaInstagram } from "react-icons/fa";

const About = () => {
  const stats = [
    { number: "50+", label: "Premium Hotels", icon: FiMapPin },
    { number: "10k+", label: "Happy Guests", icon: FiUsers },
    { number: "4.9", label: "Average Rating", icon: FiStar },
    { number: "24/7", label: "Customer Support", icon: FiShield },
  ];

  const values = [
    {
      icon: FiHeart,
      title: "Guest-Centric Approach",
      description:
        "Every decision we make is guided by what's best for our guests. Your comfort and satisfaction are our top priorities.",
    },
    {
      icon: FiAward,
      title: "Excellence in Service",
      description:
        "We maintain the highest standards in hospitality, ensuring every interaction exceeds expectations.",
    },
    {
      icon: FiShield,
      title: "Trust & Transparency",
      description:
        "We believe in honest communication, fair pricing, and transparent booking processes with no hidden fees.",
    },
    {
      icon: FiUsers,
      title: "Community Impact",
      description:
        "We support local communities by partnering with local businesses and promoting sustainable tourism practices.",
    },
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      image: "/api/placeholder/300/300",
      bio: "Former hospitality executive with 15+ years of experience in luxury hotel management.",
      social: { linkedin: "#", twitter: "#" },
    },
    {
      name: "Michael Chen",
      role: "Head of Operations",
      image: "/api/placeholder/300/300",
      bio: "Operations specialist focused on streamlining booking processes and enhancing user experience.",
      social: { linkedin: "#", instagram: "#" },
    },
    {
      name: "Emily Rodriguez",
      role: "Customer Experience Director",
      image: "/api/placeholder/300/300",
      bio: "Dedicated to ensuring every guest has memorable and seamless experiences from booking to checkout.",
      social: { linkedin: "#", twitter: "#" },
    },
  ];

  const milestones = [
    {
      year: "2020",
      title: "Company Founded",
      description:
        "Started with a vision to revolutionize hotel booking experience.",
    },
    {
      year: "2021",
      title: "10 Hotel Partners",
      description: "Reached our first milestone with 10 premium hotels onboard.",
    },
    {
      year: "2022",
      title: "10,000+ Guests",
      description:
        "Celebrated serving over 10,000 happy guests across multiple destinations.",
    },
    {
      year: "2023",
      title: "Global Expansion",
      description:
        "Launched services internationally, partnering with hotels worldwide.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="relative h-80 bg-gradient-to-r from-blue-600 to-purple-700 flex items-center justify-center text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative text-center px-4 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
          <p className="text-lg text-white/90">
            Redefining hotel booking by blending technology, comfort, and
            personalized experiences.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((stat, i) => (
          <div key={i} className="flex flex-col items-center">
            <stat.icon className="w-8 h-8 text-blue-600 mb-2" />
            <h3 className="text-2xl font-bold text-gray-800">{stat.number}</h3>
            <p className="text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Values */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, i) => (
              <div
                key={i}
                className="p-6 border rounded-2xl shadow-sm hover:shadow-md transition"
              >
                <value.icon className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="text-sm text-blue-600 mb-2">{member.role}</p>
                <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
                <div className="flex justify-center gap-3">
                  {member.social.linkedin && (
                    <a href={member.social.linkedin} className="text-blue-600">
                      <FaLinkedin />
                    </a>
                  )}
                  {member.social.twitter && (
                    <a href={member.social.twitter} className="text-blue-400">
                      <FaTwitter />
                    </a>
                  )}
                  {member.social.instagram && (
                    <a
                      href={member.social.instagram}
                      className="text-pink-500"
                    >
                      <FaInstagram />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Our Journey So Far
          </h2>
          <div className="space-y-8">
            {milestones.map((milestone, i) => (
              <div
                key={i}
                className="flex flex-col md:flex-row items-start gap-4 border-l-4 border-blue-600 pl-6"
              >
                <div className="text-blue-600 font-bold text-lg w-20">
                  {milestone.year}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">
                    {milestone.title}
                  </h3>
                  <p className="text-gray-600">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 py-16 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get in Touch</h2>
          <p className="text-white/80 mb-8">
            Have questions or partnership ideas? Reach out to us anytime.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="flex items-center gap-2">
              <FiPhone className="w-5 h-5" />
              <span>+1 (234) 567-890</span>
            </div>
            <div className="flex items-center gap-2">
              <FiMail className="w-5 h-5" />
              <span>support@hotelbookings.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
