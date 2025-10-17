import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface Card {
  id: string;
  image: string;
  title: string;
  description?: string;
}

interface CardSelectionProps {
  cards: Card[];
  onSelect?: (cardId: string) => void;
  className?: string;
  multiple?: boolean;
}

export const CardSelection: React.FC<CardSelectionProps> = ({
  cards,
  onSelect,
  className,
  multiple = false,
}) => {
  const [selectedCards, setSelectedCards] = useState<string[]>([]);

  const handleCardClick = (cardId: string) => {
    if (multiple) {
      setSelectedCards((prev) =>
        prev.includes(cardId)
          ? prev.filter((id) => id !== cardId)
          : [...prev, cardId]
      );
    } else {
      setSelectedCards([cardId]);
    }
    onSelect?.(cardId);
  };

  return (
    <div
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4',
        className
      )}
    >
      {cards.map((card) => (
        <div
          key={card.id}
          onClick={() => handleCardClick(card.id)}
          className={cn(
            'relative cursor-pointer rounded-lg overflow-hidden transition-all duration-200 hover:shadow-lg',
            'border-2',
            selectedCards.includes(card.id)
              ? 'border-primary shadow-md scale-[1.02]'
              : 'border-transparent hover:border-gray-200'
          )}
        >
          <div className="aspect-square relative">
            <img
              src={card.image}
              alt={card.title}
              className="object-cover w-full h-full"
            />
            {selectedCards.includes(card.id) && (
              <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                <div className="bg-primary text-white p-2 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg">{card.title}</h3>
            {card.description && (
              <p className="text-gray-600 mt-1 text-sm">{card.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}; 