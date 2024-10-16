import React, { useState } from "react";

const BetIconUpload: React.FC = () => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string); // Set the preview image URL
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };

  return (
    <div className="flex flex-col mt-2 w-full">
      <label
        htmlFor="betIcon"
        className="flex gap-1 items-center w-full text-base tracking-normal leading-none text-gray-400"
      >
        Bet Icon*
      </label>
      <div className="flex overflow-hidden flex-col justify-center items-center py-6 mt-1 w-full text-xs tracking-normal leading-4 text-center text-gray-500 rounded-lg border border-dashed shadow-sm bg-white bg-opacity-0 border-white border-opacity-10">
        <img
          loading="lazy"
          src={
            previewImage ||
            "https://cdn.builder.io/api/v1/image/assets/TEMP/b2b5bf7698dde32467828a90702eea7fbeb2792b82c073178d2d09ca0b85c69d?placeholderIfAbsent=true&apiKey=9a4d3cdfd283475dbc30e1b60dc2077d"
          }
          alt="Bet Icon Preview"
          className="object-contain w-8 aspect-square"
        />
        <div className="flex items-center max-w-full w-[195px]">
          <div className="flex gap-2.5 items-start self-stretch px-4 py-2 my-auto w-[195px]">
            <p className="w-full">
              Drag and drop an image here
            
            </p>
          </div>
        </div>
        <input
          type="file"
          id="betIcon"
          className="sr-only"
          accept="image/*"
          onChange={handleFileChange}
        />
        <label
          htmlFor="betIcon"
          className="gap-2.5 self-stretch px-3 py-2.5 mt-6 w-full text-base font-semibold leading-none text-gray-900 whitespace-nowrap rounded shadow-sm bg-[linear-gradient(180deg,#F19ED2_0%,#C87ECA_100%)]"
        >
          Upload Image
        </label>
      </div>
    </div>
  );
};

export default BetIconUpload;
