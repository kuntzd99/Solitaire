const PEEK_SIZE = '10px'

class Card {
  constructor(symbol, suit) {
    this.symbol = symbol
    this.suit = suit
    if (symbol === 'A') {
      this.value = 1
    } else if (symbol === 'K') {
      this.value = 13
    } else if (symbol === 'Q') {
      this.value = 12
    } else if (symbol === 'J') {
      this.value = 11
    } else {
      this.value = parseInt(symbol)
    }
    if (suit === 'H' || suit === 'D') {
      this.color = 'r'
    } else {
      this.color = 'b'
    }
    this.covered = true
  }
}

const suits = ['H', 'D', 'C', 'S']
const symbols = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K']

const deck = []

suits.forEach((suit) => {
  symbols.forEach((symbol) => {
    deck.push(new Card(symbol, suit))
  })
})

// Stacks for game
const mainSeven = [[], [], [], [], [], [], []]
const mainFour = [[], [], [], []]
const drawn = []

const setUpGame = () => {
  let cardsDown = 1
  mainSeven.forEach((array, index) => {
    for (let i = 0; i < index + 1; i++) {
      array.push(deck.pop())
      if (i === index) {
        array[i].covered = false
      }
    }
  })
}
