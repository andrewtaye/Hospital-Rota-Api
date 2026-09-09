import { useState } from "react";

import api from "../api/axios";

function CreateShiftDrawer({
  shiftData,
  onClose,
  onCreated,
}) {
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!shiftData) {
    return null;
  }

  const {
    employee,
    date,
    shiftType,
  } = shiftData;

  const startTime =
    shiftType === "day"
      ? "08:00"
      : "20:00";

  const endTime =
    shiftType === "day"
      ? "20:00"
      : "08:00";

  async function handleCreateShift() {
    setError("");
    setIsLoading(true);

    const accessToken =
      localStorage.getItem("accessToken");

    try {
      const response = await api.post(
        "shifts/",
        {
          employee: employee.user,
          department: employee.department,
          unit: employee.unit || null,

          date,

          start_time: startTime,
          end_time: endTime,

          notes,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      onCreated(response.data);

      onClose();
    } catch (requestError) {
      console.error(requestError);

      const responseData =
        requestError.response?.data;

      if (responseData?.detail) {
        setError(responseData.detail);
      } else if (responseData) {
        setError(
          Object.values(responseData)
            .flat()
            .join(" ")
        );
      } else {
        setError(
          "Could not create shift."
        );
      }
    } finally {
      setIsLoading(false);
    }
  }

  const readableDate =
    new Date(
      `${date}T00:00:00`
    ).toLocaleDateString(
      "en-GB",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );

  return (
    <div className="shift-drawer-overlay">
      <aside className="shift-drawer">
        <div className="shift-drawer__header">
          <div>
            <p>
              Create shift
            </p>

            <h2>
              {employee.username}
            </h2>
          </div>

          <button
            type="button"
            className="shift-drawer__close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="shift-drawer__summary">
          <div>
            <span>Date</span>

            <strong>
              {readableDate}
            </strong>
          </div>

          <div>
            <span>Shift</span>

            <strong>
              {shiftType === "day"
                ? "Day Shift"
                : "Night Shift"}
            </strong>
          </div>

          <div>
            <span>Time</span>

            <strong>
              {startTime} – {endTime}
            </strong>
          </div>

          <div>
            <span>Department</span>

            <strong>
              {
                employee.department_name
              }
            </strong>
          </div>

          <div>
            <span>Ward / Unit</span>

            <strong>
              {
                employee.unit_name ||
                "No unit"
              }
            </strong>
          </div>
        </div>

        <div className="shift-drawer__notes">
          <label htmlFor="shift-notes">
            Notes
          </label>

          <textarea
            id="shift-notes"
            value={notes}
            onChange={(event) =>
              setNotes(
                event.target.value
              )
            }
            placeholder="Optional notes for this shift..."
            rows="5"
          />
        </div>

        {error && (
          <div className="shift-drawer__error">
            {error}
          </div>
        )}

        <div className="shift-drawer__actions">
          <button
            type="button"
            className="shift-drawer__cancel"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="button"
            className="shift-drawer__create"
            disabled={isLoading}
            onClick={
              handleCreateShift
            }
          >
            {isLoading
              ? "Creating..."
              : "Create Shift"}
          </button>
        </div>
      </aside>
    </div>
  );
}

export default CreateShiftDrawer;