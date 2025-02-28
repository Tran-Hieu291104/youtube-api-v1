import { Link } from "react-router-dom";
import Login from "../../components/login/Login";
import { useEffect } from "react";

const HomePage = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
      console.log("Received token:", token);
      localStorage.setItem("youtubeToken", token);
    }
  }, []);

  return (
    <section>
      {" "}
      {/* Thêm padding-top để tránh header */}
      <div style={{ width: "85%", margin: "0 auto", padding: "0 1rem" }}>
        <Login />
        <Link to="/videos" style={{ color: "red" }}>
          Lấy video
        </Link>
        <br />
        <Link to="/subs" style={{ color: "red" }}>
          Đăng ký
        </Link>
        <br />
        <Link to="/rate" style={{ color: "red" }}>
          Rate
        </Link>
        <br />
        <Link to="/cmt" style={{ color: "red" }}>
          Bình luận
        </Link>
        <br />
        <Link to="/playlist" style={{ color: "red" }}>
          Playlist
        </Link>
      </div>
    </section>
  );
};

export default HomePage;
