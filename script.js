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

let deck = []

// Initialize deck
suits.forEach((suit) => {
  symbols.forEach((symbol) => {
    deck.push(new Card(symbol, suit))
  })
})

// Stacks in JS
const mainSeven = [[], [], [], [], [], [], []]
const mainFour = [[], [], [], []]
let drawn = []

// Stacks in HTML
const deckHTML = document.querySelector('#deck')
const drawnHTML = document.querySelector('#drawn')
const mainSevenHTML = document.querySelectorAll('.main-stack')
const mainFourHTML = document.querySelectorAll('.main-four')
const stacks = document.querySelectorAll('.main')

const showCard = (div, card) => {
  /*
  Displays the given card object on the given HTML div element
  */
  div.innerText = card.symbol + ' ' + card.suit
  div.style.color = card.color
  div.style.backgroundColor = 'white'
}

const resize = (htmlStack) => {
  if (htmlStack.children.length >= 1) {
    htmlStack.style.gridTemplateRows =
      (PEEK_SIZE + ' ').repeat(htmlStack.children.length - 1) + '1fr'
  }
  return htmlStack
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
      if (newCard.covered) {
        newCardDiv.classList.add('facedown')
      } else {
        showCard(newCardDiv, newCard)
      }
      mainSevenHTML[index].appendChild(newCardDiv)
      resize(mainSevenHTML[index])
    }
  })
  deckHTML.classList.add('facedown')
}

const resetDeck = () => {
  deckHTML.classList.add('facedown')
  drawnHTML.innerText = ''
  drawnHTML.style.color = 'black'
  deck = drawn
  drawn = []
}

const draw = () => {
  if (deck[deck.length - 1]) {
    newCard = deck.pop()
    drawn.push(newCard)
    drawnHTML.classList.add('card')
    drawnHTML.setAttribute('id', 'drawn')
    showCard(drawnHTML, newCard)
  } else {
    deckHTML.classList.remove('facedown')
  }
  moveTurn = true
  move(getAvailableHTMLCards())
}

deckHTML.addEventListener('click', () => {
  if (deck.length !== 0) {
    draw()
  } else {
    resetDeck()
  }
})

setUpGame()

const getAvailableHTMLCards = () => {
  let cards = []
  mainSevenHTML.forEach((array) => {
    for (let i = 0; i < array.children.length; i++) {
      let available = true
      for (let j = 0; j < array.children[i].classList.length; j++) {
        if (array.children[i].classList[j] === 'facedown') {
          available = false
        }
      }
      if (available) {
        cards.push(array.children[i])
      }
    }
  })
  if (drawnHTML.innerText != '') {
    showCard(drawnHTML, drawn[drawn.length - 1])
    cards.push(drawnHTML)
  }
  return cards
}

const getStack = (div) => {
  /*
  Takes in an HTML card and returns the stack index position for both the HTML stacks and the 
  javascript stacks
  */
  for (let i = 0; i < div.classList.length; i++) {
    if (!isNaN(parseInt(div.classList[i]))) {
      return parseInt(div.classList[i])
    }
  }
}

let cardMoving = []
let cardHTML = 0
let moveTurn = true

const getCardMoving = (card) => {
  cardMoving = []
  if (card.id === 'drawn') {
    cardMoving.push(drawn[drawn.length - 1])
    console.log(cardMoving)
  } else {
    for (let i = 0; i < mainSeven[getStack(card)].length; i++) {
      for (let j = 0; j < card.innerText.length; j++) {
        if (
          (mainSeven[getStack(card)][i].symbol === card.innerText[j] ||
            mainSeven[getStack(card)][i].symbol ===
              parseInt(card.innerText[j])) &&
          mainSeven[getStack(card)][i].color === card.style.color
        ) {
          for (let c = mainSeven[getStack(card)].length - 1; c >= i; c--) {
            cardMoving.push(mainSeven[getStack(card)][c])
          }
        }
      }
    }
    //cardMoving = mainSeven[getStack(card)][mainSeven[getStack(card)].length - 1]
  }
  cardHTML = card
}

const isMainFour = (stack) => {
  for (let i = 0; i < stack.classList.length; i++) {
    if (
      stack.classList[i] === 'main-four'
      // ||
      // stack.classList[i] === 'H' ||
      // stack.classList[i] === 'D' ||
      // stack.classList[i] === 'C' ||
      // stack.classList[i] === 'S'
    ) {
      return true
    }
  }
  return false
}

const addCardFromDrawnToMainFour = (stack) => {
  mainFour[parseInt(stack.id) - 1].push(drawn.pop())
  let newDiv = document.createElement('div')
  newDiv.innerHTML = cardHTML.innerHTML
  newDiv.style.color = cardHTML.style.color
  newDiv.classList = cardHTML.classList
  showCard(mainFourHTML[parseInt(stack.id) - 1], cardMoving[0])
  showCard(drawnHTML, drawn[drawn.length - 1])
  drawnHTML.setAttribute('id', 'drawn')
}

