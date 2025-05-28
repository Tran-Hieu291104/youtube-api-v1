import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";

interface LabelProps {
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}

const Label: React.FC<LabelProps> = ({ htmlFor, children, className }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={clsx(
        // clsx là một thư viện giúp kết hợp các className lại với nhau
        twMerge(
          // twMerge là một hàm giúp kết hợp các className lại với nhau và loại bỏ các className trùng lặp
          "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400",
          className
        )
      )}
    >
      {children}
    </label>
  );
};
export default Label;
