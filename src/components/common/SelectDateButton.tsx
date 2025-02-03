import React from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface SelectDateButtonProps {
  selectedDate: Date | null;
  onChange: (date: Date | null) => void;
}

export const SelectDateButton: React.FC<SelectDateButtonProps> = ({
  selectedDate,
  onChange,
}) => {
  return (
    <div className="relative">
      <ReactDatePicker
        selected={selectedDate}
        onChange={(date: Date | null) => onChange(date)}
        dateFormat="yyyy-MM-dd"
        className="w-32 cursor-pointer rounded-md border border-gray-300 px-4 py-2"
        showPopperArrow={false}
        popperPlacement="bottom-start"
        portalId="root-portal"
      />
    </div>
  );
};
