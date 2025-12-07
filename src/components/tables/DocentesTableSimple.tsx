import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Button from "../ui/button/Button";
import { MoreDotIcon } from "../../assets/icons";
import { useState, useRef, useEffect } from "react";
import { Usuario } from "../../services/usuarioService";

interface DocentesTableProps {
  usuarios: Usuario[];
  totalUsuarios: number;
  visibleColumns: {
    usuario: boolean;
    ci: boolean;
    correo: boolean;
    codigoDocente: boolean;
    redesSociales: boolean;
    bio: boolean;
    estaActivo: boolean;
    fechaCreacion: boolean;
  };
  showColumnSettings: boolean;
  onToggleColumnSettings: () => void;
  onToggleColumn: (column: keyof DocentesTableProps['visibleColumns']) => void;
  onAddUser: () => void;
  onEdit: (usuario: Usuario) => void;
  onDelete: (idUsuario: string) => void;
  onToggleStatus: (idUsuario: string) => void;
}

export default function DocentesTableSimple({ 
  usuarios,
  totalUsuarios,
  visibleColumns,
  showColumnSettings,
  onToggleColumnSettings,
  onToggleColumn,
  onAddUser,
  onEdit,
  onDelete,
  onToggleStatus
}: DocentesTableProps) {
  const [openSocialDropdown, setOpenSocialDropdown] = useState<string | null>(null);
  const [openActionsDropdown, setOpenActionsDropdown] = useState<string | null>(null);
  const [socialDropdownPosition, setSocialDropdownPosition] = useState<{ top: number; right: number } | null>(null);
  const [actionsDropdownPosition, setActionsDropdownPosition] = useState<{ top: number; right: number } | null>(null);
  const [settingsDropdownPosition, setSettingsDropdownPosition] = useState<{ top: number; right: number } | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const socialButtonRef = useRef<HTMLButtonElement>(null);
  const actionsButtonRef = useRef<HTMLButtonElement>(null);
  const settingsButtonRef = useRef<HTMLDivElement>(null);

  const handleImageError = (idUsuario: string) => {
    setImageErrors(prev => new Set(prev).add(idUsuario));
  };

  const toggleSocialDropdown = (idUsuario: string) => {
    setOpenSocialDropdown(openSocialDropdown === idUsuario ? null : idUsuario);
  };

  const toggleActionsDropdown = (idUsuario: string) => {
    setOpenActionsDropdown(openActionsDropdown === idUsuario ? null : idUsuario);
  };

  useEffect(() => {
    if (openSocialDropdown && socialButtonRef.current) {
      const rect = socialButtonRef.current.getBoundingClientRect();
      setSocialDropdownPosition({
        top: rect.top - 8,
        right: window.innerWidth - rect.right,
      });
    }
  }, [openSocialDropdown]);

  useEffect(() => {
    if (openActionsDropdown && actionsButtonRef.current) {
      const rect = actionsButtonRef.current.getBoundingClientRect();
      setActionsDropdownPosition({
        top: rect.top - 8,
        right: window.innerWidth - rect.right,
      });
    }
  }, [openActionsDropdown]);

  useEffect(() => {
    if (showColumnSettings && settingsButtonRef.current) {
      const rect = settingsButtonRef.current.getBoundingClientRect();
      setSettingsDropdownPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
  }, [showColumnSettings]);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      const isSocialDropdown = target.closest('[data-social-dropdown]');
      const isActionsDropdown = target.closest('[data-actions-dropdown]');
      
      if (!isSocialDropdown && openSocialDropdown) {
        setOpenSocialDropdown(null);
      }
      if (!isActionsDropdown && openActionsDropdown) {
        setOpenActionsDropdown(null);
      }
      if (showColumnSettings) {
        onToggleColumnSettings();
      }
    };

    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [openSocialDropdown, openActionsDropdown, showColumnSettings, onToggleColumnSettings]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getSocialProfiles = (usuario: Usuario): { platform: string; url: string }[] => {
    const profiles: { platform: string; url: string }[] = [];
    if (usuario.instagram) profiles.push({ platform: 'instagram', url: usuario.instagram });
    if (usuario.linkedin) profiles.push({ platform: 'linkedin', url: usuario.linkedin });
    if (usuario.github) profiles.push({ platform: 'github', url: usuario.github });
    return profiles;
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case "instagram":
        return (
          <svg className="fill-current" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
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
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 p-4 dark:border-white/[0.05]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Total Docentes:</span>
            <span className="font-semibold text-gray-900 dark:text-white">{totalUsuarios.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div ref={settingsButtonRef}>
            <Button 
              variant="outline" 
              size="xs"
              onClick={onToggleColumnSettings}
              startIcon={
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
            >
              Table settings
            </Button>
          </div>
          
          <Button 
            variant="primary" 
            size="xs"
            onClick={onAddUser}
            startIcon={
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            }
          >
            Añadir Docente
          </Button>
        </div>
      </div>
      
      {/* Panel de configuración */}
      {showColumnSettings && settingsDropdownPosition && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={onToggleColumnSettings}
          />
          <div 
            className="fixed z-50 w-64 rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800"
            style={{
              top: `${settingsDropdownPosition.top}px`,
              right: `${settingsDropdownPosition.right}px`,
            }}
          >
            <div className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
              Columnas Visibles
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={visibleColumns.usuario}
                  onChange={() => onToggleColumn('usuario')}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Usuario</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={visibleColumns.ci}
                  onChange={() => onToggleColumn('ci')}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">CI</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={visibleColumns.correo}
                  onChange={() => onToggleColumn('correo')}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Correo</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={visibleColumns.codigoDocente}
                  onChange={() => onToggleColumn('codigoDocente')}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Código Docente</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={visibleColumns.redesSociales}
                  onChange={() => onToggleColumn('redesSociales')}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Redes Sociales</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={visibleColumns.bio}
                  onChange={() => onToggleColumn('bio')}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Bio</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={visibleColumns.estaActivo}
                  onChange={() => onToggleColumn('estaActivo')}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Estado</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={visibleColumns.fechaCreacion}
                  onChange={() => onToggleColumn('fechaCreacion')}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Fecha Creación</span>
              </label>
            </div>
          </div>
        </>
      )}
      
      {/* Tabla */}
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              {visibleColumns.usuario && (
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  USUARIO
                </TableCell>
              )}
              {visibleColumns.ci && (
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  CI
                </TableCell>
              )}
              {visibleColumns.correo && (
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  CORREO
                </TableCell>
              )}
              {visibleColumns.codigoDocente && (
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  CÓDIGO
                </TableCell>
              )}
              {visibleColumns.redesSociales && (
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  REDES SOCIALES
                </TableCell>
              )}
              {visibleColumns.bio && (
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  BIO
                </TableCell>
              )}
              {visibleColumns.estaActivo && (
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  ESTADO
                </TableCell>
              )}
              {visibleColumns.fechaCreacion && (
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  FECHA CREACIÓN
                </TableCell>
              )}
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                ACCIONES
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {usuarios.map((usuario) => {
              const socialProfiles = getSocialProfiles(usuario);
              
              return (
                <TableRow key={usuario.idUsuario}>
                  {visibleColumns.usuario && (
                    <TableCell className="px-5 py-4 text-start align-top">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 overflow-hidden rounded-full flex-shrink-0">
                          {usuario.fotoPerfil?.url && !imageErrors.has(usuario.idUsuario) ? (
                            <img
                              width={40}
                              height={40}
                              src={usuario.fotoPerfil.url}
                              alt={`${usuario.nombre} ${usuario.apellido}`}
                              className="object-cover w-full h-full"
                              onError={() => handleImageError(usuario.idUsuario)}
                            />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-600 dark:to-blue-800">
                              <span className="text-sm font-semibold text-white uppercase">
                                {usuario.nombre[0]}{usuario.apellido[0]}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90 break-words block">
                            {usuario.nombre} {usuario.apellido}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                  )}

                  {visibleColumns.ci && (
                    <TableCell className="px-5 py-4 text-start">
                      <span className="text-sm text-gray-600 dark:text-gray-400 break-words">
                        {usuario.ci}
                      </span>
                    </TableCell>
                  )}

                  {visibleColumns.correo && (
                    <TableCell className="px-5 py-4 text-start">
                      <span className="text-sm text-gray-600 dark:text-gray-400 break-words">
                        {usuario.correo}
                      </span>
                    </TableCell>
                  )}

                  {visibleColumns.codigoDocente && (
                    <TableCell className="px-5 py-4 text-start">
                      <span className="text-sm text-gray-600 dark:text-gray-400 break-words">
                        {usuario.Docente?.codigoDocente || '-'}
                      </span>
                    </TableCell>
                  )}

                  {visibleColumns.redesSociales && (
                    <TableCell className="px-5 py-4 text-start">
                      <div className="relative flex items-center gap-2" data-social-dropdown>
                        {socialProfiles.length > 0 ? (
                          <>
                            <a
                              href={socialProfiles[0].url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                              aria-label={socialProfiles[0].platform}
                            >
                              {getSocialIcon(socialProfiles[0].platform)}
                            </a>

                            {socialProfiles.length > 1 && (
                              <div className="relative">
                                <button
                                  ref={openSocialDropdown === usuario.idUsuario ? socialButtonRef : null}
                                  onClick={() => toggleSocialDropdown(usuario.idUsuario)}
                                  className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-xs font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                                  aria-label={`${socialProfiles.length - 1} more social profiles`}
                                >
                                  +{socialProfiles.length - 1}
                                </button>

                                {openSocialDropdown === usuario.idUsuario && socialDropdownPosition && (
                                  <>
                                    <div
                                      className="fixed inset-0 z-10"
                                      onClick={() => setOpenSocialDropdown(null)}
                                    />
                                    
                                    <div 
                                      className="fixed z-50 w-48 rounded-lg border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-800"
                                      style={{
                                        bottom: `${window.innerHeight - socialDropdownPosition.top}px`,
                                        right: `${socialDropdownPosition.right}px`,
                                      }}
                                      data-social-dropdown
                                    >
                                      <div className="mb-2 px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                                        Redes Sociales
                                      </div>
                                      <div className="space-y-1">
                                        {socialProfiles.map((profile, index) => (
                                          <a
                                            key={index}
                                            href={profile.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 rounded-md px-2 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                          >
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300">
                                              {getSocialIcon(profile.platform)}
                                            </div>
                                            <span className="capitalize">{profile.platform}</span>
                                          </a>
                                        ))}
                                      </div>
                                    </div>
                                  </>
                                )}
                              </div>
                            )}
                          </>
                        ) : (
                          <span className="text-sm text-gray-400 dark:text-gray-500">-</span>
                        )}
                      </div>
                    </TableCell>
                  )}

                  {visibleColumns.bio && (
                    <TableCell className="px-5 py-4 text-start">
                      {usuario.bio ? (
                        <span className="text-sm text-gray-600 dark:text-gray-400 break-words">
                          {usuario.bio}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400 dark:text-gray-500">-</span>
                      )}
                    </TableCell>
                  )}

                  {visibleColumns.estaActivo && (
                    <TableCell className="px-5 py-4 text-start">
                      <button
                        onClick={() => onToggleStatus(usuario.idUsuario)}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium cursor-pointer ${
                          usuario.estaActivo
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {usuario.estaActivo ? "Activo" : "Inactivo"}
                      </button>
                    </TableCell>
                  )}

                  {visibleColumns.fechaCreacion && (
                    <TableCell className="px-5 py-4 text-start">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(usuario.fechaCreacion)}
                      </span>
                    </TableCell>
                  )}

                  <TableCell className="px-5 py-4 text-start">
                    <div className="relative" data-actions-dropdown>
                      <button 
                        ref={openActionsDropdown === usuario.idUsuario ? actionsButtonRef : null}
                        onClick={() => toggleActionsDropdown(usuario.idUsuario)}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                      >
                        <MoreDotIcon />
                      </button>

                      {openActionsDropdown === usuario.idUsuario && actionsDropdownPosition && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setOpenActionsDropdown(null)}
                          />
                          
                          <div 
                            className="fixed z-50 w-48 rounded-lg border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-800"
                            style={{
                              bottom: `${window.innerHeight - actionsDropdownPosition.top}px`,
                              right: `${actionsDropdownPosition.right}px`,
                            }}
                            data-actions-dropdown
                          >
                            <div className="mb-2 px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                              Acciones
                            </div>
                            <div className="space-y-1">
                              <button
                                onClick={() => {
                                  onEdit(usuario);
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
                                  onDelete(usuario.idUsuario);
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
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
