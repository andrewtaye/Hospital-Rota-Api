import { NavLink } from "react-router-dom";

function Sidebar({ user }) {
  const isManager =
    user?.is_manager ?? false;

  function getLinkClass({ isActive }) {
    return isActive
      ? "sidebar-link sidebar-link--active"
      : "sidebar-link";
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo__icon">
          S
        </div>

        <span className="sidebar-logo__text">
          Shifted
        </span>
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/dashboard"
          className={getLinkClass}
        >
          <span className="sidebar-link__icon">
            🏠
          </span>

          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/shifts"
          className={getLinkClass}
        >
          <span className="sidebar-link__icon">
            🗓️
          </span>

          <span>My Shifts</span>
        </NavLink>

        <NavLink
          to="/calendar"
          className={getLinkClass}
        >
          <span className="sidebar-link__icon">
            📅
          </span>

          <span>Calendar</span>
        </NavLink>

        <NavLink
          to="/requests"
          className={getLinkClass}
        >
          <span className="sidebar-link__icon">
            🔄
          </span>

          <span>Requests</span>
        </NavLink>
      </nav>

      <div className="sidebar-bottom">
        <NavLink
          to="/settings"
          className={getLinkClass}
        >
          <span className="sidebar-link__icon">
            ⚙️
          </span>

          <span>Settings</span>
        </NavLink>
      </div>
    </aside>
  );
}

export default Sidebar;