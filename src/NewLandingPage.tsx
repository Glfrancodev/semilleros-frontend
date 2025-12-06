import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
      setLoading(true);
      const [feria, pasadas, perfiles] = await Promise.all([
        obtenerFeriaActiva(),
        obtenerFeriasPasadas(),
        obtenerPerfilesDestacados(10)
      ]);
      
      setFeriaActiva(feria);
      setFeriasPasadas(pasadas);
      setPerfilesDestacados(perfiles);
    } catch (error) {
      console.error("Error al cargar datos del landing:", error);
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

  const getMedalColor = (posicion: number) => {
    switch (posicion) {
      case 1: return "🥇";
      case 2: return "🥈";
      case 3: return "🥉";
      default: return `#${posicion}`;
    }
  };

  return (
    <div className="new-landing-page min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center font-bold text-white">
                FS
              </div>
              <div>
                <div className="text-white font-bold text-sm">Feria de Semilleros</div>
                <div className="text-blue-300 text-xs">FICCT - UAGRM</div>
              </div>
            </div>
            <Link 
              to="/login" 
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105"
            >
              Iniciar Sesión →
            </Link>
          </nav>
        </div>
      </header>

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20" />
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl" />
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-block px-4 py-2 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-full text-blue-300 text-sm font-medium mb-6">
                ✨ Descubre el talento de la FICCT
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Ciencia e Innovación
                <span className="block bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  desde la FICCT
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Conectamos estudiantes destacados, proyectos innovadores y empresas líderes en tecnología
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <a 
                  href="#feria-activa" 
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/50"
                >
                  Ver Feria Actual
                </a>
                <a 
                  href="#perfiles" 
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20"
                >
                  Explorar Talento
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Feria Activa Section */}
        <section id="feria-activa" className="py-20 bg-slate-900/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-block px-4 py-2 bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-full text-green-300 text-sm font-medium mb-4">
                🎯 En vivo ahora
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Feria Actual
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Conoce la feria activa con todos los proyectos e investigaciones en curso
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : feriaActiva ? (
              <div className="max-w-5xl mx-auto">
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                  <div className="p-8 md:p-12">
                    <div className="flex items-start justify-between mb-8">
                      <div>
                        <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
                          {feriaActiva.nombre}
                        </h3>
                        <div className="flex items-center gap-3 text-gray-400">
                          <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-sm font-medium">
                            {feriaActiva.año}
                          </span>
                          <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-sm font-medium">
                            Semestre {feriaActiva.semestre}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-300 rounded-full border border-green-500/30">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-sm font-medium">Activa</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                      <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 backdrop-blur-sm p-6 rounded-xl border border-blue-500/30">
                        <div className="text-blue-300 text-sm font-medium mb-2">Proyectos Inscritos</div>
                        <div className="text-4xl font-bold text-white mb-1">
                          {feriaActiva.cantidadProyectosInscritos}
                        </div>
                        <div className="text-xs text-gray-400">Total de participantes</div>
                      </div>

                      <div className="bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 backdrop-blur-sm p-6 rounded-xl border border-yellow-500/30">
                        <div className="text-yellow-300 text-sm font-medium mb-2">Pendientes de Aprobación</div>
                        <div className="text-4xl font-bold text-white mb-1">
                          {feriaActiva.cantidadProyectosPendientesAprobacion}
                        </div>
                        <div className="text-xs text-gray-400">En revisión</div>
                      </div>

                      <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 backdrop-blur-sm p-6 rounded-xl border border-green-500/30">
                        <div className="text-green-300 text-sm font-medium mb-2">Proyectos Aprobados</div>
                        <div className="text-4xl font-bold text-white mb-1">
                          {feriaActiva.cantidadProyectosAprobados}
                        </div>
                        <div className="text-xs text-gray-400">Ya validados</div>
                      </div>

                      <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 backdrop-blur-sm p-6 rounded-xl border border-purple-500/30">
                        <div className="text-purple-300 text-sm font-medium mb-2">Proyectos Finales</div>
                        <div className="text-4xl font-bold text-white mb-1">
                          {feriaActiva.cantidadProyectosFinales}
                        </div>
                        <div className="text-xs text-gray-400">Completados</div>
                      </div>
                    </div>

                    <div className="bg-slate-800/50 rounded-xl p-6 border border-white/5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-gray-300 font-medium">Progreso General</span>
                        <span className="text-blue-400 font-bold">
                          {feriaActiva.cantidadProyectosInscritos > 0 
                            ? Math.round((feriaActiva.cantidadProyectosAprobados / feriaActiva.cantidadProyectosInscritos) * 100)
                            : 0}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${feriaActiva.cantidadProyectosInscritos > 0 
                              ? (feriaActiva.cantidadProyectosAprobados / feriaActiva.cantidadProyectosInscritos) * 100 
                              : 0}%` 
                          }}
                        />
                      </div>
                      <p className="text-gray-400 text-sm mt-2">
                        {feriaActiva.cantidadProyectosAprobados} de {feriaActiva.cantidadProyectosInscritos} proyectos aprobados
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🎪</div>
                <h3 className="text-2xl font-bold text-white mb-2">No hay feria activa</h3>
                <p className="text-gray-400">Actualmente no hay una feria en curso</p>
              </div>
            )}
          </div>
        </section>

        {/* Ferias Pasadas Section */}
        <section id="ferias-pasadas" className="py-20 bg-gradient-to-br from-slate-900 to-blue-900/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-block px-4 py-2 bg-purple-500/20 backdrop-blur-sm border border-purple-400/30 rounded-full text-purple-300 text-sm font-medium mb-4">
                📚 Historial
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Ferias Pasadas
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Explora las ediciones anteriores de nuestra feria de semilleros
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
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
                          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-white/10 p-8 md:p-12">
                            <div className="flex flex-col md:flex-row items-start justify-between mb-6">
                              <div className="flex-1">
                                <h3 className="text-3xl font-bold text-white mb-3">
                                  {feria.nombre}
                                </h3>
                                <div className="flex flex-wrap items-center gap-3">
                                  <span className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg font-medium">
                                    {feria.año}
                                  </span>
                                  <span className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg font-medium">
                                    Semestre {feria.semestre}
                                  </span>
                                  <span className="px-4 py-2 bg-slate-700/50 text-gray-300 rounded-lg text-sm">
                                    {new Date(feria.fechaCreacion).toLocaleDateString('es-ES', { 
                                      year: 'numeric', 
                                      month: 'long' 
                                    })}
                                  </span>
                                </div>
                              </div>
                              <button className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105">
                                Ver Detalles →
                              </button>
                            </div>

                            {feria.tareas && feria.tareas.length > 0 && (
                              <div className="mt-6">
                                <h4 className="text-gray-300 font-semibold mb-4">Tareas de la Feria:</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {feria.tareas.slice(0, 4).map((tarea, idx) => (
                                    <div key={tarea.idTarea || idx} className="bg-slate-800/50 rounded-lg p-4 border border-white/5">
                                      <div className="flex items-start justify-between">
                                        <div>
                                          <div className="text-sm text-gray-400 mb-1">Orden {tarea.orden}</div>
                                          <div className="text-white font-medium">{tarea.nombre}</div>
                                          {tarea.descripcion && (
                                            <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                                              {tarea.descripcion}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                {feria.tareas.length > 4 && (
                                  <p className="text-gray-400 text-sm mt-3">
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
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 bg-slate-800 border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-slate-700 transition-all duration-300 shadow-lg"
                        aria-label="Anterior"
                      >
                        ←
                      </button>
                      <button
                        onClick={nextSlide}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 bg-slate-800 border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-slate-700 transition-all duration-300 shadow-lg"
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
                          className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            idx === currentSlide 
                              ? 'bg-blue-500 w-8' 
                              : 'bg-slate-600 hover:bg-slate-500'
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
                <h3 className="text-2xl font-bold text-white mb-2">No hay ferias pasadas</h3>
                <p className="text-gray-400">Aún no se han registrado ferias anteriores</p>
              </div>
            )}
          </div>
        </section>

        {/* Perfiles Destacados Section */}
        <section id="perfiles" className="py-20 bg-slate-900/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-block px-4 py-2 bg-yellow-500/20 backdrop-blur-sm border border-yellow-400/30 rounded-full text-yellow-300 text-sm font-medium mb-4">
                🏆 Top Talento
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Perfiles Destacados
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Conoce a los estudiantes más sobresalientes de la FICCT con mejor desempeño en proyectos
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : perfilesDestacados.length > 0 ? (
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {perfilesDestacados.map((perfil) => (
                    <div 
                      key={perfil.idEstudiante}
                      className={`bg-gradient-to-br ${
                        perfil.posicion === 1 
                          ? 'from-yellow-600/20 to-yellow-900/20 border-yellow-500/30' 
                          : perfil.posicion === 2
                          ? 'from-slate-400/20 to-slate-600/20 border-slate-400/30'
                          : perfil.posicion === 3
                          ? 'from-orange-600/20 to-orange-800/20 border-orange-500/30'
                          : 'from-slate-800 to-slate-900 border-white/10'
                      } backdrop-blur-sm p-6 rounded-2xl border hover:scale-105 transition-all duration-300`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                            {perfil.nombreCompleto.split(' ').map(n => n[0]).join('').substring(0, 2)}
                          </div>
                          <div>
                            <h3 className="text-white font-bold text-lg leading-tight">
                              {perfil.nombreCompleto}
                            </h3>
                            <p className="text-gray-400 text-sm">{perfil.codigoEstudiante}</p>
                          </div>
                        </div>
                        <div className="text-3xl">
                          {getMedalColor(perfil.posicion)}
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Promedio</span>
                          <span className={`font-bold ${
                            perfil.promedioNotas >= 90 ? 'text-green-400' :
                            perfil.promedioNotas >= 80 ? 'text-blue-400' :
                            'text-yellow-400'
                          }`}>
                            {perfil.promedioNotas.toFixed(1)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Proyectos</span>
                          <span className="text-white font-bold">{perfil.totalProyectos}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Ganadores</span>
                          <span className="text-yellow-400 font-bold">{perfil.proyectosGanadores}</span>
                        </div>
                      </div>

                      {perfil.email && (
                        <div className="pt-4 border-t border-white/10">
                          <a 
                            href={`mailto:${perfil.email}`}
                            className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-2 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Contactar
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-2xl font-bold text-white mb-2">No hay perfiles disponibles</h3>
                <p className="text-gray-400">Aún no se han registrado estudiantes destacados</p>
              </div>
            )}
          </div>
        </section>

        {/* Contact Information Footer */}
        <section className="py-16 bg-slate-900 border-t border-white/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-white font-bold mb-4">Correo Oficial</h3>
                <p className="text-gray-400 text-sm mb-2">feria.semilleros@ficct.uagrm.bo</p>
                <p className="text-gray-500 text-xs">Para consultas formales y coordinación</p>
              </div>
              <div>
                <h3 className="text-white font-bold mb-4">Ubicación</h3>
                <p className="text-gray-400 text-sm mb-2">FICCT - Campus UAGRM</p>
                <p className="text-gray-500 text-xs">Santa Cruz de la Sierra, Bolivia</p>
              </div>
              <div>
                <h3 className="text-white font-bold mb-4">Horarios</h3>
                <p className="text-gray-400 text-sm mb-2">Lunes a Viernes</p>
                <p className="text-gray-500 text-xs">09:00 - 12:00 y 15:00 - 19:00</p>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-white/10 text-center">
              <p className="text-gray-500 text-sm">
                © 2025 Feria de Semilleros FICCT - UAGRM. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
