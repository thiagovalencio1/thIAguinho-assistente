/**
 * Motor de IA Avançado para Assistente Virtual Automotivo
 * Processamento de linguagem natural em português
 * Análise de DTCs e recomendações inteligentes
 */

class AIEngine {
    constructor() {
        this.conversationHistory = [];
        this.vehicleContext = {
            brand: 'Toyota',
            model: 'Corolla',
            year: 2020,
            mileage: 45230,
            lastMaintenance: '2024-11-15',
            activeDTCs: ['P0171', 'P0301']
        };
        this.dtcDatabase = this.initializeDTCDatabase();
        this.maintenanceKnowledge = this.initializeMaintenanceKnowledge();
        this.init();
    }

    init() {
        console.log('🧠 Motor de IA inicializado com sucesso');
        this.loadConversationHistory();
    }

    // Base de dados de DTCs
    initializeDTCDatabase() {
        return {
            'P0171': {
                description: 'Sistema muito pobre (Banco 1)',
                severity: 'Médio',
                causes: [
                    'Filtro de ar sujo ou entupido',
                    'Sensor MAF defeituoso',
                    'Vazamento no sistema de admissão',
                    'Bomba de combustível fraca',
                    'Injetores entupidos'
                ],
                solutions: [
                    'Verificar e substituir filtro de ar',
                    'Testar sensor MAF',
                    'Inspecionar sistema de admissão',
                    'Verificar pressão da bomba de combustível',
                    'Limpar ou substituir injetores'
                ],
                urgency: 'Moderada',
                estimatedCost: 'R$ 150 - R$ 800'
            },
            'P0301': {
                description: 'Falha de ignição no cilindro 1',
                severity: 'Alto',
                causes: [
                    'Vela de ignição defeituosa',
                    'Bobina de ignição com problema',
                    'Cabo de vela danificado',
                    'Baixa compressão no cilindro',
                    'Injetor entupido'
                ],
                solutions: [
                    'Substituir vela de ignição',
                    'Testar e substituir bobina se necessário',
                    'Verificar cabos de vela',
                    'Teste de compressão',
                    'Limpeza de injetores'
                ],
                urgency: 'Alta',
                estimatedCost: 'R$ 80 - R$ 500'
            },
            'P0420': {
                description: 'Eficiência do catalisador abaixo do limite',
                severity: 'Médio',
                causes: [
                    'Catalisador danificado',
                    'Sensor de oxigênio defeituoso',
                    'Vazamento no escapamento',
                    'Combustível de má qualidade'
                ],
                solutions: [
                    'Substituir catalisador',
                    'Verificar sensores de oxigênio',
                    'Inspecionar sistema de escapamento',
                    'Usar combustível de qualidade'
                ],
                urgency: 'Moderada',
                estimatedCost: 'R$ 800 - R$ 2.500'
            }
        };
    }

    // Base de conhecimento de manutenção
    initializeMaintenanceKnowledge() {
        return {
            'troca_oleo': {
                interval_km: 10000,
                interval_months: 6,
                description: 'Troca de óleo e filtro',
                importance: 'Crítica',
                cost_estimate: 'R$ 120 - R$ 250'
            },
            'filtro_ar': {
                interval_km: 15000,
                interval_months: 12,
                description: 'Substituição do filtro de ar',
                importance: 'Média',
                cost_estimate: 'R$ 30 - R$ 80'
            },
            'pastilhas_freio': {
                interval_km: 30000,
                interval_months: 24,
                description: 'Substituição das pastilhas de freio',
                importance: 'Alta',
                cost_estimate: 'R$ 200 - R$ 400'
            },
            'correia_dentada': {
                interval_km: 60000,
                interval_months: 48,
                description: 'Substituição da correia dentada',
                importance: 'Crítica',
                cost_estimate: 'R$ 400 - R$ 800'
            }
        };
    }

    // Processamento de linguagem natural
    async processMessage(message) {
        const userMessage = message.toLowerCase().trim();
        
        // Adicionar à história da conversa
        this.conversationHistory.push({
            type: 'user',
            message: message,
            timestamp: new Date().toISOString()
        });

        let response = '';

        try {
            // Análise de intenção
            const intent = this.analyzeIntent(userMessage);
            
            // Gerar resposta baseada na intenção
            response = await this.generateResponse(intent, userMessage);
            
            // Adicionar resposta à história
            this.conversationHistory.push({
                type: 'ai',
                message: response,
                timestamp: new Date().toISOString()
            });

            // Salvar histórico
            this.saveConversationHistory();

        } catch (error) {
            console.error('Erro no processamento da mensagem:', error);
            response = 'Desculpe, ocorreu um erro ao processar sua mensagem. Pode tentar novamente?';
        }

        return response;
    }

