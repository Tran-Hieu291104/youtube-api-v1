import { BrowserRouter as Router, Routes, Route } from "react-router";
import AppLayout from "./layout/AppLayout";

import { ScrollToTop } from "./components/common/ScrollToTop";
import SignIn from "./pages/authPages/SignIn";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Home from "./pages/dashBoard/Home";
import VideosPage from "./pages/video/VideosPage";
import PlaylistsPage from "./pages/playListsPage/PlaylistsPage";
import ChannelsPage from "./pages/channelsPage/ChannelsPage";
import SubscriptionsPage from "./pages/subscriptions/SubscriptionsPage";

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />

            <Route path="/videos" element={<VideosPage />} />

            <Route path="/playlists" element={<PlaylistsPage />} />

            <Route path="/channels" element={<ChannelsPage />} />

            <Route path="/subscriptions" element={<SubscriptionsPage />} />

            {/* <Route path="/add-book" element={<AddBook />} />
            <Route path="/add-audio-book" element={<AddAudioBook />} />
            <Route path="/books" element={<Books />} />

            <Route path="/users" element={<User />} />
            <Route path="/content-moderation" element={<ContentModeration />} />

            <Route path="/analytics" element={<Analytics />} />
            <Route path="/payment-and-logs" element={<PaymentAndLogs />} /> */}
          </Route>
        </Route>

        <Route path="/signin" element={<SignIn />} />
        {/* <Route path="/reset-password" element={<ResetPassword />} /> */}
      </Routes>
    </Router>
  );
}
