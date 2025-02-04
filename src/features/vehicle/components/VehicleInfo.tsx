import React from "react";
import { Vehicle } from "../../../types/vehicle";

interface VehicleInfoProps {
  vehicles: Vehicle[];
  onVehicleSelect: (vehicle: Vehicle) => void;
  onRegisterClick: () => void;
}

const VehicleInfo: React.FC<VehicleInfoProps> = ({
  vehicles,
  onVehicleSelect,
  onRegisterClick,
}) => {
  const getStatusText = (vehicle: Vehicle) => {
    return vehicle.us_idx ? (
      <span className="font-medium text-blue-600">배정 완료</span>
    ) : (
      <span className="font-medium text-gray-600">배정 안됨</span>
    );
  };

  return (
    <div className="mr-8 w-96">
      <div className="mb-4 flex justify-end">
        <button
          onClick={onRegisterClick}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          차량 등록
        </button>
      </div>
      <div className="h-[calc(100vh-12rem)] overflow-y-auto">
        <div className="space-y-4">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.sh_idx}
              className="cursor-pointer rounded border p-4 hover:bg-gray-50"
              onClick={() => onVehicleSelect(vehicle)}
            >
              <h3 className="text-lg font-medium">{vehicle.sh_name}</h3>
              <p className="text-sm text-gray-600">
                최대 인원: {vehicle.sh_max_cnt}명
              </p>
              <p className="text-sm text-gray-600">
                상태: {getStatusText(vehicle)}
              </p>
              {vehicle.us_idx && (
                <p className="text-sm text-gray-600">기사: {vehicle.us_name}</p>
              )}
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-600">담당 지역:</p>
                <div className="flex flex-wrap gap-1">
                  {vehicle.areas.map((area) => (
                    <span
                      key={area.sa_idx}
                      className="rounded-full bg-gray-200 px-2 py-1 text-xs"
                    >
                      {area.ar_name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VehicleInfo;
