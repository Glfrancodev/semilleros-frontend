import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import Button from "../../../components/ui/button/Button";
import { obtenerFeriaPorId, Feria } from "../../../services/feriaService";
import Badge from "../../../components/ui/badge/Badge";
import { useAuth } from "../../../context/AuthContext";
import { ROLES } from "../../../constants/roles";

interface ProyectoGanador {
  idProyecto: string;
  nombreProyecto: string;
  notaPromedio: number;
  integrantes: Array<{
    idEstudiante: string;
    nombreCompleto: string;
  }>;
}

interface LugarGanador {
  proyecto: ProyectoGanador;
}

interface CategoriasGanadoras {
  [categoria: string]: {
    primerLugar: LugarGanador | null;
    segundoLugar: LugarGanador | null;
    tercerLugar: LugarGanador | null;
  };
}

interface GanadoresPorArea {
  [area: string]: CategoriasGanadoras;
}

export default function GanadoresPage() {
  const { idFeria } = useParams<{ idFeria: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [feria, setFeria] = useState<Feria | null>(null);
  const [ganadores, setGanadores] = useState<GanadoresPorArea>({});

  const isAdmin = user?.rol === ROLES.ADMIN;

  useEffect(() => {
    cargarGanadores();
  }, [idFeria]);

  const cargarGanadores = async () => {
    if (!idFeria) return;

    try {
      setLoading(true);
      const data = await obtenerFeriaPorId(idFeria);
      setFeria(data);

      // Los ganadores ya vienen en la estructura correcta
      if (data.ganadores && typeof data.ganadores === 'object') {
        setGanadores(data.ganadores as GanadoresPorArea);
      }
    } catch (error) {
      console.error("Error al cargar ganadores:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderProyecto = (lugar: LugarGanador | null, puesto: 'primero' | 'segundo' | 'tercero') => {
    if (!lugar || !lugar.proyecto) {
      return (
        <div className="h-full flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 py-8">
          <div className="text-center">
            <div className="text-3xl mb-2 opacity-30">
              {puesto === 'primero' ? '🥇' : puesto === 'segundo' ? '🥈' : '🥉'}
            </div>
            <p className="text-sm text-gray-400 dark:text-gray-600">
              Sin proyecto
            </p>
          </div>
        </div>
      );
    }

    const { proyecto } = lugar;

    // Colores según el puesto
    const estilos = {
      primero: {
        bg: 'bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950/30 dark:via-yellow-950/20 dark:to-orange-950/30',
        border: 'border-amber-200 dark:border-amber-800/50',
        shadow: 'shadow-lg shadow-amber-100/50 dark:shadow-amber-950/30',
        medalla: '🥇',
        medallaGradient: 'from-amber-400 via-yellow-500 to-amber-600',
        badgeColor: 'warning' as const,
        rank: '1°'
      },
      segundo: {
        bg: 'bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-950/30 dark:via-gray-950/20 dark:to-zinc-950/30',
        border: 'border-slate-200 dark:border-slate-700/50',
        shadow: 'shadow-lg shadow-slate-100/50 dark:shadow-slate-950/30',
        medalla: '🥈',
        medallaGradient: 'from-slate-300 via-gray-400 to-slate-500',
        badgeColor: 'light' as const,
        rank: '2°'
      },
      tercero: {
        bg: 'bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-950/30 dark:via-amber-950/20 dark:to-yellow-950/30',
        border: 'border-orange-200 dark:border-orange-800/50',
        shadow: 'shadow-lg shadow-orange-100/50 dark:shadow-orange-950/30',
        medalla: '🥉',
        medallaGradient: 'from-orange-500 via-amber-600 to-orange-700',
        badgeColor: 'primary' as const,
        rank: '3°'
      }
    };

    const estilo = estilos[puesto];

    return (
      <div className={`h-full rounded-xl border ${estilo.border} ${estilo.bg} ${estilo.shadow} overflow-hidden transition-all hover:scale-[1.02] duration-200`}>
        {/* Header con posición */}
        <div className="relative">
          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${estilo.medallaGradient}`}></div>
          <div className="px-5 pt-5 pb-4">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${estilo.medallaGradient} flex items-center justify-center text-2xl shadow-md`}>
                {estilo.medalla}
              </div>
              <Badge variant="light" color={estilo.badgeColor} size="sm">
                {estilo.rank} Lugar
              </Badge>
            </div>

            {/* Nombre del proyecto */}
            <h5 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 min-h-[3rem]">
              {proyecto.nombreProyecto}
            </h5>

            {/* Metadata */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              <Badge variant="light" color="primary" size="sm">
                #{proyecto.idProyecto}
              </Badge>
              <Badge variant="solid" color="success" size="sm">
                ★ {proyecto.notaPromedio.toFixed(1)}
              </Badge>
            </div>
          </div>
        </div>

        {/* Body con integrantes */}
        <div className="px-5 pb-5">
          <div className="bg-white/60 dark:bg-gray-900/40 rounded-lg p-3 border border-gray-200/50 dark:border-gray-700/30">
            <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Integrantes
            </p>
            <div className="space-y-1.5">
              {proyecto.integrantes.map((integrante) => (
                <div
                  key={integrante.idEstudiante}
                  className="flex items-center gap-2"
                >
                  <div className="w-6 h-6 bg-gradient-to-br from-brand-400 to-brand-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                    <span className="text-[9px] font-bold text-white uppercase">
                      {integrante.nombreCompleto.split(' ').map(n => n[0]).slice(0, 2).join('')}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                    {integrante.nombreCompleto}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Botón Ver Proyecto */}
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/admin/proyectos/${proyecto.idProyecto}`)}
              className="w-full"
            >
              Ver Detalles
            </Button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <>
        <PageMeta
          title="Ganadores | Semilleros"
          description="Proyectos ganadores de la feria"
        />
        <PageBreadcrumb pageTitle="Ganadores" />
        <div className="flex justify-center items-center py-20">
          <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </>
    );
  }

  if (!feria || !feria.ganadores || Object.keys(ganadores).length === 0) {
    return (
      <>
        <PageMeta
          title="Ganadores | Semilleros"
          description="Proyectos ganadores de la feria"
        />
        <PageBreadcrumb pageTitle="Ganadores" />
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-center dark:border-white/[0.05] dark:bg-white/[0.03]">
          <p className="text-gray-600 dark:text-gray-400">No hay ganadores registrados</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/ferias/${idFeria}`)}
            className="mt-4"
          >
            ← Volver a Feria
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta
        title={`Ganadores - ${feria.nombre} | Semilleros`}
        description="Proyectos ganadores de la feria"
      />
      <PageBreadcrumb pageTitle={`Ganadores - ${feria.nombre}`} />

      <div className="space-y-6">
        {/* Header */}
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm dark:border-gray-800 dark:bg-gray-900/50">
          <div className="px-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-200 dark:shadow-amber-900/50">
                    <span className="text-2xl">🏆</span>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Proyectos Ganadores
                  </h2>
                </div>
                <div className="flex flex-wrap items-center gap-2 ml-15">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {feria.nombre}
                  </span>
                  <span className="text-gray-400 dark:text-gray-600">•</span>
                  <Badge variant="light" color="primary" size="sm">
                    Semestre {feria.semestre}
                  </Badge>
                  <Badge variant="light" color="primary" size="sm">
                    {feria.año}
                  </Badge>
                </div>
              </div>
              {isAdmin && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/ferias/${idFeria}`)}
                >
                  ← Volver
                </Button>
              )}
            </div>
          </div>

          {/* Botón Imprimir Certificados */}
          {isAdmin && (
            <div className="px-8 pb-6">
              <Button
                variant="primary"
                size="md"
                onClick={() => window.open('http://54.90.100.111:5173/ferias', '_blank')}
                className="w-full"
              >
                Imprimir Certificados
              </Button>
            </div>
          )}
        </div>

        {/* Ganadores por Área y Categoría */}
        {Object.entries(ganadores).map(([area, categorias]) => (
          <div
            key={area}
            className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm dark:border-gray-800 dark:bg-gray-900/50"
          >
            {/* Área Header */}
            <div className="px-8 py-6 border border-brand-200 dark:border-brand-800/40 rounded-t-2xl bg-brand-50/20 dark:bg-brand-950/10">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                {area}
              </h3>
            </div>

            {/* Categorías */}
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {Object.entries(categorias).map(([categoria, lugares]) => (
                <div key={categoria} className="p-8 bg-gray-50/50 dark:bg-gray-900/30">
                  {/* Categoría Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex-shrink-0 w-1 h-8 bg-gradient-to-b from-brand-500 to-brand-700 rounded-full"></div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                      {categoria}
                    </h4>
                  </div>

                  {/* Grid de tres lugares */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {renderProyecto(lugares.primerLugar, 'primero')}
                    {renderProyecto(lugares.segundoLugar, 'segundo')}
                    {renderProyecto(lugares.tercerLugar, 'tercero')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
