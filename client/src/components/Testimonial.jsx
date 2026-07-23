import React from "react";

const Testimonial = () => {
  const cardsData = [
    {
      image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
      name: "Briar Martin",
      handle: "@neilstellar",
      date: "April 20, 2025",
      content: "Synapse AI helped streamline our entire creative process. From idea generation to publishing, it’s been a game-changer for our team."
    },
    {
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
      name: "Avery Johnson",
      handle: "@averywrites",
      date: "May 10, 2025",
      content: "With Synapse AI, writing engaging content has never been easier. It's like having a personal assistant that gets it right every time."
    },
    {
      image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=60",
      name: "Jordan Lee",
      handle: "@jordantalks",
      date: "June 5, 2025",
      content: "Our content team saves hours weekly using Synapse AI. The efficiency and creativity it brings is unmatched."
    },
    {
      image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=60",
      name: "Avery Johnson",
      handle: "@averywrites",
      date: "May 10, 2025",
      content: "Synapse AI didn’t just improve our productivity — it completely redefined how we approach digital storytelling."
    }
  ];

  const CreateCard = ({ card }) => (
    <div className="p-6 rounded-xl mx-4 bg-white shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 w-72 shrink-0 border border-gray-200">
      <div className="flex gap-3 items-center">
        <img className="w-11 h-11 rounded-full object-cover" src={card.image} alt="User" />
        <div className="flex flex-col">
          <p className="font-semibold text-[#283389]">{card.name}</p>
          <span className="text-xs text-gray-500">{card.handle}</span>
        </div>
      </div>
      <p className="text-sm text-[#3a3f78] mt-4 leading-relaxed">{card.content}</p>
      <div className="text-xs text-[#7a80b5] mt-4">{card.date}</div>
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes simpleMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .simple-marquee {
          animation: simpleMarquee 35s linear infinite;
        }
      `}</style>

      <div className="w-full overflow-hidden py-12 bg-white">
        <div className="simple-marquee flex w-[200%] gap-8 px-4">
          {[...cardsData, ...cardsData].map((card, index) => (
            <CreateCard key={index} card={card} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Testimonial;
