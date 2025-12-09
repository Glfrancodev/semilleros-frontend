import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "./components/ui/button/Button";
import { ThemeToggleButton } from "./components/common/ThemeToggleButton";
import { 
  obtenerFeriaActiva, 
  obtenerFeriasPasadas, 
  FeriaActiva, 
  Feria 
} from "./services/feriaService";
import { 
  obtenerPerfilesDestacados, 
  PerfilDestacado 
} from "./services/estudianteService";
import "./landing.css";

export default function NewLandingPage() {
  const navigate = useNavigate();
  const [feriaActiva, setFeriaActiva] = useState<FeriaActiva | null>(null);
  const [feriasPasadas, setFeriasPasadas] = useState<Feria[]>([]);
  const [perfilesDestacados, setPerfilesDestacados] = useState<PerfilDestacado[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      console.log('🌐 [LANDING] Iniciando carga de datos...');
      setLoading(true);
      console.log('🌐 [LANDING] Llamando a las APIs...');
      const [feria, pasadas, perfiles] = await Promise.all([
        obtenerFeriaActiva(),
        obtenerFeriasPasadas(),
        obtenerPerfilesDestacados(10)
      ]);
      
      console.log('🌐 [LANDING] Feria activa recibida:', feria);
      console.log('🌐 [LANDING] Ferias pasadas recibidas:', pasadas);
      console.log('🌐 [LANDING] Perfiles destacados recibidos:', perfiles);
      console.log('🌐 [LANDING] Fotos de perfil:', perfiles.map(p => ({ nombre: p.nombreCompleto, foto: p.fotoPerfil })));
      
      setFeriaActiva(feria);
      setFeriasPasadas(pasadas);
      setPerfilesDestacados(perfiles);
      console.log('🌐 [LANDING] ✅ Datos cargados exitosamente');
    } catch (error) {
      console.error("🌐 [LANDING] ❌ Error al cargar datos del landing:", error);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.max(1, feriasPasadas.length));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => 
      prev === 0 ? Math.max(0, feriasPasadas.length - 1) : prev - 1
    );
  };

  return (
    <div className="new-landing-page min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-theme-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <img 
                src="/images/logo/logo.svg" 
                alt="Semilleros" 
                className="h-10 dark:hidden"
              />
              <img 
                src="/images/logo/logo-dark.svg" 
                alt="Semilleros" 
                className="h-10 hidden dark:block"
              />
              <div>
                <div className="text-gray-600 dark:text-gray-400 text-xs">FICCT - UAGRM</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggleButton />
              <Link to="/login">
                <Button variant="primary" size="sm">
                  Iniciar Sesión →
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden bg-gradient-to-br from-brand-50 to-blue-light-50 dark:from-gray-900 dark:to-gray-950">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-blue-light-500/5 dark:from-brand-500/10 dark:to-blue-light-500/10" />
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-light-500/10 rounded-full blur-3xl" />
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-block px-4 py-2 bg-brand-50 dark:bg-brand-950 border border-brand-200 dark:border-brand-800 rounded-full text-brand-700 dark:text-brand-300 text-sm font-medium mb-6">
                ✨ Descubre el talento de la FICCT
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Ciencia e Innovación
                <span className="block bg-gradient-to-r from-brand-600 to-blue-light-600 dark:from-brand-400 dark:to-blue-light-400 bg-clip-text text-transparent">
                  desde la FICCT
                </span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                Conectamos estudiantes destacados, proyectos innovadores y empresas líderes en tecnología
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <a href="#feria-activa">
                  <Button variant="primary" size="md">
                    Ver Feria Actual
                  </Button>
                </a>
                <a href="#perfiles">
                  <Button variant="outline" size="md">
                    Explorar Talento
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Feria Activa Section */}
        <section id="feria-activa" className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-block px-4 py-2 bg-success-50 dark:bg-success-950 border border-success-200 dark:border-success-800 rounded-full text-success-700 dark:text-success-300 text-sm font-medium mb-4">
                🎯 En vivo ahora
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Feria Actual
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Conoce la feria activa con todos los proyectos e investigaciones en curso
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : feriaActiva ? (
              <div className="max-w-5xl mx-auto">
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-theme-lg">
                  <div className="p-8 md:p-12">
                    <div className="flex items-start justify-between mb-8">
                      <div>
                        <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                          {feriaActiva.nombre}
                        </h3>
                        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                          <span className="px-3 py-1 bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 rounded-lg text-sm font-medium">
                            {feriaActiva.año}
                          </span>
                          <span className="px-3 py-1 bg-blue-light-50 dark:bg-blue-light-950 text-blue-light-700 dark:text-blue-light-300 rounded-lg text-sm font-medium">
                            Semestre {feriaActiva.semestre}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-success-50 dark:bg-success-950 text-success-700 dark:text-success-300 rounded-full border border-success-200 dark:border-success-800">
                        <span className="w-2 h-2 bg-success-600 dark:bg-success-400 rounded-full animate-pulse" />
                        <span className="text-sm font-medium">Activa</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-brand-500 dark:border-brand-400">
                        <div className="text-brand-700 dark:text-brand-300 text-sm font-medium mb-2">Proyectos Inscritos</div>
                        <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                          {feriaActiva.cantidadProyectosInscritos}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Total de participantes</div>
                      </div>

                      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-warning-500 dark:border-warning-400">
                        <div className="text-warning-700 dark:text-warning-300 text-sm font-medium mb-2">Pendientes de Aprobación</div>
                        <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                          {feriaActiva.cantidadProyectosPendientesAprobacion}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">En revisión</div>
                      </div>

                      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-success-500 dark:border-success-400">
                        <div className="text-success-700 dark:text-success-300 text-sm font-medium mb-2">Proyectos Aprobados</div>
                        <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                          {feriaActiva.cantidadProyectosAprobados}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Ya validados</div>
                      </div>

                      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-theme-purple-500 dark:border-theme-purple-400">
                        <div className="text-theme-purple-500 dark:text-theme-purple-400 text-sm font-medium mb-2">Proyectos Finales</div>
                        <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                          {feriaActiva.cantidadProyectosFinales}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Completados</div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-gray-700 dark:text-gray-300 font-medium">Progreso General</span>
                        <span className="text-brand-600 dark:text-brand-400 font-bold">
                          {feriaActiva.cantidadProyectosInscritos > 0 
                            ? Math.round((feriaActiva.cantidadProyectosAprobados / feriaActiva.cantidadProyectosInscritos) * 100)
                            : 0}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-brand-500 to-brand-600 h-3 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${feriaActiva.cantidadProyectosInscritos > 0 
                              ? (feriaActiva.cantidadProyectosAprobados / feriaActiva.cantidadProyectosInscritos) * 100 
                              : 0}%` 
                          }}
                        />
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                        {feriaActiva.cantidadProyectosAprobados} de {feriaActiva.cantidadProyectosInscritos} proyectos aprobados
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🎪</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No hay feria activa</h3>
                <p className="text-gray-600 dark:text-gray-400">Actualmente no hay una feria en curso</p>
              </div>
            )}
          </div>
        </section>

        {/* Ferias Pasadas Section */}
        <section id="ferias-pasadas" className="py-20 bg-gray-50 dark:bg-gray-950">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-block px-4 py-2 bg-theme-purple-500/10 dark:bg-theme-purple-500/20 border border-theme-purple-500/20 dark:border-theme-purple-500/30 rounded-full text-theme-purple-500 dark:text-theme-purple-500 text-sm font-medium mb-4">
                📚 Historial
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Ferias Pasadas
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Explora las ediciones anteriores de nuestra feria de semilleros
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="w-16 h-16 border-4 border-brand-500 dark:border-brand-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : feriasPasadas.length > 0 ? (
              <div className="max-w-6xl mx-auto">
                <div className="relative">
                  {/* Carousel */}
                  <div className="overflow-hidden rounded-2xl">
                    <div 
                      className="flex transition-transform duration-500 ease-out"
                      style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                    >
                      {feriasPasadas.map((feria) => (
                        <div key={feria.idFeria} className="min-w-full px-4">
                          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 md:p-12 shadow-theme-lg">
                            <div className="flex flex-col md:flex-row items-start justify-between mb-6">
                              <div className="flex-1">
                                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                                  {feria.nombre}
                                </h3>
                                <div className="flex flex-wrap items-center gap-3">
                                  <span className="px-4 py-2 bg-theme-purple-500/10 dark:bg-theme-purple-500/20 text-theme-purple-500 dark:text-theme-purple-500 rounded-lg font-medium border border-theme-purple-500/20 dark:border-theme-purple-500/30">
                                    {feria.año}
                                  </span>
                                  <span className="px-4 py-2 bg-blue-light-50 dark:bg-blue-light-950 text-blue-light-600 dark:text-blue-light-400 rounded-lg font-medium border border-blue-light-200 dark:border-blue-light-800">
                                    Semestre {feria.semestre}
                                  </span>
                                  <span className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm border border-gray-200 dark:border-gray-700">
                                    {new Date(feria.fechaCreacion).toLocaleDateString('es-ES', { 
                                      year: 'numeric', 
                                      month: 'long' 
                                    })}
                                  </span>
                                </div>
                              </div>
                              <Button 
                                variant="primary" 
                                size="sm" 
                                className="mt-4 md:mt-0"
                                onClick={() => navigate(`/ferias/${feria.idFeria}`)}
                              >
                                Ver Detalles →
                              </Button>
                            </div>

                            {feria.tareas && feria.tareas.length > 0 && (
                              <div className="mt-6">
                                <h4 className="text-gray-700 dark:text-gray-300 font-semibold mb-4">Tareas de la Feria:</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {feria.tareas.slice(0, 4).map((tarea, idx) => (
                                    <div key={tarea.idTarea || idx} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                                      <div className="flex items-start justify-between">
                                        <div>
                                          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Orden {tarea.orden}</div>
                                          <div className="text-gray-900 dark:text-white font-medium">{tarea.nombre}</div>
                                          {tarea.descripcion && (
                                            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 line-clamp-2">
                                              {tarea.descripcion}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                {feria.tareas.length > 4 && (
                                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-3">
                                    +{feria.tareas.length - 4} tareas más
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  {feriasPasadas.length > 1 && (
                    <>
                      <button
                        onClick={prevSlide}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-theme-md"
                        aria-label="Anterior"
                      >
                        ←
                      </button>
                      <button
                        onClick={nextSlide}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-theme-md"
                        aria-label="Siguiente"
                      >
                        →
                      </button>
                    </>
                  )}

                  {/* Dots Indicator */}
                  {feriasPasadas.length > 1 && (
                    <div className="flex justify-center gap-2 mt-6">
                      {feriasPasadas.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentSlide(idx)}
                          className={`rounded-full transition-all duration-300 ${
                            idx === currentSlide 
                              ? 'bg-brand-500 dark:bg-brand-400 w-8 h-3' 
                              : 'bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 w-3 h-3'
                          }`}
                          aria-label={`Ir a diapositiva ${idx + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">📖</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No hay ferias pasadas</h3>
                <p className="text-gray-600 dark:text-gray-400">Aún no se han registrado ferias anteriores</p>
              </div>
            )}
          </div>
        </section>

        {/* Perfiles Destacados Section */}
        <section id="perfiles" className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-block px-4 py-2 bg-warning-50 dark:bg-warning-950 border border-warning-200 dark:border-warning-800 rounded-full text-warning-700 dark:text-warning-300 text-sm font-medium mb-4">
                🏆 Top Talento
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Perfiles Destacados
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Conoce a los estudiantes más sobresalientes de la FICCT con mejor desempeño en proyectos
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="w-16 h-16 border-4 border-brand-500 dark:border-brand-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : perfilesDestacados.length > 0 ? (
              <div className="max-w-6xl mx-auto">
                {/* Top 3 - Podio */}
                <div className="flex items-end justify-center gap-4 mb-12 flex-wrap">
                  {/* Segundo Lugar (si existe) */}
                  {perfilesDestacados.length >= 2 && (
                    <div className="flex flex-col items-center flex-1 max-w-xs">
                      <div className="relative mb-4">
                        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-gray-300 bg-gradient-to-br from-gray-100 to-gray-200 shadow-theme-md">
                          {perfilesDestacados[1].fotoPerfil ? (
                            <img src={perfilesDestacados[1].fotoPerfil} alt={perfilesDestacados[1].nombreCompleto} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-500 to-brand-600 text-white font-bold text-2xl">
                              {perfilesDestacados[1].nombreCompleto.split(' ').filter(n => n).slice(0, 2).map(n => n[0].toUpperCase()).join('')}
                            </div>
                          )}
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-2xl border-4 border-white shadow-theme-sm">
                          🥈
                        </div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 w-full shadow-theme-md">
                        <div className="text-center mb-3">
                          <h3 className="text-gray-900 dark:text-white font-bold text-lg truncate">{perfilesDestacados[1].nombreCompleto}</h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">{perfilesDestacados[1].codigoEstudiante}</p>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Promedio</span>
                            <span className="text-success-600 dark:text-success-400 font-bold">{perfilesDestacados[1].promedioNotas}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Proyectos</span>
                            <span className="text-gray-900 dark:text-white font-bold">{perfilesDestacados[1].totalProyectos}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Ganadores</span>
                            <span className="text-warning-600 dark:text-warning-400 font-bold">{perfilesDestacados[1].proyectosGanadores}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => navigate(`/estudiantes/${perfilesDestacados[1].idEstudiante}/perfil`)}
                          className="mt-4 w-full px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                        >
                          Ver Perfil
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Primer Lugar (siempre existe si length > 0) */}
                  <div className="flex flex-col items-center flex-1 max-w-xs -mt-8">
                      <div className="relative mb-4">
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                          <div className="text-4xl">👑</div>
                        </div>
                        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-warning-500 bg-gradient-to-br from-warning-500 to-warning-600 shadow-theme-lg">
                          {perfilesDestacados[0].fotoPerfil ? (
                            <img src={perfilesDestacados[0].fotoPerfil} alt={perfilesDestacados[0].nombreCompleto} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-500 to-brand-600 text-white font-bold text-4xl">
                              {perfilesDestacados[0].nombreCompleto.split(' ').filter(n => n).slice(0, 2).map(n => n[0].toUpperCase()).join('')}
                            </div>
                          )}
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-warning-500 flex items-center justify-center text-3xl border-4 border-white shadow-theme-md">
                          🥇
                        </div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 border border-warning-200 dark:border-warning-800 rounded-2xl p-6 w-full shadow-theme-lg">
                        <div className="text-center mb-4">
                          <h3 className="text-gray-900 dark:text-white font-bold text-xl truncate">{perfilesDestacados[0].nombreCompleto}</h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">{perfilesDestacados[0].codigoEstudiante}</p>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-700 dark:text-gray-300">Promedio</span>
                            <span className="text-success-600 dark:text-success-400 font-bold text-lg">{perfilesDestacados[0].promedioNotas}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-700 dark:text-gray-300">Proyectos</span>
                            <span className="text-gray-900 dark:text-white font-bold text-lg">{perfilesDestacados[0].totalProyectos}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-700 dark:text-gray-300">Ganadores</span>
                            <span className="text-warning-600 dark:text-warning-400 font-bold text-lg">{perfilesDestacados[0].proyectosGanadores}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => navigate(`/estudiantes/${perfilesDestacados[0].idEstudiante}/perfil`)}
                          className="mt-4 w-full px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                        >
                          Ver Perfil
                        </button>
                      </div>
                    </div>

                    {/* Tercer Lugar (si existe) */}
                    {perfilesDestacados.length >= 3 && (
                      <div className="flex flex-col items-center flex-1 max-w-xs">
                        <div className="relative mb-4">
                          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-orange-400 bg-gradient-to-br from-orange-300 to-orange-500 shadow-theme-md">
                          {perfilesDestacados[2].fotoPerfil ? (
                            <img src={perfilesDestacados[2].fotoPerfil} alt={perfilesDestacados[2].nombreCompleto} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-500 to-brand-600 text-white font-bold text-2xl">
                              {perfilesDestacados[2].nombreCompleto.split(' ').filter(n => n).slice(0, 2).map(n => n[0].toUpperCase()).join('')}
                            </div>
                          )}
                          </div>
                          <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-orange-400 flex items-center justify-center text-2xl border-4 border-white shadow-theme-sm">
                            🥉
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 w-full shadow-theme-md">
                          <div className="text-center mb-3">
                            <h3 className="text-gray-900 dark:text-white font-bold text-lg truncate">{perfilesDestacados[2].nombreCompleto}</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">{perfilesDestacados[2].codigoEstudiante}</p>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Promedio</span>
                              <span className="text-success-600 dark:text-success-400 font-bold">{perfilesDestacados[2].promedioNotas}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Proyectos</span>
                              <span className="text-gray-900 dark:text-white font-bold">{perfilesDestacados[2].totalProyectos}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Ganadores</span>
                              <span className="text-warning-600 dark:text-warning-400 font-bold">{perfilesDestacados[2].proyectosGanadores}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => navigate(`/estudiantes/${perfilesDestacados[2].idEstudiante}/perfil`)}
                            className="mt-4 w-full px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                          >
                            Ver Perfil
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                {/* Resto del Top 10 */}
                {perfilesDestacados.length > 3 && (
                  <div className="space-y-3 mb-8">
                    {perfilesDestacados.slice(3, 10).map((perfil) => (
                      <div 
                        key={perfil.idEstudiante}
                        className="flex items-center gap-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-brand-300 dark:hover:border-brand-600 hover:shadow-theme-md transition-all duration-200"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="text-3xl font-bold text-gray-400 dark:text-gray-500 w-12 text-center">
                            {perfil.posicion}
                          </div>
                          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700 shadow-theme-sm">
                            {perfil.fotoPerfil ? (
                              <img src={perfil.fotoPerfil} alt={perfil.nombreCompleto} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-500 to-brand-600 text-white font-bold text-lg">
                                {perfil.nombreCompleto.split(' ').filter(n => n).slice(0, 2).map(n => n[0].toUpperCase()).join('')}
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-gray-900 dark:text-white font-bold text-base">{perfil.nombreCompleto}</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">{perfil.codigoEstudiante}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 text-sm">
                          <div className="text-center">
                            <div className="text-success-600 dark:text-success-400 font-bold text-lg">{perfil.promedioNotas}</div>
                            <div className="text-gray-500 dark:text-gray-400 text-xs">Promedio</div>
                          </div>
                          <div className="text-center">
                            <div className="text-gray-900 dark:text-white font-bold text-lg">{perfil.totalProyectos}</div>
                            <div className="text-gray-500 dark:text-gray-400 text-xs">Proyectos</div>
                          </div>
                          <div className="text-center">
                            <div className="text-warning-600 dark:text-warning-400 font-bold text-lg">{perfil.proyectosGanadores}</div>
                            <div className="text-gray-500 dark:text-gray-400 text-xs">Ganadores</div>
                          </div>
                        </div>
                        <button
                          onClick={() => navigate(`/estudiantes/${perfil.idEstudiante}/perfil`)}
                          className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 whitespace-nowrap"
                        >
                          Ver Perfil
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Botón Ver Más */}
                <div className="text-center">
                  <Button variant="primary" size="md">
                    Ver más →
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No hay perfiles disponibles</h3>
                <p className="text-gray-600 dark:text-gray-400">Aún no se han registrado estudiantes destacados</p>
              </div>
            )}
          </div>
        </section>

        {/* Contact Information Footer */}
        <section className="py-16 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-gray-900 dark:text-white font-bold mb-4">Correo Oficial</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">feria.semilleros@ficct.uagrm.bo</p>
                <p className="text-gray-500 dark:text-gray-500 text-xs">Para consultas formales y coordinación</p>
              </div>
              <div>
                <h3 className="text-gray-900 dark:text-white font-bold mb-4">Ubicación</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">FICCT - Campus UAGRM</p>
                <p className="text-gray-500 dark:text-gray-500 text-xs">Santa Cruz de la Sierra, Bolivia</p>
              </div>
              <div>
                <h3 className="text-gray-900 dark:text-white font-bold mb-4">Horarios</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Lunes a Viernes</p>
                <p className="text-gray-500 dark:text-gray-500 text-xs">09:00 - 12:00 y 15:00 - 19:00</p>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                © 2025 Feria de Semilleros FICCT - UAGRM. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