    // Análise de intenção
    analyzeIntent(message) {
        const intents = {
            dtc_inquiry: ['dtc', 'código', 'erro', 'problema', 'falha', 'diagnóstico'],
            maintenance_inquiry: ['manutenção', 'revisão', 'troca', 'óleo', 'filtro', 'quando'],
            fuel_inquiry: ['combustível', 'consumo', 'gasolina', 'álcool', 'economia'],
            performance_inquiry: ['desempenho', 'potência', 'aceleração', 'velocidade'],
            cost_inquiry: ['custo', 'preço', 'valor', 'quanto custa', 'orçamento'],
            general_help: ['ajuda', 'como', 'o que', 'explicar', 'ensinar'],
            greeting: ['oi', 'olá', 'bom dia', 'boa tarde', 'boa noite'],
            emergency: ['emergência', 'urgente', 'parou', 'não liga', 'socorro']
        };

        for (const [intent, keywords] of Object.entries(intents)) {
            if (keywords.some(keyword => message.includes(keyword))) {
                return intent;
            }
        }

        return 'general_help';
    }

    // Geração de resposta
    async generateResponse(intent, message) {
        switch (intent) {
            case 'dtc_inquiry':
                return this.handleDTCInquiry(message);
            
            case 'maintenance_inquiry':
                return this.handleMaintenanceInquiry(message);
            
            case 'fuel_inquiry':
                return this.handleFuelInquiry(message);
            
            case 'performance_inquiry':
                return this.handlePerformanceInquiry(message);
            
            case 'cost_inquiry':
                return this.handleCostInquiry(message);
            
            case 'greeting':
                return this.handleGreeting();
            
            case 'emergency':
                return this.handleEmergency(message);
            
            default:
                return this.handleGeneralHelp(message);
        }
    }

    // Manipuladores específicos de intenção
    handleDTCInquiry(message) {
        const activeDTCs = this.vehicleContext.activeDTCs;
        
        if (activeDTCs.length === 0) {
            return '✅ Ótimas notícias! Não há códigos de erro ativos no momento. Seu veículo está funcionando normalmente.';
        }

        let response = `🔍 Encontrei ${activeDTCs.length} código(s) de diagnóstico ativo(s):\n\n`;
        
        activeDTCs.forEach(dtc => {
            const dtcInfo = this.dtcDatabase[dtc];
            if (dtcInfo) {
                response += `**${dtc}**: ${dtcInfo.description}\n`;
                response += `📊 Severidade: ${dtcInfo.severity}\n`;
                response += `⚠️ Urgência: ${dtcInfo.urgency}\n`;
                response += `💰 Custo estimado: ${dtcInfo.estimatedCost}\n\n`;
                
                response += `**Possíveis causas:**\n`;
                dtcInfo.causes.forEach(cause => {
                    response += `• ${cause}\n`;
                });
                
                response += `\n**Soluções recomendadas:**\n`;
                dtcInfo.solutions.forEach(solution => {
                    response += `• ${solution}\n`;
                });
                response += '\n---\n\n';
            }
        });

        response += '💡 **Recomendação:** Procure um mecânico de confiança para uma avaliação mais detalhada.';
        
        return response;
    }

    handleMaintenanceInquiry(message) {
        const currentMileage = this.vehicleContext.mileage;
        const lastMaintenance = new Date(this.vehicleContext.lastMaintenance);
        const daysSinceLastMaintenance = Math.floor((new Date() - lastMaintenance) / (1000 * 60 * 60 * 24));

        let response = `🔧 **Status de Manutenção do seu ${this.vehicleContext.brand} ${this.vehicleContext.model}**\n\n`;
        response += `📊 Quilometragem atual: ${currentMileage.toLocaleString()} km\n`;
        response += `📅 Última manutenção: ${daysSinceLastMaintenance} dias atrás\n\n`;

        // Verificar itens de manutenção
        const maintenanceItems = [];
        
        // Troca de óleo
        const kmSinceOil = currentMileage % 10000;
        const oilDue = 10000 - kmSinceOil;
        if (oilDue <= 2000) {
            maintenanceItems.push({
                item: 'Troca de óleo',
                urgency: oilDue <= 500 ? 'Urgente' : 'Próxima',
                distance: oilDue,
                cost: 'R$ 120 - R$ 250'
            });
        }

        // Filtro de ar
        const kmSinceAirFilter = currentMileage % 15000;
        const airFilterDue = 15000 - kmSinceAirFilter;
        if (airFilterDue <= 3000) {
            maintenanceItems.push({
                item: 'Filtro de ar',
                urgency: airFilterDue <= 1000 ? 'Urgente' : 'Próxima',
                distance: airFilterDue,
                cost: 'R$ 30 - R$ 80'
            });
        }

        if (maintenanceItems.length > 0) {
            response += '⚠️ **Manutenções pendentes:**\n\n';
            maintenanceItems.forEach(item => {
                response += `• **${item.item}**\n`;
                response += `  Status: ${item.urgency}\n`;
                response += `  Distância: ${item.distance} km\n`;
                response += `  Custo estimado: ${item.cost}\n\n`;
            });
        } else {
            response += '✅ **Parabéns!** Todas as manutenções estão em dia.\n\n';
        }

        response += '📋 **Dica:** Mantenha sempre um histórico detalhado das manutenções para preservar o valor do seu veículo.';

        return response;
    }

