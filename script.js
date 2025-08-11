// Elementos
const btnPergunta = document.getElementById('btnPergunta');
const userInput = document.getElementById('userInput');
const respContent = document.getElementById('respContent');
const respostaDiv = document.getElementById('resposta');
const error = document.getElementById('error');
const apiKeyInput = document.getElementById('apiKey');
const modelSelect = document.getElementById('modelSelect');
const themeCheckbox = document.getElementById('toggleThemeCheckbox');

// Aplica o tema
function aplicarTema(tema) {
  if (tema === 'dark') {
    document.body.classList.add('dark-mode');
    themeCheckbox.checked = true;
  } else {
    document.body.classList.remove('dark-mode');
    themeCheckbox.checked = false;
  }
}

// Altera o tema manual
themeCheckbox.addEventListener('change', () => {
  const novoTema = themeCheckbox.checked ? 'dark' : 'light';
  localStorage.setItem('tema', novoTema);
  aplicarTema(novoTema);
});

// Tema salvo quando carrega
const temaSalvo = localStorage.getItem('tema') || 'light';
aplicarTema(temaSalvo);

// Enviar pergunta para a API
btnPergunta.addEventListener('click', async () => {
  const pergunta = userInput.value.trim();
  const apiKey = apiKeyInput.value.trim();
  const modelo = modelSelect.value;

  error.textContent = '';
  respContent.classList.add('hidden');
  respostaDiv.textContent = '';

  if (!apiKey) {
    error.textContent = 'API Key é obrigatória';
    return;
  }

  if (!pergunta) {
    error.textContent = 'Digite uma pergunta.';
    return;
  }

  btnPergunta.disabled = true;
  btnPergunta.textContent = 'Carregando...';

  try {
    const resposta = await fetchIA(pergunta, apiKey, modelo);
    respostaDiv.textContent = resposta;
    respContent.classList.remove('hidden');
  } catch (erro) {
    error.textContent = `Erro: ${erro.message}`;
  } finally {
    btnPergunta.disabled = false;
    btnPergunta.textContent = 'Perguntar';
  }
});

// Função de requisição para a OpenAI
async function fetchIA(pergunta, apiKey, modelo) {
  const endpoint = 'https://api.openai.com/v1/chat/completions';

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: modelo,
      messages: [{ role: 'user', content: pergunta }],
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const erro = await res.json();
    throw new Error(erro.error?.message || 'Erro desconhecido');
  }

  const data = await res.json();
  return data.choices[0].message.content.trim();
}