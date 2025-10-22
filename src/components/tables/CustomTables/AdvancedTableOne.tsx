import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import { MoreDotIcon } from "../../../assets/icons";

interface User {
  id: number;
  name: string;
  image: string;
  role: string;
  roleIcon: string;
  status: "Active" | "Inactive";
  socialProfiles: string[];
  promoted: boolean;
  rating: number;
  ratingTrend: "up" | "down";
  lastLogin: string;
}

// Mock data basado en la imagen
const usersData: User[] = [
  {
    id: 1,
    name: "Jese Leos",
    image: "/images/user/user-17.jpg",
    role: "Administrator",
    roleIcon: "👤",
    status: "Active",
    socialProfiles: ["facebook", "dribbble", "twitter", "github"],
    promoted: false,
    rating: 4.7,
    ratingTrend: "up",
    lastLogin: "20 Nov 2022",
  },
  {
    id: 2,
    name: "Bonnie Green",
    image: "/images/user/user-18.jpg",
    role: "Viewer",
    roleIcon: "👁️",
    status: "Active",
    socialProfiles: ["facebook", "dribbble", "twitter", "github"],
    promoted: true,
    rating: 3.9,
    ratingTrend: "down",
    lastLogin: "23 Nov 2022",
  },
  {
    id: 3,
    name: "Leslie Livingston",
    image: "/images/user/user-19.jpg",
    role: "Moderator",
    roleIcon: "⚡",
    status: "Inactive",
    socialProfiles: ["facebook", "dribbble", "twitter"],
    promoted: false,
    rating: 4.8,
    ratingTrend: "up",
    lastLogin: "19 Nov 2022",
  },
  {
    id: 4,
    name: "Micheal Gough",
    image: "/images/user/user-20.jpg",
    role: "Moderator",
    roleIcon: "⚡",
    status: "Active",
    socialProfiles: ["facebook", "dribbble", "twitter", "github"],
    promoted: true,
    rating: 5.0,
    ratingTrend: "up",
    lastLogin: "27 Nov 2022",
  },
  {
    id: 5,
    name: "Joseph McFall",
    image: "/images/user/user-21.jpg",
    role: "Viewer",
    roleIcon: "👁️",
    status: "Active",
    socialProfiles: ["facebook", "dribbble", "twitter", "github"],
    promoted: false,
    rating: 4.2,
    ratingTrend: "up",
    lastLogin: "20 Nov 2022",
  },
  {
    id: 6,
    name: "Robert Brown",
    image: "/images/user/user-22.jpg",
    role: "Viewer",
    roleIcon: "👁️",
    status: "Inactive",
    socialProfiles: ["facebook", "dribbble", "twitter"],
    promoted: false,
    rating: 4.5,
    ratingTrend: "up",
    lastLogin: "20 Nov 2022",
  },
  {
    id: 7,
    name: "Karen Nelson",
    image: "/images/user/user-23.jpg",
    role: "Viewer",
    roleIcon: "👁️",
    status: "Inactive",
    socialProfiles: ["facebook", "dribbble", "twitter", "github"],
    promoted: false,
    rating: 4.1,
    ratingTrend: "up",
    lastLogin: "18 Nov 2022",
  },
  {
    id: 8,
    name: "Helene Engels",
    image: "/images/user/user-24.jpg",
    role: "Moderator",
    roleIcon: "⚡",
    status: "Active",
    socialProfiles: ["facebook", "dribbble", "twitter", "github"],
    promoted: true,
    rating: 3.8,
    ratingTrend: "down",
    lastLogin: "27 Nov 2022",
  },
  {
    id: 9,
    name: "Lana Byrd",
    image: "/images/user/user-25.jpg",
    role: "Viewer",
    roleIcon: "👁️",
    status: "Active",
    socialProfiles: ["facebook", "dribbble"],
    promoted: false,
    rating: 4.6,
    ratingTrend: "up",
    lastLogin: "20 Nov 2022",
  },
  {
    id: 10,
    name: "Neil Sims",
    image: "/images/user/user-26.jpg",
    role: "Moderator",
    roleIcon: "⚡",
    status: "Inactive",
    socialProfiles: ["facebook", "dribbble", "twitter", "github"],
    promoted: false,
    rating: 5.0,
    ratingTrend: "up",
    lastLogin: "20 Nov 2022",
  },
];

