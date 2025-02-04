import React, { useState, useEffect } from "react";
import api from "@/api/axios";

interface Area {
  ar_idx: number;
  ar_name: string;
}

interface VehicleFormData {
  sh_name: string;
  sh_max_cnt: number | "";
  area_idx: number[];
}

interface VehicleRegisterProps {
  onSubmit: (data: any) => void;
  onClose: () => void;
}

const VehicleRegister: React.FC<VehicleRegisterProps> = ({
  onSubmit,
  onClose,
}) => {
  const [formData, setFormData] = useState<VehicleFormData>({
    sh_name: "",
    sh_max_cnt: "",
    area_idx: [],
  });

  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [areas, setAreas] = useState<Area[]>([]);

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
      } catch (err: any) {
        console.error("지역 목록 조회 실패:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "지역 목록을 불러오는데 실패했습니다.",
        );
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

      const response = await api.post("/shuttle", formData);

      if (response.data.code === 1) {
        onSubmit(response.data);
        onClose();
      } else {
        throw new Error(response.data.message || "차량 등록에 실패했습니다.");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "차량 등록에 실패했습니다.",
      );
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
            disabled={isLoading}
          >
            {isLoading ? "처리 중..." : "등록"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VehicleRegister;
