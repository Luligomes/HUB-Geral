/**
 * ==========================================================================
 * Hub Geral de Indicadores — Todos os Contratos
 * Lógica de Controle Modular e Reativa (JavaScript)
 * ==========================================================================
 */

const CONFIG = {
    // Definir como false para abrir o relatório embutido no próprio Hub (embed/iframe)
    OPEN_IN_NEW_TAB: false
};

/**
 * Configuração centralizada dos Links Globais
 * Permanecem sempre visíveis independente do contrato selecionado.
 */
const indicadoresGlobais = {
    gestaoPessoas: [
        {
            id: "painel-ocorrencias-qsms",
            title: "Painel de Ocorrências — QSMS",
            description: "Registro, monitoramento e indicadores de ocorrências operacionais.",
            category: "gestao-pessoas",
            categoryLabel: "Gestão de Pessoas",
            isGlobal: true,
            icon: `<svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><line x1="12" y1="11" x2="12" y2="15"></line><line x1="12" y1="19" x2="12.01" y2="19"></line></svg>`
        },
        {
            id: "programa-padrinho",
            title: "Programa Padrinho",
            description: "Monitoramento da integração, avaliações e feedbacks dos colaboradores.",
            category: "gestao-pessoas",
            categoryLabel: "Gestão de Pessoas",
            isGlobal: true,
            icon: `<svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`
        },
        {
            id: "programa-dbo",
            title: "Programa DBO",
            description: "Controle das avaliações DBO realizadas pelos líderes.",
            category: "gestao-pessoas",
            categoryLabel: "Gestão de Pessoas",
            isGlobal: true,
            icon: `<svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line></svg>`
        }
    ],
    gestaoOperacional: [
        {
            id: "diario-de-bordo",
            title: "Diário de Bordo",
            description: "Consolidado dos indicadores para acompanhamento das metas e desempenho global do contrato.",
            category: "gestao-operacional",
            categoryLabel: "Gestão Operacional",
            isGlobal: true,
            icon: `<svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`
        }
    ],
    inventario: [
        {
            id: "inventario",
            title: "Inventário",
            description: "Controle e gestão do inventário de equipamentos e materiais da operação.",
            category: "inventario",
            categoryLabel: "Inventário",
            isGlobal: true,
            icon: `<svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`
        }
    ]
};

/**
 * Configuração centralizada por Contrato
 */
