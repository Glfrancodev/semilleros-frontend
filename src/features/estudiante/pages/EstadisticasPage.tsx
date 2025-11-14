export default function EstadisticasPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Mis Estadísticas
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Visualiza tu progreso y rendimiento académico
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Card: Proyectos Activos */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Proyectos Activos
            </h3>
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 dark:text-blue-400">📁</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">3</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            En progreso
          </p>
        </div>

        {/* Card: Eventos Asistidos */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Eventos Asistidos
            </h3>
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <span className="text-green-600 dark:text-green-400">✓</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Este semestre
          </p>
        </div>

        {/* Card: Calificación Promedio */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Calificación Promedio
            </h3>
            <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
              <span className="text-yellow-600 dark:text-yellow-400">⭐</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">4.5</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            De 5.0
          </p>
        </div>

        {/* Card: Horas Dedicadas */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Horas Dedicadas
            </h3>
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <span className="text-purple-600 dark:text-purple-400">⏱️</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">48</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Este mes
          </p>
        </div>
      </div>

      {/* Gráficos y más detalles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rendimiento por proyecto */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Rendimiento por Proyecto
          </h3>
          <div className="text-center py-12 text-gray-400">
            <p>Gráfico de rendimiento</p>
            <p className="text-sm mt-2">(Por implementar)</p>
          </div>
        </div>

        {/* Actividad reciente */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Actividad Reciente
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Proyecto actualizado
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Hace 2 horas
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Evento completado
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Hace 1 día
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Nueva revisión recibida
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Hace 3 días
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
