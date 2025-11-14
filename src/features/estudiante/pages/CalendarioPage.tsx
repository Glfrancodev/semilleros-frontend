export default function CalendarioPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Mi Calendario
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Gestiona tus eventos, entregas y actividades académicas
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendario principal */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Noviembre 2025
            </h2>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                Anterior
              </button>
              <button className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                Siguiente
              </button>
            </div>
          </div>

          <div className="text-center py-20 text-gray-400">
            <p className="text-lg">📅</p>
            <p className="mt-2">Calendario interactivo</p>
            <p className="text-sm mt-1">(Por implementar)</p>
          </div>
        </div>

        {/* Eventos próximos */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Próximos Eventos
          </h3>
          
          <div className="space-y-4">
            {/* Evento 1 */}
            <div className="border-l-4 border-blue-500 pl-3 py-2">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Entrega Proyecto Final
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                15 de Noviembre, 2025
              </p>
              <span className="inline-block mt-1 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
                Entrega
              </span>
            </div>

            {/* Evento 2 */}
            <div className="border-l-4 border-green-500 pl-3 py-2">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Taller de Investigación
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                18 de Noviembre, 2025
              </p>
              <span className="inline-block mt-1 px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded">
                Evento
              </span>
            </div>

            {/* Evento 3 */}
            <div className="border-l-4 border-yellow-500 pl-3 py-2">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Revisión Metodología
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                20 de Noviembre, 2025
              </p>
              <span className="inline-block mt-1 px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded">
                Revisión
              </span>
            </div>

            {/* Evento 4 */}
            <div className="border-l-4 border-purple-500 pl-3 py-2">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Reunión con Asesor
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                22 de Noviembre, 2025
              </p>
              <span className="inline-block mt-1 px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded">
                Reunión
              </span>
            </div>
          </div>

          <button className="w-full mt-4 px-4 py-2 text-sm text-brand-600 dark:text-brand-400 border border-brand-600 dark:border-brand-400 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900/20 transition">
            Ver todos los eventos
          </button>
        </div>
      </div>
    </div>
  );
}
