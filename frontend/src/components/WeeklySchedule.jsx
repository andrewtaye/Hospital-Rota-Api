function WeeklySchedule({
  employees,
  shifts,
  weekDays,
  isManager,
  onCreateShift,
}) {
  const DAY_NURSE_SLOTS = 3;
  const DAY_SUPPORT_SLOTS = 8;

  const NIGHT_NURSE_SLOTS = 3;
  const NIGHT_SUPPORT_SLOTS = 5;

  const staffNurses =
    employees.filter(
      (employee) =>
        employee.role === "staff_nurse" ||
        employee.role === "nurse"
    );

  const supportWorkers =
    employees.filter(
      (employee) =>
        employee.role ===
        "support_worker"
    );

  function getShift(
    employeeId,
    date,
    shiftType
  ) {
    return shifts.find(
      (shift) => {
        const sameEmployee =
          shift.employee === employeeId;

        const sameDate =
          shift.date === date;

        const startTime =
          shift.start_time?.slice(0, 5);

        const isDay =
          startTime === "08:00";

        const isNight =
          startTime === "20:00";

        return (
          sameEmployee &&
          sameDate &&
          (
            (shiftType === "day" &&
              isDay) ||
            (shiftType === "night" &&
              isNight)
          )
        );
      }
    );
  }

  function createStaffSlots(
    staff,
    minimumSlots,
    shiftType,
    role
  ) {
    const slots = staff.map(
      (employee) => ({
        type: "employee",
        employee,
      })
    );

    const missingSlots =
      Math.max(
        minimumSlots - staff.length,
        0
      );

    for (
      let index = 0;
      index < missingSlots;
      index += 1
    ) {
      slots.push({
        type: "vacant",
        id:
          `${shiftType}-${role}-vacant-${index}`,
      });
    }

    return slots;
  }

  function renderStaffRows(
    staff,
    shiftType,
    minimumSlots,
    role
  ) {
    const slots =
      createStaffSlots(
        staff,
        minimumSlots,
        shiftType,
        role
      );

    return slots.map(
      (slot) => {
        if (slot.type === "vacant") {
          return (
            <div
              className="
                weekly-schedule__row
                weekly-schedule__row--vacant
              "
              key={slot.id}
            >
              <div className="weekly-schedule__employee weekly-schedule__employee--vacant">
                <div className="weekly-schedule__vacant-icon">
                  +
                </div>

                <div>
                  <strong>
                    Vacant
                  </strong>

                  <span>
                    Staff position available
                  </span>
                </div>
              </div>

              {weekDays.map(
                (day) => (
                  <div
                    key={day.date}
                    className="
                      weekly-schedule__cell
                      weekly-schedule__cell--vacant
                    "
                  />
                )
              )}
            </div>
          );
        }

        const employee =
          slot.employee;

        return (
          <div
            className="weekly-schedule__row"
            key={`${shiftType}-${employee.id}`}
          >
            <div className="weekly-schedule__employee">
              <div className="weekly-schedule__avatar">
                {employee.username
                  ?.charAt(0)
                  .toUpperCase()}
              </div>

              <div>
                <strong>
                  {employee.username}
                </strong>

                <span>
                  {employee.unit_name ||
                    employee.department_name}
                </span>
              </div>
            </div>

            {weekDays.map(
              (day) => {
                const shift =
                  getShift(
                    employee.user,
                    day.date,
                    shiftType
                  );

                return (
                  <button
                    key={day.date}
                    type="button"
                    className={
                      shift
                        ? "weekly-schedule__cell weekly-schedule__cell--assigned"
                        : "weekly-schedule__cell weekly-schedule__cell--empty"
                    }
                    onClick={() => {
                      if (
                        shift ||
                        !isManager
                      ) {
                        return;
                      }

                      onCreateShift({
                        employee,
                        date: day.date,
                        shiftType,
                      });
                    }}
                  >
                    {shift ? (
                      <div className="weekly-schedule__shift">
                        <strong>
                          {shiftType ===
                          "day"
                            ? "08:00–20:00"
                            : "20:00–08:00"}
                        </strong>

                        {shift.notes && (
                          <span>
                            {shift.notes}
                          </span>
                        )}
                      </div>
                    ) : isManager ? (
                      <span className="weekly-schedule__add">
                        +
                      </span>
                    ) : null}
                  </button>
                );
              }
            )}
          </div>
        );
      }
    );
  }

  return (
    <section className="weekly-schedule">
      <header className="weekly-schedule__header">
        <div className="weekly-schedule__employee-heading">
          Staff
        </div>

        {weekDays.map(
          (day) => (
            <div
              key={day.date}
              className="weekly-schedule__day-heading"
            >
              <span>
                {day.label}
              </span>

              <strong>
                {day.dayNumber}
              </strong>

              <small>
                {day.month}
              </small>
            </div>
          )
        )}
      </header>

      <section className="weekly-schedule__section">
        <div className="weekly-schedule__section-title">
          <span>☀</span>
          Day Shift

          <small>
            08:00 – 20:00
          </small>
        </div>

        <div className="weekly-schedule__role-title">
          Staff Nurses · 3 required
        </div>

        {renderStaffRows(
          staffNurses,
          "day",
          DAY_NURSE_SLOTS,
          "nurse"
        )}

        <div className="weekly-schedule__role-title">
          Support Workers · 8 required
        </div>

        {renderStaffRows(
          supportWorkers,
          "day",
          DAY_SUPPORT_SLOTS,
          "support"
        )}
      </section>

      <section className="weekly-schedule__section">
        <div className="weekly-schedule__section-title">
          <span>🌙</span>
          Night Shift

          <small>
            20:00 – 08:00
          </small>
        </div>

        <div className="weekly-schedule__role-title">
          Staff Nurses · 3 required
        </div>

        {renderStaffRows(
          staffNurses,
          "night",
          NIGHT_NURSE_SLOTS,
          "nurse"
        )}

        <div className="weekly-schedule__role-title">
          Support Workers · 5 required
        </div>

        {renderStaffRows(
          supportWorkers,
          "night",
          NIGHT_SUPPORT_SLOTS,
          "support"
        )}
      </section>
    </section>
  );
}

export default WeeklySchedule;