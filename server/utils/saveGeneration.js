import Generation from '../models/Generation.js';

export const saveGeneration = async (userId, { type, prompt, category = '', result }) => {
  try {
    const generation = new Generation({
      user: userId,
      type,
      prompt,
      category,
      result
    });
    await generation.save();
  } catch (err) {
    console.error('Save Generation Error:', err.message);
  }
};