export default function AdvancedTableOne() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {/* Header con estadísticas y acciones */}
      <div className="flex flex-col gap-4 p-4 border-b border-gray-100 sm:flex-row sm:items-center sm:justify-between dark:border-white/[0.05]">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">All Users:</span>
            <span className="font-semibold text-gray-900 dark:text-white">1,356,546</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Projects:</span>
            <span className="font-semibold text-gray-900 dark:text-white">884</span>
          </div>
        </div>
        <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-white/[0.1] dark:text-gray-300 dark:hover:bg-white/[0.05]">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Table settings
        </button>
      </div>

      {/* Botones de acción */}
      <div className="flex flex-wrap gap-2 p-4 border-b border-gray-100 dark:border-white/[0.05]">
        <button className="px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700">
          + Add new user
        </button>
        <button className="px-4 py-2 text-sm font-medium text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-white/[0.1] dark:text-gray-300 dark:hover:bg-white/[0.05]">
          Suspend all
        </button>
        <button className="px-4 py-2 text-sm font-medium text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-white/[0.1] dark:text-gray-300 dark:hover:bg-white/[0.05]">
          Archive all
        </button>
        <button className="px-4 py-2 text-sm font-medium text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700">
          Delete all
        </button>
      </div>

      {/* Tabla */}
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                USER
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                USER ROLE
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                STATUS
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                SOCIAL PROFILE
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                PROMOTE
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                RATING
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                LAST LOGIN
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                ACTIONS
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {usersData.map((user) => (
              <TableRow key={user.id}>
                {/* USER */}
                <TableCell className="px-5 py-4 text-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 overflow-hidden rounded-full">
                      <img
                        width={40}
                        height={40}
                        src={user.image}
                        alt={user.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {user.name}
                    </span>
                  </div>
                </TableCell>

                {/* USER ROLE */}
                <TableCell className="px-5 py-4 text-start">
                  <Badge
                    size="sm"
                    color={
                      user.role === "Administrator"
                        ? "primary"
                        : user.role === "Moderator"
                        ? "warning"
                        : "light"
                    }
                  >
                    <span className="mr-1">{user.roleIcon}</span>
                    {user.role}
                  </Badge>
                </TableCell>

                {/* STATUS */}
                <TableCell className="px-5 py-4 text-start">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        user.status === "Active"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {user.status}
                    </span>
                  </div>
                </TableCell>

                {/* SOCIAL PROFILE */}
                <TableCell className="px-5 py-4 text-start">
                  <div className="flex items-center gap-2">
                    {user.socialProfiles.slice(0, 4).map((platform, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-center w-6 h-6 text-gray-600 transition-colors rounded hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/[0.05]"
                      >
                        {platform === "facebook" && "f"}
                        {platform === "dribbble" && "○"}
                        {platform === "twitter" && "🐦"}
                        {platform === "github" && "G"}
                      </div>
                    ))}
                    {user.socialProfiles.length > 4 && (
                      <span className="text-xs text-gray-500">
                        +{user.socialProfiles.length - 4}
                      </span>
                    )}
                  </div>
                </TableCell>

                {/* PROMOTE */}
                <TableCell className="px-5 py-4 text-start">
                  <button
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      user.promoted
                        ? "bg-blue-600"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        user.promoted ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </TableCell>

                {/* RATING */}
                <TableCell className="px-5 py-4 text-start">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm ${
                        user.ratingTrend === "up"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {user.ratingTrend === "up" ? "↑" : "↓"}
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.rating}
                    </span>
                  </div>
                </TableCell>

                {/* LAST LOGIN */}
                <TableCell className="px-5 py-4 text-start">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {user.lastLogin}
                  </span>
                </TableCell>

                {/* ACTIONS */}
                <TableCell className="px-5 py-4 text-start">
                  <button className="text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                    <MoreDotIcon />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      <div className="flex flex-col items-center justify-between gap-4 p-4 border-t border-gray-100 sm:flex-row dark:border-white/[0.05]">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Rows per page:</span>
          <select className="px-3 py-1 text-sm border border-gray-300 rounded-lg dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-white">
            <option>10</option>
            <option>25</option>
            <option>50</option>
            <option>100</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">1-10 of 100</span>
        </div>

        <div className="flex items-center gap-1">
          <button className="px-3 py-1 text-sm text-gray-600 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-white/[0.1] dark:text-gray-400 dark:hover:bg-white/[0.05]">
            &lt;
          </button>
          <button className="px-3 py-1 text-sm text-white bg-blue-600 border border-blue-600 rounded-lg">
            1
          </button>
          <button className="px-3 py-1 text-sm text-gray-600 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-white/[0.1] dark:text-gray-400 dark:hover:bg-white/[0.05]">
            2
          </button>
          <button className="px-3 py-1 text-sm text-gray-600 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-white/[0.1] dark:text-gray-400 dark:hover:bg-white/[0.05]">
            3
          </button>
          <span className="px-2 text-sm text-gray-600 dark:text-gray-400">...</span>
          <button className="px-3 py-1 text-sm text-gray-600 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-white/[0.1] dark:text-gray-400 dark:hover:bg-white/[0.05]">
            100
          </button>
          <button className="px-3 py-1 text-sm text-gray-600 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-white/[0.1] dark:text-gray-400 dark:hover:bg-white/[0.05]">
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
