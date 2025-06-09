// Utilitários para formatação de data
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    return "Hoje";
  } else if (diffDays === 2) {
    return "Ontem";
  } else if (diffDays <= 7) {
    return `${diffDays - 1} dias atrás`;
  } else {
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }
};

// Utilitários para prioridades
export const getPriorityColor = (priority) => {
  const colors = {
    high: "red",
    medium: "orange",
    low: "green",
  };
  return colors[priority] || "grey";
};

export const getPriorityLabel = (priority) => {
  const labels = {
    high: "Alta",
    medium: "Média",
    low: "Baixa",
  };
  return labels[priority] || priority;
};

// Utilitários para categorias
export const getCategoryLabel = (category) => {
  const labels = {
    geral: "Geral",
    trabalho: "Trabalho",
    pessoal: "Pessoal",
    estudos: "Estudos",
    casa: "Casa",
    saude: "Saúde",
  };
  return labels[category] || category;
};

// Validações
export const textRules = [
  (v) => !!v || "Descrição é obrigatória",
  (v) => (v && v.length >= 3) || "Descrição deve ter pelo menos 3 caracteres",
  (v) => (v && v.length <= 100) || "Descrição deve ter no máximo 100 caracteres",
];

// Opções para selects
export const priorityOptions = [
  { title: "Alta", value: "high" },
  { title: "Média", value: "medium" },
  { title: "Baixa", value: "low" },
];

export const categoryOptions = [
  { title: "Geral", value: "geral" },
  { title: "Trabalho", value: "trabalho" },
  { title: "Pessoal", value: "pessoal" },
  { title: "Estudos", value: "estudos" },
  { title: "Casa", value: "casa" },
  { title: "Saúde", value: "saude" },
];
