import React from "react";
import PriceInput from "./PriceInput";
import WinConditionSelect from "./WinConditionSelect";
import DurationSelect from "./DurationSelect";
import InfoBox from "./InfoBox";
import CreateDuelButton from "./CreateDuelButton";
import TokenSelect from "./TokenInput";

interface FormData {
  tokenInput: string;
  triggerPrice: string;
  minWager: string;
  winCondition: string;
  durationSelect: string;
}

const CreateDuel: React.FC = () => {
  const [formData, setFormData] = React.useState<FormData>({
    tokenInput: "",
    triggerPrice: "",
    minWager: "",
    winCondition: "",
    durationSelect: "3H", // Set a default value if necessary
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | string
  ) => {
    // Check if the input is a string (for custom components like DurationSelect)
    if (typeof e === "string") {
      setFormData((prev) => ({
        ...prev,
        durationSelect: e, // Update the specific form field for durationSelect
      }));
    } else {
      // Handle typical input change
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value, // Dynamically set the form data
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form Data new: ", formData);
    //markPrice, duelId, type, createdAt
    // Call the contract or backend with the form data
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col justify-center py-2.5 rounded-lg bg-zinc-900 max-w-[432px]">
      <main className="flex flex-col items-center self-center px-4 mt-4 w-full">
        <div className="flex gap-2 items-start px-28 py-3 max-w-full w-[400px]">
          <div className="flex flex-1 shrink bg-pink-300 rounded-md basis-0 h-[5px] w-[83px]" />
          <div className="flex flex-1 shrink bg-pink-300 rounded-md basis-0 h-[5px] w-[83px]" />
        </div>
        <div className="flex flex-col mt-2 w-full max-w-[400px]">
          <TokenSelect name="tokenInput" value={formData.tokenInput} onChange={handleInputChange} />
          <div className="flex flex-col mt-4 w-full text-base tracking-normal leading-none">
            <div className="flex flex-1 gap-1 items-center self-stretch my-auto text-base tracking-normal leading-none basis-0 justify-between">
              <div className="flex-1 shrink gap-1 self-stretch tracking-tighter my-auto text-gray-400">
                Mark Price
              </div>
              <div className="flex-1 shrink gap-1 self-stretch my-auto text-white whitespace-nowrap text-right">
                --
              </div>
            </div>
          </div>
          <PriceInput
            name="triggerPrice"
            value={formData.triggerPrice}
            onChange={handleInputChange}
            label="Trigger Price*"
            placeholder="Enter Trigger Price"
          />
          <PriceInput
            name="minWager"
            value={formData.minWager}
            onChange={handleInputChange}
            label="Minimum Wager Amount*"
            placeholder="Enter Minimum Bet Price"
          />
          <WinConditionSelect name="winCondition" value={formData.winCondition} onChange={handleInputChange} />
          <DurationSelect name="durationSelect" value={formData.durationSelect} onChange={handleInputChange} />
          <p className="self-start mt-4 text-xs font-medium tracking-normal leading-none text-center text-white">
            YES wins if mark price is <span className="underline">above</span>{" "}
            <span className="underline">[trigger price]</span> after{" "}
            <span className="underline">3 Hours</span>
          </p>
        </div>
        <InfoBox />
        <CreateDuelButton />
      </main>
    </form>
  );
};

export default CreateDuel;
