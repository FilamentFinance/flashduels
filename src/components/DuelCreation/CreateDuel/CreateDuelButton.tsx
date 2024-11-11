import React from "react";

const CreateDuelButton = ({loading}: {loading:boolean}) => {

  //time in unix timestamp format
  //duel ID
  return (
    <button
      type="submit"
      disabled={loading}
      className="gap-2.5 self-stretch px-3 py-2.5 mt-4 w-full text-base font-semibold leading-none text-gray-900 rounded shadow-sm bg-[linear-gradient(180deg,#F19ED2_0%,#C87ECA_100%)] border-white border-opacity-70"
    >
      {loading ? (
        <div className="spinner"></div>  
      ) : (
        <span>Create Duel</span>
      )}
    </button>
  );
};

export default CreateDuelButton;
