import Booking from "../models/booking.js";
import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import transporter from "../config/nodemailer.js";

//Fuction to check availabilty of Room
const checkAvailability = async ({ room, checkInDate, checkOutDate }) => {
  try {
    const bookings = await Booking.find({
      room,
      checkInDate: { $lte: checkOutDate },
      checkOutDate: { $gte: checkInDate },
    });
    const isAvailable = bookings.length === 0;
    return isAvailable;
  } catch (error) {
    console.error(error.message);
  }
};

//API to check availabilty of Room
//post/api/booking/check-availability

export const checkAvailabilityAPI = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate } = req.body;
    const isAvailable = await checkAvailability({
      room,
      checkInDate,
      checkOutDate,
    });
    res.json({ success: true, isAvailable });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//API to create a new booking
//post/api/booking/book

export const createBooking = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate, guests } = req.body;
    const user = req.user._id;

    //Before booking check avilability
    const isAvailable = await checkAvailability({
      room,
      checkInDate,
      checkOutDate,
    });

    if (!isAvailable) {
      return res.status(400).json({
        success: false,
        message: "Room is not available for the selected dates.",
      });
    }
    //GET total price for Room
    const roomData = await Room.findById(room).populate("hotel");
    let totalPrice = roomData.pricePerNight;

    //Calculate total price based on number of nights
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
    totalPrice *= nights;

    const booking = await Booking.create({
      user,
      room,
      hotel: roomData.hotel._id,
      checkInDate,
      checkOutDate,
      totalPrice,
      guests: +guests,
    });

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: req.user.email,
      subject: "Booking Confirmation",
      html:`
      <h2>Your Booking Details</h2>
      <p>Dear ${req.user.username},</p>
      <p>Thank you for your booking! Here are your booking details:</p>
      <ul>
        <li><strong>Booking ID:</strong> ${booking._id}</li>
        <li><strong>Hotel Name:</strong> ${roomData.hotel.name}</li>
        <li><strong>Location:</strong> ${roomData.hotel.location}</li>
        <li><strong>Check-in Date:</strong> ${checkInDate}</li>
        <li><strong>Check-out Date:</strong> ${checkOutDate}</li>
        <li><strong>Total Price:</strong> $${totalPrice}</li>
      </ul>
      <p>We hope you have a pleasant stay!</p>
      <p>If you have any questions or need assistance, feel free to contact us.</p>
      `
    };
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Booking created successfully" });
  } catch (error) {
    res.json({ success: false, message: "failed to create booking" });
  }
};

//API to get all bookings of a user
//get/api/booking/bookings/user

export const getUserBookings = async (req, res) => {
  try {
    const user = req.user._id;
    const bookings = await Booking.find({ user })
      .populate("room hotel")
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    res.json({ success: false, message: "failed to fetch bookings" });
  }
};

export const getHotelBookings = async (req, res) => {
  try {
    const hotel = await Hotel.findOne({ owner: req.user._id });
  if (!hotel) {
    return res.status(404).json({ success: false, message: "Hotel not found" });
  }
  const bookings = await Booking.find({ hotel: hotel._id })
    .populate("room hotel user")
    .sort({ createdAt: -1 });

  //Total Bookings
  const totalBookings = bookings.length;
  //Total revenue
  const totalRevenue = bookings.reduce(
    (acc, booking) => acc + booking.totalPrice,0);
  res.json({
    success: true,
    dashboardData: { totalBookings, totalRevenue, bookings }});
  } catch (error) {
    res.json({
    success: false,message:"Failed to fetch bookings"});
  }
};
