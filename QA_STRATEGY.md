# 🏗️ Bloque 1: Automation (Web & E2E con Playwright)

Este bloque se enfoca en la automatización del flujo completo del usuario en la interfaz gráfica (UI), garantizando que las aplicaciones web funcionen correctamente en cualquier navegador.

### 1. Playwright
* **¿Qué es?** Es el framework moderno de código abierto desarrollado por Microsoft para pruebas de extremo a extremo (End-to-End). Permite automatizar interacciones en navegadores web (Chromium, Firefox, WebKit) utilizando una sola API en lenguajes como JavaScript/TypeScript o Python.

* **Características Clave:**
  * **Auto-wait:** Espera automáticamente a que los elementos de la página estén visibles y listos para interactuar antes de ejecutar una acción, eliminando los tests falsos positivos (*flaky tests*).
  * **Ejecución Paralela Nativa:** Corre múltiples pruebas al mismo tiempo, reduciendo drásticamente el tiempo de ejecución en entornos de CI/CD.
  * **Trace Viewer:** Herramienta que graba la ejecución completa de la prueba, permitiendo hacer un "paso a paso" post-mortem con capturas de pantalla, logs de la consola y peticiones de red para diagnosticar fallos rápidamente.

* **Rol en el Portfolio:** Es la herramienta principal para validar regresiones visuales, flujos críticos de negocio (ej. registros, compras, flujos de formularios) y compatibilidad entre navegadores.

---

# 🔗 Bloque 2: API Services (Postman, Newman & Jenkins)

Este bloque se centra en la capa de servicios (backend), validando la lógica de negocio, la integridad de los datos y la comunicación entre sistemas sin depender de la interfaz visual.

### 1. Postman
* **¿Qué es?** Es el entorno de desarrollo y diseño para APIs. Permite configurar peticiones HTTP (GET, POST, PUT, DELETE), gestionar variables dinámicas por entornos (QA, Staging, Prod) y escribir aserciones en JavaScript para validar la estructura del JSON, códigos de estado (Status Codes) y contratos de la API.
* **Rol en el Portfolio:** Funciona como el laboratorio de diseño donde creas y organizas las colecciones de pruebas de integración.

### 2. Newman
* **¿Qué es?** Es el ejecutor de colecciones de Postman nativo para la línea de comandos (CLI). Al no requerir una interfaz gráfica, permite correr las suites de pruebas de API directamente desde la consola del sistema operativo.
* **Rol en el Portfolio:** Es el motor que transforma tus pruebas manuales o visuales de Postman en scripts automatizados aptos para servidores de integración.

### 3. Jenkins
* **¿Qué es?** Es un servidor de automatización Open Source que actúa como el orquestador del Pipeline de Integración Continua (CI). Mediante un archivo de configuración (*Jenkinsfile*), automatiza tareas repetitivas ante cambios en el código.
* **Rol en el Portfolio:** Es el cerebro que detecta cuando un desarrollador sube código, descarga el proyecto, ejecuta **Newman** para validar los **API Services**, y detiene el despliegue si alguna prueba funcional falla.

---

# ⚡ Bloque 3: Performance Engineering & Infraestructura (k6, Docker & K8s)

Este bloque evalúa el comportamiento del sistema bajo condiciones de estrés extremo, simulando tráfico masivo para encontrar el punto de quiebre de la aplicación y la infraestructura contenedora.

### 🧪 Estrategias de Inyección de Carga (Tipos de Pruebas en k6)
* **Load Test (Carga Estándar):** Simula el tráfico esperado en un día normal de producción con usuarios concurrentes constantes. Valida si el sistema cumple con los acuerdos de nivel de servicio (SLAs).
* **Stress Test (Estrés):** Incrementa la carga de usuarios virtuales (VUs) de forma escalonada más allá del límite operativo normal para encontrar el punto de quiebre del sistema y ver cómo se recupera.
* **Spike Test (Pico):** Inyecta una cantidad masiva de usuarios en pocos segundos para evaluar si la arquitectura absorbe impactos súbitos (ej. eventos de ventas masivas o notificaciones push) sin tirar los servicios.
* **Soak / Endurance Test (Resistencia):** Mantiene una carga constante y alta durante horas o días para detectar degradación lenta de performance, como fugas de memoria (*memory leaks*) o saturación de conexiones a bases de datos.

