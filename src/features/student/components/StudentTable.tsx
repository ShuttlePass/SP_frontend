import React from 'react';
import { Student } from '../../../types/student';
import SearchBar from '../../../components/common/SearchBar';
import { useQuery } from '@tanstack/react-query';
import { areaService } from '@/services/areaService';

interface StudentTableProps {
  students: Student[];
  onStudentClick: (student: Student) => void;
  onDeleteClick: (student: Student) => void;
  searchTerm: string;
  onSearch?: (query: string) => void;
}

const StudentTable: React.FC<StudentTableProps> = ({
  students,
  onStudentClick,
  searchTerm,
  onSearch
}) => {
  // 지역 목록 조회
  const { data: areas = [] } = useQuery({
    queryKey: ['areas'],
    queryFn: () => areaService.getAreas(),
    staleTime: 5 * 60 * 1000
  });

  // 지역 이름 찾기 함수
  const getAreaName = (areaIdx: number) => {
    const area = areas.find(a => a.ar_idx === areaIdx);
    return area?.ar_name || '-';
  };

  const filteredStudents = students?.filter(student =>
    !searchTerm || student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-lg h-[640px] p-8">
      {/* 제목과 검색바 */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">학생 관리</h1>
        <SearchBar 
          className="w-[300px]"
          placeholder="학생 이름으로 검색"
          onSearch={onSearch || (() => {})}
        />
      </div>

      <div className="text-sm text-gray-500 mb-4">
        학생을 선택하면 정보를 확인할 수 있습니다.
      </div>

      {/* 테이블 컨테이너 */}
      <div className="bg-white rounded-lg border-2 border-gray-300">
        {/* 테이블 헤더 */}
        <div className="px-6 py-3 border-b-2 border-gray-300 bg-gray-50">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-2 text-sm font-bold text-gray-700">이름</div>
            <div className="col-span-2 text-sm font-bold text-gray-700">지역</div>
            <div className="col-span-3 text-sm font-bold text-gray-700">연락처</div>
            <div className="col-span-5 text-sm font-bold text-gray-700">주소</div>
          </div>
        </div>

        {/* 테이블 바디 - 스크롤 영역 */}
        <div className="h-[360px] overflow-y-auto">
          {filteredStudents?.map((student) => (
            <div
              key={student.id}
              onClick={() => onStudentClick(student)}
              className="px-6 py-2.5 border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
            >
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-2">
                  <span className="font-medium text-gray-900">{student.name}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-600">{getAreaName(student.area_idx)}</span>
                </div>
                <div className="col-span-3">
                  <span className="text-gray-600">{student.phone}</span>
                </div>
                <div className="col-span-5">
                  <span className="text-gray-600">{student.address}</span>
                </div>
              </div>
            </div>
          ))}
          
          {filteredStudents?.length === 0 && (
            <div className="px-6 py-8 text-center text-gray-500">
              {searchTerm ? '검색 결과가 없습니다.' : '등록된 학생이 없습니다.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentTable; 