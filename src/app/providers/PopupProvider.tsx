"use client"
import React, { createContext, useContext, useState, ReactNode } from "react";
import DisclaimerPopup from "@/components/Header/Disclaimer";
type PopupContextType = {
  showPopup: () => void;
  hidePopup: () => void;
};

const PopupContext = createContext<PopupContextType | undefined>(undefined);

export const PopupProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);

  const showPopup = () => setIsPopupVisible(true);
  const hidePopup = () => setIsPopupVisible(false);

  return (
    <PopupContext.Provider value={{ showPopup, hidePopup }}>
      {children}
      {isPopupVisible && <DisclaimerPopup onClose={hidePopup} />}{" "}
      {/* Render the popup */}
    </PopupContext.Provider>
  );
};

const usePopup = () => {
  const context = useContext(PopupContext);
  if (context === undefined) {
    throw new Error("usePopup must be used within a PopupProvider");
  }
  return context;
};

export default usePopup;