    handleFuelInquiry(message) {
        const avgConsumption = 14.2;
        const fuelPrice = 5.89;
        const monthlyKm = 1500;
        const monthlyCost = (monthlyKm / avgConsumption) * fuelPrice;

        let response = `⛽ **Análise de Consumo de Combustível**\n\n`;
        response += `📊 Consumo médio atual: ${avgConsumption} km/l\n`;
        response += `📈 Quilometragem mensal: ${monthlyKm} km\n`;
        response += `💰 Gasto mensal estimado: R$ ${monthlyCost.toFixed(2)}\n\n`;

        response += `💡 **Dicas para economizar combustível:**\n`;
        response += `• Mantenha os pneus calibrados\n`;
        response += `• Evite acelerar bruscamente\n`;
        response += `• Faça manutenção regular do motor\n`;
        response += `• Use ar condicionado com moderação\n`;
        response += `• Planeje suas rotas para evitar trânsito\n\n`;

        response += `🎯 **Meta:** Com essas dicas, você pode melhorar o consumo em até 15%!`;

        return response;
    }

    handlePerformanceInquiry(message) {
        let response = `🚗 **Análise de Performance do Veículo**\n\n`;
        response += `📊 **Dados atuais:**\n`;
        response += `• RPM: 1850 (normal em marcha lenta)\n`;
        response += `• Temperatura: 89°C (ideal)\n`;
        response += `• Consumo instantâneo: 14.5 km/l\n\n`;

        response += `📈 **Tendências dos últimos 7 dias:**\n`;
        response += `• Consumo médio: Estável\n`;
        response += `• Temperatura de operação: Normal\n`;
        response += `• Performance geral: Boa\n\n`;

        if (this.vehicleContext.activeDTCs.length > 0) {
            response += `⚠️ **Atenção:** Os códigos de erro ativos podem estar afetando a performance. Recomendo resolver os DTCs primeiro.\n\n`;
        }

        response += `💡 **Dicas para melhorar a performance:**\n`;
        response += `• Mantenha o filtro de ar limpo\n`;
        response += `• Use combustível de qualidade\n`;
        response += `• Faça a limpeza dos bicos injetores\n`;
        response += `• Verifique as velas de ignição regularmente`;

        return response;
    }

    handleCostInquiry(message) {
        const monthlyCosts = {
            fuel: 1250,
            maintenance: 450,
            insurance: 280,
            total: 1980
        };

        let response = `💰 **Análise de Custos Mensais**\n\n`;
        response += `⛽ Combustível: R$ ${monthlyCosts.fuel}\n`;
        response += `🔧 Manutenção: R$ ${monthlyCosts.maintenance}\n`;
        response += `🛡️ Seguro: R$ ${monthlyCosts.insurance}\n`;
        response += `📊 **Total mensal: R$ ${monthlyCosts.total}**\n\n`;

        response += `📈 **Comparativo com veículos similares:**\n`;
        response += `• Seu custo está 12% abaixo da média\n`;
        response += `• Economia anual estimada: R$ 2.400\n\n`;

        response += `💡 **Oportunidades de economia:**\n`;
        response += `• Manutenção preventiva: -15% nos custos\n`;
        response += `• Direção econômica: -10% no combustível\n`;
        response += `• Revisão do seguro: possível economia de R$ 50/mês`;

        return response;
    }

