import http from 'k6/http';
import { check, sleep } from 'k6';

// =============================================================================
// CONFIGURACIÓN DE ESCENARIOS (LOAD, STRESS, SPIKE, SOAK)
// =============================================================================
export const options = {
    scenarios: {
        // 1. LOAD TEST: Valida el rendimiento bajo condiciones normales esperadas.
        escenario_load: {
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                { duration: '1m', target: 50 },  // Rampa de subida normal
                { duration: '3m', target: 50 },  // Meseta: se mantiene la carga esperada
                { duration: '1m', target: 0 },   // Rampa de bajada limpia
            ],
            gracefulRampDown: '30s',
        },

        // 2. STRESS TEST: Busca el punto de quiebre aumentando la carga progresivamente.
        escenario_stress: {
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                { duration: '1m', target: 100 }, // Carga normal
                { duration: '2m', target: 100 },
                { duration: '1m', target: 250 }, // Primer pico de estrés
                { duration: '2m', target: 250 },
                { duration: '1m', target: 500 }, // Rompiendo el límite teórico
                { duration: '2m', target: 500 },
                { duration: '1m', target: 0 },
            ],
            startTime: '5m', // Se ejecuta después del Load Test si corren juntos
        },

        // 3. SPIKE TEST: Evalúa la capacidad de absorción ante picos de tráfico súbitos.
        escenario_spike: {
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                { duration: '10s', target: 0 },
                { duration: '20s', target: 600 }, // Inyección masiva en 20 segundos
                { duration: '1m', target: 600 },  // Sostiene el impacto brevemente
                { duration: '20s', target: 0 },   // Caída drástica
            ],
            startTime: '14m',
        },

        // 4. SOAK TEST: Detecta degradación, memory leaks o saturación a largo plazo.
        escenario_soak: {
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                { duration: '2m', target: 40 },  // Rampa rápida a carga sostenible
                { duration: '30m', target: 40 }, // Prueba de resistencia (en prod serían horas)
                { duration: '2m', target: 0 },
            ],
            startTime: '16m',
        },
    },

    // =============================================================================
    // UMBRALES DE ACEPTACIÓN (SLAs & QUALITY GATES)
    // =============================================================================
    thresholds: {
        // El 95% de las peticiones generales deben responder en menos de 1.5 segundos
        http_req_duration: ['p(95)<1500'],
        // El porcentaje de error total del sistema no debe superar el 2%
        http_req_failed: ['rate<0.02'],
        // El percentil 99 específico del escenario Load debe ser óptimo (< 800ms)
        'http_req_duration{scenario:escenario_load}': ['p(99)<800'],
    },
};

// =============================================================================
// FLUJO DE LA PRUEBA (TRANSACCIÓN BASE)
// =============================================================================
export default function () {
    // Endpoint de simulación pública por temas de copyright
    const url = 'https://jsonplaceholder.typicode.com/posts/1';
    
    const params = {
        headers: {
            'Content-Type': 'application/json',
            'X-Target-Environment': 'QA-Portfolio',
        },
    };

    // Ejecución de la petición HTTP GET
    const res = http.get(url, params);

    // Verificaciones funcionales básicas durante la carga
    check(res, {
        'status es 200': (r) => r.status === 200,
        'tiempo de respuesta aceptable': (r) => r.timings.duration < 2000,
    });

    // Tiempo de pensamiento del usuario (Pacing/Think Time)
    sleep(1);
}