const contratos = {
    acelen: {
        nome: "Acelen",
        kpisOperacionais: [
            {
                id: "indicadores-operacionais-acelen",
                title: "Indicadores Operacionais Acelen",
                description: "Métricas de desempenho e performance da operação Acelen.",
                category: "kpis-operacionais",
                categoryLabel: "KPIs Operacionais",
                icon: `<svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line><polyline points="22 4 12 14 6 8 2 12"></polyline></svg>`
            }
        ],
        gestaoOperacional: []
    },
    cbo: {
        nome: "CBO",
        kpisOperacionais: [
            {
                id: "indicadores-operacionais-cbo",
                title: "Indicadores Operacionais CBO",
                description: "Métricas de desempenho e performance da operação CBO.",
                category: "kpis-operacionais",
                categoryLabel: "KPIs Operacionais",
                icon: `<svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line><polyline points="22 4 12 14 6 8 2 12"></polyline></svg>`
            }
        ],
        gestaoOperacional: []
    },
    cli: {
        nome: "CLI",
        kpisOperacionais: [
            {
                id: "indicadores-operacionais-cli",
                title: "Indicadores Operacionais CLI",
                description: "Métricas de desempenho e performance da operação CLI.",
                category: "kpis-operacionais",
                categoryLabel: "KPIs Operacionais",
                icon: `<svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line><polyline points="22 4 12 14 6 8 2 12"></polyline></svg>`
            }
        ],
        gestaoOperacional: []
    },
    enelCE: {
        nome: "ENEL CE",
        kpisOperacionais: [
            {
                id: "indicadores-operacionais-enel-ce-clc",
                title: "Indicadores Operacionais ENEL CE — CLC",
                description: "Acompanhe as principais métricas de desempenho e performance da operação ENEL CE CLC.",
                category: "kpis-operacionais",
                categoryLabel: "KPIs Operacionais",
                icon: `<svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line><polyline points="22 4 12 14 6 8 2 12"></polyline></svg>`
            },
            {
                id: "indicadores-operacionais-enel-ce-insourcing",
                title: "Indicadores Operacionais ENEL CE — Insourcing",
                description: "Métricas de desempenho e performance da operação Insourcing ENEL CE.",
                category: "kpis-operacionais",
                categoryLabel: "KPIs Operacionais",
                icon: `<svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 11 11 13 15 9"></polyline></svg>`
            }
        ],
        gestaoOperacional: [
            {
                id: "gestao-operacional-clc-recebimento",
                title: "Gestão Operacional CLC — Recebimento",
                description: "Acompanhamento dos processos e controle de recebimento da operação ENEL CE CLC.",
                category: "gestao-operacional",
                categoryLabel: "Gestão Operacional",
                icon: `<svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`
            }
        ]
    },
    enelRJ: {
        nome: "ENEL RJ",
        kpisOperacionais: [
            {
                id: "indicadores-operacionais-enel-rj-clc",
                title: "Indicadores Operacionais ENEL RJ — CLC",
                description: "Acompanhe as principais métricas de desempenho e performance da operação CLC.",
                category: "kpis-operacionais",
                categoryLabel: "KPIs Operacionais",
                icon: `<svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line><polyline points="22 4 12 14 6 8 2 12"></polyline></svg>`
            },
            {
                id: "indicadores-operacionais-enel-rj-insourcing",
                title: "Indicadores Operacionais ENEL RJ — Insourcing",
                description: "Acompanhe as principais métricas de desempenho e performance da operação Insourcing.",
                category: "kpis-operacionais",
                categoryLabel: "KPIs Operacionais",
                icon: `<svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 11 11 13 15 9"></polyline></svg>`
            }
        ],
        gestaoOperacional: [
            {
                id: "gestao-operacional-enel-rj-clc",
                title: "Gestão Operacional ENEL RJ — CLC",
                description: "Painel de monitoramento operacional com acompanhamento dos processos e desempenho da operação CLC.",
                category: "gestao-operacional",
                categoryLabel: "Gestão Operacional",
                icon: `<svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`
            },
            {
                id: "gestao-operacional-enel-rj-insourcing",
                title: "Gestão Operacional ENEL RJ — Insourcing",
                description: "Painel de monitoramento operacional com acompanhamento dos processos e desempenho da operação Insourcing.",
                category: "gestao-operacional",
                categoryLabel: "Gestão Operacional",
                icon: `<svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>`
            }
        ]
    },
    equatorial: {
        nome: "Equatorial",
        kpisOperacionais: [
            {
                id: "indicadores-operacionais-equatorial",
                title: "Indicadores Operacionais Equatorial",
                description: "Métricas de desempenho e performance da operação Equatorial.",
                category: "kpis-operacionais",
                categoryLabel: "KPIs Operacionais",
                icon: `<svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line><polyline points="22 4 12 14 6 8 2 12"></polyline></svg>`
            }
        ],
        gestaoOperacional: []
    },
    globo: {
        nome: "Globo",
        kpisOperacionais: [
            {
                id: "otif-recex",
                title: "OTIF RECEX",
                description: "Acompanhamento do indicador OTIF RECEX da operação Globo.",
                category: "kpis-operacionais",
                categoryLabel: "KPIs Operacionais",
                icon: `<svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>`
            },
            {
                id: "otif-recex-gaiola",
                title: "OTIF RECEX — Gaiola",
                description: "Acompanhamento do indicador OTIF RECEX Gaiola.",
                category: "kpis-operacionais",
                categoryLabel: "KPIs Operacionais",
                icon: `<svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>`
            },
            {
                id: "otif-dressing",
                title: "OTIF Dressing",
                description: "Acompanhamento do indicador OTIF Dressing.",
                category: "kpis-operacionais",
                categoryLabel: "KPIs Operacionais",
                icon: `<svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>`
            },
            {
                id: "otif-dressing-arte",
                title: "OTIF Dressing — Arte",
                description: "Acompanhamento do indicador OTIF Dressing Arte.",
                category: "kpis-operacionais",
                categoryLabel: "KPIs Operacionais",
                icon: `<svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.586 7.586"></path><circle cx="11" cy="11" r="2"></circle></svg>`
            },
            {
                id: "otif-pecas-cenograficas",
                title: "OTIF Peças Cenográficas",
                description: "Acompanhamento do indicador OTIF Peças Cenográficas.",
                category: "kpis-operacionais",
                categoryLabel: "KPIs Operacionais",
                icon: `<svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>`
            }
        ],
        gestaoOperacional: [
            {
                id: "erro-de-catalogacao",
                title: "Erro de Catalogação",
                description: "Painel de controle e acompanhamento de erros de catalogação.",
                category: "gestao-operacional",
                categoryLabel: "Gestão Operacional",
                icon: `<svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`
            },
            {
                id: "devolucao-recex",
                title: "Devolução RECEX",
                description: "Acompanhamento das devoluções no processo RECEX.",
                category: "gestao-operacional",
                categoryLabel: "Gestão Operacional",
                icon: `<svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 14 4 9 9 4"></polyline><path d="M20 20v-7a4 4 0 0 0-4-4H4"></path></svg>`
            },
            {
                id: "avaria",
                title: "Avaria",
                description: "Registro, controle e análise de avarias de materiais.",
                category: "gestao-operacional",
                categoryLabel: "Gestão Operacional",
                icon: `<svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`
            },
            {
                id: "quarentena-recex",
                title: "Quarentena RECEX",
                description: "Gestão e monitoramento dos itens em quarentena RECEX.",
                category: "gestao-operacional",
                categoryLabel: "Gestão Operacional",
                icon: `<svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`
            }
        ]
    },
    light: {
        nome: "Light",
        kpisOperacionais: [
            {
                id: "indicadores-operacionais-light",
                title: "Indicadores Operacionais Light",
                description: "Métricas de desempenho e performance da operação Light.",
                category: "kpis-operacionais",
                categoryLabel: "KPIs Operacionais",
                icon: `<svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line><polyline points="22 4 12 14 6 8 2 12"></polyline></svg>`
            }
        ],
        gestaoOperacional: []
    },
    metrorio: {
        nome: "MetrôRio",
        kpisOperacionais: [
            {
                id: "indicadores-operacionais-metrorio",
                title: "Indicadores Operacionais MetrôRio",
                description: "Métricas de desempenho e performance da operação MetrôRio.",
                category: "kpis-operacionais",
                categoryLabel: "KPIs Operacionais",
                icon: `<svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line><polyline points="22 4 12 14 6 8 2 12"></polyline></svg>`
            }
        ],
        gestaoOperacional: []
    },
    modec: {
        nome: "Modec",
        kpisOperacionais: [
            {
                id: "indicadores-operacionais-modec",
                title: "Indicadores Operacionais Modec",
                description: "Métricas de desempenho e performance da operação Modec.",
                category: "kpis-operacionais",
                categoryLabel: "KPIs Operacionais",
                icon: `<svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line><polyline points="22 4 12 14 6 8 2 12"></polyline></svg>`
            }
        ],
        gestaoOperacional: []
    },
    motivaMobilidade: {
        nome: "Motiva Mobilidade",
        kpisOperacionais: [
            {
                id: "indicadores-operacionais-motiva-mobilidade",
                title: "Indicadores Operacionais Motiva Mobilidade",
                description: "Métricas de desempenho da operação Motiva Mobilidade.",
                category: "kpis-operacionais",
                categoryLabel: "KPIs Operacionais",
                icon: `<svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line><polyline points="22 4 12 14 6 8 2 12"></polyline></svg>`
            }
        ],
        gestaoOperacional: []
    },
    motivaRodovias: {
        nome: "Motiva Rodovias",
        kpisOperacionais: [
            {
                id: "indicadores-operacionais-motiva-rodovias",
                title: "Indicadores Operacionais Motiva Rodovias",
                description: "Métricas de desempenho da operação Motiva Rodovias.",
                category: "kpis-operacionais",
                categoryLabel: "KPIs Operacionais",
                icon: `<svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line><polyline points="22 4 12 14 6 8 2 12"></polyline></svg>`
            }
        ],
        gestaoOperacional: []
    },
    petrobras: {
        nome: "Petrobras",
        kpisOperacionais: [
            {
                id: "indicadores-operacionais-petrobras",
                title: "Indicadores Operacionais Petrobras",
                description: "Métricas de desempenho e performance da operação Petrobras.",
                category: "kpis-operacionais",
                categoryLabel: "KPIs Operacionais",
                icon: `<svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line><polyline points="22 4 12 14 6 8 2 12"></polyline></svg>`
            }
        ],
        gestaoOperacional: []
    },
    rumo: {
        nome: "Rumo",
        kpisOperacionais: [
            {
                id: "indicadores-operacionais-rumo",
                title: "Indicadores Operacionais Rumo",
                description: "Métricas de desempenho e performance da operação Rumo.",
                category: "kpis-operacionais",
                categoryLabel: "KPIs Operacionais",
                icon: `<svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line><polyline points="22 4 12 14 6 8 2 12"></polyline></svg>`
            }
        ],
        gestaoOperacional: []
    },
    valeMG: {
        nome: "Vale MG",
        kpisOperacionais: [
            {
                id: "indicadores-operacionais-vale-mg",
                title: "Indicadores Operacionais Vale MG",
                description: "Métricas de desempenho e performance da operação Vale MG.",
                category: "kpis-operacionais",
                categoryLabel: "KPIs Operacionais",
                icon: `<svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line><polyline points="22 4 12 14 6 8 2 12"></polyline></svg>`
            }
        ],
        gestaoOperacional: [
            {
                id: "gestao-operacional-vale-mg",
                title: "Gestão Operacional Vale MG",
                description: "Painel de monitoramento operacional com acompanhamento Vale MG.",
                category: "gestao-operacional",
                categoryLabel: "Gestão Operacional",
                icon: `<svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`
            }
        ]
    },
    valePA: {
        nome: "Vale PA",
        kpisOperacionais: [
            {
                id: "indicadores-operacionais-vale-pa",
                title: "Indicadores Operacionais Vale PA",
                description: "Métricas de desempenho e performance da operação Vale PA.",
                category: "kpis-operacionais",
                categoryLabel: "KPIs Operacionais",
                icon: `<svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line><polyline points="22 4 12 14 6 8 2 12"></polyline></svg>`
            }
        ],
        gestaoOperacional: []
    }
};

