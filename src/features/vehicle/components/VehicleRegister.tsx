import React, { useState, useEffect } from "react";
import api from "@/api/axios";
import { Driver } from "@/types/vehicle";

interface Area {
  ar_idx: number;
  ar_name: string;
}

interface VehicleFormData {
  sh_name: string;
  sh_max_cnt: number | "";
  area_idx: number[];
  driver_idx?: number | null;
}

interface VehicleRegisterProps {
  onSubmit: () => void;
  onClose: () => void;
  drivers: Driver[];
}

// 기사 상태 타입 정의
interface DriverStatus {
  status: 'available' | 'assigned';
  shuttle_name?: string;  // 배정된 경우 셔틀 이름
}

const VehicleRegister: React.FC<VehicleRegisterProps> = ({
  onSubmit,
  onClose,
  drivers
}) => {
  const [formData, setFormData] = useState<VehicleFormData>({
    sh_name: "",
    sh_max_cnt: "",
    area_idx: [],
    driver_idx: null
  });

  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [areas, setAreas] = useState<Area[]>([]);

  // 기사 목록 필터링 로직 수정
  const getDriverStatus = (driver: Driver): DriverStatus => {
    // sh_idx가 null이거나 undefined인 경우 배정 안됨
    if (!driver.sh_idx) {
      return {
        status: 'available'
      };
    }
    return {
      status: 'assigned',
      shuttle_name: driver.us_name
    };
  };

  // 지역 목록 가져오기
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        // 지역 목록 API 엔드포인트 수정
        const response = await api.get("/list/area");
        if (response.data.code === 1) {
          setAreas(response.data.data);
        } else {
          throw new Error(
            response.data.message || "지역 목록을 불러오는데 실패했습니다.",
          );
        }
      } catch (err: Error | unknown) {
        const errorMessage = err instanceof Error ? err.message : "알 수 없는 에러가 발생했습니다.";
        setError(errorMessage);
        console.error("지역 목록 조회 실패:", err);
      }
    };

    fetchAreas();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!formData.sh_name) {
        throw new Error("차량 이름을 입력해주세요.");
      }
      if (!formData.sh_max_cnt) {
        throw new Error("최대 탑승 인원을 입력해주세요.");
      }
      if (formData.area_idx.length === 0) {
        throw new Error("담당 지역을 선택해주세요.");
      }
      if (!formData.driver_idx) {
        throw new Error("기사를 선택해주세요.");
      }

      const response = await api.post("/shuttle", formData);

      if (response.data.code === 1) {
        onSubmit();
        onClose();
      } else {
        throw new Error(response.data.message || "차량 등록에 실패했습니다.");
      }
    } catch (err: Error | unknown) {
      const errorMessage = err instanceof Error ? err.message : "알 수 없는 에러가 발생했습니다.";
      setError(errorMessage);
      console.error("차량 등록 에러:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAreaToggle = (areaIdx: number) => {
    setFormData((prev) => ({
      ...prev,
      area_idx: prev.area_idx.includes(areaIdx)
        ? prev.area_idx.filter((idx) => idx !== areaIdx)
        : [...prev.area_idx, areaIdx],
    }));
  };

  return (
    <div className="fixed inset-y-0 right-0 w-96 overflow-y-auto bg-white p-6 shadow-lg">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">차량 등록</h2>
        <button onClick={onClose} className="text-gray-500">
          ✕
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 차량 이름 입력 */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            차량 이름 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.sh_name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, sh_name: e.target.value }))
            }
            className="w-full rounded border p-2"
            placeholder="예: 1호차"
            required
          />
        </div>

        {/* 최대 탑승 인원 입력 */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            최대 탑승 인원 <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={formData.sh_max_cnt}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                sh_max_cnt: e.target.value ? Number(e.target.value) : "",
              }))
            }
            className="w-full rounded border p-2"
            placeholder="최대 탑승 인원을 입력하세요"
            min="1"
            required
          />
        </div>

        {/* 담당 지역 선택 */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            담당 지역 <span className="text-red-500">*</span>
          </label>
          <div className="mt-2 space-y-2">
            {areas.map((area) => (
              <label key={area.ar_idx} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.area_idx.includes(area.ar_idx)}
                  onChange={() => handleAreaToggle(area.ar_idx)}
                  className="rounded border-gray-300"
                />
                <span>{area.ar_name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 기사 선택 */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            기사 선택 <span className="text-red-500">*</span>
          </label>
          <div className="mt-2 max-h-60 overflow-y-auto rounded border">
            {drivers.map((driver) => {
              const driverStatus = getDriverStatus(driver);
              const isAvailable = driverStatus.status === 'available';

              return (
                <label
                  key={driver.us_idx}
                  className={`flex cursor-pointer items-center space-x-3 border-b p-3 
                    ${!isAvailable ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-50'}
                    ${formData.driver_idx === driver.us_idx ? 'bg-blue-50' : ''}`}
                >
                  <input
                    type="radio"
                    name="driver"
                    checked={formData.driver_idx === driver.us_idx}
                    onChange={() =>
                      isAvailable && setFormData(prev => ({ ...prev, driver_idx: driver.us_idx }))
                    }
                    disabled={!isAvailable}
                    className="h-4 w-4 text-blue-500 disabled:cursor-not-allowed"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{driver.us_name}</div>
                      <div className={`text-sm ${isAvailable ? 'text-green-600' : 'text-red-500'}`}>
                        {isAvailable ? '배정 가능' : '배정됨'}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      ID: {driver.us_id}
                    </div>
                    <div className="text-sm text-gray-500">
                      연락처: {driver.us_contact}
                    </div>
                  </div>
                </label>
              );
            })}
            {drivers.length === 0 && (
              <div className="p-4 text-center text-gray-500">
                등록된 기사가 없습니다
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
            disabled={isLoading}
          >
            취소
          </button>
          <button
            type="submit"
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-blue-300"
            disabled={isLoading || !formData.sh_name || !formData.sh_max_cnt || formData.area_idx.length === 0 || !formData.driver_idx}
          >
            {isLoading ? "처리 중..." : "등록"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VehicleRegister;
