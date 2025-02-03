import React, { useState } from "react";

interface RegisterProps {
  layout: {
    title: string;
    fields: {
      label: string;
      type: string;
      placeholder: string;
    }[];
  };
  onSubmit: (data: any) => void;
}

const Register = ({ layout, onSubmit }: RegisterProps) => {
  const [formData, setFormData] = useState<{[key: string]: string}>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('폼 데이터:', formData);
    onSubmit(formData);
  };

  const handleChange = (label: string, value: string) => {
    console.log('입력 값 변경:', label, value);
    setFormData(prev => ({
      ...prev,
      [label]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 ml-auto bg-[#f8f8f8] border-2 border-[#B0B8C1] rounded w-[400px]">
      <h2 className="text-xl font-bold mb-6">학생관리</h2>
      
      {/* 각 페이지별로 다른 필드들을 렌더링할 컨테이너 */}
      <div className="space-y-4">
        {layout.fields.map((field, index) => (
          <div key={index}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
            </label>
            <input
              type={field.type}
              placeholder={field.placeholder}
              value={formData[field.label] || ''}
              onChange={(e) => handleChange(field.label, e.target.value)}
              className="w-full p-2 border-2 rounded border-[#B0B8C1]"
            />
          </div>
        ))}
      </div>

      {/* 공통 버튼 영역 */}
      <div className="flex justify-end gap-2 mt-10">
        <button 
          type="button"
          className="px-3 py-2 text-black font-bold border-2 border-black rounded w-[100px]"
        >
          임시 저장
        </button>
        <button 
          type="submit"
          className="px-3 py-2 text-black font-bold rounded w-[100px] bg-blue-500 text-white"
        >
          등록
        </button>
      </div>
    </form>
  );
}; 

export default Register;