/**
 * Metadados das categorias da barra lateral
 */
const categoryMetaData = {
    all: {
        title: "Hub Geral de Indicadores",
        subtitle: "VISÃO GERAL DOS CONTRATOS",
        description: "Selecione um contrato para acessar os indicadores disponíveis ou navegue pelas categorias."
    },
    processos: {
        title: "Processos",
        subtitle: "DESEMPENHO DA OPERAÇÃO",
        description: "Indicadores de processos, produtividade e performance conforme o contrato selecionado."
    },
    pessoas: {
        title: "Pessoas",
        subtitle: "GESTÃO DE PESSOAS",
        description: "Painéis globais de integração do Programa Padrinho e avaliações DBO."
    },
    "inventario": {
        title: "Inventário",
        subtitle: "CONTROLE DE MATERIAIS",
        description: "Painel centralizado de controle e gestão de inventário."
    },
    sms: {
        title: "SMS",
        subtitle: "SEGURANÇA, MEIO AMBIENTE E SAÚDE",
        description: "Registro, monitoramento e indicadores do Painel de Ocorrências."
    },
    gestao: {
        title: "Gestão",
        subtitle: "ACOMPANHAMENTO GERENCIAL",
        description: "Consulte o Diário de Bordo para acompanhamento da gestão."
    }
};

