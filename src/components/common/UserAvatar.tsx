import { useMemo } from "react";

interface UserAvatarProps {
  fotoPerfil?: string | null;
  iniciales?: string;
  nombre?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-11 w-11 text-sm",
  lg: "h-16 w-16 text-lg",
  xl: "h-24 w-24 text-2xl",
};

export default function UserAvatar({
  fotoPerfil,
  iniciales = "U",
  nombre = "Usuario",
  size = "md",
  className = "",
}: UserAvatarProps) {
  const sizeClass = sizeClasses[size];

  // Memoizar para evitar re-renders innecesarios
  const avatarContent = useMemo(() => {
    if (fotoPerfil) {
      return (
        <div className={`overflow-hidden rounded-full ${sizeClass} ${className}`}>
          <img
            src={fotoPerfil}
            alt={nombre}
            className="object-cover w-full h-full"
            onError={(e) => {
              // Si la imagen falla al cargar, ocultar el img y mostrar iniciales
              e.currentTarget.style.display = "none";
              const parent = e.currentTarget.parentElement;
              if (parent) {
                parent.innerHTML = `
                  <div class="flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                    ${iniciales}
                  </div>
                `;
              }
            }}
          />
        </div>
      );
    }

    // Mostrar iniciales si no hay foto
    return (
      <div
        className={`flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold ${sizeClass} ${className}`}
        title={nombre}
      >
        {iniciales}
      </div>
    );
  }, [fotoPerfil, iniciales, nombre, size, className, sizeClass]);

  return avatarContent;
}
