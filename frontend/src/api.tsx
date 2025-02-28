import { YouTubeApiResponse } from "./youtubeApi";
import axios from "axios";

export const fetchYoutubeVideos = async () => {
  try {
    const response = await axios.get<YouTubeApiResponse>(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          key: "AIzaSyBvWZh5f2wzYyUCHD5UJ1_5NkvwHdVEMQE",
          channelId: "UC8YW6FO4bJzh8IKJl3PtZqw",
          part: "snippet,id",
          order: "date",
          maxResults: 10,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
    throw error;
  }
};

export const subscribeToChannel = async (channelId: string) => {
  const token = localStorage.getItem("youtubeToken");
  if (!token) throw new Error("No access token found");

  const response = await axios.post(
    "https://www.googleapis.com/youtube/v3/subscriptions?part=snippet",
    {
      snippet: {
        resourceId: {
          channelId: channelId,
        },
      },
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const unsubscribe = async (channelId: string) => {
  const token = localStorage.getItem("youtubeToken");
  if (!token) throw new Error("No access token found");

  const response = await axios.delete(
    `https://www.googleapis.com/youtube/v3/subscriptions?id=${channelId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const getSubscribe = async () => {
  const token = localStorage.getItem("youtubeToken");
  if (!token) throw new Error("No access token found");

  try {
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/subscriptions?part=snippet&mine=true",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = response.data; // axios đã parse JSON vào response.data
    return data.items || []; // Trả về mảng rỗng nếu không có items
  } catch (error: any) {
    if (error.response) {
      throw new Error(
        `API error: ${error.response.status} - ${error.response.data.error.message}`
      );
    } else {
      throw new Error("Network error or invalid request");
    }
  }
};

export const rate = async (id: string, rating: string): Promise<void> => {
  const token = localStorage.getItem("youtubeToken");
  console.log("Token from localStorage:", token); // Kiểm tra token
  if (!token) throw new Error("No access token found");

  try {
    await axios.post(
      `https://www.googleapis.com/youtube/v3/videos/rate?id=${id}&rating=${rating}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error: any) {
    if (error.response) {
      throw new Error(
        `API error: ${error.response.status} - ${error.response.data.error.message}`
      );
    } else {
      throw new Error("Network error or invalid request");
    }
  }
};

export const postComment = async (videoId: string, text: string) => {
  const token = localStorage.getItem("youtubeToken");
  if (!token) throw new Error("No access token found");
  console.log("Token being sent:", token);

  const commentData = {
    snippet: {
      topLevelComment: {
        snippet: {
          textOriginal: text,
        },
      },
      videoId: videoId,
    },
  };

  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    console.log("Request config:", config); // Log headers trước khi gửi
    const response = await axios.post(
      "https://www.googleapis.com/youtube/v3/commentThreads?part=id,snippet",
      commentData,
      config
    );
    console.log("Response data:", response.data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Full error response:", error.response.data); // Log chi tiết lỗi
      throw new Error(
        `API error: ${error.response.status} - ${error.response.data.error.message}`
      );
    } else {
      throw new Error("Network error or invalid request");
    }
  }
};

export const getCommentThreads = async (videoId: string) => {
  try {
    const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/commentThreads?part=id,replies,snippet&videoId=${videoId}&key=${API_KEY}`
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(
        `API error: ${error.response.status} - ${error.response.data.error.message}`
      );
    } else {
      throw new Error("Lỗi mạng hoặc yêu cầu không hợp lệ");
    }
  }
};

export const replyComment = async (parentId: string, text: string) => {
  const token = localStorage.getItem("youtubeToken");
  if (!token) throw new Error("No access token found");
  console.log("Token being sent:", token);

  const commentData = {
    snippet: {
      textOriginal: text,
      parentId: parentId,
    },
  };

  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    console.log("Request config:", config);
    const response = await axios.post(
      "https://www.googleapis.com/youtube/v3/comments?part=id,snippet",
      commentData,
      config
    );
    console.log("Response data:", response.data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Full error response:", error.response.data);
      throw new Error(
        `API error: ${error.response.status} - ${error.response.data.error.message}`
      );
    } else {
      throw new Error("Network error or invalid request");
    }
  }
};

export const getComment = async (idComment: string) => {
  const token = localStorage.getItem("youtubeToken");
  if (!token) throw new Error("No access token found");

  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/comments?part=snippet&parentId=${idComment}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(
        `API error: ${error.response.status} - ${error.response.data.error.message}`
      );
    } else {
      throw new Error("Lỗi mạng hoặc yêu cầu không hợp lệ");
    }
  }
};

export const editComment = async (newComment: string, id: string) => {
  const token = localStorage.getItem("youtubeToken");
  if (!token) throw new Error("No access token found");

  const commentData = {
    id: id,
    snippet: {
      textOriginal: newComment,
    },
  };

  try {
    const response = await axios.put(
      "https://www.googleapis.com/youtube/v3/comments?part=id,snippet",
      commentData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Edit comment response:", response.data);
    return response.data; // Trả về dữ liệu bình luận đã chỉnh sửa
  } catch (error: any) {
    if (error.response) {
      console.error("Full error response:", error.response.data);
      throw new Error(
        `API error: ${error.response.status} - ${error.response.data.error.message}`
      );
    } else {
      throw new Error("Network error or invalid request");
    }
  }
};

export const deleteComment = async (id: string): Promise<void> => {
  const token = localStorage.getItem("youtubeToken");
  if (!token) throw new Error("No access token found");

  try {
    await axios.delete(
      `https://www.googleapis.com/youtube/v3/comments?id=${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: any) {
    if (error.response) {
      console.error("Full error response:", error.response.data);
      throw new Error(
        `API error: ${error.response.status} - ${error.response.data.error.message}`
      );
    } else {
      throw new Error("Network error or invalid request");
    }
  }
};

export const createPlaylist = async (title: string, description: string) => {
  const token = localStorage.getItem("youtubeToken");
  if (!token) throw new Error("No access token found");

  const playlistData = {
    snippet: {
      title: title,
      description: description,
    },
  };

  try {
    const response = await axios.post(
      "https://www.googleapis.com/youtube/v3/playlists?part=snippet",
      playlistData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Create playlist response:", response.data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Full error response:", error.response.data);
      throw new Error(
        `API error: ${error.response.status} - ${error.response.data.error.message}`
      );
    } else {
      throw new Error("Network error or invalid request");
    }
  }
};

export const editPlaylist = async (playlistId: string, videoId: string) => {
  const token = localStorage.getItem("youtubeToken");
  if (!token) throw new Error("No access token found");

  const playlistData = {
    snippet: {
      playlistId: playlistId,
      position: 0,
      resourceId: {
        kind: "youtube#video",
        videoId: videoId,
      },
    },
  };

  try {
    const response = await axios.post(
      "https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails,id,snippet,status",
      playlistData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Create playlist response:", response.data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Full error response:", error.response.data);
      throw new Error(
        `API error: ${error.response.status} - ${error.response.data.error.message}`
      );
    } else {
      throw new Error("Network error or invalid request");
    }
  }
};

export const getVideosOfPlaylist = async (id: string) => {
  const token = localStorage.getItem("youtubeToken");
  if (!token) throw new Error("No access token found");

  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails,id,snippet,status&playlistId=${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Full error response:", error.response.data);
      throw new Error(
        `API error: ${error.response.status} - ${error.response.data.error.message}`
      );
    } else {
      throw new Error("Network error or invalid request");
    }
  }
};

export const deleteVideoPlaylist = async (id: string): Promise<void> => {
  const token = localStorage.getItem("youtubeToken");
  if (!token) throw new Error("No access token found");

  try {
    await axios.delete(
      `https://www.googleapis.com/youtube/v3/playlistItems?id=${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: any) {
    if (error.response) {
      console.error("Full error response:", error.response.data);
      throw new Error(
        `API error: ${error.response.status} - ${error.response.data.error.message}`
      );
    } else {
      throw new Error("Network error or invalid request");
    }
  }
};
