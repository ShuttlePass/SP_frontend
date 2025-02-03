import React from 'react';
import { Vehicle } from '../../../types/vehicle';

interface VehicleInfoProps {
  vehicles: Vehicle[];
  onVehicleSelect: (vehicle: Vehicle) => void;
  onRegisterClick: () => void;
}

const VehicleInfo: React.FC<VehicleInfoProps> = ({ 
  vehicles, 
  onVehicleSelect, 
  onRegisterClick 
}) => {
  return (
    <div className="p-6 mr-4 bg-white border-2 border-[#B0B8C1] rounded-lg shadow-md w-[740px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">차량 목록</h2>
        <button
          onClick={onRegisterClick}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-600"
        >
          차량 등록
        </button>
      </div>

      <table className="w-full">
        <thead>
          <tr>
            <th className="py-2 px-4 text-left border-b-2">호차</th>
            <th className="py-2 px-4 text-left border-b-2">등/하원</th>
            <th className="py-2 px-4 text-left border-b-2">기사</th>
            <th className="py-2 px-4 text-left border-b-2">연락처</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((vehicle) => (
            <tr 
              key={vehicle.id}
              onClick={() => onVehicleSelect(vehicle)}
              className="hover:bg-gray-50 cursor-pointer"
            >
              <td className="py-2 px-4">{vehicle.number}</td>
              <td className="py-2 px-4">{vehicle.type}</td>
              <td className="py-2 px-4">{vehicle.name}</td>
              <td className="py-2 px-4">{vehicle.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VehicleInfo; 