import { http, HttpResponse } from "msw";
import { MOCK_SCHEDULE_DATA } from "./scheduleData";

export const handlers = [
  http.get("/api//admin/shuttles/:date", ({ params }) => {
    const { date } = params;
    const scheduleData = MOCK_SCHEDULE_DATA[date as string];

    if (!scheduleData) {
      return new HttpResponse(
        JSON.stringify({ message: "해당 날짜의 스케줄이 없습니다." }),
        { status: 404 },
      );
    }

    return HttpResponse.json(scheduleData);
  }),

  http.get("/api/routes/:routeId/timeslots/:time", ({ params, request }) => {
    const { routeId, time } = params;
    const url = new URL(request.url);
    const date = url.searchParams.get("date");
    const type = url.searchParams.get("type") as "pickup" | "dropoff";

    const scheduleData = MOCK_SCHEDULE_DATA[date as string];
    const route = scheduleData?.[type]?.find((r) => r.id === routeId);
    const timeSlot = route?.timeSlots.find((t) => t.time === time);

    if (!timeSlot) {
      return new HttpResponse(
        JSON.stringify({ message: "해당 시간의 노선 정보가 없습니다." }),
        { status: 404 },
      );
    }

    return HttpResponse.json(timeSlot);
  }),
];
