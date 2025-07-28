/**
 * Aplicação Principal do Assistente Virtual Automotivo
 * Integração completa de IA, ELM327, interface e funcionalidades
 */

class AssistenteAutomotivo {
    constructor() {
        this.currentTab = 'dashboard';
        this.charts = {};
        this.isInitialized = false;
        this.vehicleData = {
            brand: 'Toyota',
            model: 'Corolla',
            year: 2020,
            mileage: 45230,
            lastMaintenance: '2024-11-15'
        };
        this.init();
    }

    async init() {
        console.log('🚗 Inicializando Assistente Virtual Automotivo...');
        
        try {
            // Inicializar ícones Lucide
            lucide.createIcons();
            
            // Configurar event listeners
            this.setupEventListeners();
            
            // Inicializar gráficos
            this.initializeCharts();
            
            // Configurar callbacks dos serviços
            this.setupServiceCallbacks();
            
            // Inicializar dados em tempo real
            this.startRealTimeUpdates();
            
            // Carregar dados salvos
            this.loadSavedData();
            
            this.isInitialized = true;
            console.log('✅ Assistente Virtual Automotivo inicializado com sucesso!');
            
            // Mostrar mensagem de boas-vindas
            this.showWelcomeMessage();
            
        } catch (error) {
            console.error('❌ Erro na inicialização:', error);
        }
    }

