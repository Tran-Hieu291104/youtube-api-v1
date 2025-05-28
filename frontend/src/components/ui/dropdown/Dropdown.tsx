import { useEffect, useRef } from "react";

interface DropdownProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  isOpen,
  onClose,
  children,
  className = "",
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null); // Tham chiếu đến thẻ <div> của dropdown để kiểm tra xem click có nằm trong dropdown hay không
  // useRef trả về một đối tượng có thuộc tính current, mà bạn có thể gán cho phần tử DOM trong JSX

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && // Kiểm tra xem dropdownRef.current có tồn tại hay không
        !dropdownRef.current.contains(event.target as Node) && // Kiểm tra xem click có nằm trong dropdown hay không
        !(event.target as HTMLElement).closest(".dropdown-toggle") // Kiểm tra xem click có nằm trong phần tử kích hoạt dropdown hay không
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside); // Thêm sự kiện click vào document để kiểm tra xem click có nằm ngoài dropdown hay không
    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // Xóa sự kiện click khi component bị unmount
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className={`absolute z-40  right-0 mt-2  rounded-xl border border-gray-200 bg-white  shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark ${className}`}
    >
      {children}
    </div>
  );
};
