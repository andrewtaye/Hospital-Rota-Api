function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h2>Shifted</h2>
      </div>

      <div className="navbar-right">
        <button className="notification-button">
          🔔
        </button>

        <div className="profile">
          <div className="profile-avatar">
            A
          </div>

          <div className="profile-info">
            <span className="profile-name">Andy</span>
            <span className="profile-role">Employee</span>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;