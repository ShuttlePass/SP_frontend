import { ScheduleData } from "../features/shuttleSchedule/schedule.types";

export const MOCK_SCHEDULE_DATA: ScheduleData = {
  "2025-02-05": {
    pickup: [
      {
        id: "0",
        carName: "1호차",
        timeSlots: [
          {
            time: "09:00",
            passengers: [
              {
                name: "임시진",
                contact: "010-5938-3648",
                address: "경기도 수원시 시신시구 599-8",
                boardingLocation: "중동동",
              },
              {
                name: "오미자",
                contact: "010-9876-5432",
                address: "경기도 수원시 인계동 38-3",
                boardingLocation: "영통동",
              },
              {
                name: "김수정",
                contact: "010-3333-2222",
                address: "경기도 수원시 영통구 40-3",
                boardingLocation: "반도체기숙사",
              },
              {
                name: "윤이서",
                contact: "010-4040-3030",
                address: "경기도 수원시 홍덕지구",
                boardingLocation: "홍덕지구",
              },
              {
                name: "차돌이",
                contact: "010-9876-5432",
                address: "경기도 수원시 기산디 253-4",
                boardingLocation: "기산동",
              },
              {
                name: "양희선",
                contact: "010-1111-2223",
                address: "경기도 수원시 매탄동 30-4",
                boardingLocation: "매탄동",
              },
              {
                name: "남이남이",
                contact: "010-0999-9999",
                address: "수원시 망포동",
                boardingLocation: "서천지구",
              },
              {
                name: "한서희",
                contact: "010-4040-3030",
                address: "경기도 수원시 기산동 39-9",
                boardingLocation: "기산동",
              },
              {
                name: "강호동",
                contact: "010-0999-9999",
                address: "수원시 망포동",
                boardingLocation: "반도체기숙사",
              },
            ],
            passengerCount: 9,
          },
          {
            time: "11:00",
            passengers: [
              {
                name: "박서준",
                contact: "010-1234-5678",
                address: "경기도 수원시 영통구 50-1",
                boardingLocation: "영통동",
              },
              {
                name: "김민지",
                contact: "010-2222-3333",
                address: "경기도 수원시 매탄동 45-2",
                boardingLocation: "매탄동",
              },
              {
                name: "이하늘",
                contact: "010-7777-8888",
                address: "경기도 수원시 원천동 20-5",
                boardingLocation: "원천동",
              },
              {
                name: "정다운",
                contact: "010-5555-6666",
                address: "경기도 수원시 광교동 100-7",
                boardingLocation: "광교동",
              },
            ],
            passengerCount: 4,
          },
          {
            time: "13:00",
            passengers: [
              {
                name: "최유진",
                contact: "010-9999-8888",
                address: "경기도 수원시 인계동 60-3",
                boardingLocation: "인계동",
              },
              {
                name: "송민호",
                contact: "010-3456-7890",
                address: "경기도 수원시 영통구 35-8",
                boardingLocation: "반도체기숙사",
              },
              {
                name: "강다희",
                contact: "010-2468-1357",
                address: "경기도 수원시 팔달구 15-4",
                boardingLocation: "팔달구",
              },
              {
                name: "윤서아",
                contact: "010-1357-2468",
                address: "경기도 수원시 장안구 80-1",
                boardingLocation: "장안구",
              },
              {
                name: "임재현",
                contact: "010-8765-4321",
                address: "경기도 수원시 권선구 25-9",
                boardingLocation: "권선구",
              },
            ],
            passengerCount: 5,
          },
        ],
      },
    ],
    dropoff: [
      {
        id: "0",
        carName: "1호차",
        timeSlots: [
          {
            time: "08:45",
            passengers: [
              {
                name: "김하늘",
                contact: "010-2222-3333",
                address: "경기도 수원시 영통구 55-7",
                boardingLocation: "영통동",
              },
              {
                name: "이태양",
                contact: "010-3333-4444",
                address: "경기도 수원시 매탄동 70-2",
                boardingLocation: "매탄동",
              },
              {
                name: "박별님",
                contact: "010-5555-6666",
                address: "경기도 수원시 원천동 30-8",
                boardingLocation: "원천동",
              },
            ],
            passengerCount: 3,
          },
          {
            time: "09:50",
            passengers: [
              {
                name: "정구름",
                contact: "010-7777-8888",
                address: "경기도 수원시 광교동 80-5",
                boardingLocation: "광교동",
              },
              {
                name: "한바다",
                contact: "010-8888-9999",
                address: "경기도 수원시 영통구 42-1",
                boardingLocation: "반도체기숙사",
              },
              {
                name: "최달빛",
                contact: "010-9999-0000",
                address: "경기도 수원시 인계동 90-3",
                boardingLocation: "인계동",
              },
              {
                name: "송하람",
                contact: "010-1234-5678",
                address: "경기도 수원시 팔달구 20-4",
                boardingLocation: "팔달구",
              },
            ],
            passengerCount: 4,
          },
          {
            time: "11:30",
            passengers: [
              {
                name: "강산들",
                contact: "010-2468-1357",
                address: "경기도 수원시 장안구 65-9",
                boardingLocation: "장안구",
              },
              {
                name: "임하수",
                contact: "010-1357-2468",
                address: "경기도 수원시 권선구 33-6",
                boardingLocation: "권선구",
              },
              {
                name: "오솔길",
                contact: "010-9876-5432",
                address: "경기도 수원시 영통구 77-3",
                boardingLocation: "영통동",
              },
              {
                name: "신바람",
                contact: "010-4567-8901",
                address: "경기도 수원시 기산동 45-7",
                boardingLocation: "기산동",
              },
              {
                name: "황미리",
                contact: "010-6789-0123",
                address: "경기도 수원시 매탄동 88-2",
                boardingLocation: "매탄동",
              },
            ],
            passengerCount: 5,
          },
        ],
      },
    ],
  },
  "2025-02-06": {
    pickup: [
      {
        id: "0",
        carName: "1호차",
        timeSlots: [
          {
            time: "09:00",
            passengers: [
              {
                name: "김도윤",
                contact: "010-1111-2222",
                address: "경기도 수원시 영통구 60-8",
                boardingLocation: "영통동",
              },
              {
                name: "이지안",
                contact: "010-3333-4444",
                address: "경기도 수원시 매탄동 85-3",
                boardingLocation: "매탄동",
              },
              {
                name: "박서연",
                contact: "010-5555-6666",
                address: "경기도 수원시 기산동 40-5",
                boardingLocation: "기산동",
              },
              {
                name: "정민준",
                contact: "010-7777-8888",
                address: "경기도 수원시 원천동 25-7",
                boardingLocation: "원천동",
              },
            ],
            passengerCount: 4,
          },
          {
            time: "11:00",
            passengers: [
              {
                name: "최예준",
                contact: "010-9999-0000",
                address: "경기도 수원시 인계동 75-2",
                boardingLocation: "인계동",
              },
              {
                name: "한소율",
                contact: "010-2468-1357",
                address: "경기도 수원시 영통구 50-9",
                boardingLocation: "반도체기숙사",
              },
              {
                name: "송지우",
                contact: "010-1357-2468",
                address: "경기도 수원시 팔달구 30-1",
                boardingLocation: "팔달구",
              },
            ],
            passengerCount: 3,
          },
          {
            time: "13:00",
            passengers: [
              {
                name: "강하준",
                contact: "010-8765-4321",
                address: "경기도 수원시 장안구 70-4",
                boardingLocation: "장안구",
              },
              {
                name: "임서현",
                contact: "010-4321-8765",
                address: "경기도 수원시 권선구 45-6",
                boardingLocation: "권선구",
              },
              {
                name: "신유나",
                contact: "010-9876-5432",
                address: "경기도 수원시 광교동 90-8",
                boardingLocation: "광교동",
              },
              {
                name: "황준서",
                contact: "010-6543-2109",
                address: "경기도 수원시 호매실동 55-3",
                boardingLocation: "호매실동",
              },
            ],
            passengerCount: 4,
          },
        ],
      },
    ],
    dropoff: [
      {
        id: "0",
        carName: "1호차",
        timeSlots: [
          {
            time: "08:45",
            passengers: [
              {
                name: "오다인",
                contact: "010-2345-6789",
                address: "경기도 수원시 영통구 65-2",
                boardingLocation: "영통동",
              },
              {
                name: "윤승민",
                contact: "010-3456-7890",
                address: "경기도 수원시 매탄동 80-7",
                boardingLocation: "매탄동",
              },
              {
                name: "조은우",
                contact: "010-4567-8901",
                address: "경기도 수원시 원천동 35-4",
                boardingLocation: "원천동",
              },
              {
                name: "류아린",
                contact: "010-5678-9012",
                address: "경기도 수원시 광교동 95-1",
                boardingLocation: "광교동",
              },
            ],
            passengerCount: 4,
          },
          {
            time: "09:50",
            passengers: [
              {
                name: "배서진",
                contact: "010-6789-0123",
                address: "경기도 수원시 영통구 45-8",
                boardingLocation: "반도체기숙사",
              },
              {
                name: "구민재",
                contact: "010-7890-1234",
                address: "경기도 수원시 인계동 70-6",
                boardingLocation: "인계동",
              },
              {
                name: "남도현",
                contact: "010-8901-2345",
                address: "경기도 수원시 팔달구 25-3",
                boardingLocation: "팔달구",
              },
            ],
            passengerCount: 3,
          },
          {
            time: "11:30",
            passengers: [
              {
                name: "홍서연",
                contact: "010-9012-3456",
                address: "경기도 수원시 장안구 85-9",
                boardingLocation: "장안구",
              },
              {
                name: "문지호",
                contact: "010-0123-4567",
                address: "경기도 수원시 권선구 50-2",
                boardingLocation: "권선구",
              },
              {
                name: "안하은",
                contact: "010-1234-5678",
                address: "경기도 수원시 기산동 75-5",
                boardingLocation: "기산동",
              },
              {
                name: "장민서",
                contact: "010-2345-6789",
                address: "경기도 수원시 호매실동 40-7",
                boardingLocation: "호매실동",
              },
            ],
            passengerCount: 4,
          },
        ],
      },
    ],
  },
};
