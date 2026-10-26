# Bruno's Worlds
Trabalhos, interesses e a minha morena.
Por Bruno Horlando Bähr

Miniprojeto de e-commerce em TypeScript desenvolvido por Bruno H. para a turma T5. Essa loja é fruto de uma mente, altamente movimentada, um tanto pertubada, porém criativa, atende empresas B2B, no caso uma só Eu (Bruno versão CEO de MEI) e pessoas físicas B2C, no caso pessoa fisíca que é o Bruno versão hiperfoco na amada, e suas nerdises, com produtos, serviços e preços, que assim como a saúde mental, são muito caros. A aplicação funciona no terminal, porque o pai ta aprendendo ser back, não front,quem sabe um dia igual o senhor professor eu seja full.  

Como rodar esse trem incrivel?

Precisa ter Node.js e npm instalados. Abra no VS Code a pasta que contém o `package.json`.
O senhor sabe, mas eu não sabia: Que tem que terminal PowerShell do VS Code, e executar uns comandos que são:
 
npm install *RODA PRIMEIRO ESSE E ESPERA*
npm run build DEPOIS ESSE AQUI.....*e espera*
npm start agora esse pra funcionar

No Linux, macOS ou Git Bash, use `npm` no lugar de `npm.cmd`.

# Oque a loja faz?

Falando sério, é pra cadastrasr, listar, bucar e alterar os prudutos. Da pra buscar por ID (o que eu chamava de SKU), parte do nome categoria. 
Cadastra e consulta os clientes, e impede novos cadastros com e-mail repetido. 

Adiciona, remove, altera os proutos do carrinho.

Finaliza os pedidos, atualiza o estoque aaaand consulta os pedidos dos incriveis 3 
clientes, ou mais se for cadastrar mais. 

Aplica o cupom `MORANGUINHO98` em homenagem a minha amada <3

Gera um resumo de vendas e mais
Professor, não sei se o Readme ficou muito informal, mas é isso. 

# Onde fica cada coisa e pra que serve:
src/types.ts => Pra definir a estrutura, criar a tipagem do typescript dos produtos, clientes, carrinhos, pedidos etc...

src/produtos.ts => O brabo, ele que se usa para cadastrar, listar, atualizar, remover e fazer as buscas.

src/clientes.ts => Onde ficam as listagens dos clientes

src/carrinho.ts => Onde a mágica acontece do capitalismo aconte. 

src/cupons.ts => O arquivo que guarda a regra oficial do desconto de 98% do cupom Moranguinho98

src/pedidos.ts => Onde é feito os pedidos fecham as compras etc..

src/relatorios.ts => O que junta os dados das vendas concluídas e manda o resumão pro terminal.

src/validacoes.ts => As regras de segurança e a conversão de valores em centavos para o JavaScript não endoidar

src/main.ts => O cara que roda a demonstração da loja, e faz os testes.

src/testes.ts => Os testes automatizados que ta tudo redondo. 
até vi uns videos sobre isso
ref 1: https://www.youtube.com/watch?v=N-U5uLMHsTI&time_continue=7&source_ve_path=MjM4NTE&embeds_referring_euri=https%3A%2F%2Fgemini.google.com%2F&embeds_referring_origin=https%3A%2F%2Fgemini.google.com

refc2:youtube.com/channel/UCh4dJzctb0NhSibjU-e2P6w?source_ve_path=MzY5MjU&embeds_referring_euri=https%3A%2F%2Fgemini.google.com%2F&embeds_referring_origin=https%3A%2F%2Fgemini.google.com

e é isso. Valeu professor, não sei se poderia falar assim, ou se o senhor de alguma forma ve isso como falta de compromentimento.