// Estado da Aplicação
let currentContractKey = "todos"; // "todos" ou chave do contrato (ex: "acelen")
let currentCategory = "all";

// Elementos do DOM
const contractSelect = document.getElementById("contract-select");
const contractBadge = document.getElementById("contract-badge");
const sidebarButtons = document.querySelectorAll(".nav-button[data-category]");
const indicatorsGrid = document.getElementById("indicators-grid");
const dashboardViewport = document.getElementById("dashboard-viewport");
const iframeViewport = document.getElementById("iframe-viewport");
const reportIframe = document.getElementById("report-iframe");
const iframeLoader = document.getElementById("iframe-loader");
const btnVoltarDashboard = document.getElementById("btn-voltar-dashboard");

const viewSubtitle = document.getElementById("view-subtitle");
const viewTitle = document.getElementById("view-title");
const viewDescription = document.getElementById("view-description");

const iframeCategoryText = document.getElementById("iframe-category-text");
const iframeTitleText = document.getElementById("iframe-title-text");
const iframeExternalLink = document.getElementById("iframe-external-link");

const menuToggle = document.getElementById("menu-toggle");
const sidebar = document.querySelector(".sidebar");
const logoHome = document.getElementById("logo-home");
const btnVisaoGeral = document.getElementById("btn-visao-geral");

