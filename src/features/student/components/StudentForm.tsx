import React from 'react';
import { areaService } from '@/services/areaService';
import { useQuery } from '@tanstack/react-query';
import type { Area } from '@/services/areaService';

interface StudentFormProps {
  name: string;
  phone: string;
  address: string;
  area_idx?: number;
  isEditing: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  errors?: {
    name?: string;
    phone?: string;
    address?: string;
    area_idx?: string;
  };
}

const StudentForm: React.FC<StudentFormProps> = ({
  name,
  phone,
  address,
  area_idx,
  isEditing,
  onChange,
  errors
}) => {
  const { data: areas = [] } = useQuery<Area[]>({
    queryKey: ['areas'],
    queryFn: () => areaService.getAreas(),
    staleTime: 5 * 60 * 1000
  });

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          성명 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={name}
          onChange={onChange}
          className={`w-full p-2 border-2 rounded ${
            !isEditing ? 'bg-gray-50 cursor-pointer' : 'bg-white'
          } ${errors?.name ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="이름을 입력하세요"
        />
        {errors?.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="area_select" className="block text-sm font-medium text-gray-700 mb-1">
          지역 <span className="text-red-500">*</span>
        </label>
        <select
          id="area_select"
          name="area_idx"
          value={area_idx || ""}
          onChange={onChange}
          className={`w-full p-2 border-2 rounded ${
            errors?.area_idx ? 'border-red-500' : 'border-gray-300'
          }`}
          required
        >
          <option value="">지역을 선택해주세요</option>
          {areas.map((area) => (
            <option key={area.ar_idx} value={area.ar_idx}>
              {area.ar_name}
            </option>
          ))}
        </select>
        {errors?.area_idx && (
          <p className="mt-1 text-sm text-red-500">{errors.area_idx}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          연락처 <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          name="phone"
          value={phone}
          onChange={onChange}
          className={`w-full p-2 border-2 rounded ${
            !isEditing ? 'bg-gray-50 cursor-pointer' : 'bg-white'
          } ${errors?.phone ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="연락처를 입력하세요"
        />
        {errors?.phone && (
          <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          주소 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="address"
          value={address}
          onChange={onChange}
          className={`w-full p-2 border-2 rounded ${
            !isEditing ? 'bg-gray-50 cursor-pointer' : 'bg-white'
          } ${errors?.address ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="주소를 입력하세요"
        />
        {errors?.address && (
          <p className="mt-1 text-sm text-red-500">{errors.address}</p>
        )}
      </div>
    </div>
  );
};

export default StudentForm;
