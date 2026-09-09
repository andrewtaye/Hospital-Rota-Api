import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function CreateShift() {
  const navigate = useNavigate();

  const [departments, setDepartments] = useState([]);
  const [units, setUnits] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [department, setDepartment] = useState("");
  const [unit, setUnit] = useState("");
  const [employee, setEmployee] = useState("");

  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [notes, setNotes] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  const accessToken =
    localStorage.getItem("accessToken");

  // -----------------------------------
  // Theme
  // -----------------------------------

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      theme
    );

    localStorage.setItem("theme", theme);
  }, [theme]);

  function handleThemeChange() {
    setTheme((currentTheme) =>
      currentTheme === "dark" ? "light" : "dark"
    );
  }

  // -----------------------------------
  // Logout
  // -----------------------------------

  function handleLogout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    navigate("/login");
  }

  // -----------------------------------
  // Load departments
  // -----------------------------------

  useEffect(() => {
    async function loadDepartments() {
      if (!accessToken) {
        navigate("/login");
        return;
      }

      try {
        const response = await api.get(
          "departments/",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        setDepartments(response.data);
      } catch (requestError) {
        console.error(requestError);

        if (requestError.response?.status === 401) {
          handleLogout();
          return;
        }

        setError("Could not load departments.");
      }
    }

    loadDepartments();
  }, [accessToken, navigate]);

  // -----------------------------------
  // Load units
  // -----------------------------------

  useEffect(() => {
    if (!department) {
      setUnits([]);
      setUnit("");
      setEmployees([]);
      setEmployee("");
      return;
    }

    async function loadUnits() {
      try {
        const response = await api.get(
          "units/",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const departmentUnits =
          response.data.filter(
            (currentUnit) =>
              String(currentUnit.department) ===
              String(department)
          );

        setUnits(departmentUnits);
      } catch (requestError) {
        console.error(requestError);
        setError("Could not load units.");
      }
    }

    loadUnits();
  }, [department, accessToken]);

  // -----------------------------------
  // Load employees
  // -----------------------------------

  useEffect(() => {
    if (!department) {
      return;
    }

    async function loadEmployees() {
      try {
        let url =
          `employees/?department=${department}`;

        if (unit) {
          url += `&unit=${unit}`;
        }

        const response = await api.get(
          url,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        setEmployees(response.data);
      } catch (requestError) {
        console.error(requestError);
        setError("Could not load employees.");
      }
    }

    loadEmployees();
  }, [department, unit, accessToken]);

  // -----------------------------------
  // Submit shift
  // -----------------------------------

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      await api.post(
        "shifts/",
        {
          employee: Number(employee),
          department: Number(department),
          unit: unit ? Number(unit) : null,
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

      setSuccess("Shift created successfully.");

      setEmployee("");
      setDate("");
      setStartTime("");
      setEndTime("");
      setNotes("");
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
        setError("Could not create shift.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="dashboard">
        <Navbar
          theme={theme}
          onThemeChange={handleThemeChange}
          onLogout={handleLogout}
        />

        <main className="create-shift-content">
          <section className="create-shift-header">
            <div>
              <p className="create-shift-header__label">
                Manager workspace
              </p>

              <h1>Create a shift</h1>

              <p className="create-shift-header__description">
                Assign an employee to a department,
                ward and working period.
              </p>
            </div>

            <button
              type="button"
              className="create-shift-back"
              onClick={() =>
                navigate("/dashboard")
              }
            >
              ← Back to dashboard
            </button>
          </section>

          <section className="create-shift-layout">
            <div className="create-shift-panel">
              <div className="create-shift-panel__heading">
                <p>Shift assignment</p>

                <h2>Schedule employee</h2>
              </div>

              <form
                className="create-shift-form"
                onSubmit={handleSubmit}
              >
                <div className="create-shift-grid">
                  <div className="create-shift-field">
                    <label htmlFor="department">
                      Department
                    </label>

                    <select
                      id="department"
                      value={department}
                      onChange={(event) => {
                        setDepartment(
                          event.target.value
                        );

                        setUnit("");
                        setEmployee("");
                      }}
                      required
                    >
                      <option value="">
                        Select department
                      </option>

                      {departments.map(
                        (currentDepartment) => (
                          <option
                            key={
                              currentDepartment.id
                            }
                            value={
                              currentDepartment.id
                            }
                          >
                            {
                              currentDepartment.name
                            }
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  {units.length > 0 && (
                    <div className="create-shift-field">
                      <label htmlFor="unit">
                        Ward / Unit
                      </label>

                      <select
                        id="unit"
                        value={unit}
                        onChange={(event) => {
                          setUnit(
                            event.target.value
                          );

                          setEmployee("");
                        }}
                      >
                        <option value="">
                          Select ward or unit
                        </option>

                        {units.map(
                          (currentUnit) => (
                            <option
                              key={
                                currentUnit.id
                              }
                              value={
                                currentUnit.id
                              }
                            >
                              {
                                currentUnit.name
                              }
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  )}

                  <div className="create-shift-field create-shift-field--full">
                    <label htmlFor="employee">
                      Employee
                    </label>

                    <select
                      id="employee"
                      value={employee}
                      onChange={(event) =>
                        setEmployee(
                          event.target.value
                        )
                      }
                      disabled={!department}
                      required
                    >
                      <option value="">
                        Select employee
                      </option>

                      {employees.map(
                        (currentEmployee) => (
                          <option
                            key={
                              currentEmployee.id
                            }
                            value={
                              currentEmployee.user
                            }
                          >
                            {
                              currentEmployee.username
                            }
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>

                <div className="create-shift-divider" />

                <div className="create-shift-grid create-shift-grid--three">
                  <div className="create-shift-field">
                    <label htmlFor="date">
                      Date
                    </label>

                    <input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(event) =>
                        setDate(
                          event.target.value
                        )
                      }
                      required
                    />
                  </div>

                  <div className="create-shift-field">
                    <label htmlFor="startTime">
                      Start time
                    </label>

                    <input
                      id="startTime"
                      type="time"
                      value={startTime}
                      onChange={(event) =>
                        setStartTime(
                          event.target.value
                        )
                      }
                      required
                    />
                  </div>

                  <div className="create-shift-field">
                    <label htmlFor="endTime">
                      End time
                    </label>

                    <input
                      id="endTime"
                      type="time"
                      value={endTime}
                      onChange={(event) =>
                        setEndTime(
                          event.target.value
                        )
                      }
                      required
                    />
                  </div>
                </div>

                <div className="create-shift-field">
                  <label htmlFor="notes">
                    Notes
                  </label>

                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(event) =>
                      setNotes(
                        event.target.value
                      )
                    }
                    placeholder="Add any useful information about this shift..."
                    rows="5"
                  />
                </div>

                {error && (
                  <div className="create-shift-error">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="create-shift-success">
                    ✓ {success}
                  </div>
                )}

                <div className="create-shift-actions">
                  <button
                    type="button"
                    className="create-shift-cancel"
                    onClick={() =>
                      navigate("/dashboard")
                    }
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="create-shift-submit"
                    disabled={isLoading}
                  >
                    {isLoading
                      ? "Creating shift..."
                      : "Create shift"}
                  </button>
                </div>
              </form>
            </div>

            <aside className="create-shift-summary">
              <p className="create-shift-summary__label">
                Shift preview
              </p>

              <h2>
                {date
                  ? new Date(
                      `${date}T00:00:00`
                    ).toLocaleDateString(
                      "en-GB",
                      {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      }
                    )
                  : "No date selected"}
              </h2>

              <div className="create-shift-summary__time">
                <span>
                  {startTime || "--:--"}
                </span>

                <div />

                <span>
                  {endTime || "--:--"}
                </span>
              </div>

              <div className="create-shift-summary__details">
                <div>
                  <span>Department</span>

                  <strong>
                    {departments.find(
                      (item) =>
                        String(item.id) ===
                        String(department)
                    )?.name || "Not selected"}
                  </strong>
                </div>

                <div>
                  <span>Ward / Unit</span>

                  <strong>
                    {units.find(
                      (item) =>
                        String(item.id) ===
                        String(unit)
                    )?.name || "Not selected"}
                  </strong>
                </div>

                <div>
                  <span>Employee</span>

                  <strong>
                    {employees.find(
                      (item) =>
                        String(item.user) ===
                        String(employee)
                    )?.username ||
                      "Not selected"}
                  </strong>
                </div>
              </div>
            </aside>
          </section>
        </main>
      </div>
    </div>
  );
}

export default CreateShift;