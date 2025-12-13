import express from "express";
import OpenAI from "openai";

const router = express.Router();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    // Send request to OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an AI assistant for a hotel booking website. Answer clearly and politely about bookings, rooms, amenities, cancellations, and policies.",
        },
        { role: "user", content: message },
      ],
    });

    const reply = completion.choices[0].message.content;

    res.json({ reply });
  } catch (err) {
    console.error("OpenAI API Error:", err.response?.data || err.message);
    res.json({
      reply: `You said: "${message}". AI service is not available right now.`,
    });
  }
});

export default router;
