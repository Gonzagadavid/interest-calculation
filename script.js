(function () {
  'use strict'

  const capital = document.getElementById('capital')
  const juros = document.getElementById('juros')
  const tempo = document.getElementById('tempo')
  const simples = document.getElementById('simples')
  const composto = document.getElementById('composto')
  const detalhado = document.getElementById('detalhado')
  const totalCheck = document.getElementById('total')
  const calcBtn = document.getElementById('calc')
  const feedBackTotal = document.querySelector('.total p')
  const feedBackDetalhado = document.querySelector('.feedback p')
  let tipoJuros = ''
  let tipoFeedBack = ''

  calcBtn.disabled = true

  checkColor()

  // verifica se a opção 'simples' esta acionada, desabilita a opção 'composta' e passa o valor para a variavel
  simples.addEventListener('change', checkSimples)
  function checkSimples () {
    composto.checked = false
    simples.checked ? tipoJuros = 'simples' : tipoJuros = ''
    habiltaBtn()
  }

  // verifica se a opção 'composta' esta acionada, desabilita a opção 'simples' e passa o valor para a variavel
  composto.addEventListener('change', checkComposto)
  function checkComposto () {
    simples.checked = false
    composto.checked ? tipoJuros = 'composto' : tipoJuros = ''
    habiltaBtn()
  }

  // verifica se a opção 'detalhado' esta acionada, desabilita a opção 'somente o total' e passa o valor para a variavel
  detalhado.addEventListener('change', checkDetalhado)
  function checkDetalhado () {
    totalCheck.checked = false
    detalhado.checked ? tipoFeedBack = 'detalhado' : tipoFeedBack = ''
    habiltaBtn()
  }

  // verifica se a opção 'somente o total' esta acionada, desabilita a opção 'detalhado' e passa o valor para a variavel
  totalCheck.addEventListener('change', checkTotal)
  function checkTotal () {
    detalhado.checked = false
    totalCheck.checked ? tipoFeedBack = 'total' : tipoFeedBack = ''
    habiltaBtn()
  }

  // verifica se o campo 'capital' está preenchido corretamente e chama a função de habilitar o botão
  capital.addEventListener('input', checkCapital)
  function checkCapital () {
    if (capital.value < 100) {
      calcBtn.disabled = true
      checkColor()
    } else {
      habiltaBtn()
    }
  }

  // verifica se o campo 'taxa de juros' está preenchido corretamente e chama a função de habilitar o botão
  juros.addEventListener('input', checkJuros)
  function checkJuros () {
    if (juros.value < 0 || juros.value > 100) {
      calcBtn.disabled = true
      checkColor()
    } else {
      habiltaBtn()
    }
  }

  // verifica se o campo 'tempo' está preenchido corretamente e chama a função de habilitar o botão
  tempo.addEventListener('input', checkTempo)
  function checkTempo () {
    if (tempo.value < 2 || tempo.value > 72) {
      calcBtn.disabled = true
      checkColor()
    } else {
      habiltaBtn()
    }
  }

  // verifica se todos os campos estão preenchidos e habilita o botão
  function habiltaBtn () {
    if (capital.value && juros.value && tempo.value && tipoJuros && tipoFeedBack) {
      calcBtn.disabled = false
    } else {
      calcBtn.disabled = true
    }
    checkColor()
  }

  // torna o botão visível quando habilitado
  function checkColor () {
    if (calcBtn.disabled) {
      calcBtn.style.backgroundColor = 'rgb(238, 238, 195)'
    } else {
      calcBtn.style.backgroundColor = 'rgb(46, 128, 43)'
    }
  }

  // constroi um objeto com os dados passados pelo usuário e excuta o método de acordo com a opção escolhida
  calcBtn.addEventListener('click', calculaJuros)
  function calculaJuros (e) {
    e.preventDefault()
    const usuario = new Cliente(capital.value, juros.value, tempo.value, tipoJuros, tipoFeedBack)

    feedBackTotal.textContent = ''
    feedBackDetalhado.textContent = ''

    if (usuario.tipoJuros === 'simples') { usuario.calculoSimples() }
    if (usuario.tipoJuros === 'composto') { usuario.calculoComposto() }
  }

  // função construtora usada para construir o objeto com os dados do usuário
  function Cliente (capital, taxa, tempo, tipoJuros, tipoFeedBack) {
    this.capital = capital
    this.taxa = taxa
    this.tempo = tempo
    this.tipoJuros = tipoJuros
    this.tipoFeedBack = tipoFeedBack
  }

  // método para calcular o juros simples, e exibir para o usuário de acordo com a opção escolhida
  Cliente.prototype.calculoSimples = function () {
    if (this.tipoFeedBack === 'total') {
      const resultadoTotal = this.capital * (this.taxa / 100) * this.tempo

      feedBackTotal.textContent = resultadoTotal.toLocaleString('br-PT', { style: 'currency', currency: 'BRL' })
    } else if (this.tipoFeedBack === 'detalhado') {
      const quantidade = this.tempo
      let resultado = 0

      feedBackDetalhado.innerHTML = 'Parcelas detalhadas de juros simples:<br>'

      for (let i = 1; i <= quantidade; i++) {
        resultado += this.capital * (this.taxa / 100)

        feedBackDetalhado.innerHTML += `<br>${i}º parcela: ${parseFloat(this.capital).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} a ${this.taxa}% = ${resultado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}<br>`
      }
      feedBackTotal.textContent = resultado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    }
  }

  // método para calcular o juros composto, e exibir para o usuário de acordo com a opção escolhida
  Cliente.prototype.calculoComposto = function () {
    if (this.tipoFeedBack === 'total') {
      const resultado = this.capital * Math.pow(1 + (this.taxa / 100), this.tempo) - this.capital

      feedBackTotal.textContent = resultado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    } else if (this.tipoFeedBack) {
      const quantidade = this.tempo
      let montante = parseFloat(this.capital)
      let resultado = 0

      feedBackDetalhado.innerHTML = 'Parcelas detalhadas de juros composto:<br>'
      for (let i = 1; i <= quantidade; i++) {
        resultado = montante * (1 + (this.taxa / 100))

        feedBackDetalhado.innerHTML += `<br>${i}º parcela: ${montante.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} a ${this.taxa}% = ${resultado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}<br>`
        montante = resultado
      }
      feedBackTotal.textContent = (resultado - this.capital).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    }
  }
})()
