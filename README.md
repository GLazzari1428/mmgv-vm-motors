# VM Motors
## Informações Institucionais

- **Disciplina:** Experiência Criativa: Inovando Colaborativamente
- **Instituição:** Pontifícia Universidade Católica do Paraná
- **Professor:** Glauco Vinicius de Franca Furstenberger & Mateus Nunes da Silva
- **Turma:** U
- **Equipe:** 10 (MMGV)

### Membros da equipe

| Nome Completo | Usuário GitHub |
| :--- | :--- |
| `Gustavo Tasca Lazzari` | `@GLazzari1428` |
| `Mateus Roese Tucunduva` | `@Matizuuu` |
| `Matheus Yamamoto Dias` | `@MatheusYamas` |
| `Victor Ryuki Tamezava` | `@VicRuk` |

---

## 1. Objetivo do Projeto

Aplicação web desenvolvida com React e Vite, seguindo uma arquitetura modular com separação clara entre componentes, páginas, serviços e estado global. O projeto serve como base sólida e escalável para o desenvolvimento de funcionalidades.

---

## 2. Estrutura do Repositório

```bash
src/
├── assets/          # Imagens, fontes e ícones
├── components/      # Componentes reutilizáveis
│   ├── common/      # Componentes genéricos (Button, Input, Card)
│   ├── layout/      # Estrutura de layout (Header, Footer, Sidebar)
│   └── features/    # Componentes específicos de funcionalidades
├── config/          # Configurações centralizadas (variáveis de ambiente)
├── hooks/           # Custom hooks
├── pages/           # Páginas da aplicação
├── routes/          # Configuração de rotas
├── services/        # Chamadas à API
├── store/           # Estado global (context e reducers)
├── styles/          # Estilos globais
└── utils/           # Funções utilitárias
```

---

## 3. Como Executar

### 3.1 Instalar dependências
```zsh
npm install
```

### 3.2 Iniciar servidor de desenvolvimento
```zsh
npm run dev
```

### 3.3 Verificar linting
```zsh
npm run lint
```

### 3.4 Formatar código
```zsh
npm run format
```

>O servidor será iniciado em [http://127.0.0.1:3000](http://127.0.0.1:3000).
