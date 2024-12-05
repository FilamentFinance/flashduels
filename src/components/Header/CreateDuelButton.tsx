import React, { useState } from 'react';
import DuelCreationModal from '../DuelCreation/DuelCreationModal';
import { GeneralNotification } from '../GeneralNotification';

const CreateDuelButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="App">
      <button
        onClick={handleOpenModal}
        className="gap-2.5 self-stretch px-3 py-2.5 my-auto text-base font-semibold leading-none text-gray-900 rounded shadow-sm bg-[linear-gradient(180deg,#F19ED2_0%,#C87ECA_100%)]"
      >
        Create Duel
      </button>

      {isModalOpen && (
        <DuelCreationModal onClose={handleCloseModal} />
      )}
      <GeneralNotification></GeneralNotification>
    </div>
  );
};

export default CreateDuelButton;
