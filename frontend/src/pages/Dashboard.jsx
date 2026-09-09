import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";

import CreateShiftDrawer from "../components/CreateShiftDrawer";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import WeeklySchedule from "../components/WeeklySchedule";

function Dashboard() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);

  const [shifts, setShifts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  const [weekOffset, setWeekOffset] = useState(0);

  const [selectedShiftCell, setSelectedShiftCell] =
    useState(null);

  const [isCreateShiftOpen, setIsCreateShiftOpen] =
    useState(false);

  const accessToken =
    localStorage.getItem("accessToken");

  // --------------------------------------------------
  // Theme
  // --------------------------------------------------

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      theme
    );

    localStorage.setItem("theme", theme);
  }, [theme]);

  function handleThemeChange() {
    setTheme((currentTheme) =>
      currentTheme === "dark"
        ? "light"
        : "dark"
    );
  }

  // --------------------------------------------------
  // Logout
  // --------------------------------------------------

  function handleLogout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    navigate("/login");
  }

  // --------------------------------------------------
  // Load dashboard data
  // --------------------------------------------------

  useEffect(() => {
    async function loadDashboardData() {
      if (!accessToken) {
        navigate("/login");
        return;
      }

      try {
        const headers = {
          Authorization: `Bearer ${accessToken}`,
        };

        const [
          currentUserResponse,
          shiftsResponse,
          employeesResponse,
          departmentsResponse,
        ] = await Promise.all([
          api.get("me/", { headers }),
          api.get("shifts/", { headers }),
          api.get("employees/", { headers }),
          api.get("departments/", { headers }),
        ]);

        setCurrentUser(
          currentUserResponse.data
        );

        setShifts(
          shiftsResponse.data
        );

        setEmployees(
          employeesResponse.data
        );

        setDepartments(
          departmentsResponse.data
        );

      } catch (requestError) {
        console.error(requestError);

        if (
          requestError.response?.status === 401
        ) {
          handleLogout();
          return;
        }

        setError(
          "Could not load rota data."
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, [accessToken, navigate]);

  // --------------------------------------------------
  // Manager detection
  // --------------------------------------------------

  const isManager =
    currentUser?.is_manager ?? false;

  // --------------------------------------------------
  // Ward
  // --------------------------------------------------

  const wardName =
    currentUser?.ward?.name ||
    "No ward assigned";

  // --------------------------------------------------
  // Format date
  // --------------------------------------------------

  function formatDate(date) {
    const year =
      date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  // --------------------------------------------------
  // Current week
  // --------------------------------------------------

  const weekDays = useMemo(() => {
    const today = new Date();

    const day =
      today.getDay();

    const mondayDifference =
      day === 0
        ? -6
        : 1 - day;

    const monday =
      new Date(today);

    monday.setDate(
      today.getDate() +
        mondayDifference +
        weekOffset * 7
    );

    monday.setHours(
      0,
      0,
      0,
      0
    );

    return Array.from(
      { length: 7 },
      (_, index) => {
        const date =
          new Date(monday);

        date.setDate(
          monday.getDate() +
            index
        );

        return {
          label:
            date.toLocaleDateString(
              "en-GB",
              {
                weekday: "short",
              }
            ),

          fullLabel:
            date.toLocaleDateString(
              "en-GB",
              {
                weekday: "long",
              }
            ),

          dayNumber:
            date.getDate(),

          month:
            date.toLocaleDateString(
              "en-GB",
              {
                month: "short",
              }
            ),

          date:
            formatDate(date),
        };
      }
    );
  }, [weekOffset]);

  // --------------------------------------------------
  // Weekly navigation
  // --------------------------------------------------

  function goToPreviousWeek() {
    setWeekOffset(
      (current) =>
        current - 1
    );
  }

  function goToNextWeek() {
    setWeekOffset(
      (current) =>
        current + 1
    );
  }

  function goToCurrentWeek() {
    setWeekOffset(0);
  }

  // --------------------------------------------------
  // Manager clicks empty cell
  // --------------------------------------------------

  function handleCreateShift({
    employee,
    date,
    shiftType,
  }) {
    if (!isManager) {
      return;
    }

    setSelectedShiftCell({
      employee,
      date,
      shiftType,
    });

    setIsCreateShiftOpen(true);
  }

  // --------------------------------------------------
  // Add newly created shift to board
  // --------------------------------------------------

  function handleShiftCreated(
    newShift
  ) {
    setShifts(
      (currentShifts) => [
        ...currentShifts,
        newShift,
      ]
    );
  }

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (isLoading) {
    return (
      <main className="dashboard-loading">
        <p>Loading rota...</p>
      </main>
    );
  }

  // --------------------------------------------------
  // Error
  // --------------------------------------------------

  if (error) {
    return (
      <main className="dashboard-error">
        <div>
          <p>{error}</p>

          <button
            type="button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </main>
    );
  }

  // --------------------------------------------------
  // Dashboard
  // --------------------------------------------------

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="dashboard">
        <Navbar
          user={currentUser}
          theme={theme}
          onThemeChange={
            handleThemeChange
          }
          onLogout={
            handleLogout
          }
        />

        <main className="dashboard-content">

          <div className="ward-heading">
            <span>
              {wardName}
            </span>
          </div>

          <section className="weekly-rota-heading">
            <div>
              <p className="dashboard-welcome__label">
                Staff scheduling
              </p>

              <h1>
                Weekly Rota
              </h1>

              <p className="dashboard-welcome__description">
                View staff coverage across day and
                night shifts.
              </p>
            </div>

            <div className="weekly-rota-controls">
              <button
                type="button"
                onClick={
                  goToPreviousWeek
                }
              >
                ← Previous
              </button>

              <button
                type="button"
                onClick={
                  goToCurrentWeek
                }
              >
                This week
              </button>

              <button
                type="button"
                onClick={
                  goToNextWeek
                }
              >
                Next →
              </button>
            </div>
          </section>

          <WeeklySchedule
            employees={
              employees
            }
            shifts={
              shifts
            }
            weekDays={
              weekDays
            }
            isManager={
              isManager
            }
            onCreateShift={
              handleCreateShift
            }
          />
        </main>
      </div>

      {isCreateShiftOpen && (
        <CreateShiftDrawer
          shiftData={
            selectedShiftCell
          }
          onClose={() => {
            setIsCreateShiftOpen(
              false
            );

            setSelectedShiftCell(
              null
            );
          }}
          onCreated={
            handleShiftCreated
          }
        />
      )}
    </div>
  );
}

export default Dashboard;