import { Link } from "react-router-dom";

interface DropdownItemProps {
  tag?: "a" | "button";
  to?: string;
  onClick?: () => void;
  onItemClick?: () => void;
  baseClassName?: string;
  className?: string;
  children: React.ReactNode;
}

export const DropdownItem: React.FC<DropdownItemProps> = ({
  tag = "button",
  to, // Đường dẫn đến trang mà bạn muốn chuyển đến khi nhấn vào item
  onClick,
  onItemClick,
  baseClassName = "block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900",
  className = "",
  children,
}) => {
  const combinedClasses = `${baseClassName} ${className}`.trim(); // Kết hợp các className với nhau
  // Sử dụng trim() để loại bỏ khoảng trắng thừa ở đầu và cuối chuỗi

  const handleClick = (event: React.MouseEvent) => {
    if (tag === "button") {
      event.preventDefault(); // Ngăn chặn hành vi mặc định của button
    }
    if (onClick) onClick(); // Gọi hàm onClick nếu có
    if (onItemClick) onItemClick(); // Gọi hàm onItemClick nếu có
  };

  if (tag == "a" && to) {
    return (
      <Link to={to} className={combinedClasses} onClick={handleClick}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} onClick={handleClick}>
      {children}
    </button>
  );
};
