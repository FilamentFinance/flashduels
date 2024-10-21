import React from "react";
import CategorySelect from "./CategorySelect";
import BetInput from "./BetInput";
import BetIconUpload from "./BetIconUpload";
import DurationSelect from "./DurationSelect";
import InfoBox from "./InfoBox";
import SubmitButton from "./SubmitButton";

// interface FormData {
//   category: string;
//   betAmount: string;
//   betIcon: string;
//   duration: string;
// }

// interface CreateDuelFormProps {
//   onSubmit: (formData:FormData) => void;
// }

const CreateDuelForm= () => {

  const [formData, setFormData] = React.useState({
    category: "",
    betAmount: "",
    betIcon: "",
    duration: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | string
  ) => {
    // Check if the input is a string (custom component like DurationSelect)
    if (typeof e === "string") {
      setFormData({
        ...formData,
        duration: e, // Update the specific form field manually
      });
    } else {
      // Handle typical input change
      setFormData({
        ...formData,
        [e.target.name]: e.target.value, // Dynamically set the form data
      });
    }
  };
  

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form Data: ", formData);
    //call contract
    // console.log("Call BE", duelId, createdAt, description, formData.category, formData.betAmount, formData.betIcon, formData.duration);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col justify-center py-2.5 rounded-lg  bg-zinc-900 max-w-[432px]"
    >
      {/* <header className="flex relative gap-2.5 justify-center items-start py-2 w-full text-xl font-semibold text-center text-white border-b border-white border-opacity-10">
        <h1 className="z-0 flex-1 shrink my-auto w-full basis-0">
          Create a Duel
        </h1>
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/c8454ace92408c5f78a561826e30af0ccb24a17e06e7bdcde242966a7eca23a8?placeholderIfAbsent=true&apiKey=9a4d3cdfd283475dbc30e1b60dc2077d"
          alt=""
          className="object-contain absolute top-0.5 right-3 z-0 shrink-0 self-start w-7 h-7 aspect-square fill-white fill-opacity-10 stroke-[1px] stroke-white stroke-opacity-0"
        />
      </header> */}
      <div className="flex flex-col self-center px-4 mt-4 w-full">
        <div className="flex gap-2 items-start px-28 py-3 w-full">
          <div className="flex flex-1 shrink bg-pink-300 rounded-md basis-0 h-[5px] w-[83px]" />
          <div className="flex flex-1 shrink bg-pink-300 rounded-md basis-0 h-[5px] w-[83px]" />
        </div>
        <CategorySelect name="category" value={formData.category} onChange={handleInputChange} />
        <BetInput name="betAmount" value={formData.betAmount} onChange={handleInputChange} />
        <BetIconUpload name="betIcon" value={formData.betIcon} onChange={handleInputChange} />
        <DurationSelect name="duration" value={formData.duration} onChange={handleInputChange} />

        <InfoBox />
        <SubmitButton />
      </div>
    </form>
  );
};

export default CreateDuelForm;
