# Ordem e Regresso

Jogo de debate eleitoral para jogar presencialmente com os amigos, direto do celular.

Cada rodada sorteia uma crise política para o país. Os candidatos recebem uma proposta aleatória e precisam convencer os eleitores de que ela resolve tudo. Depois a mesa vota, em aberto ou na urna secreta, e quem chegar primeiro à meta de votos é eleito.

- 121 crises e 280 propostas no baralho padrão
- Cartas personalizadas da galera pelo menu Baralho
- Timer de fala, votação aberta ou urna eletrônica, placar
- Funciona offline depois de aberto e salva a partida no aparelho

Para editar as cartas padrão, altere as listas `DEF_CRISES` e `DEF_PROPS` no `index.html`.

# Devaneio

Jogo de cartas ilustradas e pistas vagas, inspirado no Dixit, para jogar online com os amigos, cada um no seu celular. Fica em `/devaneio/`.

- Quem cria a sala recebe um código de 4 letras, um link e um QR code para convidar.
- O celular de quem criou a sala comanda a partida e precisa ficar com o jogo aberto.
- A conexão em tempo real usa servidores MQTT públicos e gratuitos (EMQX e HiveMQ), sem conta e sem servidor próprio.
- As 114 ilustrações são geradas pelo código em `art.js`, a partir do número de cada carta.
- Para testar vários jogadores no mesmo navegador: `devaneio/?local&u=1`, `?local&u=2`, etc.
