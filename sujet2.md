# Sujet 02 (difficile socket.io)

Sur la base des socket.io, essayez de construire le jeu Chiffoumi.

## Partie 1

Le jeu consiste à proposer un choix entre : pierre, feuille ou ciseau. Votre algorithme sur le serveur choisit aléatoirement un des trois choix possibles. Vous vérifiez qui a gagné, et vous re-envoyez (emit) le résultat de ce tour.

## Partie 2

Dans la partie optionnelle, vous pouvez faire jouer l'utilisateur contre le script avec un nombre de tours fixés à l'avance, par exemple 10. Lorsque ces 10 tours sont terminés on compte les points, on termine la partie en affichant les résultats et on donne la possibilité de re-jouer.

## Contraintes 

Utilisez la base de l'exemple sur les socket.io que nous avons vu en cours pour réaliser ce projet.

## Remarques techniques importantes

- Vous avez la possibilité d'utilisez un identifiant pour déterminer chaque client à partir de l'objet socket :

```js
socket.id
```

- Dans notre exemple du cours, vous pouvez faire un console.log pour voir que cet identidiant est unique par instance de votre client (onglet de navigateur).

```js
io.on('connection', (socket) => {
    // est ce que le client envoie quelque chose ? Si oui on récupère le message
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg + socket.id); // socket.id unique par client
        // re-envoyer un message à tout le monde, même à celui qui l'a envoyé
        io.emit('chat message', msg);
        // envoyer un message sauf à celui qui a déclenché l'événement
        socket.broadcast.emit('chat message', 'SOME EVENT !!');
    });

    socket.on('disconnect',  () => {
        console.log('Disconnect');
    });
});
```