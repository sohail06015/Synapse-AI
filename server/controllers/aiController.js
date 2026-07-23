import { GoogleGenAI } from "@google/genai";

import dotenv from "dotenv";
import Generation from "../models/Generation.js";
import axios from 'axios';
import streamifier from 'streamifier';
import cloudinary from '../config/cloudinary.js';
import pdfParse from "pdf-parse/lib/pdf-parse.js";

import mongoose from 'mongoose';

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Helper function to validate MongoDB ID
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Article Generation
export const generateArticle = async (req, res) => {
  try {
    const { prompt, length } = req.body;
    const userId = req.user._id;

    // Validate input
    if (!prompt?.trim() || !length) {
      return res.status(400).json({
        success: false,
        message: "Prompt and word length are required",
      });
    }

    const result = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: `Write a ${length}-word article about: ${prompt}`,
    });

    const content = result?.text;
    if (!content) throw new Error("No content generated");

    const generation = await Generation.create({
      user: userId,
      type: "article",
      prompt,
      result: content,
      length: parseInt(length),
    });

    return res.status(200).json({
      success: true,
      article: content,
      generationId: generation._id
    });

  } catch (error) {
  console.error("========== ARTICLE ERROR ==========");
  console.error(error);
  console.error("Message:", error.message);
  console.error("Stack:", error.stack);

  return res.status(500).json({
    success: false,
    message: "Failed to generate article",
    error: error.message,
  });
  }
};

// Blog Title Generation
export const generateBlogTitle = async (req, res) => {
  try {
    const { prompt, category } = req.body;
    const userId = req.user._id;

    if (!prompt?.trim() || !category?.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: "Prompt and category are required" 
      });
    }

    const result = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: `Generate a catchy ${category} blog title about: ${prompt}`,
    });

    const title = result?.text;
    if (!title) throw new Error("No title generated");

    const generation = await Generation.create({
      user: userId,
      type: "blog-title",
      prompt,
      category,
      result: title
    });

    return res.status(200).json({
      success: true,
      title,
      generationId: generation._id
    });

  } catch (error) {
    console.error("Title Generation Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate title",
      error: error.message
    });
  }
};

// Image Generation
export const generateImage = async (req, res) => {
  try {
    const { prompt, imageStyle, isPublic } = req.body;
    const userId = req.user._id;

    if (!prompt?.trim() || !imageStyle?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Prompt and image style are required"
      });
    }

    const styledPrompt = `${imageStyle}, ${prompt}`;
    const response = await axios.post(
      'https://clipdrop-api.co/text-to-image/v1',
      { prompt: styledPrompt },
      {
        headers: {
          'x-api-key': process.env.CLIPDROP_API_KEY,
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer',
        timeout: 30000 // 30 seconds timeout
      }
    );

    const uploadToCloudinary = () => new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "synapse-ai/generated-images" },
        (error, result) => error ? reject(error) : resolve(result)
      );
      streamifier.createReadStream(Buffer.from(response.data, 'binary')).pipe(uploadStream);
    });

    const cloudinaryResult = await uploadToCloudinary();

    const generation = await Generation.create({
      user: userId,
      type: 'image',
      prompt,
      result: cloudinaryResult.secure_url,
      isPublic: Boolean(isPublic),
    });

    return res.status(200).json({
      success: true,
      imageUrl: cloudinaryResult.secure_url,
      generationId: generation._id
    });

  } catch (error) {
    console.error("Image Generation Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate image",
      error: error.response?.data || error.message
    });
  }
};

// Background Removal
export const removeImageBackground = async (req, res) => {
  try {
    const userId = req.user._id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ 
        success: false, 
        message: "No image file uploaded" 
      });
    }

    // Validate image type
    if (!file.mimetype.startsWith('image/')) {
      return res.status(400).json({ 
        success: false, 
        message: "Only image files are allowed" 
      });
    }

    const uploadToCloudinary = () => new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "synapse-ai/bg-removed",
          transformation: [{ effect: 'background_removal' }],
        },
        (error, result) => error ? reject(error) : resolve(result)
      );
      uploadStream.end(file.buffer);
    });

    const result = await uploadToCloudinary();

    const generation = await Generation.create({
      user: userId,
      type: 'image',
      prompt: 'Background removed',
      result: result.secure_url,
    });

    return res.status(200).json({
      success: true,
      imageUrl: result.secure_url,
      generationId: generation._id
    });

  } catch (error) {
    console.error("Background Removal Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to remove background",
      error: error.message
    });
  }
};

// Resume Review
export const resumeReview = async (req, res) => {
  try {
    const user = req.user;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No file uploaded' 
      });
    }

    if (file.mimetype !== 'application/pdf') {
      return res.status(400).json({ 
        success: false, 
        message: 'Only PDF files are accepted' 
      });
    }

    if (file.size > 10 * 1024 * 1024) {
      return res.status(400).json({ 
        success: false, 
        message: 'File size must be under 10MB' 
      });
    }

    const pdfData = await pdfParse(file.buffer);
    const prompt = `Provide detailed resume feedback on:\n\n${pdfData.text}\n\nFocus on:\n- Strengths\n- Weaknesses\n- Improvement suggestions\n- Formatting\n- ATS compatibility`;

    const result = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: prompt,
    });

    const feedback = result?.text;
    if (!feedback) throw new Error("No feedback generated");

    const generation = await Generation.create({
      user: user._id,
      type: 'resume-review',
      prompt: 'Resume Review',
      result: feedback,
    });

    return res.status(200).json({ 
      success: true, 
      feedback,
      generationId: generation._id
    });

  } catch (error) {
    console.error('Resume Review Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to analyze resume',
      error: error.message
    });
  }
};

// Get Public Images
export const getPublicImages = async (req, res) => {
  try {
    const images = await Generation.find({ 
      type: 'image', 
      isPublic: true 
    })
    .populate("user", "name email")
    .sort({ createdAt: -1 })
    .lean();

    // Convert all IDs to strings for consistency
    const normalizedImages = images.map(img => ({
      ...img,
      _id: img._id.toString(),
      user: img.user ? {
        ...img.user,
        _id: img.user._id.toString()
      } : null,
      likes: img.likes.map(id => id.toString())
    }));

    return res.status(200).json({ 
      success: true, 
      images: normalizedImages 
    });

  } catch (error) {
    console.error("Fetch Images Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch images",
      error: error.message
    });
  }
};

// Toggle Like on Image
export const toggleLikeImage = async (req, res) => {
  try {
    const imageId = req.params.id;
    const userId = req.user._id;

    if (!isValidObjectId(imageId)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid image ID" 
      });
    }

    const image = await Generation.findById(imageId);
    if (!image) {
      return res.status(404).json({ 
        success: false, 
        message: "Image not found" 
      });
    }

    const userIdStr = userId.toString();
    const likeIndex = image.likes.map(id => id.toString()).indexOf(userIdStr);

    if (likeIndex > -1) {
      image.likes.splice(likeIndex, 1);
    } else {
      image.likes.push(userId);
    }

    await image.save();

    return res.status(200).json({
      success: true,
      likes: image.likes.map(id => id.toString())
    });

  } catch (error) {
    console.error("Like Toggle Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update like",
      error: error.message
    });
  }
};



export const getUserCreations = async (req, res) => {
  try {
    const userId = req.user._id;
    const creations = await Generation.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, creations });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch creations" });
  }
};