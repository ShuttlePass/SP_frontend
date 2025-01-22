import React, { useState, useRef, useEffect } from 'react';

interface Course {
  name: string;
  schedule: string;
}

interface Student {
  id: string;
  name: string;
  phone: string;
  courses: Course[];
}

interface StudentSearchBarProps {
  onSelectCourse?: (studentId: string, course: Course) => void;
  className?: string;
}

const StudentSearchBar: React.FC<StudentSearchBarProps> = ({ 
  onSelectCourse,
  className = ''
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 임시 데이터 (실제로는 props나 API로 받아올 수 있습니다)
  const students: Student[] = [
    {
      id: '1',
      name: '김유진',
      phone: '010-1234-5678',
      courses: [
        { name: '기능 교육', schedule: '월수금 13:00-15:00' },
        { name: '필기 시험', schedule: '화목 15:00-17:00' }
      ]
    },
    {
      id: '2',
      name: '김유진',
      phone: '010-8765-4321',
      courses: []
    }
  ];

  const filteredStudents = students.filter(student => 
    student.name.includes(searchQuery)
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
        setSelectedStudent(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <input
        ref={inputRef}
        type="text"
        placeholder="학생 이름을 입력하세요"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setShowResults(e.target.value.length > 0);
          setSelectedStudent(null);
        }}
        onFocus={() => {
          if (searchQuery) setShowResults(true);
        }}
        className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
      />

      {showResults && searchQuery && (
        <div 
          ref={dropdownRef}
          className="absolute w-full mt-2 bg-white border rounded-lg shadow-lg z-10 max-h-[400px] overflow-auto"
        >
          {!selectedStudent && filteredStudents.map((student) => (
            <div 
              key={student.id}
              onClick={() => setSelectedStudent(student)}
              className="p-4 hover:bg-blue-50 cursor-pointer border-b last:border-b-0 transition-colors duration-150"
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">{student.name}</span>
                <span className="text-gray-500 text-sm">{student.phone}</span>
              </div>
            </div>
          ))}

          {selectedStudent && (
            <div className="divide-y divide-gray-100">
              <div className="p-4 bg-blue-50 flex justify-between items-center">
                <div>
                  <span className="font-semibold text-gray-700">{selectedStudent.name}</span>
                  <span className="text-gray-500 text-sm ml-4">{selectedStudent.phone}</span>
                </div>
                <button 
                  onClick={() => setSelectedStudent(null)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-150"
                >
                  ← 뒤로
                </button>
              </div>
              {selectedStudent.courses.map((course, index) => (
                <div 
                  key={index} 
                  className="p-4 hover:bg-gray-50 transition-all duration-150 ease-in-out group"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors duration-150">
                        {course.name}
                      </div>
                      <div className="text-sm text-gray-500 mt-0.5">{course.schedule}</div>
                    </div>
                    <button 
                      className="bg-blue-500 text-white px-4 py-1.5 rounded-md hover:bg-blue-600 transform hover:scale-105 transition-all duration-150 shadow-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCourse?.(selectedStudent.id, course);
                      }}
                    >
                      선택
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredStudents.length === 0 && (
            <div className="p-6 text-gray-500 text-center">
              검색 결과가 없습니다
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentSearchBar; 