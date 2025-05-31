import { YouTubeApiResponse } from "./youtubeApi";
import axios from "axios";

// export const fetchYoutubeVideos = async () => {
//   try {
//     const response = await axios.get<YouTubeApiResponse>(
//       "https://www.googleapis.com/youtube/v3/search",
//       {
//         params: {
//           key: "AIzaSyBvWZh5f2wzYyUCHD5UJ1_5NkvwHdVEMQE",
//           channelId: "UC8YW6FO4bJzh8IKJl3PtZqw",
//           part: "snippet,id",
//           order: "date",
//           maxResults: 10,
//         },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching YouTube videos:", error);
//     throw error;
//   }
// };

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
  const token = checkToken();
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
    console.log("Request config:", config);
    const response = await axios.post(
      "https://www.googleapis.com/youtube/v3/commentThreads?part=id,snippet",
      commentData,
      config
    );
    console.log("Response data:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Comment post error:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.error?.message || "Failed to post comment"
    );
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
  const token = checkToken();
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
  const token = checkToken();

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
  const token = checkToken();

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

// Playlists API
export const fetchPlaylists = async (channelId: string, pageToken?: string) => {
  try {
    const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/playlists",
      {
        params: {
          key: API_KEY,
          channelId,
          part: "id,snippet,contentDetails",
          maxResults: 10,
          pageToken,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const insertPlaylist = async (title: string, description: string) => {
  const token = checkToken();
  try {
    const playlistData = {
      snippet: {
        title,
        description,
      },
      status: {
        privacyStatus: "private",
      },
    };
    const response = await axios.post(
      "https://www.googleapis.com/youtube/v3/playlists?part=snippet,status",
      playlistData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updatePlaylist = async (
  playlistId: string,
  title: string,
  description: string
) => {
  const token = checkToken();
  try {
    const playlistData = {
      id: playlistId,
      snippet: {
        title,
        description,
      },
    };
    const response = await axios.put(
      "https://www.googleapis.com/youtube/v3/playlists?part=snippet",
      playlistData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deletePlaylist = async (playlistId: string) => {
  const token = checkToken();
  try {
    await axios.delete(
      `https://www.googleapis.com/youtube/v3/playlists?id=${playlistId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    throw handleApiError(error);
  }
};

// PlaylistItems API
export const fetchPlaylistItems = async (
  playlistId: string,
  pageToken?: string
) => {
  try {
    const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/playlistItems",
      {
        params: {
          key: API_KEY,
          playlistId,
          part: "id,snippet,contentDetails",
          maxResults: 10,
          pageToken,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const insertPlaylistItem = async (
  playlistId: string,
  videoId: string
) => {
  const token = checkToken();
  try {
    const itemData = {
      snippet: {
        playlistId,
        resourceId: {
          kind: "youtube#video",
          videoId,
        },
      },
    };
    const response = await axios.post(
      "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet",
      itemData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updatePlaylistItem = async (
  itemId: string,
  playlistId: string,
  videoId: string,
  position: number
) => {
  const token = checkToken();
  try {
    const itemData = {
      id: itemId,
      snippet: {
        playlistId,
        position,
        resourceId: {
          kind: "youtube#video",
          videoId,
        },
      },
    };
    const response = await axios.put(
      "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet",
      itemData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deletePlaylistItem = async (itemId: string) => {
  const token = checkToken();
  try {
    await axios.delete(
      `https://www.googleapis.com/youtube/v3/playlistItems?id=${itemId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    throw handleApiError(error);
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

const handleApiError = (error: any) => {
  if (error.response) {
    if (error.response.status === 401) {
      localStorage.removeItem("youtubeToken");
      localStorage.removeItem("userEmail");
      window.location.href = "/signin";
      throw new Error("Authentication failed. Redirecting to sign-in...");
    }
    console.error("API error details:", error.response.data);
    throw new Error(
      `API error: ${error.response.status} - ${
        error.response.data.error?.message || "Unknown error"
      }`
    );
  } else {
    console.error("Network error:", error.message);
    throw new Error("Network error or invalid request: " + error.message);
  }
};

const checkToken = () => {
  const token = localStorage.getItem("youtubeToken");
  if (!token) {
    window.location.href = "/signin";
    throw new Error("No access token found. Redirecting to sign-in...");
  }
  return token;
};

// Hàm đã có từ trước (giữ nguyên)
export const fetchYoutubeVideos = async (
  channelId: string,
  pageToken?: string
) => {
  try {
    const response = await axios.get<YouTubeApiResponse>(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          key: import.meta.env.VITE_YOUTUBE_API_KEY,
          channelId,
          part: "snippet,id",
          order: "date",
          maxResults: 10,
          pageToken,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Lấy thông tin chi tiết video theo ID (list với bộ lọc)
export const getVideoDetails = async (videoIds: string[]) => {
  const token = localStorage.getItem("youtubeToken");
  try {
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/videos",
      {
        params: {
          key: import.meta.env.VITE_YOUTUBE_API_KEY,
          id: videoIds.join(","),
          part: "snippet,statistics",
        },
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );
    return response.data.items;
  } catch (error) {
    handleApiError(error);
  }
};

export const uploadVideo = async (
  title: string,
  description: string,
  tags: string[],
  file: File
) => {
  const token = checkToken();

  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("tags", tags.join(",")); // Gửi tags dưới dạng string
    formData.append("video", file);

    console.log("Sending FormData:", {
      title,
      description,
      tags,
      file: file.name,
    });

    const response = await axios.post(
      "http://localhost:3001/api/video/upload",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          console.log(`Upload Progress: ${percentCompleted}%`);
        },
      }
    );

    console.log("Upload response:", response.data);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
// Cập nhật video (update)
export const updateVideo = async (
  videoId: string,
  title: string,
  description: string,
  tags: string[]
) => {
  const token = localStorage.getItem("youtubeToken");
  if (!token) throw new Error("No access token found");

  const data = {
    id: videoId,
    snippet: {
      title,
      description,
      tags,
      categoryId: "22", // Giả định category "People & Blogs"
    },
  };

  try {
    const response = await axios.put(
      "https://www.googleapis.com/youtube/v3/videos?part=snippet",
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Xóa video (delete)
export const deleteVideo = async (videoId: string) => {
  const token = localStorage.getItem("youtubeToken");
  if (!token) throw new Error("No access token found");

  try {
    await axios.delete(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    handleApiError(error);
  }
};

// Đánh giá video (rate)
export const rateVideo = async (
  videoId: string,
  rating: "like" | "dislike" | "none"
) => {
  const token = localStorage.getItem("youtubeToken");
  if (!token) throw new Error("No access token found");

  try {
    await axios.post(
      `https://www.googleapis.com/youtube/v3/videos/rate?id=${videoId}&rating=${rating}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    handleApiError(error);
  }
};

// Lấy đánh giá video (getRating)
export const getVideoRating = async (videoId: string) => {
  const token = localStorage.getItem("youtubeToken");
  if (!token) throw new Error("No access token found");

  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos/getRating?id=${videoId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.items[0].rating;
  } catch (error) {
    handleApiError(error);
  }
};

// Báo cáo vi phạm (reportAbuse)
export const reportVideoAbuse = async (videoId: string, reason: string) => {
  const token = localStorage.getItem("youtubeToken");
  if (!token) throw new Error("No access token found");

  const data = {
    videoId,
    reasonId: reason, // Ví dụ: "spam", "violence", "harmful"
    comments: "Reported via API",
  };

  try {
    await axios.post(
      "https://www.googleapis.com/youtube/v3/videos/reportAbuse",
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    handleApiError(error);
  }
};

export const checkChannelOwnership = async (channelId: string) => {
  const token = localStorage.getItem("youtubeToken");
  if (!token) {
    console.log("No token found");
    return false;
  }

  try {
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/channels",
      {
        params: {
          key: import.meta.env.VITE_YOUTUBE_API_KEY,
          part: "snippet",
          mine: true, // Dùng mine=true
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Channel ownership response:", response.data);
    return response.data.items.some((item: any) => item.id === channelId);
  } catch (error: any) {
    console.error(
      "Error checking channel ownership:",
      error.response?.data || error.message
    );
    return false;
  }
};
