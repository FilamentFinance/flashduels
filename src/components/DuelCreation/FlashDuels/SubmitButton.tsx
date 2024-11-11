import React from "react";

const SubmitButton = ({loading, uploading}: {loading:boolean, uploading:boolean}) => {
  return (
    <button
      type="submit"
      disabled={loading || uploading}
      // onClick={onClick}
      className="gap-2.5 self-stretch px-3 py-2.5 mt-6 w-full text-base font-semibold leading-none text-gray-900 whitespace-nowrap rounded shadow-sm bg-[linear-gradient(180deg,#F19ED2_0%,#C87ECA_100%)]"
    >
      {loading || uploading ? (
        <div className="spinner"></div> 
      ) : (
        <span>Create Duel</span>
      )}
    </button>
  );
};

export default SubmitButton;
