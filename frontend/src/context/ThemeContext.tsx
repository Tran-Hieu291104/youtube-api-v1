"use client";

import React, { useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = React.createContext<ThemeContextType | undefined>( // ThemeContextType là kiểu dữ liệu của context, có 2 thuộc tính: theme và toggleTheme
  undefined // Giá trị mặc định của context là undefined, có nghĩa là chưa có giá trị nào được cung cấp cho context
);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>("light");
  const [isInitialized, setIsInitialized] = useState(false); // Trạng thái để kiểm tra xem đã khởi tạo hay chưa
  // isInitialized được sử dụng để đảm bảo rằng theme đã được khởi tạo trước khi sử dụng nó trong component

  useEffect(() => {
    // giải thích: useEffect sẽ chạy sau khi component được render lần đầu tiên
    // This code will only run on the client side
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    const initialTheme = savedTheme || "light"; // Default to light theme

    setTheme(initialTheme);
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    // giải thích: useEffect sẽ chạy mỗi khi theme thay đổi
    if (isInitialized) {
      // Chỉ chạy khi đã khởi tạo
      localStorage.setItem("theme", theme);
      if (theme === "dark") {
        // Nếu theme là dark thì thêm class dark vào thẻ html
        document.documentElement.classList.add("dark");
      } else {
        // Nếu theme là light thì xóa class dark khỏi thẻ html
        document.documentElement.classList.remove("dark");
      }
    }
  }, [theme, isInitialized]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {" "}
      {/*  // ThemeContext.Provider là một component cung cấp giá trị cho context,
      giá trị này sẽ được sử dụng trong các component con */}
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  // useTheme là một hook tùy chỉnh để sử dụng context
  // useTheme sẽ trả về giá trị của context, nếu context là undefined thì sẽ ném ra lỗi
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
