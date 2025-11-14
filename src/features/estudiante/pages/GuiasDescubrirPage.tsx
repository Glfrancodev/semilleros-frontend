export default function GuiasDescubrirPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Guías y Descubrir
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Explora guías, recursos y encuentra inspiración para tus proyectos
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <nav className="flex gap-6">
          <button className="pb-3 px-1 border-b-2 border-brand-500 text-brand-600 dark:text-brand-400 font-medium text-sm">
            Guías
          </button>
          <button className="pb-3 px-1 border-b-2 border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm">
            Descubrir
          </button>
          <button className="pb-3 px-1 border-b-2 border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm">
            Convocatorias
          </button>
        </nav>
      </div>

      {/* Guías disponibles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Guía 1 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition p-6">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">📖</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Cómo Empezar un Proyecto
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Aprende los pasos básicos para iniciar tu proyecto de investigación de forma exitosa.
          </p>
          <button className="text-sm text-brand-600 dark:text-brand-400 hover:underline">
            Ver guía →
          </button>
        </div>

        {/* Guía 2 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition p-6">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">✍️</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Formato APA 7
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Guía completa para formatear tu documento siguiendo las normas APA 7.
          </p>
          <button className="text-sm text-brand-600 dark:text-brand-400 hover:underline">
            Ver guía →
          </button>
        </div>

        {/* Guía 3 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition p-6">
          <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">🔬</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Metodología de Investigación
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Conoce las diferentes metodologías y cómo aplicarlas en tu proyecto.
          </p>
          <button className="text-sm text-brand-600 dark:text-brand-400 hover:underline">
            Ver guía →
          </button>
        </div>

        {/* Guía 4 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition p-6">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">📊</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Análisis de Datos
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Herramientas y técnicas para analizar los datos de tu investigación.
          </p>
          <button className="text-sm text-brand-600 dark:text-brand-400 hover:underline">
            Ver guía →
          </button>
        </div>

        {/* Guía 5 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition p-6">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">💡</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Ideas de Proyectos
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Explora temas innovadores y encuentra inspiración para tu proyecto.
          </p>
          <button className="text-sm text-brand-600 dark:text-brand-400 hover:underline">
            Ver guía →
          </button>
        </div>

        {/* Guía 6 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition p-6">
          <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">🎯</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Presentación de Resultados
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Cómo presentar tus hallazgos de manera clara y profesional.
          </p>
          <button className="text-sm text-brand-600 dark:text-brand-400 hover:underline">
            Ver guía →
          </button>
        </div>
      </div>
    </div>
  );
}
