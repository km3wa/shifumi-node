const http = require('http');
const { readFileSync } = require('fs');
const { Server } = require("socket.io");
const { PIERRE, FEUILLE, CISEAUX } = require('./attacks');
const { fight } = require('./fight');

class Player {
  name; score; wins; attack;

  constructor(name) {
    this.name = name;
    this.score = 0;
    this.wins = 0;
    this.attack = '';
  }
}

const random_attack = () => {
  const rand = Math.floor(Math.random() * 3);
  switch (rand) {
    case 2:
      return CISEAUX;

    case 1:
      return FEUILLE;

    case 0:
      return PIERRE;

    default: return '';
  }
}

const server = (req, res) => {
  if (req.url === '/favicon.ico') {
    res.writeHead(200, { 'Content-Type': 'image/x-icon' });
    res.end();
    return; // pensez à arrêter l'exécution des scripts côté serveur une fois la réponse envoyée.
  }

  if (req.url === "/") {
    res.writeHead(200, {
      "Content-Type": "text/html;charset=utf8",
    });
    const home = readFileSync('./views/index.html', 'utf-8');
    res.write(home)
    res.end();
  }  
}

const human = new Player('Human');
const cpu = new Player('CPU');

const score_target = 10;

const app = http.createServer(server);
const io = new Server(app);


io.on("connection", (socket) => {
  // envoi d'un message au client
  console.log(socket.id);


  // réception d'un message envoyé par le client
  socket.on("input", (msg) => {
    switch (msg) {
      case PIERRE:
      case FEUILLE:
      case CISEAUX:
        human.attack = msg;
        cpu.attack = random_attack();

        switch (fight(human.attack, cpu.attack)) {
          case 1:
            io.emit('output', `${human.name}'s ${human.attack} beats ${cpu.name}'s ${cpu.attack}`);
            human.score++;
            break;

          case 2:
            io.emit('output', `${cpu.name}'s ${cpu.attack} beats ${human.name}'s ${human.attack}`);
            cpu.score++;
            break;

          case 0:
            io.emit('output', `draw: double ${human.attack}`);
            break;

          case -1:
          default:
            io.emit('output', 'an error occurred. game will continue still.');
            break;
        }

        io.emit('output', `${human.name} | ${human.score} - ${cpu.score} | ${cpu.name}`);

        switch (score_target) {
          case human.score:
            human.wins++;
            human.score = 0;
            cpu.score = 0;
            io.emit('output', `${human.name} wins !!`);
            io.emit('output', `--- REMATCH (Human | ${human.wins} - ${cpu.wins} | CPU) ---`);
            return;

          case cpu.score:
            cpu.wins++;
            human.score = 0;
            cpu.score = 0;
            io.emit('output', `${cpu.name} wins !!`);
            io.emit('output', `--- REMATCH (Human | ${human.wins} - ${cpu.wins} | CPU) ---`);
            return;
        }
        break;

      default:
        socket.emit('output', 'incorrect input. try another input.');
        break;
    }
    /*console.log(msg + ' ' + socket.id)
    socket.emit('chat', msg) // a moi
    io.emit('chat', msg) // a moi + les autres
    socket.broadcast.emit('chat', 'evenement envoyé') //a tt le monde sauf à moi*/
  });

  socket.on('disconnect', () => { //rechargé la page deconnecte - mettre systeme de cache pour memoriser donnée
    console.log('deconnecté')
  });
});

app.listen(3000);


//console.log("ROCK PAPER SCISSORS: type 'start' to play the game or 'stop' to quit. first to 10 wins")