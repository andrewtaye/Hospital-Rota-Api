function Navbar({ user }) {
  const displayName =
    user?.first_name ||
    user?.username ||
    "User";

  const initial =
    displayName.charAt(0).toUpperCase();

  const roleLabels = {
    manager: "Manager",
    nurse: "Nurse",
    support_worker: "Support Worker",
    employee: "Employee",
  };

  const role =
    roleLabels[user?.role] ||
    "Employee";

  return (
    <nav className="navbar">
      <div className="navbar__brand">
        <span className="navbar__brand-mark">
          S
        </span>

        <div>
          <h2>Shifted</h2>
          <p>St Magnus Community</p>
        </div>
      </div>

      <div className="navbar__actions">
        <button
          className="navbar__notification"
          type="button"
          aria-label="Notifications"
        >
          🔔
        </button>

        <div className="navbar__profile">
          <div className="navbar__avatar">
            {initial}
          </div>

          <div className="navbar__profile-text">
            <span className="navbar__name">
              {displayName}
            </span>

            <span className="navbar__role">
              {role}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;