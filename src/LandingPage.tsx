import { useState, FormEvent, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import "./landing.css";

const LandingPage: React.FC = () => {
  const [formValues, setFormValues] = useState({
    nombre: "",
    correo: "",
    rol: "",
    tema: "",
    mensaje: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { nombre, correo, rol, tema, mensaje } = formValues;

    if (!nombre.trim() || nombre.trim().length < 3) {
      toast.error("Ingresa un nombre válido.");
      return;
    }

    if (!correo.trim() || !correo.includes("@")) {
      toast.error("Ingresa un correo institucional válido.");
      return;
    }

    if (!rol) {
      toast.error("Selecciona tu rol en la feria.");
      return;
    }

    if (!tema) {
      toast.error("Selecciona el motivo de tu consulta.");
      return;
    }

    if (!mensaje.trim() || mensaje.trim().length < 10) {
      toast.error("El mensaje debe tener al menos 10 caracteres.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setFormValues({
        nombre: "",
        correo: "",
        rol: "",
        tema: "",
        mensaje: "",
      });
      toast.success(
        "Consulta enviada. Pronto nos pondremos en contacto."
      );
    }, 1000);
  };

  return (
    <div className="landing-page">
      <div className="page">
        <header>
          <div className="container">
            <nav className="nav">
              <div className="logo">
                <div className="logo-mark">FS</div>
                <div className="logo-text">
                  <div className="logo-title">Feria de Semilleros</div>
                  <div className="logo-subtitle">FICCT - UAGRM</div>
                </div>
              </div>
              <div className="nav-links">
                <Link className="nav-pill" to="/login">
                  Iniciar Sesión<span>→</span>
                </Link>
              </div>
            </nav>
          </div>
        </header>

        <main>
          {/* HERO */}
          <section id="inicio" className="hero">
            <div className="container">
              <div className="hero-grid">
                <div>
                  <div className="eyebrow">
                    <span className="eyebrow-badge">Edición 2025</span>
                    Feria de semilleros de investigación FICCT
                  </div>
                  <h1 className="hero-title">
                    Ciencia, innovación y tecnología desde la{" "}
                    <span>FICCT</span>.
                  </h1>
                  <p className="hero-subtitle">
                    La Feria de Semilleros FICCT conecta a estudiantes, docentes
                    y empresas para presentar proyectos que transforman la
                    universidad y la región. Investigación aplicada, prototipos,
                    software, redes, IoT, IA y más.
                  </p>
                  <div className="hero-meta">
                    <div className="hero-chip">
                      <strong>Fecha:</strong> 10-12 de octubre 2025
                    </div>
                    <div className="hero-chip">
                      <strong>Lugar:</strong> Campus UAGRM - FICCT
                    </div>
                    <div className="hero-chip">
                      <strong>Modalidad:</strong> Presencial con muestras en
                      vivo
                    </div>
                  </div>
                  <div className="hero-actions">
                    <Link to="/login" className="btn btn-primary">
                      Iniciar Sesión
                      <span>→</span>
                    </Link>
                  </div>
                  <p className="hero-note">
                    Abierto a estudiantes de todos los semestres y niveles de
                    proyecto: ideas iniciales, prototipos y proyectos de grado.
                  </p>
                </div>

                {/* CARD PREVIEW / MOCKUP */}
                <div className="hero-card" aria-hidden="true">
                  <div className="hero-card-header">
                    <div>
                      <div className="hero-card-title">Panel de Feria</div>
                      <div className="hero-card-subtitle">
                        Semilleros registrados - Vista resumen
                      </div>
                    </div>
                    <div className="hero-status">
                      <span className="hero-status-dot"></span>
                      Convocatoria abierta
                    </div>
                  </div>

                  <div className="hero-grid-mini">
                    <div className="mini-card">
                      <div className="mini-label">Proyectos postulados</div>
                      <div className="mini-value">132</div>
                      <div className="mini-tag">+18 nuevos hoy</div>
                    </div>
                    <div className="mini-card">
                      <div className="mini-label">Líneas de investigación</div>
                      <div className="mini-value">7 áreas</div>
                      <div className="mini-tag">Software - Redes - IA</div>
                    </div>
                  </div>

                  <div className="hero-progress">
                    <div className="hero-progress-header">
                      <div className="hero-progress-title">
                        Estado general de la feria
                      </div>
                      <div className="hero-progress-badge">68% de avance</div>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill"></div>
                    </div>
                    <div className="hero-progress-footer">
                      <span>Revisión de proyectos</span>
                      <span>Etapa: validación de resúmenes</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SOBRE LA FERIA */}
          <section id="sobre">
            <div className="container">
              <div className="section-header">
                <div className="section-kicker">Sobre la feria</div>
                <h2 className="section-title">
                  ¿Qué es la Feria de Semilleros FICCT?
                </h2>
                <p className="section-description">
                  Es un espacio académico donde los semilleros de investigación
                  de la FICCT presentan sus avances, comparten resultados y
                  conectan con docentes, empresas y otros estudiantes
                  interesados en ciencia y tecnología.
                </p>
              </div>

              <div className="about-grid">
                <div className="about-card">
                  <p>
                    <strong>Objetivo general:</strong> impulsar la cultura de
                    investigación en la FICCT, fomentando la participación
                    temprana de estudiantes en proyectos científicos y
                    tecnológicos que respondan a problemas reales de la
                    universidad, la industria y la sociedad.
                  </p>
                  <br />
                  <p>
                    Durante la feria se presentan pósteres, demostraciones,
                    prototipos, aplicaciones, soluciones de redes y
                    telecomunicaciones, sistemas de información, inteligencia
                    artificial, IoT, emprendimientos tecnológicos y más.
                  </p>
                </div>

                <div className="about-list">
                  <div className="about-item">
                    <div className="about-dot"></div>
                    <div>
                      <strong>Para estudiantes:</strong>
                      <br />
                      Fortalecen su CV académico, practican la defensa de
                      proyectos y obtienen retroalimentación directa de docentes
                      y jurados.
                    </div>
                  </div>
                  <div className="about-item">
                    <div className="about-dot"></div>
                    <div>
                      <strong>Para docentes:</strong>
                      <br />
                      Visibilizan líneas de investigación, captan nuevos
                      semilleros y articulan proyectos con otras carreras y
                      unidades.
                    </div>
                  </div>
                  <div className="about-item">
                    <div className="about-dot"></div>
                    <div>
                      <strong>Para empresas e instituciones:</strong>
                      <br />
                      Conocen talento, ideas innovadoras y soluciones
                      tecnológicas que pueden convertirse en proyectos conjuntos
                      o futuras contrataciones.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* EJES TEM�TICOS */}
          <section id="ejes">
            <div className="container">
              <div className="section-header">
                <div className="section-kicker">Ejes temáticos</div>
                <h2 className="section-title">Áreas de participación</h2>
                <p className="section-description">
                  Los proyectos pueden inscribirse en uno de los ejes temáticos
                  oficiales de la feria. Esto permite organizar mejor las
                  evaluaciones y premiaciones.
                </p>
              </div>

              <div className="track-grid">
                <div className="track-card">
                  <div className="track-tag">FS01</div>
                  <div className="track-title">
                    Ingeniería de Software y SI
                  </div>
                  <p>
                    Aplicaciones web y móviles, sistemas de información,
                    arquitectura de software, pruebas, calidad y metodologías
                    ágiles.
                  </p>
                </div>
                <div className="track-card">
                  <div className="track-tag">FS02</div>
                  <div className="track-title">
                    Redes, Telecom y Ciberseguridad
                  </div>
                  <p>
                    Diseño de redes, protocolos, monitoreo, seguridad
                    informática, infraestructuras inalámbricas y redes de
                    sensores.
                  </p>
                </div>
                <div className="track-card">
                  <div className="track-tag">FS03</div>
                  <div className="track-title">
                    IA, Ciencia de Datos y Automatización
                  </div>
                  <p>
                    Machine learning, visión por computador, analítica de datos,
                    sistemas inteligentes, automatización de procesos.
                  </p>
                </div>
                <div className="track-card">
                  <div className="track-tag">FS04</div>
                  <div className="track-title">
                    Innovación y Emprendimiento Tecnológico
                  </div>
                  <p>
                    Proyectos con modelo de negocio, soluciones para la
                    comunidad, prototipos listos para incubación o spin-off.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CRONOGRAMA */}
          <section id="cronograma">
            <div className="container">
              <div className="section-header">
                <div className="section-kicker">Cronograma</div>
                <h2 className="section-title">Fechas clave de la feria</h2>
                <p className="section-description">
                  A continuación se presenta el cronograma tentativo de la Feria
                  de Semilleros FICCT 2025. Las fechas pueden ajustarse según
                  disposiciones de la facultad.
                </p>
              </div>

              <div className="timeline">
                <div className="timeline-item">
                  <div className="timeline-date">01 – 15 agosto</div>
                  <div className="timeline-title">
                    Lanzamiento de convocatoria
                  </div>
                  <p className="timeline-text">
                    Publicación de bases, ejes temáticos, criterios de
                    evaluación y formas de participación para todos los
                    semilleros.
                  </p>
                </div>
                <div className="timeline-item">
                  <div className="timeline-date">16 – 31 agosto</div>
                  <div className="timeline-title">Registro de proyectos</div>
                  <p className="timeline-text">
                    Inscripción de equipos, carga de información básica del
                    proyecto y asignación provisional de categoría.
                  </p>
                </div>
                <div className="timeline-item">
                  <div className="timeline-date">01 – 15 septiembre</div>
                  <div className="timeline-title">
                    Envío de resúmenes y póster
                  </div>
                  <p className="timeline-text">
                    Presentación de resumen extendido y diseño preliminar de
                    póster científico para revisión por parte de los jurados.
                  </p>
                </div>
                <div className="timeline-item">
                  <div className="timeline-date">10 – 12 octubre</div>
                  <div className="timeline-title">Feria presencial</div>
                  <p className="timeline-text">
                    Exposición de proyectos en stands, demostraciones, visitas
                    guiadas y evaluación por tribunal académico.
                  </p>
                </div>
                <div className="timeline-item">
                  <div className="timeline-date">12 octubre</div>
                  <div className="timeline-title">
                    Premiación y reconocimientos
                  </div>
                  <p className="timeline-text">
                    Entrega de certificados, menciones honoríficas y premios a
                    los proyectos destacados de cada eje temático.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* PARTICIPAR / BENEFICIOS */}
          <section id="participar">
            <div className="container">
              <div className="section-header">
                <div className="section-kicker">Participar</div>
                <h2 className="section-title">¿Quiénes pueden participar?</h2>
                <p className="section-description">
                  La Feria de Semilleros está pensada para la comunidad FICCT,
                  pero también se abre a invitados y aliados estratégicos de la
                  facultad.
                </p>
              </div>

              <div className="cards-3">
                <div className="card">
                  <div className="tag-pill">Estudiantes FICCT</div>
                  <div className="card-title">
                    Semilleros y equipos estudiantiles
                  </div>
                  <p>
                    Estudiantes de cualquier semestre que formen parte de
                    semilleros de investigación, grupos de estudio o equipos de
                    proyecto vinculados a un docente guía.
                  </p>
                </div>
                <div className="card">
                  <div className="tag-pill">Docentes e investigadores</div>
                  <div className="card-title">Líderes de semilleros</div>
                  <p>
                    Docentes que coordinen semilleros, líneas de investigación o
                    proyectos institucionales y deseen presentar avances o
                    resultados junto a sus estudiantes.
                  </p>
                </div>
                <div className="card">
                  <div className="tag-pill">Aliados externos</div>
                  <div className="card-title">Empresas e instituciones</div>
                  <p>
                    Empresas de tecnología, startups, ONGs o instituciones
                    públicas interesadas en conocer proyectos, proponer retos o
                    apoyar iniciativas FICCT.
                  </p>
                </div>
              </div>

              <div className="cta">
                <div className="cta-text">
                  <strong>¿Listo para mostrar tu proyecto?</strong>
                  <br />
                  Prepara tu resumen, define tu eje temático y coordina con tu
                  docente guía. El siguiente paso es completar el formulario de
                  registro institucional.
                </div>
                <div>
                  <Link to="/login" className="btn btn-primary">
                    Consultar requisitos con la comisión
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* CONTACTO */}
          <section id="contacto">
            <div className="container">
              <div className="section-header">
                <div className="section-kicker">Contáctenos</div>
                <h2 className="section-title">Zona de contacto</h2>
                <p className="section-description">
                  Si tienes dudas sobre las bases, el proceso de inscripción,
                  los ejes temáticos o requieres una carta oficial para tu
                  semillero, completa el formulario o utiliza los canales de
                  contacto de la FICCT.
                </p>
              </div>

              <div className="contact-grid">
                <div className="contact-card">
                  <form className="form-grid" onSubmit={handleSubmit}>
                    <div className="form-row">
                      <div>
                        <label htmlFor="nombre">Nombre completo</label>
                        <input
                          id="nombre"
                          name="nombre"
                          type="text"
                          placeholder="Ej: Juan Pérez"
                          value={formValues.nombre}
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <label htmlFor="correo">Correo</label>
                        <input
                          id="correo"
                          name="correo"
                          type="email"
                          placeholder="Ej: jperez@gmail.com"
                          value={formValues.correo}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div>
                        <label htmlFor="rol">Rol en la feria</label>
                        <select
                          id="rol"
                          name="rol"
                          value={formValues.rol}
                          onChange={handleChange}
                        >
                          <option value="">Selecciona una opción</option>
                          <option value="estudiante">Estudiante</option>
                          <option value="docente">Docente</option>
                          <option value="empresa">
                            Empresa / institución
                          </option>
                          <option value="otro">Otro</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="tema">Motivo de la consulta</label>
                        <select
                          id="tema"
                          name="tema"
                          value={formValues.tema}
                          onChange={handleChange}
                        >
                          <option value="">Selecciona un motivo</option>
                          <option value="inscripcion">
                            Inscripción de proyecto
                          </option>
                          <option value="bases">Bases y reglamento</option>
                          <option value="jurados">Evaluación y jurados</option>
                          <option value="logistica">
                            Logística y horarios
                          </option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="mensaje">Mensaje</label>
                      <textarea
                        id="mensaje"
                        name="mensaje"
                        placeholder="Escribe tu consulta aquí..."
                        value={formValues.mensaje}
                        onChange={handleChange}
                      ></textarea>
                    </div>

                    <div>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Enviando..." : "Enviar consulta"}
                      </button>
                    </div>
                  </form>
                </div>

                <div className="contact-meta">
                  <div className="contact-item">
                    <div className="contact-label">Correo oficial</div>
                    <div className="contact-value">
                      feria.semilleros@ficct.uagrm.bo
                    </div>
                    <p className="contact-note">
                      Para envío de documentos formales, cartas de invitación o
                      coordinación institucional.
                    </p>
                  </div>

                  <div className="contact-item">
                    <div className="contact-label">Ubicación</div>
                    <div className="contact-value">
                      Facultad de Ingeniería en Ciencias de la Computación y
                      Telecomunicaciones (FICCT) – Campus UAGRM
                    </div>
                    <p className="contact-note">
                      Bloque de la FICCT, área de laboratorios y salas de
                      cómputo, Santa Cruz de la Sierra.
                    </p>
                  </div>

                  <div className="contact-item">
                    <div className="contact-label">Horarios de atención</div>
                    <div className="contact-value">
                      Lunes a viernes – 09:00 - 12:00 y 15:00 - 19:00
                    </div>
                    <p className="contact-note">
                      Atención presencial en coordinación de carrera o mediante
                      los canales oficiales de la facultad.
                    </p>
                  </div>
                </div>
              </div>

              <footer>
                <div className="container">
                  <div className="footer-row">
                    <div>
                      Feria de Semilleros FICCT – UAGRM – 2025.
                      <span> Vista previa de landing page sin funciones.</span>
                    </div>
                    <div className="footer-links">
                      <a href="#inicio">Volver al inicio</a>
                      <a href="#sobre">Sobre la feria</a>
                      <a href="#contacto">Contacto</a>
                    </div>
                  </div>
                </div>
              </footer>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default LandingPage;