    // Configurar event listeners
    setupEventListeners() {
        // Navegação por abas
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.currentTarget.dataset.tab;
                this.switchTab(tab);
            });
        });

        // Chat
        const chatInput = document.getElementById('chatInput');
        const sendBtn = document.getElementById('sendBtn');
        const voiceBtn = document.getElementById('voiceBtn');

        if (chatInput && sendBtn) {
            sendBtn.addEventListener('click', () => this.sendChatMessage());
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendChatMessage();
                }
            });
        }

        if (voiceBtn) {
            voiceBtn.addEventListener('click', () => this.startVoiceRecognition());
        }

        // Scanner ELM327
        const connectBtn = document.getElementById('connectBtn');
        const readDtcBtn = document.getElementById('readDtcBtn');
        const clearDtcBtn = document.getElementById('clearDtcBtn');
        const liveDataBtn = document.getElementById('liveDataBtn');

        if (connectBtn) {
            connectBtn.addEventListener('click', () => this.connectScanner());
        }
        if (readDtcBtn) {
            readDtcBtn.addEventListener('click', () => this.readDTCs());
        }
        if (clearDtcBtn) {
            clearDtcBtn.addEventListener('click', () => this.clearDTCs());
        }
        if (liveDataBtn) {
            liveDataBtn.addEventListener('click', () => this.toggleLiveData());
        }

        // Botão de emergência
        const emergencyBtn = document.getElementById('emergencyBtn');
        if (emergencyBtn) {
            emergencyBtn.addEventListener('click', () => this.handleEmergency());
        }

        // Notificações
        const notificationBtn = document.getElementById('notificationBtn');
        if (notificationBtn) {
            notificationBtn.addEventListener('click', () => this.showNotifications());
        }
    }

    // Trocar aba
    switchTab(tabName) {
        // Atualizar botões
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tab === tabName) {
                btn.classList.add('active');
            }
        });

        // Mostrar/ocultar conteúdo
        document.querySelectorAll('.tab-content-panel').forEach(panel => {
            panel.classList.add('hidden');
        });

        const targetPanel = document.getElementById(`${tabName}-tab`);
        if (targetPanel) {
            targetPanel.classList.remove('hidden');
        }

        this.currentTab = tabName;
        
        // Atualizar gráficos se necessário
        if (tabName === 'reports') {
            setTimeout(() => {
                this.updateCharts();
            }, 100);
        }
    }

    // Inicializar gráficos
    initializeCharts() {
        this.initializePerformanceChart();
        this.initializeFuelChart();
        this.initializeCostChart();
    }

    // Gráfico de performance
    initializePerformanceChart() {
        const ctx = document.getElementById('performanceChart');
        if (!ctx) return;

        const data = {
            labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
            datasets: [{
                label: 'Consumo (km/l)',
                data: [14.2, 13.8, 14.5, 14.1, 13.9, 15.2, 14.8],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true
            }]
        };

        this.charts.performance = new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 13,
                        max: 16
                    }
                }
            }
        });
    }

    // Gráfico de combustível
    initializeFuelChart() {
        const ctx = document.getElementById('fuelChart');
        if (!ctx) return;

        const data = {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
            datasets: [{
                label: 'Consumo Médio (km/l)',
                data: [13.5, 14.1, 13.8, 14.2, 14.5, 14.3],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: 'Gasto (R$)',
                data: [1200, 1150, 1300, 1250, 1180, 1220],
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                tension: 0.4,
                fill: true,
                yAxisID: 'y1'
            }]
        };

        this.charts.fuel = new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        grid: {
                            drawOnChartArea: false,
                        },
                    }
                }
            }
        });
    }

    // Gráfico de custos
    initializeCostChart() {
        const ctx = document.getElementById('costChart');
        if (!ctx) return;

        const data = {
            labels: ['Combustível', 'Manutenção', 'Seguro', 'Outros'],
            datasets: [{
                data: [1250, 450, 280, 150],
                backgroundColor: [
                    '#3b82f6',
                    '#10b981',
                    '#f59e0b',
                    '#ef4444'
                ],
                borderWidth: 0
            }]
        };

        this.charts.cost = new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Atualizar gráficos
    updateCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart) {
                chart.update();
            }
        });
    }

    // Configurar callbacks dos serviços
    setupServiceCallbacks() {
        // Callback de conexão ELM327
        elm327Service.onConnectionChange((connected, error) => {
            this.updateConnectionStatus(connected, error);
        });

        // Callback de dados ELM327
        elm327Service.onDataReceived((data) => {
            this.handleELM327Data(data);
        });
    }

    // Atualizar status de conexão
    updateConnectionStatus(connected, error) {
        const statusElement = document.getElementById('scannerStatus');
        const connectBtn = document.getElementById('connectBtn');
        const connectionStatus = document.getElementById('connectionStatus');
        
        if (connected) {
            if (statusElement) statusElement.textContent = 'Conectado';
            if (connectBtn) {
                connectBtn.textContent = 'Desconectar';
                connectBtn.classList.remove('bg-blue-600', 'hover:bg-blue-700');
                connectBtn.classList.add('bg-red-600', 'hover:bg-red-700');
            }
            if (connectionStatus) connectionStatus.classList.add('status-indicator');
            
            // Habilitar botões do scanner
            this.enableScannerButtons(true);
            
            this.showNotification('✅ Scanner ELM327 conectado com sucesso!', 'success');
        } else {
            if (statusElement) statusElement.textContent = error ? `Erro: ${error}` : 'Desconectado';
            if (connectBtn) {
                connectBtn.textContent = 'Conectar Scanner';
                connectBtn.classList.remove('bg-red-600', 'hover:bg-red-700');
                connectBtn.classList.add('bg-blue-600', 'hover:bg-blue-700');
            }
            if (connectionStatus) connectionStatus.classList.remove('status-indicator');
            
            // Desabilitar botões do scanner
            this.enableScannerButtons(false);
            
            if (error) {
                this.showNotification(`❌ Erro na conexão: ${error}`, 'error');
            }
        }
    }

    // Habilitar/desabilitar botões do scanner
    enableScannerButtons(enabled) {
        const buttons = ['readDtcBtn', 'clearDtcBtn', 'liveDataBtn'];
        buttons.forEach(btnId => {
            const btn = document.getElementById(btnId);
            if (btn) {
                btn.disabled = !enabled;
                if (enabled) {
                    btn.classList.remove('opacity-50');
                } else {
                    btn.classList.add('opacity-50');
                }
            }
        });
    }

    // Conectar scanner
    async connectScanner() {
        const connectBtn = document.getElementById('connectBtn');
        
        if (elm327Service.isConnected) {
            // Desconectar
            await elm327Service.disconnect();
            return;
        }

        try {
            if (connectBtn) {
                connectBtn.textContent = 'Conectando...';
                connectBtn.disabled = true;
            }

            await elm327Service.connect();
            
        } catch (error) {
            console.error('Erro ao conectar scanner:', error);
            this.showNotification('❌ Erro ao conectar scanner. Verifique se o dispositivo está ligado e próximo.', 'error');
        } finally {
            if (connectBtn) {
                connectBtn.disabled = false;
            }
        }
    }

    // Ler DTCs
    async readDTCs() {
        try {
            this.showNotification('🔍 Lendo códigos de diagnóstico...', 'info');
            
            const dtcs = await elm327Service.readDTCs();
            this.displayDTCs(dtcs);
            
            if (dtcs.length === 0) {
                this.showNotification('✅ Nenhum código de erro encontrado!', 'success');
            } else {
                this.showNotification(`⚠️ Encontrados ${dtcs.length} código(s) de erro`, 'warning');
            }
            
        } catch (error) {
            console.error('Erro ao ler DTCs:', error);
            this.showNotification('❌ Erro ao ler códigos de diagnóstico', 'error');
        }
    }

    // Exibir DTCs
    displayDTCs(dtcs) {
        const dtcResults = document.getElementById('dtcResults');
        const dtcList = document.getElementById('dtcList');
        
        if (!dtcResults || !dtcList) return;

        if (dtcs.length === 0) {
            dtcResults.classList.add('hidden');
            return;
        }

        dtcList.innerHTML = '';
        
        dtcs.forEach(dtc => {
            const dtcElement = document.createElement('div');
            dtcElement.className = 'p-4 border border-red-200 rounded-lg bg-red-50';
            
            const severityColor = dtc.severity === 'Alto' ? 'text-red-600' : 
                                 dtc.severity === 'Médio' ? 'text-yellow-600' : 'text-blue-600';
            
            dtcElement.innerHTML = `
                <div class="flex items-start justify-between">
                    <div class="flex-1">
                        <h4 class="font-semibold text-gray-900">${dtc.code}</h4>
                        <p class="text-sm text-gray-600 mt-1">${dtc.description}</p>
                        <div class="flex items-center mt-2 space-x-4">
                            <span class="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                                ${dtc.status || 'Ativo'}
                            </span>
                            <span class="text-xs ${severityColor} font-medium">
                                Severidade: ${dtc.severity}
                            </span>
                        </div>
                    </div>
                    <button onclick="assistente.askAIAboutDTC('${dtc.code}')" 
                            class="ml-4 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                        Perguntar à IA
                    </button>
                </div>
            `;
            
            dtcList.appendChild(dtcElement);
        });
        
        dtcResults.classList.remove('hidden');
    }

    // Limpar DTCs
    async clearDTCs() {
        if (!confirm('Tem certeza que deseja limpar todos os códigos de diagnóstico?')) {
            return;
        }

        try {
            this.showNotification('🧹 Limpando códigos de diagnóstico...', 'info');
            
            const result = await elm327Service.clearDTCs();
            
            if (result.success) {
                this.showNotification('✅ Códigos de diagnóstico limpos com sucesso!', 'success');
                
                // Ocultar resultados de DTCs
                const dtcResults = document.getElementById('dtcResults');
                if (dtcResults) {
                    dtcResults.classList.add('hidden');
                }
                
                // Atualizar dashboard
                this.updateDashboardStatus();
            }
            
        } catch (error) {
            console.error('Erro ao limpar DTCs:', error);
            this.showNotification('❌ Erro ao limpar códigos de diagnóstico', 'error');
        }
    }

    // Alternar dados ao vivo
    async toggleLiveData() {
        const liveDataBtn = document.getElementById('liveDataBtn');
        
        if (elm327Service.monitoringInterval) {
            // Parar monitoramento
            elm327Service.stopMonitoring();
            if (liveDataBtn) {
                liveDataBtn.textContent = 'Iniciar Dados ao Vivo';
                liveDataBtn.classList.remove('bg-red-600', 'hover:bg-red-700');
                liveDataBtn.classList.add('bg-purple-600', 'hover:bg-purple-700');
            }
            this.showNotification('⏹️ Monitoramento parado', 'info');
        } else {
            // Iniciar monitoramento
            elm327Service.startMonitoring(2000);
            if (liveDataBtn) {
                liveDataBtn.textContent = 'Parar Dados ao Vivo';
                liveDataBtn.classList.remove('bg-purple-600', 'hover:bg-purple-700');
                liveDataBtn.classList.add('bg-red-600', 'hover:bg-red-700');
            }
            this.showNotification('📊 Monitoramento iniciado', 'success');
        }
    }

    // Manipular dados do ELM327
    handleELM327Data(data) {
        if (data.type === 'liveData') {
            this.updateRealTimeData(data.data);
        }
    }

    // Atualizar dados em tempo real
    updateRealTimeData(data) {
        const elements = {
            rpmValue: data.rpm,
            speedValue: `${data.speed} km/h`,
            tempValue: `${data.temperature}°C`,
            fuelValue: `${(data.speed / (data.rpm / 1000) * 0.8).toFixed(1)} km/l`
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });
    }

    // Iniciar atualizações em tempo real
    startRealTimeUpdates() {
        setInterval(() => {
            if (!elm327Service.isConnected) {
                // Simular dados quando não conectado
                const simulatedData = elm327Service.simulateLiveData();
                this.updateRealTimeData(simulatedData);
            }
        }, 3000);
    }

    // Chat com IA
    async sendChatMessage() {
        const chatInput = document.getElementById('chatInput');
        const chatMessages = document.getElementById('chatMessages');
        
        if (!chatInput || !chatMessages) return;
        
        const message = chatInput.value.trim();
        if (!message) return;

        // Adicionar mensagem do usuário
        this.addChatMessage('user', message);
        chatInput.value = '';

        try {
            // Processar com IA
            const response = await aiEngine.processMessage(message);
            
            // Adicionar resposta da IA
            this.addChatMessage('ai', response);
            
        } catch (error) {
            console.error('Erro no chat:', error);
            this.addChatMessage('ai', 'Desculpe, ocorreu um erro. Tente novamente.');
        }
    }

    // Adicionar mensagem ao chat
    addChatMessage(type, message) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        const messageElement = document.createElement('div');
        messageElement.className = `chat-bubble p-3 rounded-lg ${
            type === 'user' ? 'bg-blue-50 ml-8' : 'bg-gray-50 mr-8'
        }`;

        const formattedMessage = message.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        messageElement.innerHTML = `
            <p class="text-sm">
                <strong>${type === 'user' ? 'Você' : 'IA'}:</strong> 
                ${formattedMessage}
            </p>
        `;

        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Perguntar à IA sobre DTC
    async askAIAboutDTC(dtcCode) {
        this.switchTab('chat');
        
        const message = `Me explique sobre o código de erro ${dtcCode}`;
        const chatInput = document.getElementById('chatInput');
        if (chatInput) {
            chatInput.value = message;
            await this.sendChatMessage();
        }
    }

    // Reconhecimento de voz
    startVoiceRecognition() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            this.showNotification('❌ Reconhecimento de voz não suportado neste navegador', 'error');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.lang = 'pt-BR';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
            this.showNotification('🎤 Escutando... Fale agora!', 'info');
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            const chatInput = document.getElementById('chatInput');
            if (chatInput) {
                chatInput.value = transcript;
                this.sendChatMessage();
            }
        };

        recognition.onerror = (event) => {
            console.error('Erro no reconhecimento de voz:', event.error);
            this.showNotification('❌ Erro no reconhecimento de voz', 'error');
        };

        recognition.start();
    }

    // Emergência
    handleEmergency() {
        this.switchTab('chat');
        
        const emergencyMessage = 'Emergência! Preciso de ajuda urgente com meu veículo!';
        const chatInput = document.getElementById('chatInput');
        if (chatInput) {
            chatInput.value = emergencyMessage;
            this.sendChatMessage();
        }
    }

    // Notificações
    showNotifications() {
        const notifications = [
            { type: 'warning', message: 'Troca de óleo vence em 15 dias' },
            { type: 'info', message: 'Revisão agendada para 30/12/2024' },
            { type: 'success', message: 'Filtro de ar substituído com sucesso' }
        ];

        let notificationHtml = '<div class="space-y-2">';
        notifications.forEach(notif => {
            const icon = notif.type === 'warning' ? '⚠️' : 
                        notif.type === 'info' ? 'ℹ️' : '✅';
            notificationHtml += `
                <div class="p-3 rounded-lg bg-${notif.type === 'warning' ? 'yellow' : notif.type === 'info' ? 'blue' : 'green'}-50 border border-${notif.type === 'warning' ? 'yellow' : notif.type === 'info' ? 'blue' : 'green'}-200">
                    <p class="text-sm">${icon} ${notif.message}</p>
                </div>
            `;
        });
        notificationHtml += '</div>';

        this.showModal('🔔 Notificações', notificationHtml);
    }

    // Mostrar notificação
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
            type === 'success' ? 'bg-green-500 text-white' :
            type === 'error' ? 'bg-red-500 text-white' :
            type === 'warning' ? 'bg-yellow-500 text-black' :
            'bg-blue-500 text-white'
        }`;
        
        notification.innerHTML = `
            <div class="flex items-center justify-between">
                <p class="text-sm">${message}</p>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-lg">&times;</button>
            </div>
        `;

        document.body.appendChild(notification);

        // Remover automaticamente após 5 segundos
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    // Mostrar modal
    showModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50';
        
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold">${title}</h3>
                    <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700">
                        <i data-lucide="x" class="w-5 h-5"></i>
                    </button>
                </div>
                <div>${content}</div>
            </div>
        `;

        document.body.appendChild(modal);
        lucide.createIcons();

        // Fechar ao clicar fora
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // Atualizar status do dashboard
    updateDashboardStatus() {
        // Simular atualização dos cards de status
        // Em implementação real, buscaria dados atuais
    }

    // Mostrar mensagem de boas-vindas
    showWelcomeMessage() {
        setTimeout(() => {
            this.addChatMessage('ai', '👋 Olá! Bem-vindo ao seu Assistente Virtual Automotivo! Estou aqui para ajudar com diagnósticos, manutenção e qualquer dúvida sobre seu veículo. Como posso ajudar você hoje?');
        }, 1000);
    }

    // Carregar dados salvos
    loadSavedData() {
        try {
            const savedData = localStorage.getItem('assistenteAutomotivoData');
            if (savedData) {
                const data = JSON.parse(savedData);
                this.vehicleData = { ...this.vehicleData, ...data.vehicleData };
            }
        } catch (error) {
            console.warn('Erro ao carregar dados salvos:', error);
        }
    }

    // Salvar dados
    saveData() {
        try {
            const dataToSave = {
                vehicleData: this.vehicleData,
                timestamp: new Date().toISOString()
            };
            localStorage.setItem('assistenteAutomotivoData', JSON.stringify(dataToSave));
        } catch (error) {
            console.warn('Erro ao salvar dados:', error);
        }
    }
}

// Inicializar aplicação quando DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.assistente = new AssistenteAutomotivo();
});

// Service Worker para PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('✅ Service Worker registrado:', registration);
            })
            .catch(error => {
                console.log('❌ Erro ao registrar Service Worker:', error);
            });
    });
}

