import gradientBackground from "./gradientBackground.png";
import user_group from "./user_group.png";
import star_icon from "./star_icon.svg";
import star_dull_icon from "./star_dull_icon.svg";
import arrow_icon from "./arrow_icon.svg";
import syn from "./syn.png";
import { SquarePen, Hash, Image, Eraser, Scissors, FileText } from 'lucide-react'

export const assets = {
    syn,
    gradientBackground,
    user_group,
    star_icon,
    star_dull_icon,
    arrow_icon,
};

export const AiToolsData = [
    {
        title: 'AI Article Writer',
        description: 'Generate high-quality, engaging articles on any topic with our AI writing technology.',
        Icon: SquarePen,
        bg: { from: '#3588F2', to: '#0BB0D7' },
        path: '/ai/write-article'
    },
    {
        title: 'Blog Title Generator',
        description: 'Find the perfect, catchy title for your blog posts with our AI-powered generator.',
        Icon: Hash,
        bg: { from: '#B153EA', to: '#E549A3' },
        path: '/ai/blog-titles'
    },
    {
        title: 'AI Image Generation',
        description: 'Create stunning visuals with our AI image generation tool, Experience the power of AI ',
        Icon: Image,
        bg: { from: '#20C363', to: '#11B97E' },
        path: '/ai/generate-images'
    },
    {
        title: 'Background Removal',
        description: 'Effortlessly remove backgrounds from your images with our AI-driven tool.',
        Icon: Eraser,
        bg: { from: '#F76C1C', to: '#F04A3C' },
        path: '/ai/remove-background'
    },

    {
        title: 'Resume Reviewer',
        description: 'Get your resume reviewed by AI to improve your chances of landing your dream job.',
        Icon: FileText,
        bg: { from: '#12B7AC', to: '#08B6CE' },
        path: '/ai/review-resume'
    }
]


