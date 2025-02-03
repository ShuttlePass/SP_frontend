import React from 'react';

interface StudentFormProps {
  name: string;
  phone: string;
  address: string;
  isEditing: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors?: {
    name?: string;
    phone?: string;
    address?: string;
  };
}

const StudentForm: React.FC<StudentFormProps> = ({
  name,
  phone,
  address,
  isEditing,
  onChange,
  errors
}) => {
  const renderField = (label: string, value: string, name: string) => {
    return (
      <input
        type={name === 'phone' ? 'tel' : 'text'}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full p-2 border-2 rounded border-[#B0B8C1] ${
          !isEditing ? 'bg-gray-50 cursor-pointer' : 'bg-white'
        } ${errors?.[name as keyof typeof errors] ? 'border-red-500' : 'border-gray-300'}`}
        placeholder={`${label}을(를) 입력하세요`}
      />
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          성명 <span className="text-red-500">*</span>
        </label>
        {renderField('이름', name, 'name')}
        {errors?.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          연락처 <span className="text-red-500">*</span>
        </label>
        {renderField('연락처', phone, 'phone')}
        {errors?.phone && (
          <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          주소 <span className="text-red-500">*</span>
        </label>
        {renderField('주소', address, 'address')}
        {errors?.address && (
          <p className="mt-1 text-sm text-red-500">{errors.address}</p>
        )}
      </div>
    </div>
  );
};

export default StudentForm; 