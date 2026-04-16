const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

exports.getSuggestions = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No pantry items provided' });
    }

    const pantryDescription = items
      .map(i => `${i.name} (${i.category}, ${i.quantity} ${i.unit}, expires: ${i.expiryDate ?? 'no date'})`)
      .join('\n');

    const prompt = `You are a helpful kitchen assistant. Based on the following pantry inventory, suggest 5 items the user should add to their shopping list. Focus on common complementary ingredients that are missing, or items that are running low or expiring soon. Return ONLY a valid JSON array with no extra text, in this exact format:
[
  { "name": "item name", "category": "category", "quantity": 1, "unit": "unit" },
  ...
]

Pantry inventory:
${pantryDescription}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    const raw = response.text.trim();
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const suggestions = JSON.parse(cleaned);

    res.json({ suggestions });
  } catch (err) {
    console.error('[suggestionsController] Error:', err.message);
    res.status(500).json({ message: 'Failed to get suggestions', error: err.message });
  }
};