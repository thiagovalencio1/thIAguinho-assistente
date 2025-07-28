/**
 * Service Worker para Assistente Virtual Automotivo
 * Funcionalidade PWA e cache offline
 */

const CACHE_NAME = 'assistente-automotivo-v1.0.0';
const urlsToCache = [
    '/',
    '/index.html',
    '/app.js',
    '/ai-engine.js',
    '/elm327-service.js',
    'https://cdn.tailwindcss.com',
    'https://unpkg.com/lucide@latest/dist/umd/lucide.js',
    'https://cdn.jsdelivr.net/npm/chart.js'
];

// Instalação do Service Worker
self.addEventListener('install', event => {
    console.log('🔧 Service Worker: Instalando...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('📦 Service Worker: Cache aberto');
                return cache.addAll(urlsToCache);
            })
            .then(() => {
                console.log('✅ Service Worker: Instalado com sucesso');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('❌ Service Worker: Erro na instalação:', error);
            })
    );
});

// Ativação do Service Worker
self.addEventListener('activate', event => {
    console.log('🚀 Service Worker: Ativando...');
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('🗑️ Service Worker: Removendo cache antigo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('✅ Service Worker: Ativado com sucesso');
            return self.clients.claim();
        })
    );
});

// Interceptação de requisições
self.addEventListener('fetch', event => {
    // Ignorar requisições não-GET
    if (event.request.method !== 'GET') {
        return;
    }

    // Ignorar requisições para APIs externas específicas
    if (event.request.url.includes('chrome-extension://') ||
        event.request.url.includes('moz-extension://') ||
        event.request.url.includes('webkit-extension://')) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Retorna do cache se encontrado
                if (response) {
                    console.log('📦 Service Worker: Servindo do cache:', event.request.url);
                    return response;
                }

                // Busca na rede
                return fetch(event.request)
                    .then(response => {
                        // Verifica se a resposta é válida
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clona a resposta
                        const responseToCache = response.clone();

                        // Adiciona ao cache
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    })
                    .catch(error => {
                        console.error('❌ Service Worker: Erro na requisição:', error);
                        
                        // Retorna página offline para navegação
                        if (event.request.destination === 'document') {
                            return caches.match('/index.html');
                        }
                        
                        throw error;
                    });
            })
    );
});

// Mensagens do cliente
self.addEventListener('message', event => {
    console.log('💬 Service Worker: Mensagem recebida:', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_NAME });
    }
});

// Sincronização em background
self.addEventListener('sync', event => {
    console.log('🔄 Service Worker: Sincronização em background:', event.tag);
    
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

// Função de sincronização
async function doBackgroundSync() {
    try {
        console.log('🔄 Service Worker: Executando sincronização...');
        
        // Aqui você pode implementar lógica de sincronização
        // Por exemplo, enviar dados offline para o servidor
        
        console.log('✅ Service Worker: Sincronização concluída');
    } catch (error) {
        console.error('❌ Service Worker: Erro na sincronização:', error);
    }
}

// Notificações push
self.addEventListener('push', event => {
    console.log('📱 Service Worker: Notificação push recebida');
    
    const options = {
        body: event.data ? event.data.text() : 'Nova notificação do Assistente Automotivo',
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Abrir App',
                icon: '/icon-192x192.png'
            },
            {
                action: 'close',
                title: 'Fechar',
                icon: '/icon-192x192.png'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('Assistente Automotivo', options)
    );
});

// Clique em notificação
self.addEventListener('notificationclick', event => {
    console.log('👆 Service Worker: Clique em notificação:', event.action);
    
    event.notification.close();

    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    } else if (event.action === 'close') {
        // Apenas fecha a notificação
    } else {
        // Clique padrão na notificação
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Erro não capturado
self.addEventListener('error', event => {
    console.error('❌ Service Worker: Erro não capturado:', event.error);
});

// Rejeição de Promise não capturada
self.addEventListener('unhandledrejection', event => {
    console.error('❌ Service Worker: Promise rejeitada:', event.reason);
});

console.log('🚗 Service Worker do Assistente Virtual Automotivo carregado');

