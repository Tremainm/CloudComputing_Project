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

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();
    console.log('[suggestions] Gemini response:', JSON.stringify(data, null, 2));
    const raw = data.candidates[0].content.parts[0].text.trim();

    // Strip markdown code fences if Gemini wraps the JSON in them
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const suggestions = JSON.parse(cleaned);

    res.json({ suggestions });
  } catch (err) {
    console.error('[suggestionsController] Error:', err.message);
    res.status(500).json({ message: 'Failed to get suggestions', error: err.message });
  }
};