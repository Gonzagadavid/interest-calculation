(function () {
  'use strict'

  const capital = document.getElementById('capital')
  const interestRate = document.getElementById('interestRate')
  const time = document.getElementById('time')
  const simple = document.getElementById('simple')
  const compound = document.getElementById('compound')
  const detailed = document.getElementById('detailed')
  const checkTotal = document.getElementById('total')
  const calcBtn = document.getElementById('calc')
  const feedBackTotal = document.querySelector('.total p')
  const feedBackDetailed = document.querySelector('.feedback p')
  let interestType = ''
  let feedBackType = ''

  calcBtn.disabled = true

  checkColor()

  // checks if the 'simple' option is activated, disables the 'compound' option and passes the value to the variable
  // verifica se a opção 'simples' esta acionada, desabilita a opção 'composta' e passa o valor para a variavel
  simple.addEventListener('change', checkSimple)
  function checkSimple () {
    compound.checked = false
    simple.checked ? interestType = 'simple' : interestType = ''
    enableBtn()
  }

  // checks if the 'compound' option is activated, disables the 'simple' option and passes the value to the variable
  // verifica se a opção 'composta' esta acionada, desabilita a opção 'simples' e passa o valor para a variavel
  compound.addEventListener('change', checkCompound)
  function checkCompound () {
    simple.checked = false
    compound.checked ? interestType = 'compound' : interestType = ''
    enableBtn()
  }

  // checks if the 'detailed' option is enabled, disables the 'total only' option and passes the value to the variable
  // verifica se a opção 'detalhado' esta acionada, desabilita a opção 'somente o total' e passa o valor para a variavel
  detailed.addEventListener('change', checkDetailed)
  function checkDetailed () {
    checkTotal.checked = false
    detailed.checked ? feedBackType = 'detailed' : feedBackType = ''
    enableBtn()
  }

  // checks if the option 'only the total' is activated, disables the option 'detailed' and passes the value to the variable
  // verifica se a opção 'somente o total' esta acionada, desabilita a opção 'detalhado' e passa o valor para a variavel
  checkTotal.addEventListener('change', checkBoxTotal)
  function checkBoxTotal () {
    detailed.checked = false
    checkTotal.checked ? feedBackType = 'total' : feedBackType = ''
    enableBtn()
  }

  // checks if the 'capital' field is filled in correctly and calls the function to enable the button
  // verifica se o campo 'capital' está preenchido corretamente e chama a função de habilitar o botão
  capital.addEventListener('input', checkCapital)
  function checkCapital () {
    if (capital.value < 100) {
      calcBtn.disabled = true
      checkColor()
    } else {
      enableBtn()
    }
  }

  // checks if the 'interest rate' field is filled in correctly and calls the function to enable the button
  // verifica se o campo 'taxa de juros' está preenchido corretamente e chama a função de habilitar o botão
  interestRate.addEventListener('input', checkRate)
  function checkRate () {
    if (interestRate.value < 0 || interestRate.value > 100) {
      calcBtn.disabled = true
      checkColor()
    } else {
      enableBtn()
    }
  }

  // checks if the 'time' field is filled in correctly and calls the function to enable the button
  // verifica se o campo 'tempo' está preenchido corretamente e chama a função de habilitar o botão
  time.addEventListener('input', checkTime)
  function checkTime () {
    if (time.value < 2 || time.value > 72) {
      calcBtn.disabled = true
      checkColor()
    } else {
      enableBtn()
    }
  }

  // check if all fields are filled in and enable the button
  // verifica se todos os campos estão preenchidos e habilita o botão
  function enableBtn () {
    if (capital.value && interestRate.value && time.value && interestType && feedBackType) {
      calcBtn.disabled = false
    } else {
      calcBtn.disabled = true
    }
    checkColor()
  }

  // makes the button visible when enabled
  // torna o botão visível quando habilitado
  function checkColor () {
    if (calcBtn.disabled) {
      calcBtn.style.backgroundColor = 'rgb(238, 238, 195)'
    } else {
      calcBtn.style.backgroundColor = 'rgb(46, 128, 43)'
    }
  }

  // build an object with the data passed by the user and execute the method according to the chosen option
  // constroi um objeto com os dados passados pelo usuário e excuta o método de acordo com a opção escolhida
  calcBtn.addEventListener('click', calcInterest)
  function calcInterest (e) {
    e.preventDefault()
    const usuario = new Client(capital.value, interestRate.value, time.value, interestType, feedBackType)

    feedBackTotal.textContent = ''
    feedBackDetailed.textContent = ''

    if (usuario.interestType === 'simple') { usuario.calcSimple() }
    if (usuario.interestType === 'compound') { usuario.calcCompound() }
  }

  // constructor function used to construct the object with user data
  // função construtora usada para construir o objeto com os dados do usuário
  function Client (capital, rate, time, interestType, feedBackType) {
    this.capital = capital
    this.rate = rate
    this.time = time
    this.interestType = interestType
    this.feedBackType = feedBackType
  }

  // method to calculate simple interest, and display it to the user according to the option chosen
  // método para calcular o juros simples, e exibir para o usuário de acordo com a opção escolhida
  Client.prototype.calcSimple = function () {
    if (this.feedBackType === 'total') {
      const resultTotal = this.capital * (this.rate / 100) * this.time

      feedBackTotal.textContent = resultTotal.toLocaleString('br-PT', { style: 'currency', currency: 'BRL' })
    } else if (this.feedBackType === 'detailed') {
      const amount = this.time
      let result = 0

      feedBackDetailed.innerHTML = 'Parcelas detalhadas de juros simples:<br>'

      for (let i = 1; i <= amount; i++) {
        result += this.capital * (this.rate / 100)

        feedBackDetailed.innerHTML += `<br>${i}º parcela: ${parseFloat(this.capital).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} a ${this.rate}% = ${result.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}<br>`
      }
      feedBackTotal.textContent = result.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    }
  }

  // method to calculate compound interest, and display it to the user according to the option chosen
  // método para calcular o juros composto, e exibir para o usuário de acordo com a opção escolhida
  Client.prototype.calcCompound = function () {
    if (this.feedBackType === 'total') {
      const result = this.capital * Math.pow(1 + (this.rate / 100), this.time) - this.capital

      feedBackTotal.textContent = result.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    } else if (this.feedBackType) {
      const amount = this.time
      let montante = parseFloat(this.capital)
      let result = 0

      feedBackDetailed.innerHTML = 'Parcelas detalhadas de juros composto:<br>'
      for (let i = 1; i <= amount; i++) {
        result = montante * (1 + (this.rate / 100))

        feedBackDetailed.innerHTML += `<br>${i}º parcela: ${montante.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} a ${this.rate}% = ${result.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}<br>`
        montante = result
      }
      feedBackTotal.textContent = (result - this.capital).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    }
  }
})()
