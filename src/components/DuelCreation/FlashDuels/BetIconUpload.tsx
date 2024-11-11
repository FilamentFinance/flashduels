import React from "react";

interface BetIconUploadProps {
  name: string;
  value?: string;
  // onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  previewImage: string | null;
  uploading: boolean;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const BetIconUpload: React.FC<BetIconUploadProps> = ({ name, handleFileChange, previewImage, uploading }) => {


  return (
    <div className="flex flex-col mt-2 w-full">
      <label
        htmlFor="betIcon"
        className="flex gap-1 items-center w-full text-base tracking-normal leading-none text-gray-400"
      >
        Duel Icon*
      </label>
      <div className="flex overflow-hidden flex-col justify-center items-center pt-6 mt-1 w-full text-xs tracking-normal leading-4 text-center text-gray-500 rounded-lg border border-dashed shadow-sm bg-neutral-800 border-white border-opacity-10">
        <img
          loading="lazy"
          src={
            previewImage ||
            "https://cdn.builder.io/api/v1/image/assets/TEMP/b2b5bf7698dde32467828a90702eea7fbeb2792b82c073178d2d09ca0b85c69d?placeholderIfAbsent=true&apiKey=9a4d3cdfd283475dbc30e1b60dc2077d"
          }
          alt="Duel Icon Preview"
          className="object-contain w-8 aspect-square"
        />
        <div className="flex items-center max-w-full w-[195px]">
          <div className="flex gap-2.5 items-start self-stretch px-4 py-2 my-auto w-[195px]">
            <p className="w-full">Drag and drop an image here</p>
          </div>
        </div>
        <input
          type="file"
          id="betIcon"
          name={name}
          // value={value}
          className="sr-only"
          accept="image/*"
          onChange={handleFileChange} // Handle file change
        />
        <label
          htmlFor="betIcon"
          className="gap-2.5 self-stretch px-3 py-2.5 mt-6 w-full text-base font-semibold leading-none text-gray-900 whitespace-nowrap rounded shadow-sm bg-[linear-gradient(180deg,#F19ED2_0%,#C87ECA_100%)]"
        >
          {uploading ? "Uploading..." : "Upload Image"}
        </label>
      </div>
    </div>
  );
};

export default BetIconUpload;
