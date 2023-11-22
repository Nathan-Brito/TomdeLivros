//------------------------------------------------------------------------------------------------------------
let bd_produtos = []
let soma = somarCarrinho();

const botao = document.querySelector('.bntComprar');
const botoes = document.querySelectorAll('.bntComprar');
botoes.forEach(botao => {
    botao.addEventListener('click', inserirProduto);
});

//------------------------------------------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', function () {
    const soma = somarCarrinho();
    const qrText = soma.toString();
    const qrSize = 300;

    const produtosLocalStorage = getLocalStorage();
    bd_produtos = produtosLocalStorage;

    atualizaQuantidadeCarrinho(bd_produtos.length);

    generateQRCode(qrText, qrSize);

    const precoFinalDiv = document.querySelector('.precoQRCode');

    const paragrafo = document.createElement('p');
    paragrafo.classList.add('branco');
    paragrafo.textContent = `O valor total da sua compra foi de: R$${soma}`;
    precoFinalDiv.appendChild(paragrafo);

    const downloadBtn = document.querySelector('.downloadBnt');
    downloadBtn.addEventListener('click', downloadQRCode);
});

function atualizaQuantidadeCarrinho(quantidade) {
    const quatCar = document.querySelector('.quatCar');
    const noti = document.querySelector('.noti');

    quatCar.textContent = quantidade;

    if (quantidade > 0) {
        noti.style.display = 'block';
    } else {
        noti.style.display = 'none';
    }

}

//------------------------------------------------------------------------------------------------------------

function inserirProduto(){

    const livro = this.closest(".item");

    const precoString = livro.querySelector('.preco').textContent.replace("R$", "").replace(",", ".").trim();
    const preco = parseFloat(precoString);

    const produto = {
        capa: livro.querySelector('img').getAttribute("src"),
        titulo: livro.querySelector('.tituloLivro').textContent,
        autor: livro.querySelector('.autor').textContent,
        preco: preco,
    }

    bd_produtos = getLocalStorage();
    console.log(bd_produtos);
    bd_produtos.push(produto);
    atualizaQuantidadeCarrinho(bd_produtos.length)
    setLocalStorage(bd_produtos);
    updateTable();
}

//------------------------------------------------------------------------------------------------------------

function getLocalStorage(){ 
    return JSON.parse(localStorage.getItem('bd_produtos')) || [] 
}

//------------------------------------------------------------------------------------------------------------

function setLocalStorage(bd_produtos){
    localStorage.setItem('bd_produtos', JSON.stringify(bd_produtos)) 
}

//------------------------------------------------------------------------------------------------------------

function cleanTable(){
    const tbody = document.querySelector('#tbProdutos>tbody');
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }
}

//------------------------------------------------------------------------------------------------------------

function remove(button){
    const bd_produtos= getLocalStorage();
    const index = button.getAttribute('data-index');

    bd_produtos.splice(index, 1);
    setLocalStorage(bd_produtos);
    updateTable();
}

//------------------------------------------------------------------------------------------------------------

function somarCarrinho() {
    let soma = 0;
    const bd_produtos = getLocalStorage();

    bd_produtos.forEach(produto => {
        soma += produto.preco;
    });

    return soma.toFixed(2)
}

//------------------------------------------------------------------------------------------------------------

function valorTotal() {
    let soma = 0;
    const bd_produtos = getLocalStorage();

    bd_produtos.forEach(produto => {
        soma += produto.preco;
    });

    const footer = document.querySelector("#tbProdutos>tfoot");
    footer.innerHTML = '';

    const valor = document.createElement("tr");
    valor.innerHTML = `
        <td>Valor Total:</td>
        <td></td>
        <td class="final">${soma.toFixed(2)}</td> 
    `;
    footer.appendChild(valor);
}

//------------------------------------------------------------------------------------------------------------

function updateTable(){
    cleanTable()
    const bd_produtos = getLocalStorage()

    bd_produtos.forEach(newRow)
    atualizaQuantidadeCarrinho(bd_produtos.length)
    valorTotal()
}

//------------------------------------------------------------------------------------------------------------

function newRow(produto, index) {
    const line = document.createElement("tr");

    line.innerHTML = `  
        <td><img class="imagem" src="${produto.capa}" alt=""></td>
        <td class="infos">
            <span class="informacoes">${produto.titulo}</span>
            <span class="informacoes">${produto.autor}</span>
        <div class="acoes">
            <button data-index="${index}" onclick="remove(this)">Delete <i class='bx bx-trash'></i></button>
        </div>
        </td>
        <td class="preco">${produto.preco.toFixed(2)}</td>        
    `;

    document.querySelector("#tbProdutos>tbody").appendChild(line);
}
//------------------------------------------------------------------------------------------------------------
updateTable()
valorTotal()
//------------------------------------------------------------------------------------------------------------

function generateQRCode(qrText, qrSize) {
    const qrContainer = document.querySelector('#qr-code');
    qrContainer.innerHTML = '';
    new QRCode('qr-code', {
        text: qrText, 
        height: qrSize,
        width: qrSize,
        colorLight: '#fff',
        colorDark: '#000'
    });
}

//------------------------------------------------------------------------------------------------------------

function downloadQRCode() {
    const qrCanvas = document.querySelector('#qr-code canvas');
    const downloadLink = document.querySelector('#download-link');


    const imageDataURL = qrCanvas.toDataURL('image/png');

    downloadLink.href = imageDataURL;
}


document.getElementById('finalizando').addEventListener('click', function(event) {
    soma = somarCarrinho()

    if (soma <= 0.00) {
        
        alert('Seu carrinho esta vazio! Volte e escolha seus novos tons!');
        
        event.preventDefault();
    }
});