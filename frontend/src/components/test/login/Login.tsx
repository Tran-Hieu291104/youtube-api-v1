const login = () => {
  const login = () => {
    window.location.href = "/api/auth/google";
  };
  return (
    <div>
      <button
        style={{ marginTop: "4rem", borderBottom: "2px solid #22c55e" }}
        onClick={login}
      >
        Đăng nhập với Google
      </button>
    </div>
  );
};

export default login;
