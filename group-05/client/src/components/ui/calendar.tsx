import type { DatesSetArg, EventClickArg, EventInput } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Card } from "./card";

type CalendarProps = {
  events: EventInput[];
  initialView?: "dayGridMonth" | "timeGridWeek" | "timeGridDay";
  onEventClick?: (arg: EventClickArg) => void;
  onDatesSet?: (arg: DatesSetArg) => void;
};

export function Calendar({ events, initialView = "timeGridWeek", onEventClick, onDatesSet }: CalendarProps) {
  return (
    <Card className="overflow-hidden p-3 sm:p-4">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={initialView}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay"
        }}
        height="auto"
        nowIndicator
        allDaySlot={false}
        slotMinTime="07:00:00"
        slotMaxTime="18:00:00"
        events={events}
        eventClick={onEventClick}
        datesSet={onDatesSet}
        eventClassNames={(arg) => {
          const status = String(arg.event.extendedProps.status ?? "").toLowerCase();
          return status ? [`gtgs-event-${status}`] : [];
        }}
      />
    </Card>
  );
}
