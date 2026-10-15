/**
 * Lógica principal da aplicação de pré-qualificação de leads.
 * Gerencia o fluxo de etapas, seleção de opções, modo de edição,
 * tela de resumo e formatação/abertura do WhatsApp.
 */

import { WHATSAPP_NUMBER, BROKER_INFO } from './config.js';
import { QUESTIONS } from './questions.js';

// Ícones SVG consistentes (Lucide / Feather style + WhatsApp oficial)
const ICONS = {
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
  arrowRight: `<svg class="arrow-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`,
  arrowLeft: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>`,
  edit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`,
  briefcase: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>`,
  shieldCheck: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>`,
  dollarSign: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>`,
  home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`,
  users: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
  whatsapp: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>`
};

// Estado da Aplicação
const state = {
  currentStepIndex: 0,
  answers: {}, // { questionId: selectedOption }
  isEditingFromSummary: false,
  editingQuestionIndex: null,
  isSummaryView: false
};

// Elementos do DOM
const quizContainer = document.getElementById('quiz-card-content');
const heroIntro = document.getElementById('hero-intro');

/**
 * Inicialização
 */
export function initApp() {
  initPreloader();
  renderCurrentView();
}

/**
 * Inicialização da tela de carregamento (Preloader)
 */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const progressBar = document.getElementById('preloader-progress-bar');
  if (!preloader) return;

  const dismissPreloader = () => {
    preloader.classList.add('preloader--hidden');
    setTimeout(() => {
      if (preloader.parentNode) {
        preloader.remove();
      }
    }, 600);
  };

  if (progressBar) {
    progressBar.addEventListener('animationend', () => {
      setTimeout(dismissPreloader, 180);
    });
  }

  // Fallback seguro caso a animação demore ou seja interrompida
  setTimeout(dismissPreloader, 2300);
}


/**
 * Renderiza a visão atual (etapa do quiz ou resumo)
 */
function renderCurrentView() {
  if (state.isSummaryView) {
    renderSummaryView();
  } else {
    renderQuestionStep(state.currentStepIndex);
  }
}

/**
 * Renderiza uma pergunta do quiz
 * @param {number} index Índice da pergunta (0 a 4)
 */
function renderQuestionStep(index) {
  const question = QUESTIONS[index];
  const totalQuestions = QUESTIONS.length;
  const currentStepNumber = index + 1;
  const progressPercent = (currentStepNumber / totalQuestions) * 100;
  
  const currentAnswer = state.answers[question.id] || null;
  const isEditing = state.isEditingFromSummary;
  const isLastQuestion = index === totalQuestions - 1;

  // Garante que o hero intro esteja visível durante o quiz
  if (heroIntro) heroIntro.style.display = 'block';

  let html = `
    <!-- Barra de Metadados / Progresso -->
    <div class="card-header-meta">
      <span class="badge-profile">Seu Perfil</span>
      <span class="step-counter" aria-live="polite">Pergunta ${currentStepNumber} de ${totalQuestions}</span>
    </div>

    <div class="progress-track" role="progressbar" aria-valuenow="${currentStepNumber}" aria-valuemin="1" aria-valuemax="${totalQuestions}" aria-label="Progresso do questionário: etapa ${currentStepNumber} de ${totalQuestions}">
      <div class="progress-bar-fill" style="width: ${progressPercent}%;"></div>
    </div>

    ${isEditing ? `
      <div class="edit-mode-notice" role="status">
        ${ICONS.edit} Alterando resposta salva
      </div>
    ` : ''}

    <!-- Cabeçalho da Pergunta -->
    <div class="question-container">
      <h2 class="question-title" id="question-heading" tabindex="-1">${question.title}</h2>
      ${question.helpText ? `<p class="question-help">${question.helpText}</p>` : ''}
    </div>

    <!-- Lista de Opções -->
    <div class="options-group" role="radiogroup" aria-labelledby="question-heading">
  `;

  question.options.forEach((optionText, optIdx) => {
    const isSelected = currentAnswer === optionText;
    const optionId = `opt-${index}-${optIdx}`;

    html += `
      <button 
        type="button" 
        class="option-card ${isSelected ? 'is-selected' : ''}" 
        id="${optionId}"
        role="radio" 
        aria-checked="${isSelected ? 'true' : 'false'}"
        data-value="${escapeHtml(optionText)}"
      >
        <span class="option-label">${optionText}</span>
        <span class="option-indicator" aria-hidden="true">
          ${ICONS.check}
        </span>
      </button>
    `;
  });

  html += `
    </div>

    <!-- Ações de Navegação -->
    <div class="quiz-actions">
      <button 
        type="button" 
        class="btn-continue" 
        id="btn-continue" 
        ${!currentAnswer ? 'disabled' : ''}
      >
        ${isEditing ? 'Salvar alteração' : (isLastQuestion ? 'Ver meu resumo' : 'Continuar')}
        ${!isEditing ? ICONS.arrowRight : ''}
      </button>

      ${isEditing ? `
        <button type="button" class="btn-back" id="btn-cancel-edit">
          ${ICONS.arrowLeft} Cancelar e voltar ao resumo
        </button>
      ` : (index > 0 ? `
        <button type="button" class="btn-back" id="btn-back">
          ${ICONS.arrowLeft} Voltar
        </button>
      ` : '')}
    </div>
  `;

  quizContainer.innerHTML = html;

  // Foco no título da pergunta para leitores de tela e acessibilidade de teclado
  const headingEl = document.getElementById('question-heading');
  if (headingEl) {
    headingEl.focus();
  }

  // Vincula eventos dos cards de opção
  const optionButtons = quizContainer.querySelectorAll('.option-card');
  optionButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const selectedValue = btn.getAttribute('data-value');
      selectOption(question.id, selectedValue);
    });

    btn.addEventListener('keydown', (e) => {
      handleOptionKeydown(e, optionButtons);
    });
  });

  // Botão Continuar / Salvar
  const btnContinue = document.getElementById('btn-continue');
  if (btnContinue) {
    btnContinue.addEventListener('click', () => {
      if (isEditing) {
        // Retorna diretamente para a tela de resumo após salvar
        state.isEditingFromSummary = false;
        state.editingQuestionIndex = null;
        state.isSummaryView = true;
        renderSummaryView();
      } else {
        if (isLastQuestion) {
          state.isSummaryView = true;
          renderSummaryView();
        } else {
          state.currentStepIndex++;
          renderQuestionStep(state.currentStepIndex);
        }
      }
    });
  }

  // Botão Voltar
  const btnBack = document.getElementById('btn-back');
  if (btnBack) {
    btnBack.addEventListener('click', () => {
      if (state.currentStepIndex > 0) {
        state.currentStepIndex--;
        renderQuestionStep(state.currentStepIndex);
      }
    });
  }

  // Botão Cancelar Edição
  const btnCancelEdit = document.getElementById('btn-cancel-edit');
  if (btnCancelEdit) {
    btnCancelEdit.addEventListener('click', () => {
      state.isEditingFromSummary = false;
      state.editingQuestionIndex = null;
      state.isSummaryView = true;
      renderSummaryView();
    });
  }
}

/**
 * Seleciona uma opção e atualiza o estado e a UI
 */
function selectOption(questionId, value) {
  state.answers[questionId] = value;

  // Atualiza visualmente os botões de opção
  const buttons = quizContainer.querySelectorAll('.option-card');
  buttons.forEach((btn) => {
    const isThisSelected = btn.getAttribute('data-value') === value;
    btn.classList.toggle('is-selected', isThisSelected);
    btn.setAttribute('aria-checked', isThisSelected ? 'true' : 'false');
  });

  // Habilita o botão continuar
  const btnContinue = document.getElementById('btn-continue');
  if (btnContinue) {
    btnContinue.disabled = false;
  }
}

/**
 * Suporte a navegação por teclado nas opções (setas para cima/baixo)
 */
function handleOptionKeydown(e, buttons) {
  const currentIdx = Array.from(buttons).indexOf(e.currentTarget);
  let nextIdx = null;

  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
    e.preventDefault();
    nextIdx = (currentIdx + 1) % buttons.length;
  } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
    e.preventDefault();
    nextIdx = (currentIdx - 1 + buttons.length) % buttons.length;
  }

  if (nextIdx !== null) {
    buttons[nextIdx].focus();
    buttons[nextIdx].click();
  }
}

/**
 * Renderiza a Tela de Resumo
 */
function renderSummaryView() {
  // Rola suavemente para o topo do quiz
  quizContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const hasBrokerNumber = WHATSAPP_NUMBER && WHATSAPP_NUMBER.trim().length >= 10;
  const whatsappUrl = hasBrokerNumber ? buildWhatsAppLink() : '#';

  const iconMap = {
    profissao: ICONS.briefcase,
    restricao: ICONS.shieldCheck,
    renda: ICONS.dollarSign,
    casa_propria: ICONS.home,
    estado_civil: ICONS.users
  };

  let itemsHtml = '';
  QUESTIONS.forEach((q, qIndex) => {
    const answer = state.answers[q.id] || 'Não respondido';
    const icon = iconMap[q.id] || ICONS.check;

    itemsHtml += `
      <div class="summary-item">
        <div class="summary-item-left">
          <div class="summary-item-icon" aria-hidden="true">
            ${icon}
          </div>
          <div class="summary-item-texts">
            <span class="summary-item-label">${q.label}</span>
            <span class="summary-item-value" title="${escapeHtml(answer)}">${answer}</span>
          </div>
        </div>
        <button 
          type="button" 
          class="btn-edit-item" 
          data-index="${qIndex}" 
          aria-label="Editar ${q.label}"
        >
          ${ICONS.edit}
          <span>Editar</span>
        </button>
      </div>
    `;
  });

  const html = `
    <div class="summary-container">
      <div class="summary-check-badge" aria-hidden="true">
        ${ICONS.check}
      </div>

      <h2 class="summary-title" id="summary-heading" tabindex="-1">Tudo pronto, vamos conversar?</h2>
      <p class="summary-subtitle">Confira suas respostas e envie para o Marcos pelo WhatsApp.</p>

      <div class="summary-card-inner">
        <div class="summary-inner-header">
          <span class="summary-inner-title">Seu resumo</span>
        </div>
        <div class="summary-items-list">
          ${itemsHtml}
        </div>
      </div>

      ${!hasBrokerNumber ? `
        <div class="alert-broker-unconfigured" role="alert">
          Contato do corretor ainda não configurado.
        </div>
      ` : ''}

      <button 
        type="button" 
        class="btn-whatsapp" 
        id="btn-send-whatsapp"
        ${!hasBrokerNumber ? 'disabled' : ''}
      >
        ${ICONS.whatsapp}
        <span>Enviar respostas pelo WhatsApp</span>
      </button>

      <p class="summary-helper-text">
        O WhatsApp abrirá com suas respostas. Toque em enviar para concluir.
      </p>

      <p class="summary-disclaimer">
        Ao continuar, você abrirá o WhatsApp para compartilhar estas respostas com Marcos Antônio e receber atendimento sobre imóveis.
      </p>
    </div>
  `;

  quizContainer.innerHTML = html;

  const summaryHeading = document.getElementById('summary-heading');
  if (summaryHeading) {
    summaryHeading.focus();
  }

  // Eventos dos botões "Editar"
  const editButtons = quizContainer.querySelectorAll('.btn-edit-item');
  editButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetIndex = parseInt(btn.getAttribute('data-index'), 10);
      openEditQuestion(targetIndex);
    });
  });

  // Evento do botão Enviar pelo WhatsApp
  const btnWhatsApp = document.getElementById('btn-send-whatsapp');
  if (btnWhatsApp && hasBrokerNumber) {
    btnWhatsApp.addEventListener('click', () => {
      openWhatsApp(whatsappUrl);
    });
  }
}

/**
 * Abre uma pergunta específica para edição
 */
function openEditQuestion(index) {
  state.isEditingFromSummary = true;
  state.editingQuestionIndex = index;
  state.isSummaryView = false;
  state.currentStepIndex = index;
  renderQuestionStep(index);
}

/**
 * Monta o texto padronizado e o link codificado do WhatsApp
 */
function buildWhatsAppLink() {
  const qMap = {};
  QUESTIONS.forEach((q) => {
    qMap[q.id] = state.answers[q.id] || 'Não informado';
  });

  const messageText = 
`Olá, Marcos! Respondi às perguntas do seu site e gostaria de conversar sobre a compra de um imóvel.

*Meu perfil*
• Ocupação: ${qMap.profissao || ''}
• Restrição no nome: ${qMap.restricao || ''}
• Renda mensal individual: ${qMap.renda || ''}
• Já possui casa própria: ${qMap.casa_propria || ''}
• Estado civil: ${qMap.estado_civil || ''}

Pode me orientar sobre os próximos passos?`;

  const cleanNumber = WHATSAPP_NUMBER.replace(/\D/g, '');
  const encodedText = encodeURIComponent(messageText);

  return `https://wa.me/${cleanNumber}?text=${encodedText}`;
}

/**
 * Redireciona para o WhatsApp de forma segura na mesma aba
 */
function openWhatsApp(url) {
  if (!url || url === '#') return;
  window.location.href = url;
}

/**
 * Helper para escapar HTML em strings
 */
function escapeHtml(string) {
  if (!string) return '';
  return String(string)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Inicia ao carregar a página
document.addEventListener('DOMContentLoaded', initApp);
