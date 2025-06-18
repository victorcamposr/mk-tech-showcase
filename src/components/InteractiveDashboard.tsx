import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ScrollReveal";
import CountUpNumber from "@/components/CountUpNumber";

const InteractiveDashboard = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentMetric, setCurrentMetric] = useState(0);
  const [currentChart, setCurrentChart] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [typedText, setTypedText] = useState("");
  
  const metricsGroups = [
    [
      { label: "Vendas Hoje", value: 12, suffix: "%", color: "text-green-500", icon: "📈" },
      { label: "Estoque Crítico", value: 3, suffix: " itens", color: "text-orange-500", icon: "⚠️" },
      { label: "Eficiência", value: 89, suffix: "%", color: "text-blue-500", icon: "⚡" },
      { label: "Lucro", value: 24, suffix: "%", color: "text-brand-gold", icon: "💰" }
    ],
    [
      { label: "Fluxo de Caixa", value: 96, suffix: "%", color: "text-green-600", icon: "💰" },
      { label: "Processamento", value: 15, suffix: "ms", color: "text-blue-600", icon: "⚡" },
      { label: "Margem Bruta", value: 8.7, suffix: "%", color: "text-purple-500", icon: "📊" },
      { label: "Economia Gerada", value: 34, suffix: "k", color: "text-emerald-500", icon: "💎" }
    ],
    [
      { label: "Produtividade", value: 127, suffix: "%", color: "text-indigo-500", icon: "🚀" },
      { label: "Custos Reduzidos", value: 28, suffix: "%", color: "text-red-500", icon: "💸" },
      { label: "Automação", value: 85, suffix: "%", color: "text-cyan-500", icon: "🤖" },
      { label: "Uptime", value: 99.9, suffix: "%", color: "text-green-700", icon: "🟢" }
    ]
  ];

  const chartTypes = [
    {
      title: "Previsão de Vendas - Próximos 7 Dias",
      data: [65, 78, 82, 70, 88, 95, 72],
      labels: ["D1", "D2", "D3", "D4", "D5", "D6", "D7"]
    },
    {
      title: "Análise de Comportamento do Cliente",
      data: [45, 67, 89, 76, 92, 85, 79],
      labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]
    },
    {
      title: "Otimização de Estoque por Categoria",
      data: [80, 65, 90, 45, 88, 95, 70],
      labels: ["Cat1", "Cat2", "Cat3", "Cat4", "Cat5", "Cat6", "Cat7"]
    },
    {
      title: "Performance de Funcionários",
      data: [88, 92, 78, 95, 87, 91, 89],
      labels: ["F1", "F2", "F3", "F4", "F5", "F6", "F7"]
    }
  ];

  const aiInsightsGroups = [
    [
      "Analisando padrões de vendas em tempo real...",
      "Detectado aumento de 12% no fluxo de vendas hoje",
      "Identificados 3 itens próximos de esgotar no estoque",
      "Recomendação: Reabastecer produtos categoria 'Eletrônicos'",
      "Previsão para amanhã: +8% nas vendas"
    ],
    [
      "Processando comportamento de clientes...",
      "Detectado padrão: 67% dos clientes retornam em 30 dias",
      "Hora de pico identificada: 14h às 16h",
      "Produto mais procurado: Smartphones categoria Premium",
      "Recomendação: Aumentar estoque para horário de pico"
    ],
    [
      "Analisando eficiência operacional...",
      "Sistema detectou otimização de 34% nos processos",
      "Tempo médio de atendimento reduzido em 28%",
      "Automação implementada em 85% das tarefas",
      "Previsão: Economia de R$ 15.000 este mês"
    ],
    [
      "Executando análise preditiva avançada...",
      "IA identificou tendência de crescimento: +45% próximo trimestre",
      "Padrão sazonal detectado: Alta demanda em dezembro",
      "Recomendação: Preparar campanha promocional",
      "Forecast de receita: R$ 280.000 próximos 90 dias"
    ],
    [
      "Processando análise de margem de lucro...",
      "Detectado aumento de 15% na margem bruta",
      "Categoria com maior rentabilidade: Acessórios",
      "Oportunidade identificada: Expandir linha premium",
      "Projeção: +R$ 45.000 em lucro adicional"
    ],
    [
      "Executando monitoramento de concorrência...",
      "Análise de preços dos concorrentes em progresso",
      "Identificadas 12 oportunidades de reposicionamento",
      "Recomendação: Ajustar preços em 5 produtos chave",
      "Impacto estimado: +18% em competitividade"
    ],
    [
      "Analisando fluxo de caixa em tempo real...",
      "Entradas projetadas: R$ 85.600 (próximos 30 dias)",
      "Saídas programadas: R$ 62.300 (próximos 30 dias)",
      "Saldo líquido previsto: +R$ 23.300",
      "Status: Fluxo de caixa saudável e controlado"
    ],
    [
      "Processando análise de sazonalidade...",
      "Detectado padrão: +35% vendas em datas comemorativas",
      "Próximo evento: Dia das Mães (preparar estoque)",
      "Produtos em alta: Perfumes e cosméticos",
      "Estratégia: Aumentar estoque em 40% na categoria"
    ]
  ];

  const currentMetrics = metricsGroups[Math.floor(currentMetric / 4) % metricsGroups.length];
  const currentInsights = aiInsightsGroups[Math.floor(currentMetric / 4) % aiInsightsGroups.length];

  useEffect(() => {
    if (isAnalyzing) {
      const interval = setInterval(() => {
        setCurrentMetric((prev) => prev + 1);
        setCurrentChart((prev) => (prev + 1) % chartTypes.length);
      }, 3000);
      
      // Simular alert depois de 4 segundos
      setTimeout(() => setShowAlert(true), 4000);
      
      return () => clearInterval(interval);
    }
  }, [isAnalyzing, chartTypes.length]);

  useEffect(() => {
    if (isAnalyzing) {
      let index = 0;
      const text = currentInsights[Math.floor(Math.random() * currentInsights.length)];
      setTypedText("");
      
      const typeInterval = setInterval(() => {
        if (index < text.length) {
          setTypedText(text.slice(0, index + 1));
          index++;
        } else {
          clearInterval(typeInterval);
        }
      }, 60);
      
      return () => clearInterval(typeInterval);
    }
  }, [isAnalyzing, currentInsights, currentMetric]);

  const startAnalysis = () => {
    setIsAnalyzing(true);
    setShowAlert(false);
    setTypedText("");
    setCurrentMetric(0);
    setCurrentChart(0);
    setTimeout(() => setIsAnalyzing(false), 15000);
  };

  return (
    <ScrollReveal animation="fade-up" delay={250}>
      <div className="relative bg-gradient-to-br from-brand-black via-brand-black-light to-brand-black rounded-2xl p-4 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-gold/5 to-transparent"></div>
        <div className="absolute top-0 right-0 w-20 h-20 bg-brand-gold/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-brand-gold/5 rounded-full blur-xl"></div>
        
        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-3">
            <h2 className="text-2xl font-bold text-white mb-3 flex items-center justify-center gap-2">
              <span className="text-xl">🤖</span>
              Análise Inteligente em Tempo Real
              <span className={`w-2 h-2 rounded-full ${isAnalyzing ? 'bg-green-400 animate-ping shadow-lg shadow-green-400/50' : 'bg-gray-400'}`}></span>
            </h2>
            <p className="text-gray-300 text-base max-w-2xl mx-auto">
              Nossa IA monitora e analisa seus dados 24/7, fornecendo insights instantâneos para maximizar seus resultados
            </p>
          </div>

          {/* AI Console */}
          <Card className="bg-black/40 border-brand-gold/20 backdrop-blur-sm mb-4">
            <CardHeader className="pb-2 pt-3">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <CardTitle className="text-brand-gold text-xs font-mono">AI_ANALYZER v2.0</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="bg-black/60 rounded-lg p-3 font-mono text-xs">
                <div className="text-green-400 mb-1">$ ai --analyze --real-time</div>
                <div className="text-white min-h-[40px] flex items-center">
                  {isAnalyzing ? (
                    <span>
                      {typedText}
                      <span className="animate-pulse">|</span>
                    </span>
                  ) : (
                    <span className="text-gray-400">Aguardando comando de análise...</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            {currentMetrics.map((metric, index) => (
              <Card 
                key={index} 
                className={`bg-black/30 border-brand-gold/20 transition-all duration-500 hover:scale-105 ${
                  isAnalyzing && (currentMetric % 4) === index ? 'ring-2 ring-brand-gold shadow-lg shadow-brand-gold/20' : ''
                }`}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">{metric.icon}</div>
                  <div className={`text-2xl font-bold ${metric.color} mb-1`}>
                    {isAnalyzing && (currentMetric % 4) === index ? (
                      <CountUpNumber end={metric.value} suffix={metric.suffix} className="block" />
                    ) : (
                      `${metric.value}${metric.suffix}`
                    )}
                  </div>
                  <div className="text-gray-300 text-xs font-medium">{metric.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Alert System */}
          {showAlert && (
            <Card className="bg-orange-500/20 border-orange-500/40 mb-4 animate-pulse animate-fade-in">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🚨</span>
                  <div>
                    <div className="text-orange-300 font-semibold text-sm">Alerta Automático Detectado</div>
                    <div className="text-orange-200 text-xs">3 produtos próximos do estoque mínimo - Ação recomendada: Reposição urgente</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Chart Simulation */}
          <Card className="bg-black/30 border-brand-gold/20 mb-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm">{chartTypes[currentChart].title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-end justify-between h-20 px-2">
                {chartTypes[currentChart].data.map((height, index) => (
                  <div key={index} className="flex flex-col items-center gap-1">
                    <div 
                      className={`bg-gradient-to-t from-brand-gold to-brand-gold-light rounded-t transition-all duration-1000 w-6 ${
                        isAnalyzing ? `opacity-100 animate-pulse` : 'opacity-60'
                      }`}
                      style={{ 
                        height: `${height}%`,
                        animationDelay: isAnalyzing ? `${index * 150}ms` : '0ms'
                      }}
                    ></div>
                    <span className="text-gray-400 text-[10px]">{chartTypes[currentChart].labels[index]}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Control Center */}
          <div className="text-center">
            <Button 
              onClick={startAnalysis}
              disabled={isAnalyzing}
              className={`px-6 py-3 text-sm font-semibold transition-all duration-300 ${
                isAnalyzing 
                  ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                  : 'bg-brand-gold hover:bg-brand-gold-dark text-brand-black hover:scale-105'
              }`}
            >
              {isAnalyzing ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⚙️</span>
                  Analisando Dados...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  🎯 Iniciar Análise Inteligente
                </span>
              )}
            </Button>
            
            <p className="text-gray-400 text-xs mt-3">
              * Demonstração interativa - Os dados são simulados para fins de apresentação
            </p>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
};

export default InteractiveDashboard;