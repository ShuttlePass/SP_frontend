import { ScheduleData } from "../features/shuttleSchedule/schedule.types";

export const MOCK_SCHEDULE_DATA: ScheduleData = {
  "2025-01-20": {
    pickup: [
      {
        id: "0",
        carName: "1호차",
        timeSlots: [
          {
            time: "09:00",
            peopleCount: 3,
            passengers: [
              {
                name: "홍길동",
                contact: "010-1234-5678",
                address: "서울시 강남구 테헤란로 1",
                boardingLocation: "서울역",
              },
              {
                name: "김철수",
                contact: "010-2345-6789",
                address: "서울시 종로구 세종로 2",
                boardingLocation: "서울역",
              },
              {
                name: "이영희",
                contact: "010-3456-7890",
                address: "서울시 중구 을지로 3",
                boardingLocation: "서울역",
              },
            ],
          },
          {
            time: "11:00",
            peopleCount: 2,
            passengers: [
              {
                name: "이상훈",
                contact: "010-7890-1234",
                address: "서울시 반도체 기숙사 7번지",
                boardingLocation: "반도체 기숙사",
              },
              {
                name: "최영수",
                contact: "010-8901-2345",
                address: "서울시 성동구 왕십리로 4",
                boardingLocation: "성수역",
              },
            ],
          },
          {
            time: "13:00",
            peopleCount: 12,
            passengers: [
              {
                name: "강지원",
                contact: "010-9876-5432",
                address: "서울시 영등포구 여의도 5",
                boardingLocation: "여의도역",
              },
              {
                name: "차은영",
                contact: "010-2345-6789",
                address: "서울시 강남구 역삼로 6",
                boardingLocation: "강남역",
              },
              {
                name: "허지원",
                contact: "010-8765-4321",
                address: "서울시 송파구 잠실로 7",
                boardingLocation: "잠실역",
              },
              {
                name: "조하은",
                contact: "010-5678-1234",
                address: "서울시 강동구 고덕로 8",
                boardingLocation: "고덕역",
              },
              {
                name: "서준호",
                contact: "010-1357-2468",
                address: "서울시 서초구 반포대로 9",
                boardingLocation: "교대역",
              },
              {
                name: "김서영",
                contact: "010-2468-1357",
                address: "서울시 마포구 홍대입구 10",
                boardingLocation: "홍대입구역",
              },
              {
                name: "정수민",
                contact: "010-1111-2222",
                address: "서울시 강서구 마곡로 11",
                boardingLocation: "마곡역",
              },
              {
                name: "서동민",
                contact: "010-2222-3333",
                address: "서울시 양천구 목동로 12",
                boardingLocation: "목동역",
              },
              {
                name: "박지민",
                contact: "010-3333-4444",
                address: "서울시 강남구 삼성로 13",
                boardingLocation: "삼성역",
              },
              {
                name: "조민준",
                contact: "010-4444-5555",
                address: "서울시 성동구 왕십리로 14",
                boardingLocation: "왕십리역",
              },
              {
                name: "배수연",
                contact: "010-5555-6666",
                address: "서울시 종로구 종로1가 15",
                boardingLocation: "종로3가역",
              },
              {
                name: "이영희",
                contact: "010-6666-7777",
                address: "서울시 동대문구 회기동 16",
                boardingLocation: "회기역",
              },
            ],
          },
        ],
      },
      {
        id: "1",
        carName: "2호차",
        timeSlots: [
          {
            time: "09:30",
            peopleCount: 2,
            passengers: [
              {
                name: "강지원",
                contact: "010-9876-5432",
                address: "서울시 영등포구 여의도 5",
                boardingLocation: "여의도역",
              },
              {
                name: "차은영",
                contact: "010-2345-6789",
                address: "서울시 강남구 역삼로 6",
                boardingLocation: "강남역",
              },
            ],
          },
          {
            time: "11:30",
            peopleCount: 3,
            passengers: [
              {
                name: "허지원",
                contact: "010-8765-4321",
                address: "서울시 송파구 잠실로 7",
                boardingLocation: "잠실역",
              },
              {
                name: "조하은",
                contact: "010-5678-1234",
                address: "서울시 강동구 고덕로 8",
                boardingLocation: "고덕역",
              },
              {
                name: "서준호",
                contact: "010-1357-2468",
                address: "서울시 서초구 반포대로 9",
                boardingLocation: "교대역",
              },
            ],
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
            time: "14:00",
            peopleCount: 3,
            passengers: [
              {
                name: "임하진",
                contact: "010-1111-2222",
                address: "서울시 강남구 강남대로 10",
                boardingLocation: "강남역",
              },
              {
                name: "김수현",
                contact: "010-3333-4444",
                address: "서울시 서초구 서초로 11",
                boardingLocation: "서초역",
              },
              {
                name: "정하영",
                contact: "010-5555-6666",
                address: "서울시 중구 충무로 12",
                boardingLocation: "충무로역",
              },
            ],
          },
        ],
      },
    ],
  },

  "2025-01-21": {
    pickup: [
      {
        id: "0",
        carName: "1호차",
        timeSlots: [
          {
            time: "08:00",
            peopleCount: 5,
            passengers: [
              {
                name: "김철수",
                contact: "010-2345-6789",
                address: "서울시 종로구 세종로 2",
                boardingLocation: "서울역",
              },
              {
                name: "박지민",
                contact: "010-3456-7890",
                address: "서울시 중구 을지로 3",
                boardingLocation: "서울역",
              },
              {
                name: "조민준",
                contact: "010-4567-8901",
                address: "서울시 강남구 테헤란로 4",
                boardingLocation: "강남역",
              },
              {
                name: "배수연",
                contact: "010-5678-9012",
                address: "서울시 영등포구 여의도 5",
                boardingLocation: "여의도역",
              },
              {
                name: "이상훈",
                contact: "010-7890-1234",
                address: "서울시 반도체 기숙사 7번지",
                boardingLocation: "반도체 기숙사",
              },
            ],
          },
        ],
      },
    ],
    dropoff: [],
  },
};
