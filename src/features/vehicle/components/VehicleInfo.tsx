import React from "react";
import { Vehicle } from "@/types/vehicle";

interface VehicleInfoProps {
  vehicles: Vehicle[];
  onVehicleSelect: (vehicle: Vehicle) => void;
  onRegisterClick: () => void;
  onDriverListClick: () => void;
}

const VehicleInfo: React.FC<VehicleInfoProps> = ({
  vehicles,
  onVehicleSelect,
  onRegisterClick,
  onDriverListClick,
}) => {
  return (
    <div className="w-full max-w-3xl">
      <div className="mb-4 flex justify-end gap-2">
        <button
          onClick={onDriverListClick}
          className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          기사 목록
        </button>
        <button
          onClick={onRegisterClick}
          className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          차량 등록
        </button>
      </div>
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">차량명</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">최대인원</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">기사명</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">연락처</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">상태</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {vehicles.map((vehicle) => (
              <tr
                key={vehicle.sh_idx}
                onClick={() => onVehicleSelect(vehicle)}
                className="cursor-pointer hover:bg-gray-50"
              >
                <td className="px-6 py-4 text-sm text-gray-900">{vehicle.sh_name}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{vehicle.sh_max_cnt}명</td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {vehicle.us_name || '-'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {vehicle.us_contact || '-'}
                </td>
                <td className="px-6 py-4 text-sm">
                  {vehicle.us_idx ? (
                    <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                      배정 완료
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold leading-5 text-red-800">
                      기사 미배정
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VehicleInfo;
