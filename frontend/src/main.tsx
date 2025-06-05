import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import { ThemeProvider } from "./context/ThemeContext";
import { AppWrapper } from "./components/common/PageMeta";
import App from "./App";
import { CommentProvider } from "./components/comments/CommentContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CommentProvider>
      <ThemeProvider>
        <AppWrapper>
          <App />
        </AppWrapper>
      </ThemeProvider>
    </CommentProvider>
  </StrictMode>
);
