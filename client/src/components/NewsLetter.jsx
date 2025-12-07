import axios from "axios";
import { assets } from "../assets/assets";
import { Tittle } from "./Tittle";
import { useState } from "react";
import { toast } from "react-hot-toast";

export const NewsLetter = () => {
  const [email, setEmail] = useState("");
  const handleSubscribe = async () => {
  if (!email.includes("@")) {
    toast.error("Invalid email");
    return;
  }

  try {
    const { data } = await axios.post("/api/user/newsletter/subscribe", { email });
    if (data.success) {
      toast.success("Subscribed!");
      setEmail("");
    } else {
      toast.error(data.message||"Subscription failed");
    }
  } catch (err) {
    toast.error("Something went wrong");
  }
};

  return (
    <div className="flex flex-col items-center max-w-5xl lg:w-full rounded-2xl px-4 py-12 md:py-16 mx-2 lg:mx-auto my-30 bg-gray-900 text-white">
        <Tittle tittle="Stay Inspired" subTittle='Join our newsletter and be the first to discover new destinations, exclusive offers , and travel inspiration.' />
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-6">
        <input
          type="text"
          className="bg-white/10 px-4 py-2.5 border border-white/20 rounded outline-none max-w-66 w-full"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="flex items-center justify-center gap-2 group bg-black px-4 md:px-7 py-2.5 rounded active:scale-95 transition-all" onClick={handleSubscribe}>
          Subscribe
          <img
            src={assets.arrowIcon}
            alt="arrow-icon"
            className="w-3.5 invert group-hover:translate-x-1 transition-all"
          />
        </button>
      </div>
      <p className="text-gray-500 mt-6 text-xs text-center">
        By subscribing, you agree to our Privacy Policy and consent to receive
        updates.
      </p>
    </div>
  );
};