/**
 * Retorna os indicadores ativos com base no contrato selecionado e categoria
 */
function getFilteredIndicators(category, contractKey) {
    let list = [];

    const addCategory = (items, categoryName, categoryLabel, contratoNome) => {
        list = list.concat(items.map(item => ({
            ...item,
            category: categoryName,
            categoryLabel,
            ...(contratoNome ? { contratoNome } : {})
        })));
    };

    const addGlobalCategories = () => {
        if (category === "all" || category === "pessoas") {
            addCategory(
                indicadoresGlobais.gestaoPessoas.filter(item => item.id !== "painel-ocorrencias-qsms"),
                "pessoas",
                "Pessoas"
            );
        }

        if (category === "all" || category === "inventario") {
            addCategory(indicadoresGlobais.inventario, "inventario", "Inventário");
        }

        if (category === "all" || category === "sms") {
            addCategory(
                indicadoresGlobais.gestaoPessoas.filter(item => item.id === "painel-ocorrencias-qsms"),
                "sms",
                "SMS"
            );
        }

        if (category === "all" || category === "gestao") {
            addCategory(indicadoresGlobais.gestaoOperacional, "gestao", "Gestão");
        }
    };

    if (contractKey && contractKey !== "todos" && contratos[contractKey]) {
        const contrato = contratos[contractKey];

        if (category === "all" || category === "processos") {
            addCategory(
                [...contrato.kpisOperacionais, ...contrato.gestaoOperacional],
                "processos",
                "Processos",
                contrato.nome
            );
        }

        addGlobalCategories();
    } else {
        if (category === "all" || category === "processos") {
            Object.values(contratos).forEach(c => {
                addCategory(
                    [...c.kpisOperacionais, ...c.gestaoOperacional],
                    "processos",
                    "Processos",
                    c.nome
                );
            });
        }

        addGlobalCategories();
    }

    const uniqueMap = new Map();
    list.forEach(item => {
        if (!uniqueMap.has(item.id)) {
            uniqueMap.set(item.id, item);
        }
    });

    const indicators = Array.from(uniqueMap.values());
    const allowedIndicators = window.ACCESS_CONTEXT?.indicators;
    return Array.isArray(allowedIndicators)
        ? indicators.filter(item => allowedIndicators.includes(item.id))
        : [];
}

