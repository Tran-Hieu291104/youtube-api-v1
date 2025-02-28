import CreatePlaylist from "../../components/createPlaylist/CreatePlaylist";
import DeleteVideoPlaylist from "../../components/deleteVideoPlaylist/DeleteVideoPlaylist";
import EditPlaylist from "../../components/editPlaylist/EditPlaylist";
import GetVideoPlaylist from "../../components/getVideoPlaylist/GetVideoPlaylist";

const PlaylistPage = () => {
  return (
    <section>
      <div
        style={{
          width: "85%",
          margin: "0 auto",
          padding: "0 1rem",
          marginTop: "4rem",
        }}
      >
        <CreatePlaylist />
        <EditPlaylist />
        <GetVideoPlaylist />
        <DeleteVideoPlaylist />
      </div>
    </section>
  );
};

export default PlaylistPage;
