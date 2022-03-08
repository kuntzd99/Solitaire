const PEEK_SIZE = '40px'

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
      this.color = 'red'
    } else {
      this.color = 'black'
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

// Stacks as unordered lists in html
const deckHTML = document.querySelector('#deck')
const drawnHTML = document.querySelector('#drawn')
const mainSevenHTML = document.querySelectorAll('.main-stack')

const showCard = (div, card) => {
  div.innerText = card.symbol + ' ' + card.suit
  div.style.color = card.color
  div.style.backgroundColor = 'white'
}

const resize = (htmlStack) => {
  if (htmlStack.children.length >= 1) {
    htmlStack.style.gridTemplateRows =
      (PEEK_SIZE + ' ').repeat(htmlStack.children.length) + '1fr'
  }
  return htmlStack
}

const pushCardHTML = (htmlStack, card) => {
  resize(mainSevenHTML[index])
  if (card.covered) {
    newCard.classList.add('facedown')
  } else {
    showCard(newCard, card)
  }
  htmlStack.appendChild(newCard)
}

const setUpGame = () => {
  mainSeven.forEach((array, index) => {
    for (let i = 0; i < index + 1; i++) {
      let newCard = deck.pop()
      array.push(newCard)
      if (i === index) {
        array[i].covered = false
      }
      const newCardDiv = document.createElement('div')
      newCardDiv.classList.add('card')
      newCardDiv.classList.add(index.toString())
      resize(mainSevenHTML[index])
      if (newCard.covered) {
        newCardDiv.classList.add('facedown')
      } else {
        showCard(newCardDiv, newCard)
      }
      mainSevenHTML[index].appendChild(newCardDiv)
    }
  })
  deckHTML.classList.add('facedown')
}

const draw = () => {
  if (deck[deck.length - 1]) {
    newCard = deck.pop()
    drawn.push(newCard)
    drawnHTML.classList.add('card')
    showCard(drawnHTML, newCard)
  }
}

deckHTML.addEventListener('click', draw)

setUpGame()

const getAvailableHTMLCards = () => {
  let cards = []
  mainSevenHTML.forEach((array) => {
    for (let i = 0; i < array.children.length; i++) {
      // This works as long as facedown is always the second class in the classlist
      if ((array.children[i].classList[2] === 'facedown') === false) {
        cards.push(array.children[i])
      }
    }
  })
  return cards
}

let movableCardsHTML = getAvailableHTMLCards()

const getStack = (div) => {
  return div.classList[1]
}

// const updateBoard = () => {
//   mainSevenHTML.forEach((stack) => {

//   })
// }

// Move function
movableCardsHTML.forEach((card) => {
  card.addEventListener('click', () => {
    mainSevenHTML.forEach((stack) => {
      stack.addEventListener('click', () => {
        let cardMoving =
          mainSeven[getStack(card)][mainSeven[getStack(card)].length - 1]
        if (
          mainSeven[parseInt(stack.id) - 1][
            mainSeven[parseInt(stack.id) - 1].length - 1
          ].color !== cardMoving.color &&
          mainSeven[parseInt(stack.id) - 1][
            mainSeven[parseInt(stack.id) - 1].length - 1
          ].value ===
            cardMoving.value + 1
        ) {
          mainSeven[parseInt(stack.id) - 1].push(
            mainSeven[getStack(card)].pop()
          )
          // mainSeven[getStack(card)][
          //   mainSeven[getStack(card)].length - 1
          // ].covered = false
          stack.appendChild(mainSevenHTML[getStack(card)].lastChild)
          resize(stack)
          // Removes card from the original list
          mainSevenHTML[getStack(card)].removeChild(
            mainSevenHTML[getStack(card)].lastChild
          )
          // Shows next card in line of original list
          showCard(
            mainSevenHTML[getStack(card)].children[
              mainSevenHTML[getStack(card)].children.length - 1
            ],
            mainSeven[getStack(card)][mainSeven[getStack(card)].length - 1]
          )
          resize(mainSevenHTML[getStack(card)])
        }
      })
    })
  })
})