    handleGreeting() {
        const greetings = [
            '👋 Olá! Sou seu assistente virtual automotivo. Como posso ajudar você hoje?',
            '🚗 Oi! Estou aqui para cuidar do seu veículo. O que você gostaria de saber?',
            '😊 Olá! Pronto para ajudar com qualquer dúvida sobre seu carro. Em que posso ser útil?'
        ];
        
        return greetings[Math.floor(Math.random() * greetings.length)];
    }

    handleEmergency(message) {
        let response = `🚨 **SITUAÇÃO DE EMERGÊNCIA DETECTADA**\n\n`;
        response += `📞 **Contatos de emergência:**\n`;
        response += `• Guincho: 0800-123-4567\n`;
        response += `• Seguro: 0800-987-6543\n`;
        response += `• Mecânico de confiança: (11) 99999-9999\n\n`;

        response += `🛡️ **Primeiros passos:**\n`;
        response += `1. Mantenha a calma\n`;
        response += `2. Coloque o triângulo de segurança\n`;
        response += `3. Ligue o pisca-alerta\n`;
        response += `4. Saia do veículo com segurança\n\n`;

        response += `💡 **Dica:** Descreva o problema com mais detalhes para que eu possa dar orientações específicas.`;

        return response;
    }

    handleGeneralHelp(message) {
        let response = `🤖 **Como posso ajudar você?**\n\n`;
        response += `Posso auxiliar com:\n`;
        response += `🔍 • Diagnóstico de códigos de erro (DTCs)\n`;
        response += `🔧 • Cronograma de manutenção\n`;
        response += `⛽ • Análise de consumo de combustível\n`;
        response += `📊 • Relatórios de performance\n`;
        response += `💰 • Análise de custos\n`;
        response += `🚨 • Situações de emergência\n\n`;

        response += `💬 **Exemplos de perguntas:**\n`;
        response += `• "Quais códigos de erro estão ativos?"\n`;
        response += `• "Quando devo trocar o óleo?"\n`;
        response += `• "Como está meu consumo de combustível?"\n`;
        response += `• "Quanto estou gastando por mês?"\n\n`;

        response += `🎯 **Dica:** Seja específico em suas perguntas para respostas mais precisas!`;

        return response;
    }

    // Análise de DTCs
    analyzeDTC(dtcCode) {
        const dtcInfo = this.dtcDatabase[dtcCode];
        if (!dtcInfo) {
            return {
                code: dtcCode,
                description: 'Código não encontrado na base de dados',
                severity: 'Desconhecido',
                recommendation: 'Consulte um mecânico especializado'
            };
        }

        return {
            code: dtcCode,
            ...dtcInfo,
            recommendation: this.generateDTCRecommendation(dtcInfo)
        };
    }

    generateDTCRecommendation(dtcInfo) {
        if (dtcInfo.urgency === 'Alta') {
            return '🚨 Procure um mecânico imediatamente. Este problema pode causar danos maiores se não for resolvido rapidamente.';
        } else if (dtcInfo.urgency === 'Moderada') {
            return '⚠️ Agende uma visita ao mecânico nas próximas semanas. Monitore o comportamento do veículo.';
        } else {
            return '💡 Problema de baixa prioridade. Pode ser resolvido na próxima manutenção programada.';
        }
    }

    // Persistência de dados
    saveConversationHistory() {
        try {
            localStorage.setItem('aiConversationHistory', JSON.stringify(this.conversationHistory));
        } catch (error) {
            console.warn('Não foi possível salvar o histórico da conversa:', error);
        }
    }

    loadConversationHistory() {
        try {
            const saved = localStorage.getItem('aiConversationHistory');
            if (saved) {
                this.conversationHistory = JSON.parse(saved);
            }
        } catch (error) {
            console.warn('Não foi possível carregar o histórico da conversa:', error);
            this.conversationHistory = [];
        }
    }

    // Atualizar contexto do veículo
    updateVehicleContext(newContext) {
        this.vehicleContext = { ...this.vehicleContext, ...newContext };
        console.log('Contexto do veículo atualizado:', this.vehicleContext);
    }

    // Obter estatísticas da conversa
    getConversationStats() {
        const totalMessages = this.conversationHistory.length;
        const userMessages = this.conversationHistory.filter(msg => msg.type === 'user').length;
        const aiMessages = this.conversationHistory.filter(msg => msg.type === 'ai').length;

        return {
            total: totalMessages,
            user: userMessages,
            ai: aiMessages,
            lastInteraction: this.conversationHistory.length > 0 ? 
                this.conversationHistory[this.conversationHistory.length - 1].timestamp : null
        };
    }
}

// Instância global do motor de IA
const aiEngine = new AIEngine();

// Exportar para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AIEngine, aiEngine };
}

