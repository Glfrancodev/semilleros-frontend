import { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode; // Texto o contenido del botón
  size?: "xs" | "sm" | "md"; // Tamaño del botón
  variant?: "primary" | "outline" | "danger" | "success" | "warning"; // Estilo del botón
  startIcon?: ReactNode; // Icono antes del texto
  endIcon?: ReactNode; // Icono después del texto
  className?: string; // Clases adicionales
}

const Button: React.FC<ButtonProps> = ({
  children,
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  onClick,
  className = "",
  disabled = false,
  type = "button", // ✅ valor por defecto
  ...props
}) => {
  // Clases de tamaño
  const sizeClasses = {
    xs: "px-3 py-2 text-sm",
    sm: "px-4 py-3 text-sm",
    md: "px-5 py-3.5 text-sm",
  };

  // Clases de variante
  const variantClasses = {
    primary:
      "bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 dark:bg-transparent dark:text-brand-400 dark:ring-1 dark:ring-inset dark:ring-brand-500 dark:hover:bg-brand-500/10 dark:shadow-none",
    outline:
      "bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300",
    danger:
      "bg-red-600 text-white shadow-theme-xs hover:bg-red-700 disabled:bg-red-300 dark:bg-transparent dark:text-red-400 dark:ring-1 dark:ring-inset dark:ring-red-600 dark:hover:bg-red-600/10 dark:shadow-none",
    success:
      "bg-green-600 text-white shadow-theme-xs hover:bg-green-700 disabled:bg-green-300 dark:bg-transparent dark:text-green-400 dark:ring-1 dark:ring-inset dark:ring-green-600 dark:hover:bg-green-600/10 dark:shadow-none",
    warning:
      "bg-yellow-600 text-white shadow-theme-xs hover:bg-yellow-700 disabled:bg-yellow-300 dark:bg-transparent dark:text-yellow-400 dark:ring-1 dark:ring-inset dark:ring-yellow-600 dark:hover:bg-yellow-600/10 dark:shadow-none",
  };

  return (
    <button
      type={type} // ✅ ahora acepta 'submit', 'button', etc.
      className={`inline-flex items-center justify-center gap-2 rounded-lg transition ${className} ${
        sizeClasses[size]
      } ${variantClasses[variant]} ${
        disabled ? "cursor-not-allowed opacity-50" : ""
      }`}
      onClick={onClick}
      disabled={disabled}
      {...props} // ✅ pasa el resto de props válidas del HTML
    >
      {startIcon && <span className="flex items-center">{startIcon}</span>}
      {children}
      {endIcon && <span className="flex items-center">{endIcon}</span>}
    </button>
  );
};

export default Button;
