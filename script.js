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

// Initialize deck
suits.forEach((suit) => {
  symbols.forEach((symbol) => {
    deck.push(new Card(symbol, suit))
  })
})

// Stacks in JS
const mainSeven = [[], [], [], [], [], [], []]
const mainFour = [[], [], [], []]
const drawn = []

// Stacks in HTML
const deckHTML = document.querySelector('#deck')
const drawnHTML = document.querySelector('#drawn')
const mainSevenHTML = document.querySelectorAll('.main-stack')

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
  move(getAvailableHTMLCards())
}

deckHTML.addEventListener('click', draw)

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

let cardMoving = 0
let cardHTML = 0
let moveTurn = true

const getCardMoving = (card) => {
  if (card.id === 'drawn') {
    cardMoving = drawn[drawn.length - 1]
  } else {
    cardMoving = mainSeven[getStack(card)][mainSeven[getStack(card)].length - 1]
  }
  cardHTML = card
}

const move = (movableCardsHTML) => {
  movableCardsHTML.forEach((card) => {
    card.addEventListener('click', () => {
      if (moveTurn) {
        getCardMoving(card)
        moveTurn = false
      }
    })
  })
  mainSevenHTML.forEach((stack) => {
    stack.addEventListener('click', () => {
      if (
        (mainSeven[parseInt(stack.id) - 1][
          mainSeven[parseInt(stack.id) - 1].length - 1
        ].color !== cardMoving.color &&
          mainSeven[parseInt(stack.id) - 1][
            mainSeven[parseInt(stack.id) - 1].length - 1
          ].value ===
            cardMoving.value + 1) ||
        (mainSeven[parseInt(stack.id) - 1] === [] && cardMoving.symbol === 'K')
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
          draw()
          moveTurn = true
          move(getAvailableHTMLCards())
          //showCard(drawnHTML, drawn[drawn.length - 1])
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
      }
    })
  })
}

// Move function
// const move = (movableCardsHTML) => {
//   movableCardsHTML.forEach((card) => {
//     if (move) {
//       card.addEventListener('click', () => {
//         if (card.id === 'drawn') {
//           cardMoving = drawn[drawn.length - 1]
//         } else {
//           cardMoving =
//             mainSeven[getStack(card)][mainSeven[getStack(card)].length - 1]
//         }
//         cardHTML = card
//     })
//     mainSevenHTML.forEach((stack) => {
//       stack.addEventListener('click', () => {
//         if (
//           mainSeven[parseInt(stack.id) - 1][
//             mainSeven[parseInt(stack.id) - 1].length - 1
//           ].color !== cardMoving.color &&
//           mainSeven[parseInt(stack.id) - 1][
//             mainSeven[parseInt(stack.id) - 1].length - 1
//           ].value ===
//             cardMoving.value + 1
//         ) {
//           if (cardHTML.id === 'drawn') {
//             mainSeven[parseInt(stack.id) - 1].push(drawn.pop())
//             cardHTML.removeAttribute('id')
//             let newDiv = document.createElement('div')
//             newDiv.innerHTML = cardHTML.innerHTML
//             newDiv.style.color = cardHTML.style.color
//             newDiv.classList = cardHTML.classList
//             stack.appendChild(newDiv)
//             stack.lastChild.classList.add((parseInt(stack.id) - 1).toString())
//             resize(stack)
//             draw()
//             //showCard(drawnHTML, drawn[drawn.length - 1])
//           } else {
//             // Make changes in js arrays
//             mainSeven[parseInt(stack.id) - 1].push(
//               mainSeven[getStack(cardHTML)].pop()
//             )
//             //console.log(mainSeven[getStack(card)])
//             mainSeven[getStack(cardHTML)][
//               mainSeven[getStack(cardHTML)].length - 1
//             ].covered = false
//             // Define variable that represents index of stack originally clicked
//             let originalStackIndex = getStack(cardHTML)
//             // Make changes in HTML
//             stack.appendChild(mainSevenHTML[originalStackIndex].lastChild)
//             stack.lastChild.classList.remove(originalStackIndex.toString())
//             stack.lastChild.classList.add((parseInt(stack.id) - 1).toString())
//             resize(stack)

//             // Removes card from the original HTML list
//             // mainSevenHTML[originalStackIndex].removeChild(
//             //   mainSevenHTML[originalStackIndex].lastChild
//             // )

//             // Shows next card in line of original list
//             showCard(
//               mainSevenHTML[originalStackIndex].lastChild,
//               mainSeven[originalStackIndex][
//                 mainSeven[originalStackIndex].length - 1
//               ]
//             )
//             mainSevenHTML[originalStackIndex].lastChild.classList.toggle(
//               'facedown'
//             )
//             resize(mainSevenHTML[originalStackIndex])
//           }
//         }
//       })
//     })
//   })
// }

move(getAvailableHTMLCards())
