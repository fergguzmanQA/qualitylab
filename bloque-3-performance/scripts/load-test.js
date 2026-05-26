import http from 'k6/http';
import { check, sleep } from 'k6';

// 1. Configuración de la carga (Escenario MVP) y Umbrales (SLAs)
export const options = {
    stages: [
        { duration: '10s', target: 5 },  // Rampa de subida: de 0 a 5 usuarios en 10 segundos
        { duration: '20s', target: 5 },  // Meseta: mantener 5 usuarios por 20 segundos
        { duration: '10s', target: 0 },  // Rampa de bajada: volver a 0 usuarios
    ],
    thresholds: {
        http_req_failed: ['rate<0.01'],   // El porcentaje de error debe ser menor al 1%
        http_req_duration: ['p(95)<2000'], // El 95% de las peticiones debe responder en menos de 2 segundos (2000ms)
    },
};

// 2. Flujo de la prueba (Lo que hace cada usuario virtual)
export default function () {
    // Pegamos a un endpoint público simulado por razones de copyright
    const res = http.get('https://jsonplaceholder.typicode.com/posts/1');
    
    // Validamos que el servidor responda con un estado 200
    check(res, {
        'status es 200': (r) => r.status === 200,
    });

    // Pausa aleatoria entre usuarios para simular comportamiento humano real
    sleep(1);
}
