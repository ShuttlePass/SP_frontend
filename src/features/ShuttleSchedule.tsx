import { useState } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MOCK_SCHEDULE_DATA } from "@/mocks/mockScheduleData.ts";
import { ShuttleType } from "@/types/shuttle.types";
import { Passenger } from "@/types/shuttle.types";
import phone from "@/assets/img/phone_call.png";

interface ShuttleScheduleProps {
  carName: string;
}

const ShuttleSchedule = ({ carName }: ShuttleScheduleProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [shuttleType, setShuttleType] = useState<ShuttleType>("pickup");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Passenger | null>(
    null,
  );
  const [selectedStudentName, setSelectedStudentName] = useState<string | null>(
    null,
  );

  const formattedDate = selectedDate.toISOString().split("T")[0];
  const scheduleData = MOCK_SCHEDULE_DATA[formattedDate]?.[shuttleType] || [];
  const carSchedule = scheduleData.find(
    (schedule) => schedule.carName === carName,
  );
  const timeSlots = carSchedule ? carSchedule.timeSlots : [];
  const filteredSlots = selectedTime
    ? timeSlots.filter((slot) => slot.time === selectedTime)
    : timeSlots;

  const groupPassengersByLocation = (passengers: Passenger[]) => {
    return passengers.reduce(
      (acc, passenger) => {
        const { boardingLocation } = passenger;
        if (!acc[boardingLocation]) {
          acc[boardingLocation] = [];
        }
        acc[boardingLocation].push(passenger);
        return acc;
      },
      {} as Record<string, Passenger[]>,
    );
  };

  return (
    <div className="mt-10 flex min-h-screen items-center justify-center">
      <div className="w-full max-w-4xl rounded-md border bg-white p-4 shadow-md">
        <h2 className="mb-4 text-xl font-bold">{carName} 운영 시간표</h2>

        {/* 날짜 및 셔틀 타입 선택 */}
        <div className="mb-4 flex items-center justify-between">
          <select
            className="rounded-md border border-gray-300 px-3 py-2"
            value={shuttleType}
            onChange={(e) => setShuttleType(e.target.value as ShuttleType)}
          >
            <option value="pickup">등원</option>
            <option value="dropoff">하원</option>
          </select>
          <div>
            <ReactDatePicker
              selected={selectedDate}
              onChange={(date: Date | null) => date && setSelectedDate(date)}
              dateFormat="yyyy-MM-dd"
              className="w-32 cursor-pointer rounded-md border border-gray-300 px-4 py-2"
            />
          </div>
        </div>

        {/* 시간 필터 */}
        <div className="mb-4 flex gap-2">
          {timeSlots.map((slot) => (
            <button
              key={slot.time}
              className={`rounded border px-3 py-1 ${selectedTime === slot.time ? "bg-blue-500 text-white" : "bg-gray-100"}`}
              onClick={() => setSelectedTime(slot.time)}
            >
              {slot.time}
            </button>
          ))}
        </div>

        {/* 탑승자 목록 */}
        <div className="max-h-[400px] overflow-y-auto">
          {filteredSlots.length > 0 ? (
            filteredSlots.map((slot) => {
              const groupedPassengers = groupPassengersByLocation(
                slot.passengers || [],
              );

              return (
                <div key={slot.time} className="mb-4">
                  <h3 className="font-semibold">{slot.time}</h3>
                  <div className="mt-2 space-y-2">
                    {Object.entries(groupedPassengers).map(
                      ([location, students]) => (
                        <div key={location} className="rounded-md border p-2">
                          <span className="font-medium">{location}</span>{" "}
                          {students.map((student, index) => (
                            <button
                              key={index}
                              className={`ml-2 mr-1 rounded-md border px-2 py-1 shadow ${
                                selectedStudentName === student.name
                                  ? "bg-blue-500 text-white"
                                  : "bg-gray-100"
                              }`}
                              onClick={() => {
                                setSelectedStudent(student);
                                setSelectedStudentName(student.name);
                              }}
                            >
                              {student.name}
                            </button>
                          ))}
                        </div>
                      ),
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500">운행 정보가 없습니다.</p>
          )}
        </div>

        {/* 선택된 학생 정보 */}
        {selectedStudent && (
          <div className="mt-6 rounded-md border bg-gray-50 p-4">
            <h3 className="text-lg font-bold">
              {selectedStudent.name} 님의 정보
            </h3>
            <p className="mt-2 flex items-center">
              {selectedStudent.contact}{" "}
              <button
                className="ml-2 rounded-md border bg-gray-100 px-2 py-1 text-sm"
                onClick={() => {
                  if (selectedStudent?.contact) {
                    navigator.clipboard.writeText(selectedStudent.contact);
                    alert("연락처가 복사 되었습니다.");
                  }
                }}
              >
                복사
              </button>
              <a href={`tel:${selectedStudent.contact}`} className="ml-2">
                <img
                  src={phone} // 이미지 경로
                  alt="전화 걸기"
                  className="h-6 w-6"
                />
              </a>
            </p>
            <p className="mt-2">{selectedStudent.address}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShuttleSchedule;
