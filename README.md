# Hub Geral de Indicadores — Todos os Contratos

Aplicação Web unificada para acesso aos indicadores e dashboards estratégicos de todos os 16 contratos MRO.

## 🚀 Funcionalidades

- **Filtro em Tempo Real**: Seleção rápida de contrato no topo da página atualizando dinamicamente os indicadores sem recarregar a tela.
- **Categorias Organizadas**:
  - **Visão Geral**: Todos os indicadores ativos ou filtrados por contrato.
  - **Processos**: Indicadores de performance e relatórios operacionais específicos por contrato.
  - **Pessoas**: Programa Padrinho e DBO (Globais).
  - **Inventário**: Painel de Controle de Inventário (Global).
  - **SMS**: Painel de Ocorrências (Global).
  - **Gestão**: Diário de Bordo (Global).
- **Gestão de Usuários (CCO)**:
  - Login por e-mail e senha com troca obrigatória da senha temporária.
  - Perfis CCO, Diretoria, Gerente Geral, Gerente, Coordenador, Supervisor e Analista.
  - Restrições de contratos, operações, menus e indicadores validadas no backend.
  - Cadastro manual, ativação/inativação, redefinição de senha e permissões individuais.
  - Importação Excel com pré-visualização, deduplicação por e-mail e validação de campos.
  - Histórico de auditoria das alterações.
- **Design System Identico ao Hub ENEL RJ**:
  - Tipografia Google Fonts (`Outfit` e `Inter`).
  - Paleta de cores corporativa, sombras dinâmicas e efeitos de elevação em hover.
  - 100% Responsivo para Desktop, Tablet e Mobile.
  - Todos os links abrem em nova guia (`target="_blank"`).

## 🏢 Contratos Suportados

1. Acelen
2. CBO
3. CLI
4. ENEL CE
5. ENEL RJ
6. Equatorial
7. Globo
8. Light
9. MetrôRio
10. Modec
11. Motiva Mobilidade
12. Motiva Rodovias
13. Petrobras
14. Rumo
15. Vale MG
16. Vale PA

Na importação de usuários, a planilha deve possuir as colunas `Nome`, `E-mail`, `Centro de Custo` e `Cargo`. A coluna `Contrato` é opcional: `Todos` libera todos os contratos, uma célula vazia não libera nenhum BI contratual e nomes ainda não cadastrados no Hub são ignorados. Para vincular mais de um contrato conhecido ao mesmo usuário, separe os nomes por vírgula. O sistema identifica o nível pelo cargo e libera somente os indicadores permitidos para esse nível e para o escopo contratual informado.

Nas permissões individuais, liberar um menu também libera os indicadores pertencentes a ele, sempre respeitando os contratos e operações atribuídos ao usuário. Um bloqueio definido diretamente em um indicador prevalece sobre a liberação do menu.

## 🛠️ Tecnologias Utilizadas

- HTML5 Semântico
- CSS3 (Vanilla CSS com Variáveis Customizadas)
- JavaScript ES6+
- SVGs Lucide Icons
- Vercel Functions (Node.js)
- PostgreSQL

## Configuração do módulo de acesso

### Teste local

Execute `npm install` e depois `npm start`. Acesse `http://localhost:3000`. Abrir o `index.html` diretamente ou usar uma extensão de servidor estático não inicia a API e impede o login.

Sem `DATABASE_URL`, o servidor local usa um banco SQLite persistente em `.data/hub.sqlite` e cria o CCO `luiza.gomes@mroativa.com.br` com a senha inicial `senhamro`. Usuários, permissões e histórico permanecem salvos após reiniciar o servidor. É possível alterar o caminho com `LOCAL_DATABASE_PATH`.

### Produção

1. Crie um banco PostgreSQL e copie `.env.example` para as variáveis do projeto na Vercel.
2. Defina `DATABASE_URL`, `AUTH_SECRET` (mínimo de 32 caracteres), `CCO_EMAIL`, `CCO_PASSWORD` e `CCO_NAME`.
3. Execute `npm install` para desenvolvimento local e publique o projeto. As tabelas são criadas automaticamente no primeiro acesso.
4. O primeiro usuário CCO é criado somente quando a tabela de usuários está vazia. A senha inicial deve ser alterada no primeiro login.

As URLs dos indicadores ficam apenas na função serverless e são liberadas depois da validação da sessão e das permissões. Relatórios Power BI publicados publicamente continuam acessíveis pelo próprio link do Power BI; para impedir acesso externo ao Hub, utilize Power BI Embedded/Entra ID com RLS.
