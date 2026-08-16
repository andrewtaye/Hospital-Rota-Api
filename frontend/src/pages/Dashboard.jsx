import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";
import Calendar from "../components/Calendar";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function Dashboard() {
  const [shifts, setShifts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedShift, setSelectedShift] = useState(null);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  const navigate = useNavigate();

  // -------------------------
  // Theme
  // -------------------------

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      theme
    );

    localStorage.setItem("theme", theme);
  }, [theme]);

  // -------------------------
  // Load shifts
  // -------------------------

  useEffect(() => {
    async function loadShifts() {
      const accessToken =
        localStorage.getItem("accessToken");

      if (!accessToken) {
        navigate("/login");
        return;
      }

      try {
        const response = await api.get("shifts/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setShifts(response.data);
      } catch (requestError) {
        console.error(requestError);

        if (requestError.response?.status === 401) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");

          navigate("/login");
          return;
        }

        setError("Could not load shifts.");
      } finally {
        setIsLoading(false);
      }
    }

    loadShifts();
  }, [navigate]);

  // -------------------------
  // Theme toggle
  // -------------------------

  function handleThemeChange() {
    setTheme((currentTheme) =>
      currentTheme === "dark" ? "light" : "dark"
    );
  }

  // -------------------------
  // Logout
  // -------------------------

  function handleLogout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    navigate("/login");
  }

  // -------------------------
  // Loading
  // -------------------------

  if (isLoading) {
    return (
      <main className="dashboard-loading">
        <p>Loading shifts...</p>
      </main>
    );
  }

  // -------------------------
  // Error
  // -------------------------

  if (error) {
    return (
      <main className="dashboard-error">
        <p>{error}</p>

        <button
          type="button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </main>
    );
  }

  // -------------------------
  // Dashboard
  // -------------------------

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="dashboard">
        <Navbar
          theme={theme}
          onThemeChange={handleThemeChange}
          onLogout={handleLogout}
        />

        <main className="dashboard-content">

          {/* -------------------------
              Welcome
          ------------------------- */}

          <section className="dashboard-welcome">
            <div>
              <p className="dashboard-welcome__label">
                Staff scheduling
              </p>

              <h1>My Rota</h1>

              <p className="dashboard-welcome__description">
                View your scheduled shifts and working days.
              </p>
            </div>
          </section>

          {/* -------------------------
              Overview cards
          ------------------------- */}

          <section className="dashboard-stats">
            <div className="stat-card">
              <span className="stat-card__label">
                Total shifts
              </span>

              <strong className="stat-card__value">
                {shifts.length}
              </strong>

              <span className="stat-card__description">
                Scheduled shifts
              </span>
            </div>

            <div className="stat-card">
              <span className="stat-card__label">
                Next shift
              </span>

              <strong className="stat-card__value">
                {shifts.length > 0
                  ? shifts[0].date
                  : "None"}
              </strong>

              <span className="stat-card__description">
                Upcoming working day
              </span>
            </div>

            <div className="stat-card">
              <span className="stat-card__label">
                Department
              </span>

              <strong className="stat-card__value">
                {shifts.length > 0
                  ? shifts[0].department
                  : "—"}
              </strong>

              <span className="stat-card__description">
                Current assignment
              </span>
            </div>
          </section>

          {/* -------------------------
              Main dashboard area
          ------------------------- */}

          {shifts.length === 0 ? (
            <section className="empty-state">
              <h2>No scheduled shifts</h2>

              <p>
                You currently have no shifts assigned to you.
              </p>
            </section>
          ) : (
            <section className="dashboard-main-grid">

              {/* Calendar */}

              <div className="dashboard-calendar">
                <Calendar
                  shifts={shifts}
                  onSelectShift={setSelectedShift}
                />
              </div>

              {/* Shift details */}

              <section className="shift-details">
                <div className="shift-details__heading">
                  <p>Selected day</p>

                  <h2>Shift details</h2>
                </div>

                {selectedShift ? (
                  <div className="shift-details__grid">

                    <div className="shift-details__item">
                      <span>Date</span>

                      <strong>
                        {selectedShift.date}
                      </strong>
                    </div>

                    <div className="shift-details__item">
                      <span>Start time</span>

                      <strong>
                        {selectedShift.start_time.slice(
                          0,
                          5
                        )}
                      </strong>
                    </div>

                    <div className="shift-details__item">
                      <span>End time</span>

                      <strong>
                        {selectedShift.end_time.slice(
                          0,
                          5
                        )}
                      </strong>
                    </div>

                    <div className="shift-details__item">
                      <span>Department</span>

                      <strong>
                        {selectedShift.department}
                      </strong>
                    </div>

                    {selectedShift.notes && (
                      <div className="shift-details__item shift-details__item--notes">
                        <span>Notes</span>

                        <strong>
                          {selectedShift.notes}
                        </strong>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="shift-details__empty">
                    <p>
                      Select a highlighted working day
                      to view the shift information.
                    </p>
                  </div>
                )}
              </section>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;