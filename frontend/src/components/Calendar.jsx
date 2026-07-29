
import { useState } from "react";

const WEEK_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function Calendar({ shifts, onSelectShift }) {
  // Opens on the user's real current month.
  const [displayedDate, setDisplayedDate] = useState(() => new Date());

  const today = new Date();

  const displayedYear = displayedDate.getFullYear();
  const displayedMonth = displayedDate.getMonth();

  const monthTitle = displayedDate.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function createCalendarDays() {
    const firstDayOfMonth = new Date(
      displayedYear,
      displayedMonth,
      1
    );

    // Converts JavaScript's Sunday-first system
    // into a Monday-first calendar.
    const mondayBasedStartDay =
      (firstDayOfMonth.getDay() + 6) % 7;

    const firstCalendarDate = new Date(
      displayedYear,
      displayedMonth,
      1 - mondayBasedStartDay
    );

    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(firstCalendarDate);

      date.setDate(firstCalendarDate.getDate() + index);

      return {
        date,
        dateKey: formatDate(date),
        dayNumber: date.getDate(),
        isCurrentMonth:
          date.getMonth() === displayedMonth,
        isToday:
          formatDate(date) === formatDate(today),
      };
    });
  }

  const calendarDays = createCalendarDays();

  function findShiftForDate(dateKey) {
    return shifts.find((shift) => shift.date === dateKey);
  }

  function goToPreviousMonth() {
    setDisplayedDate(
      new Date(displayedYear, displayedMonth - 1, 1)
    );
  }

  function goToNextMonth() {
    setDisplayedDate(
      new Date(displayedYear, displayedMonth + 1, 1)
    );
  }

  function goToCurrentMonth() {
    setDisplayedDate(new Date());
  }

  return (
    <section className="rota-calendar">
      <header className="rota-calendar__header">
        <div>
          <p className="rota-calendar__label">
            Monthly rota
          </p>

          <h2>{monthTitle}</h2>
        </div>

        <div className="rota-calendar__controls">
          <button
            type="button"
            onClick={goToPreviousMonth}
          >
            Previous
          </button>

          <button
            type="button"
            onClick={goToCurrentMonth}
          >
            Today
          </button>

          <button
            type="button"
            onClick={goToNextMonth}
          >
            Next
          </button>
        </div>
      </header>

      <div className="rota-calendar__weekdays">
        {WEEK_DAYS.map((weekDay) => (
          <div
            key={weekDay}
            className="rota-calendar__weekday"
          >
            <span className="weekday-full">
              {weekDay}
            </span>

            <span className="weekday-short">
              {weekDay.slice(0, 3)}
            </span>
          </div>
        ))}
      </div>

      <div className="rota-calendar__grid">
        {calendarDays.map(
          ({
            dateKey,
            dayNumber,
            isCurrentMonth,
            isToday,
          }) => {
            const shift = findShiftForDate(dateKey);

            const classNames = [
              "rota-calendar__day",
              !isCurrentMonth
                ? "rota-calendar__day--outside"
                : "",
              shift
                ? "rota-calendar__day--working"
                : "",
              isToday
                ? "rota-calendar__day--today"
                : "",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <button
                key={dateKey}
                type="button"
                className={classNames}
                disabled={!shift}
                onClick={() => {
                  if (shift) {
                    onSelectShift(shift);
                  }
                }}
              >
                <span className="rota-calendar__date-number">
                  {dayNumber}
                </span>

                {isToday && (
                  <span className="rota-calendar__today-label">
                    Today
                  </span>
                )}

                {shift && (
                  <div className="rota-calendar__shift">
                    <span>Working</span>

                    <strong>
                      {shift.start_time.slice(0, 5)}–
                      {shift.end_time.slice(0, 5)}
                    </strong>
                  </div>
                )}
              </button>
            );
          }
        )}
      </div>
    </section>
  );
}

export default Calendar;

