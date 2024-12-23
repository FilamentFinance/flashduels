import * as React from "react";
import { DetailsAndRules } from "./DetailsAndRules";

export const DetailsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null; // Do not render the modal if it's closed

  return (
    <div
      className="fixed top-0 left-0 right-0 bottom-0 z-50 bg-black bg-opacity-50 flex justify-center items-center"
    //   onClick={onClose}
    >
      {/* <div
        className="bg-white p-8 rounded-lg"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      > */}
        <DetailsAndRules onClose={onClose} />
        {/* <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg"
        >
          Close
        </button> */}
      {/* </div> */}
    </div>
  );
};
