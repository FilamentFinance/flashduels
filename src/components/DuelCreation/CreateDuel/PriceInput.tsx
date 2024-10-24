import React from "react";

interface PriceInputProps {
  label: string;
  placeholder: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>)=> void
}

const PriceInput: React.FC<PriceInputProps> = ({ label, placeholder, onChange, name, value }) => {
  return (
    <div className="flex gap-1 items-center mt-4 w-full">
      <label
        htmlFor={`${label.toLowerCase().replace(/\s/g, "-")}-input`}
        className="flex flex-1 shrink gap-1 items-center self-stretch my-auto text-base tracking-normal leading-none text-gray-400 basis-0"
      >
        <span className="gap-1 self-stretch my-auto tracking-tighter min-w-full w-full">
          {label}
        </span>
      </label>
      <div className="flex overflow-hidden flex-1 shrink self-stretch my-auto text-xs tracking-normal leading-loose text-gray-500 rounded-lg border border-solid shadow-sm basis-0 bg-neutral-800 border-zinc-800">
        <input
        required
          id={`${label.toLowerCase().replace(/\s/g, "-")}-input`}
          name={name} value={value} onChange={onChange} 
          type="text"
          className="flex flex-1 shrink gap-2.5 items-start self-stretch px-4 py-2 bg-neutral-800 my-auto w-full basis-0"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

export default PriceInput;
