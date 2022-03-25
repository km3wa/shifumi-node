const { PIERRE, FEUILLE, CISEAUX } = require('./attacks');

exports.fight = (p1, p2) => {
  switch (p1) {
    case PIERRE:
      switch (p2) {
        case FEUILLE:
          return 2;

        case CISEAUX:
          return 1;

        default: return 0;
      }

    case FEUILLE:
      switch (p2) {
        case PIERRE:
          return 1;

        case CISEAUX:
          return 2;

        default: return 0;
      }

    case CISEAUX:
      switch (p2) {
        case PIERRE:
          return 2;

        case FEUILLE:
          return 1;

        default: return 0;
      }

    default: return -1;
  }
}