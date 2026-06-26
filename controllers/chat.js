const Groq = require("groq-sdk");
const Restaurant = require("../models/restaurant.js");

module.exports.handleChat = async (req, res) => {
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const { messages } = req.body;

    // Fetch context from the database to inject into the AI's prompt
    const allRestaurants = await Restaurant.find({}).select('name hygieneGrade hygieneScore category location violations');
    
    const contextStr = allRestaurants.map(r => 
      `- ${r.name} (${r.category} at ${r.location}): Grade ${r.hygieneGrade}, Score ${r.hygieneScore}/100. Violations: ${r.violations.length ? r.violations.join(', ') : 'None'}`
    ).join('\n');

    const systemPrompt = {
      role: "system",
      content: `You are the SafeEats Food Safety Assistant for Bengaluru. 
You are a helpful, professional, and concise AI designed to help citizens and health inspectors track food hygiene.
Always be polite and keep answers relatively brief unless asked for details.

Here is the LIVE data of restaurants currently tracked in the database:
${contextStr}

Use this data to answer questions about specific restaurants, grades, or general food safety inquiries.`
    };

    const chatCompletion = await groq.chat.completions.create({
      messages: [systemPrompt, ...messages],
      model: "llama-3.1-8b-instant",
      temperature: 0.5,
      max_tokens: 512,
    });

    res.json({ success: true, reply: chatCompletion.choices[0]?.message?.content || "I'm sorry, I couldn't process that." });
  } catch (error) {
    console.error("Chat Error:", error);
    res.status(500).json({ success: false, message: "Failed to communicate with AI." });
  }
};
