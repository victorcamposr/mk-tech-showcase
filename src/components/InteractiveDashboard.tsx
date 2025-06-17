import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ScrollReveal";
import CountUpNumber from "@/components/CountUpNumber";

const InteractiveDashboard = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentMetric, setCurrentMetric] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [typedText, setTypedText] = useState("");
  
  const metrics = [
    { label: "Vendas Hoje", value: 12, suffix: "%", color: "text-green-500", icon: "📈" },
    { label: "Estoque Crítico", value: 3, suffix: " itens", color: "text-orange-500", icon: "⚠️" },
    { label: "Eficiência", value: 89, suffix: "%", color: "text-blue-500", icon: "⚡" },
    { label: "Lucro", value: 24, suffix: "%", color: "text-brand-gold", icon: "💰" }
  ];

  const aiInsights = [
    "Analisando padrões de vendas...",
    "Detectado aumento de 12% no fluxo de vendas hoje",
    "Identificados 3 itens próximos de esgotar no estoque",
    "Recomendação: Reabastecer produtos categoria 'Eletrônicos'",
    "Previsão para amanhã: +8% nas vendas"
  ];

  useEffect(() => {
    if (isAnalyzing) {
      const interval = setInterval(() => {
        setCurrentMetric((prev) => (prev + 1) % metrics.length);
      }, 2000);
      
      // Simular alert depois de 3 segundos
      setTimeout(() => setShowAlert(true), 3000);
      
      return () => clearInterval(interval);
    }
  }, [isAnalyzing, metrics.length]);

  useEffect(() => {
    if (isAnalyzing) {
      let index = 0;
      const text = aiInsights[Math.floor(Math.random() * aiInsights.length)];
      const typeInterval = setInterval(() => {
        if (index < text.length) {
          setTypedText(text.slice(0, index + 1));
          index++;
        } else {
          clearInterval(typeInterval);
        }
      }, 50);
      
      return () => clearInterval(typeInterval);
    }
  }, [isAnalyzing, aiInsights]);

  const startAnalysis = () => {
    setIsAnalyzing(true);
    setShowAlert(false);
    setTypedText("");
    setTimeout(() => setIsAnalyzing(false), 10000);
  };

  return (
    <ScrollReveal animation="fade-up" delay={250}>
      <div className="relative bg-gradient-to-br from-brand-black via-brand-black-light to-brand-black rounded-3xl p-8 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-gold/5 to-transparent"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-brand-gold/5 rounded-full blur-2xl"></div>
        
        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center justify-center gap-3">
              <span className="text-2xl">🤖</span>
              Análise Inteligente em Tempo Real
              <span className={`w-3 h-3 rounded-full ${isAnalyzing ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></span>
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Nossa IA monitora e analisa seus dados 24/7, fornecendo insights instantâneos para maximizar seus resultados
            </p>
          </div>

          {/* AI Console */}
          <Card className="bg-black/40 border-brand-gold/20 backdrop-blur-sm mb-8">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <CardTitle className="text-brand-gold text-sm font-mono">AI_ANALYZER v2.0</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-black/60 rounded-lg p-4 font-mono text-sm">
                <div className="text-green-400 mb-2">$ ai --analyze --real-time</div>
                <div className="text-white min-h-[60px] flex items-center">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metrics.map((metric, index) => (
              <Card 
                key={index} 
                className={`bg-black/30 border-brand-gold/20 transition-all duration-500 hover:scale-105 ${
                  isAnalyzing && currentMetric === index ? 'ring-2 ring-brand-gold shadow-lg shadow-brand-gold/20' : ''
                }`}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-3">{metric.icon}</div>
                  <div className={`text-3xl font-bold ${metric.color} mb-2`}>
                    {isAnalyzing && currentMetric === index ? (
                      <CountUpNumber end={metric.value} suffix={metric.suffix} className="block" />
                    ) : (
                      `${metric.value}${metric.suffix}`
                    )}
                  </div>
                  <div className="text-gray-300 text-sm font-medium">{metric.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Alert System */}
          {showAlert && (
            <Card className="bg-orange-500/20 border-orange-500/40 mb-8 animate-pulse">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🚨</span>
                  <div>
                    <div className="text-orange-300 font-semibold">Alerta Automático Detectado</div>
                    <div className="text-orange-200 text-sm">3 produtos próximos do estoque mínimo - Ação recomendada: Reposição urgente</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Chart Simulation */}
          <Card className="bg-black/30 border-brand-gold/20 mb-8">
            <CardHeader>
              <CardTitle className="text-white text-lg">Previsão de Vendas - Próximos 7 Dias</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between h-32 px-4">
                {[65, 78, 82, 70, 88, 95, 72].map((height, index) => (
                  <div key={index} className="flex flex-col items-center gap-2">
                    <div 
                      className={`bg-gradient-to-t from-brand-gold to-brand-gold-light rounded-t transition-all duration-1000 w-8 ${
                        isAnalyzing ? `opacity-100` : 'opacity-60'
                      }`}
                      style={{ 
                        height: `${height}%`,
                        animationDelay: isAnalyzing ? `${index * 200}ms` : '0ms'
                      }}
                    ></div>
                    <span className="text-gray-400 text-xs">D{index + 1}</span>
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
              className={`px-8 py-4 text-lg font-semibold transition-all duration-300 ${
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
            
            <p className="text-gray-400 text-sm mt-4">
              * Demonstração interativa - Os dados são simulados para fins de apresentação
            </p>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
};

export default InteractiveDashboard;