const addCardFromMainSevenToMainFour = (stack) => {
  mainFour[parseInt(stack.id) - 1].push(mainSeven[getStack(cardHTML)].pop())
  let newDiv = document.createElement('div')
  newDiv.innerHTML = cardHTML.innerHTML
  newDiv.style.color = cardHTML.style.color
  newDiv.classList = cardHTML.classList
  showCard(mainFourHTML[parseInt(stack.id) - 1], cardMoving[0])
  mainSevenHTML[getStack(cardHTML)].removeChild(
    mainSevenHTML[getStack(cardHTML)].lastChild
  )
}

let magicalIndex = 0

const move = (movableCardsHTML) => {
  movableCardsHTML.forEach((card) => {
    card.addEventListener('click', () => {
      if (moveTurn) {
        getCardMoving(card)
        moveTurn = false
      }
    })
  })
  stacks.forEach((stack) => {
    //if (moveTurn === false) {
    stack.addEventListener('click', () => {
      //moveTurn = false
      //if (moveTurn === false) {
      if (isMainFour(stack)) {
        if (cardMoving.length === 1) {
          if (stack.hasChildNodes() === false) {
            if (cardMoving[0].symbol === 'A') {
              if (cardHTML.id === 'drawn') {
                addCardFromDrawnToMainFour(stack)
                moveTurn = true
                move(getAvailableHTMLCards())
              } else {
                addCardFromMainSevenToMainFour(stack)
                moveTurn = true
                move(getAvailableHTMLCards())
              }
            }
          } else {
            if (
              cardMoving[0].suit ===
                mainFour[parseInt(stack.id) - 1][
                  mainFour[parseInt(stack.id) - 1].length - 1
                ].suit &&
              cardMoving[0].value ===
                mainFour[parseInt(stack.id) - 1][
                  mainFour[parseInt(stack.id) - 1].length - 1
                ].value +
                  1
            ) {
              if (cardHTML.id === 'drawn') {
                addCardFromDrawnToMainFour(stack)
                moveTurn = true
                move(getAvailableHTMLCards())
              } else {
                addCardFromMainSevenToMainFour(stack)
                moveTurn = true
                move(getAvailableHTMLCards())
              }
            }
          }
        } else {
          moveTurn = true
          move(getAvailableHTMLCards())
        }
      } else {
        if (
          (mainSeven[parseInt(stack.id) - 1][
            mainSeven[parseInt(stack.id) - 1].length - 1
          ].color !== cardMoving.color &&
            mainSeven[parseInt(stack.id) - 1][
              mainSeven[parseInt(stack.id) - 1].length - 1
            ].value ===
              cardMoving.value + 1) ||
          (mainSeven[parseInt(stack.id) - 1] === [] &&
            cardMoving.symbol === 'K')
        ) {
          if (cardHTML.id === 'drawn') {
            mainSeven[parseInt(stack.id) - 1].push(drawn.pop())
            cardHTML.removeAttribute('id')
            let newDiv = document.createElement('div')
            newDiv.innerHTML = cardHTML.innerHTML
            newDiv.style.color = cardHTML.style.color
            newDiv.classList = cardHTML.classList
            stack.appendChild(newDiv)
            stack.lastChild.classList.add((parseInt(stack.id) - 1).toString())
            resize(stack)
            if (drawn.length !== 0) {
              showCard(drawnHTML, drawn[drawn.length - 1])
            } else {
              drawnHTML.innerText = ''
              drawnHTML.color = 'black'
            }
            moveTurn = true
          } else {
            // Make changes in js arrays
            mainSeven[parseInt(stack.id) - 1].push(
              mainSeven[getStack(cardHTML)].pop()
            )
            if (mainSeven[getStack(cardHTML)].length !== 0) {
              mainSeven[getStack(cardHTML)][
                mainSeven[getStack(cardHTML)].length - 1
              ].covered = false
            }
            // Define variable that represents index of stack originally clicked
            let originalStackIndex = getStack(cardHTML)
            // Make changes in HTML
            stack.appendChild(mainSevenHTML[originalStackIndex].lastChild)
            stack.lastChild.classList.remove(originalStackIndex.toString())
            stack.lastChild.classList.add((parseInt(stack.id) - 1).toString())
            resize(stack)

            // Removes card from the original HTML list
            // mainSevenHTML[originalStackIndex].removeChild(
            //   mainSevenHTML[originalStackIndex].lastChild
            // )

            // Shows next card in line of original list
            if (mainSeven[originalStackIndex].length !== 0) {
              showCard(
                mainSevenHTML[originalStackIndex].lastChild,
                mainSeven[originalStackIndex][
                  mainSeven[originalStackIndex].length - 1
                ]
              )
              mainSevenHTML[originalStackIndex].lastChild.classList.toggle(
                'facedown'
              )
              resize(mainSevenHTML[originalStackIndex])
            } else {
              mainSevenHTML[originalStackIndex].style.borderStyle = 'solid'
            }
            moveTurn = true
            move(getAvailableHTMLCards())
          }
        } else {
          // if (magicalIndex % 2 === 1) {
          //   moveTurn = true
          // }
          // magicalIndex++
        }
      }
      //}
    })
  })
}

move(getAvailableHTMLCards())
