import { useState, useEffect } from "react";
import { ProyectoDetalle } from "../../../services/proyectoService";
import api from "../../../services/api";

interface ProyectoIntegrantesCardProps {
  proyecto: ProyectoDetalle;
}

interface Integrante {
  idEstudianteProyecto: string;
  codigo: string;
  nombreCompleto: string;
  esLider: boolean;
}

export default function ProyectoIntegrantesCard({ proyecto }: ProyectoIntegrantesCardProps) {
  const [integrantes, setIntegrantes] = useState<Integrante[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarIntegrantes();
  }, [proyecto.idProyecto]);

  const cargarIntegrantes = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/proyectos/${proyecto.idProyecto}/integrantes`);
      const data = response.data.data;
      // El backend devuelve { count, items }
      setIntegrantes(data.items || []);
    } catch (error) {
      console.error("Error al cargar integrantes:", error);
      setIntegrantes([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
        Integrantes
      </h3>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-primary-600 dark:border-gray-700 dark:border-t-primary-500"></div>
        </div>
      ) : integrantes.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
          No hay integrantes registrados
        </p>
      ) : (
        <div className="space-y-3">
          {integrantes.map((integrante) => (
            <div
              key={integrante.idEstudianteProyecto}
              className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30">
                  <svg
                    className="h-5 w-5 text-primary-600 dark:text-primary-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {integrante.nombreCompleto}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {integrante.codigo}
                  </p>
                </div>
              </div>

              {integrante.esLider && (
                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                  <svg
                    className="h-4 w-4 text-yellow-600 dark:text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400">
                    Líder
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
