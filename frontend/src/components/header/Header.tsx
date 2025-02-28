const Header = () => {
  return (
    <nav
      id="head-navbar"
      style={{
        width: "100%",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        position: "fixed",
        top: 0,
        zIndex: 50,
        backgroundColor: "white",
        padding: "1rem",
      }}
    >
      <span style={{ color: "green" }}>Đây là header</span>
    </nav>
  );
};

export default Header;
