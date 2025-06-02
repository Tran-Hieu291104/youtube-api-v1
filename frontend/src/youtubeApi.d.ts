export interface YouTubeVideo {
    kind: string;
    etag: string;
    id: string;
    snippet: {
      publishedAt: string;
      channelId: string;
      title: string;
      description: string;
      thumbnails: {
        default: {
          url: string;
          width: number;
          height: number;
        };
        medium: {
          url: string;
          width: number;
          height: number;
        };
        high: {
          url: string;
          width: number;
          height: number;
        };
      };
      channelTitle: string;
      tags: string[];
      categoryId: string;
      liveBroadcastContent: string;
      localized: {
        title: string;
        description: string;
      };
    };
    statistics: {
      viewCount: string;
      likeCount: string;
      dislikeCount: string;
      favoriteCount: string;
      commentCount: string;
    };
  }
  
export interface VideoStatistics {
  viewCount: string;
  likeCount: string;
  dislikeCount: string;
  favoriteCount: string;
  commentCount: string;
}

export interface YouTubePlaylist {
    kind: string;
    etag: string;
    id: string;
    snippet: {
      publishedAt: string;
      channelId: string;
      title: string;
      description: string;
      thumbnails: {
        default: {
          url: string;
          width: number;
          height: number;
        };
        medium: {
          url: string;
          width: number;
          height: number;
        };
        high: {
          url: string;
          width: number;
          height: number;
        };
      };
      channelTitle: string;
      localized: {
        title: string;
        description: string;
      };
    };
  }
  
export interface YouTubeApiResponse {
  kind: string;
  etag: string;
  nextPageToken?: string;
  prevPageToken?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: YouTubeVideo[];
}

// Interface cho thông tin snippet của một subscription
export interface SubscriptionSnippet {
  publishedAt: string; // Thời gian subscribe
  channelId: string; // ID của kênh được subscribe
  title: string; // Tiêu đề kênh
  description: string; // Mô tả kênh
  thumbnails: {
    default: {
      url: string;
      width: number;
      height: number;
    };
    medium: {
      url: string;
      width: number;
      height: number;
    };
    high: {
      url: string;
      width: number;
      height: number;
    };
  };
  channelTitle: string; // Tên kênh
  resourceId: {
    kind: string; // Thường là "youtube#channel"
    channelId: string; // ID của kênh (trùng với channelId ở trên)
  };
}

// Interface cho một subscription cụ thể
export interface YouTubeSubscription {
  kind: string; // Thường là "youtube#subscription"
  etag: string;
  id: string; // Subscription ID (dùng để DELETE subscription)
  snippet: SubscriptionSnippet;
}

// Interface cho toàn bộ phản hồi từ API
export interface YouTubeSubscriptionResponse {
  kind: string; // Thường là "youtube#subscriptionListResponse"
  etag: string;
  nextPageToken?: string; // Token để lấy trang tiếp theo (nếu có)
  prevPageToken?: string; // Token để lấy trang trước (nếu có)
  pageInfo: {
    totalResults: number; // Tổng số subscriptions
    resultsPerPage: number; // Số lượng kết quả mỗi trang
  };
  items: YouTubeSubscription[]; // Danh sách các subscriptions
}

export interface CommentThread {
  id: string;
  snippet: {
    topLevelComment: {
      snippet: {
        textDisplay: string;
        authorDisplayName: string;
      };
    };
  };
}

export interface Reply {
  id: string;
  snippet: {
    textDisplay: string;
    authorDisplayName: string;
    parentId: string;
  };
}

export interface PlaylistItem {
  id: string; // Đây là ID của playlist item
  snippet: {
    title: string;
    description: string;
    resourceId: {
      videoId: string; // ID của video, không dùng trong trường hợp này
    };
    thumbnails: {
      default: {
        url: string;
      };
    };
  };
}

interface VideoListItemProps {
  video: {
    title: string;
    videoId: string;
    publishedAt: string;
    views: number;
    thumbnailUrl: string;
  };
}