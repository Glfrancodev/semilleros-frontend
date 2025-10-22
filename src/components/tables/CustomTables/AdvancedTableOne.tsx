import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import Button from "../../ui/button/Button";
import { MoreDotIcon } from "../../../assets/icons";
import { useState } from "react";
import CustomSelect from "../../common/CustomSelect";

export interface User {
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

interface AdvancedTableOneProps {
  data: User[];
  totalUsers?: number;
  totalProjects?: number;
}

export default function AdvancedTableOne({ 
  data, 
  totalUsers = 1356546, 
  totalProjects = 884 
}: AdvancedTableOneProps) {
  const [openSocialDropdown, setOpenSocialDropdown] = useState<number | null>(null);
  const [openActionsDropdown, setOpenActionsDropdown] = useState<number | null>(null);
  const [rowsPerPage, setRowsPerPage] = useState<string>("10");

  const rowsPerPageOptions = [
    { value: "10", label: "10" },
    { value: "25", label: "25" },
    { value: "50", label: "50" },
    { value: "100", label: "100" },
  ];

  const toggleSocialDropdown = (userId: number) => {
    setOpenSocialDropdown(openSocialDropdown === userId ? null : userId);
  };

  const toggleActionsDropdown = (userId: number) => {
    setOpenActionsDropdown(openActionsDropdown === userId ? null : userId);
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case "instagram":
        return (
          <svg className="fill-current" width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.8567 1.66699C11.7946 1.66854 12.2698 1.67351 12.6805 1.68573L12.8422 1.69102C13.0291 1.69766 13.2134 1.70599 13.4357 1.71641C14.3224 1.75738 14.9273 1.89766 15.4586 2.10391C16.0078 2.31572 16.4717 2.60183 16.9349 3.06503C17.3974 3.52822 17.6836 3.99349 17.8961 4.54141C18.1016 5.07197 18.2419 5.67753 18.2836 6.56433C18.2935 6.78655 18.3015 6.97088 18.3081 7.15775L18.3133 7.31949C18.3255 7.73011 18.3311 8.20543 18.3328 9.1433L18.3335 9.76463C18.3336 9.84055 18.3336 9.91888 18.3336 9.99972L18.3335 10.2348L18.333 10.8562C18.3314 11.794 18.3265 12.2694 18.3142 12.68L18.3089 12.8417C18.3023 13.0286 18.294 13.213 18.2836 13.4351C18.2426 14.322 18.1016 14.9268 17.8961 15.458C17.6842 16.0074 17.3974 16.4713 16.9349 16.9345C16.4717 17.397 16.0057 17.6831 15.4586 17.8955C14.9273 18.1011 14.3224 18.2414 13.4357 18.2831C13.2134 18.293 13.0291 18.3011 12.8422 18.3076L12.6805 18.3128C12.2698 18.3251 11.7946 18.3306 10.8567 18.3324L10.2353 18.333C10.1594 18.333 10.0811 18.333 10.0002 18.333H9.76516L9.14375 18.3325C8.20591 18.331 7.7306 18.326 7.31997 18.3137L7.15824 18.3085C6.97136 18.3018 6.78703 18.2935 6.56481 18.2831C5.67801 18.2421 5.07384 18.1011 4.5419 17.8955C3.99328 17.6838 3.5287 17.397 3.06551 16.9345C2.60231 16.4713 2.3169 16.0053 2.1044 15.458C1.89815 14.9268 1.75856 14.322 1.7169 13.4351C1.707 13.213 1.69892 13.0286 1.69238 12.8417L1.68714 12.68C1.67495 12.2694 1.66939 11.794 1.66759 10.8562L1.66748 9.1433C1.66903 8.20543 1.67399 7.73011 1.68621 7.31949L1.69151 7.15775C1.69815 6.97088 1.70648 6.78655 1.7169 6.56433C1.75786 5.67683 1.89815 5.07266 2.1044 4.54141C2.3162 3.9928 2.60231 3.52822 3.06551 3.06503C3.5287 2.60183 3.99398 2.31641 4.5419 2.10391C5.07315 1.89766 5.67731 1.75808 6.56481 1.71641C6.78703 1.70652 6.97136 1.69844 7.15824 1.6919L7.31997 1.68666C7.7306 1.67446 8.20591 1.6689 9.14375 1.6671L10.8567 1.66699ZM10.0002 5.83308C7.69781 5.83308 5.83356 7.69935 5.83356 9.99972C5.83356 12.3021 7.69984 14.1664 10.0002 14.1664C12.3027 14.1664 14.1669 12.3001 14.1669 9.99972C14.1669 7.69732 12.3006 5.83308 10.0002 5.83308ZM10.0002 7.49974C11.381 7.49974 12.5002 8.61863 12.5002 9.99972C12.5002 11.3805 11.3813 12.4997 10.0002 12.4997C8.6195 12.4997 7.50023 11.3809 7.50023 9.99972C7.50023 8.61897 8.61908 7.49974 10.0002 7.49974ZM14.3752 4.58308C13.8008 4.58308 13.3336 5.04967 13.3336 5.62403C13.3336 6.19841 13.8002 6.66572 14.3752 6.66572C14.9496 6.66572 15.4169 6.19913 15.4169 5.62403C15.4169 5.04967 14.9488 4.58236 14.3752 4.58308Z" />
          </svg>
        );
      case "linkedin":
        return (
          <svg className="fill-current" width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.78381 4.16645C5.78351 4.84504 5.37181 5.45569 4.74286 5.71045C4.11391 5.96521 3.39331 5.81321 2.92083 5.32613C2.44836 4.83904 2.31837 4.11413 2.59216 3.49323C2.86596 2.87233 3.48886 2.47942 4.16715 2.49978C5.06804 2.52682 5.78422 3.26515 5.78381 4.16645ZM5.83381 7.06645H2.50048V17.4998H5.83381V7.06645ZM11.1005 7.06645H7.78381V17.4998H11.0672V12.0248C11.0672 8.97475 15.0422 8.69142 15.0422 12.0248V17.4998H18.3338V10.8914C18.3338 5.74978 12.4505 5.94145 11.0672 8.46642L11.1005 7.06645Z" />
          </svg>
        );
      case "github":
        return (
          <svg className="fill-current" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.866-.013-1.7-2.782.605-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.833.091-.647.35-1.088.636-1.339-2.22-.253-4.555-1.112-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.269 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.026 2.748-1.026.546 1.378.203 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.31.679.92.679 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.481A10.019 10.019 0 0 0 22 12.017C22 6.484 17.523 2 12 2Z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {/* Header con estadísticas y acciones */}
      <div className="flex flex-col gap-4 p-4 border-b border-gray-100 sm:flex-row sm:items-center sm:justify-between dark:border-white/[0.05]">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">All Users:</span>
            <span className="font-semibold text-gray-900 dark:text-white">{totalUsers.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Projects:</span>
            <span className="font-semibold text-gray-900 dark:text-white">{totalProjects.toLocaleString()}</span>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="xs"
          startIcon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        >
          Table settings
        </Button>
      </div>

      {/* Botones de acción */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-4 border-b border-gray-100 dark:border-white/[0.05]">
        {/* Botón principal a la izquierda */}
        <Button variant="primary" size="xs">
          + Add new user
        </Button>
        
        {/* Botones secundarios a la derecha */}
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="xs">
            Suspend all
          </Button>
          <Button variant="outline" size="xs">
            Archive all
          </Button>
          <Button variant="danger" size="xs">
            Delete all
          </Button>
        </div>
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
            {data.map((user) => (
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
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      user.status === "Active"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    {user.status === "Active" ? "Activo" : "Inactivo"}
                  </span>
                </TableCell>

                {/* SOCIAL PROFILE */}
                <TableCell className="px-5 py-4 text-start">
                  <div className="relative flex items-center gap-2">
                    {/* Mostrar solo la primera red social */}
                    {user.socialProfiles.length > 0 && (
                      <>
                        <a
                          href="#"
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                          aria-label={user.socialProfiles[0]}
                        >
                          {getSocialIcon(user.socialProfiles[0])}
                        </a>
                      </>
                    )}

                    {/* Botón +N si hay más redes sociales */}
                    {user.socialProfiles.length > 1 && (
                      <div className="relative">
                        <button
                          onClick={() => toggleSocialDropdown(user.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-xs font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                          aria-label={`${user.socialProfiles.length - 1} more social profiles`}
                        >
                          +{user.socialProfiles.length - 1}
                        </button>

                        {/* Dropdown */}
                        {openSocialDropdown === user.id && (
                          <>
                            {/* Overlay para cerrar al hacer click fuera */}
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setOpenSocialDropdown(null)}
                            />
                            
                            {/* Contenido del dropdown */}
                            <div className="absolute left-0 top-full z-20 mt-2 w-48 rounded-lg border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                              <div className="mb-2 px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                                Redes Sociales
                              </div>
                              <div className="space-y-1">
                                {user.socialProfiles.map((platform, index) => (
                                  <a
                                    key={index}
                                    href="#"
                                    className="flex items-center gap-3 rounded-md px-2 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                  >
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300">
                                      {getSocialIcon(platform)}
                                    </div>
                                    <span className="capitalize">{platform}</span>
                                  </a>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
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
                  <div className="relative">
                    <button 
                      onClick={() => toggleActionsDropdown(user.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                    >
                      <MoreDotIcon />
                    </button>

                    {/* Dropdown de acciones */}
                    {openActionsDropdown === user.id && (
                      <>
                        {/* Overlay para cerrar al hacer click fuera */}
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setOpenActionsDropdown(null)}
                        />
                        
                        {/* Contenido del dropdown */}
                        <div className="absolute right-0 top-full z-20 mt-2 w-48 rounded-lg border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                          <div className="mb-2 px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                            Actions
                          </div>
                          <div className="space-y-1">
                            <button
                              onClick={() => {
                                // Aquí irá la lógica de editar
                                console.log('Editar usuario:', user.id);
                                setOpenActionsDropdown(null);
                              }}
                              className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </div>
                              <span>Editar</span>
                            </button>
                            
                            <button
                              onClick={() => {
                                // Aquí irá la lógica de eliminar
                                console.log('Eliminar usuario:', user.id);
                                setOpenActionsDropdown(null);
                              }}
                              className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                            >
                              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-red-600 dark:border-gray-600 dark:bg-gray-700 dark:text-red-400">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </div>
                              <span>Eliminar</span>
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
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
          <CustomSelect
            options={rowsPerPageOptions}
            value={rowsPerPage}
            onChange={setRowsPerPage}
            className="w-20"
            dropdownPosition="top"
          />
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
