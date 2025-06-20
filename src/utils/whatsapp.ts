// Função para gerar mensagem personalizada do WhatsApp
export const getWhatsAppMessage = (solutionTitle: string, solutionKey: string) => {
  const message = `Olá! Tenho interesse em conhecer mais sobre a solução *${solutionTitle}* da MK Tecnologia. Gostaria de receber uma demonstração gratuita personalizada para meu negócio. Aguardo o contato de vocês!`;
  return `https://wa.me/5565993535079?text=${encodeURIComponent(message)}`;
};