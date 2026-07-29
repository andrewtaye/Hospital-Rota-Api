
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";
import Calendar from "../components/Calendar";

function Dashboard() {
  const [shifts, setShifts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedShift, setSelectedShift] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

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

  function handleThemeChange() {
    setTheme((currentTheme) =>
      currentTheme === "dark" ? "light" : "dark"
    );

    setIsMenuOpen(false);
  }

  function handleLogout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    navigate("/login");
  }

  if (isLoading) {
    return (
      <main className="dashboard">
        <p>Loading shifts...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="dashboard">
        <p>{error}</p>

        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      </main>
    );
  }

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-header__label">
            Staff scheduling
          </p>

          <h1>My Rota</h1>

          <p className="dashboard-header__description">
            View your scheduled shifts and working days.
          </p>
        </div>

        <div
          className="dashboard-menu"
          ref={menuRef}
        >
          <button
            type="button"
            className="dashboard-menu__button"
            onClick={() =>
              setIsMenuOpen((currentValue) => !currentValue)
            }
            aria-expanded={isMenuOpen}
            aria-label="Open dashboard menu"
          >
            <span />
            <span />
            <span />
          </button>

          {isMenuOpen && (
            <div className="dashboard-menu__dropdown">
              <button
                type="button"
                onClick={handleThemeChange}
              >
                {theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"}
              </button>

              <button
                type="button"
                className="dashboard-menu__logout"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {shifts.length === 0 ? (
        <section className="empty-state">
          <h2>No scheduled shifts</h2>

          <p>
            You currently have no shifts assigned to you.
          </p>
        </section>
      ) : (
        <>
          <Calendar
            shifts={shifts}
            onSelectShift={setSelectedShift}
          />

          <section className="shift-details">
            <div className="shift-details__heading">
              <p>Selected day</p>
              <h2>Shift details</h2>
            </div>

            {selectedShift ? (
              <div className="shift-details__grid">
                <div className="shift-details__item">
                  <span>Date</span>
                  <strong>{selectedShift.date}</strong>
                </div>

                <div className="shift-details__item">
                  <span>Start time</span>
                  <strong>
                    {selectedShift.start_time.slice(0, 5)}
                  </strong>
                </div>

                <div className="shift-details__item">
                  <span>End time</span>
                  <strong>
                    {selectedShift.end_time.slice(0, 5)}
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
                    <strong>{selectedShift.notes}</strong>
                  </div>
                )}
              </div>
            ) : (
              <p className="shift-details__empty">
                Select a highlighted working day to view
                the shift information.
              </p>
            )}
          </section>
        </>
      )}
    </main>
  );
}

export default Dashboard;