### 🛠️ Herramientas de Inyección e Infraestructura
* **k6:** Herramienta moderna de pruebas de carga desarrollada por Grafana Labs. Escrita en Go (altamente eficiente en hilos) y programable en JavaScript. Es ligera, ágil para pipelines y consume mínimos recursos de sistema para inyectar miles de usuarios virtuales.
* **Docker:** Tecnología de contenedores que aísla la aplicación, las bases de datos y los agentes de inyección en entornos idénticos, limpios y reproducibles en cualquier máquina.
* **Kubernetes (K8s) & Pods:** Orquestador de contenedores. Un *Pod* es la unidad mínima donde corre la aplicación en K8s. En Performance, k6 ataca los endpoints para evaluar si las reglas de *Horizontal Pod Autoscaling* (HPA) funcionan creando nuevos pods automáticamente cuando la carga satura el sistema.

---

# 📊 Bloque 4: Monitoreo & Observabilidad (Prometheus & Grafana)

Este bloque se enfoca en la recolección, almacenamiento y visualización de métricas en tiempo real. Su objetivo es auditar la salud de los microservicios y de la infraestructura bajo prueba, permitiendo el diagnóstico preciso de cuellos de botella.

### 1. Prometheus
* **¿Qué es?** Es un sistema de monitoreo de código abierto y una base de datos de series temporales (TSDB). Funciona bajo un modelo "pull", lo que significa que va a buscar (*scrape*) activamente las métricas de rendimiento expuestas por los servidores, contenedores y microservicios a intervalos regulares.
* **Métricas Clave que recolecta:**
  * **De Infraestructura (Host/Pods):** Uso de CPU (por núcleo), consumo de memoria RAM (y alertas de falta de memoria / *OOMKilled*), entrada/salida de red (I/O) y espacio en disco.
  * **De Servicios (APIs/Aplicación):** Tasa de peticiones por segundo (*Throughput*), porcentaje de errores (4xx, 5xx) y tiempos de latencia interna del servidor.


---

## 📊 Estrategia de Observabilidad & Monitoreo (Shift-Right Testing)

La estrategia de calidad no termina cuando el código se despliega. Implementamos prácticas de **Observabilidad** para transformar datos duros de infraestructura en insights de negocio y estabilidad de software.

### 1. Los Tres Pilares de la Observabilidad en QA
* **Métricas (Metrics):** Monitoreo en tiempo real de la salud del clúster a través de Prometheus (CPU Throttling, Memory Usage, saturación de red, y tasas de error HTTP 4xx/5xx).
* **Logs:** Centralización de registros de los microservicios para realizar análisis forense ante fallas puntuales (Stack traces, excepciones no controladas).
* **Trazas (Traces):** Mapeo del viaje de una petición a través de los diferentes componentes de la arquitectura para aislar qué microservicio o consulta de base de datos introduce latencia.

### 2. Monitoreo Activo vs. Pasivo
* **Monitoreo Sintético (Active):** Scripts automatizados (Playwright/APIs) ejecutándose de forma cíclica en producción para detectar caídas críticas antes que los usuarios reales.
* **Monitoreo de Usuario Real (RUM / Passive):** Análisis de la experiencia real del usuario final en Azure (Tiempos de carga reales, tasas de rebote por performance).

### 3. Quality Gates de Infraestructura
Establecemos umbrales donde una degradación de hardware detiene un despliegue, incluso si las pruebas funcionales dan verde:
* Alerta de **OOMKilled** (Out Of Memory) inminente en los Pods de Kubernetes.
* Incremento mayor al 5% en la latencia del percentil 95 ($p(95)$) en las llamadas de API persistentes.

### 2. Grafana
* **¿Qué es?** Es la plataforma líder de análisis, visualización y paneles (*dashboards*) interactivos. No almacena datos por sí misma; se conecta a fuentes de datos como Prometheus para consultar esas métricas puras y transformarlas en gráficos de líneas, barras y mapas de calor altamente visuales.
* **Rol en el Monitoreo de Performance:** Es la cabina de control del ingeniero. Permite correlacionar de forma visual el tráfico que está inyectando k6 (e.g., 2000 usuarios virtuales) con el impacto real en el clúster de Kubernetes y la base de datos en ese preciso segundo, facilitando la detección de cuellos de botella (como picos de CPU o caídas de memoria).

Gracias por leer
Atte Fernando G. Guzmán