/**
 * Renderiza os cards de indicadores na tela
 */
function renderIndicators() {
    indicatorsGrid.innerHTML = "";
    const indicators = getFilteredIndicators(currentCategory, currentContractKey);

    if (contractBadge) {
        if (currentContractKey === "todos") {
            contractBadge.textContent = `Todos os Contratos (${indicators.length} indicadores)`;
        } else if (contratos[currentContractKey]) {
            contractBadge.textContent = `${contratos[currentContractKey].nome} (${indicators.length} indicadores)`;
        }
    }

    if (indicators.length === 0) {
        indicatorsGrid.innerHTML = `
            <div class="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <h3>Nenhum indicador encontrado</h3>
                <p>Não há indicadores específicos nesta categoria para o contrato selecionado.</p>
            </div>
        `;
        return;
    }

    indicators.forEach(ind => {
        const card = document.createElement("a");
        card.href = "#";
        card.className = "indicator-card";
        card.setAttribute("data-id", ind.id);

        const badgeText = ind.isGlobal ? "Global" : (ind.contratoNome || ind.categoryLabel);

        card.innerHTML = `
            <span class="card-category-tag ${ind.category}">${badgeText}</span>
            <div class="card-icon-wrapper">
                ${ind.icon}
            </div>
            <h3 class="card-title">${ind.title}</h3>
            <p class="card-description">${ind.description}</p>
            <div class="card-arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            </div>
        `;

        // Ao clicar no card, abre o indicador diretamente EMBUTIDO no próprio Hub (iframe)
        card.addEventListener("click", (e) => {
            e.preventDefault();
            abrirRelatorio(ind);
        });

        indicatorsGrid.appendChild(card);
    });
}

/**
 * Atualiza o cabeçalho do dashboard
 */
function updateHeader() {
    const meta = categoryMetaData[currentCategory] || categoryMetaData.all;
    viewSubtitle.textContent = meta.subtitle;

    if (currentContractKey !== "todos" && contratos[currentContractKey]) {
        viewTitle.textContent = `${meta.title} — ${contratos[currentContractKey].nome}`;
    } else {
        viewTitle.textContent = meta.title;
    }

    viewDescription.textContent = meta.description;
}

/**
 * Carrega e exibe um relatório do Power BI ou Vercel dentro do iframe embutido
 */
async function abrirRelatorio(indicator) {
    let response;
    try {
        response = await fetch(`/api?action=report&id=${encodeURIComponent(indicator.id)}`, { credentials: "same-origin" });
        if (!response.ok) throw new Error((await response.json()).error || "Indicador não autorizado.");
    } catch (error) {
        window.alert(error.message || "Não foi possível abrir o indicador.");
        return;
    }
    const { url } = await response.json();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Exibe a categoria e nome do contrato no topo do iframe
    const categoryTag = indicator.contratoNome 
        ? `${indicator.categoryLabel} — ${indicator.contratoNome}` 
        : indicator.categoryLabel;

    iframeCategoryText.textContent = categoryTag;
    iframeTitleText.textContent = indicator.title;
    iframeExternalLink.href = url;

    // Loader suave
    iframeLoader.style.opacity = "1";
    iframeLoader.style.display = "flex";
    reportIframe.src = "";

    dashboardViewport.style.display = "none";
    iframeViewport.style.display = "flex";

    // Carrega a URL no iframe
    reportIframe.src = url;

    reportIframe.onload = () => {
        setTimeout(() => {
            iframeLoader.style.opacity = "0";
            setTimeout(() => {
                iframeLoader.style.display = "none";
            }, 300);
        }, 400);
    };
}

