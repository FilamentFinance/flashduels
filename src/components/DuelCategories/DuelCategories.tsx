"use client"
import React, { useState } from "react";
import DuelCategoryCard from "./DuelCategoryCard";

interface DuelCategory {
  title: string;
  imageSrc?: string;
  isSpecial?: boolean;
}

const duelCategories: DuelCategory[] = [
  {
    title: "All Duels",
    imageSrc:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/b485f558eb6284bde6c0b2cc721774d631e9d8d87990d1e63e360a0655304a83?placeholderIfAbsent=true&apiKey=5395477fd4e141368e15c98db5e38353",
  },
  { title: "US Election", imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/ae1d90d8598f5499d16d159b9c8b54473e77387140768094e6307e0c1b6820f7?placeholderIfAbsent=true&apiKey=5395477fd4e141368e15c98db5e38353" },
  {
    title: "Crypto",
    imageSrc:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/ae1d90d8598f5499d16d159b9c8b54473e77387140768094e6307e0c1b6820f7?placeholderIfAbsent=true&apiKey=5395477fd4e141368e15c98db5e38353",
  },
  {
    title: "Sports",
    imageSrc:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/4c04e7757372a179f81313b63b0059135a85f6f3156fac915e4bccc2b70f5d77?placeholderIfAbsent=true&apiKey=5395477fd4e141368e15c98db5e38353",
  },
];

const DuelCategories: React.FC = () => {
  const [specialCategoryIndex, setSpecialCategoryIndex] = useState<number | null>(0);

  const handleCategoryClick = (index: number) => {
    setSpecialCategoryIndex(specialCategoryIndex === index ? null : index);
  };
  return (
    <main className="flex flex-wrap gap-4 mt-6 items-center px-[50px] text-4xl font-semibold text-zinc-700 max-md:px-5">
      {duelCategories.map((category, index) => (
      <DuelCategoryCard
      key={index}
      title={category.title}
      imageSrc={category.imageSrc}
      isSpecial={specialCategoryIndex === index}
      onClick={() => handleCategoryClick(index)}
    />
      ))}
    </main>
  );
};

export default DuelCategories;
