import React, { useState } from 'react';
import SearchBar from '../../components/common/SearchBar';
import Modal from '../../components/common/Modal';
import { StudentRow } from '../../types/student';
import { MOCK_STUDENTS } from '../../mocks/mockData';

interface StudentListProps {
  students: StudentRow[];
}

const StudentList: React.FC<StudentListProps> = ({ students }) => {
  const [filteredStudents, setFilteredStudents] = useState(students);
  const [selectedStudent, setSelectedStudent] = useState<StudentRow | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredStudents(students);
      return;
    }

    const filtered = students.filter(student => 
      student.name.toLowerCase().includes(query.toLowerCase()) ||
      student.phone.includes(query) ||
      student.address.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredStudents(filtered);
  };

  const handleStudentClick = (student: StudentRow) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 mr-4 bg-white border-2 border-[#B0B8C1] rounded-lg shadow-md w-[740px]">
      <h2 className="text-xl font-bold mb-6">학생 목록</h2>
      
      {/* 검색/필터 영역 */}
      <div className="flex justify-between mb-4">
        <div className="flex gap-2">
          <select 
            className="border rounded px-3 py-1.5 min-w-[100px]"
            title="정렬 기준"
          >
            <option>등록 순</option>
            <option>가나다 순</option>
          </select>
        </div>
        <SearchBar 
          placeholder="학생 검색..."
          onSearch={handleSearch}
          className="w-[240px]"
        />
      </div>

      {/* 총 개수 */}
      <div className="text-sm text-gray-600 mb-2">
        총 {MOCK_STUDENTS.totalCount}명
      </div>

      {/* 테이블 */}
      <div className="rounded-lg overflow-hidden border-2 border-[#B0B8C1]">
        <table className="w-full">
          <thead>
            <tr>
              <th className="py-2 px-4 text-center border border-[#B0B8C1] bg-white">이름</th>
              <th className="py-2 px-4 text-center border border-[#B0B8C1] bg-white">연락처</th>
              <th className="py-2 px-4 text-center border border-[#B0B8C1] bg-white">주소</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, index) => (
              <tr 
                key={index} 
                className="bg-white hover:bg-gray-50 cursor-pointer"
                onClick={() => handleStudentClick(student)}
              >
                <td className="py-2 px-4 text-center">{student.name}</td>
                <td className="py-2 px-4 text-center">{student.phone}</td>
                <td className="py-2 px-4 text-center">{student.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 학생 상세 정보 모달 */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${selectedStudent?.name || ''} 학생 정보`}
      >
        {selectedStudent && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">연락처</label>
              <div>{selectedStudent.phone}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">주소</label>
              <div>{selectedStudent.address}</div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StudentList; 