/**
 * Retorna do visualizador para o painel principal (grid de cards)
 */
function voltarParaDashboard() {
    iframeViewport.style.display = "none";
    dashboardViewport.style.display = "flex";
    reportIframe.src = "";
}

/**
 * Seleciona a categoria ativa na sidebar
 */
function setActiveTab(category, activeBtn) {
    currentCategory = category;

    sidebarButtons.forEach(btn => btn.classList.remove("active"));
    if (activeBtn) {
        activeBtn.classList.add("active");
    }

    voltarParaDashboard();
    updateHeader();
    renderIndicators();

    if (window.innerWidth <= 1024) {
        sidebar.classList.remove("open");
    }
}

/**
 * Popula as opções do filtro de contrato
 */
function populateContractFilter() {
    if (!contractSelect) return;

    const allowedContracts = window.ACCESS_CONTEXT?.contracts || [];
    const canViewAll = allowedContracts.includes("*");
    contractSelect.innerHTML = canViewAll ? `<option value="todos">Todos os Contratos</option>` : "";

    const sortedKeys = Object.keys(contratos).sort((a, b) => 
        contratos[a].nome.localeCompare(contratos[b].nome)
    );

    sortedKeys.filter(key => canViewAll || allowedContracts.includes(key)).forEach(key => {
        const option = document.createElement("option");
        option.value = key;
        option.textContent = contratos[key].nome;
        contractSelect.appendChild(option);
    });

    contractSelect.onchange = (e) => {
        currentContractKey = e.target.value;
        voltarParaDashboard();
        updateHeader();
        renderIndicators();
    };

    if (!canViewAll && contractSelect.options.length) {
        currentContractKey = contractSelect.options[0].value;
        contractSelect.value = currentContractKey;
    }
}

function applyAccessContext(access) {
    window.ACCESS_CONTEXT = access;
    document.querySelectorAll(".nav-button[data-category]").forEach(button => {
        button.closest(".nav-item").hidden = !access.menus.includes(button.dataset.category);
    });
    populateContractFilter();
    const firstAllowedCategory = access.menus.find(menu => categoryMetaData[menu]) || "all";
    const firstAllowedButton = document.querySelector(`.nav-button[data-category="${firstAllowedCategory}"]`);
    if (!access.menus.includes(currentCategory)) setActiveTab(firstAllowedCategory, firstAllowedButton);
    else { updateHeader(); renderIndicators(); }
}

// Event Listeners
sidebarButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const category = btn.getAttribute("data-category");
        setActiveTab(category, btn);
    });
});

if (btnVoltarDashboard) {
    btnVoltarDashboard.addEventListener("click", voltarParaDashboard);
}

if (logoHome) {
    logoHome.addEventListener("click", (e) => {
        e.preventDefault();
        const canViewAllContracts = window.ACCESS_CONTEXT?.contracts?.includes("*");
        if (canViewAllContracts) {
            contractSelect.value = "todos";
            currentContractKey = "todos";
        }
        const homeCategory = window.ACCESS_CONTEXT?.menus?.includes("all") ? "all" : (window.ACCESS_CONTEXT?.menus?.[0] || "all");
        setActiveTab(homeCategory, document.querySelector(`.nav-button[data-category="${homeCategory}"]`));
    });
}

if (menuToggle) {
    menuToggle.addEventListener("click", () => {
        if (window.innerWidth <= 1024) {
            sidebar.classList.toggle("open");
        } else {
            document.body.classList.toggle("sidebar-collapsed");
        }
    });
}

const btnCollapseSidebar = document.getElementById("btn-collapse-sidebar");
if (btnCollapseSidebar) {
    btnCollapseSidebar.addEventListener("click", () => {
        if (window.innerWidth > 1024) {
            document.body.classList.add("sidebar-collapsed");
        } else {
            sidebar.classList.remove("open");
        }
    });
}

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
    populateContractFilter();
    setActiveTab("all", btnVisaoGeral);
});
