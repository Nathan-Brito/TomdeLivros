//------------------------------------------------------------------------------------------------------------
let bd_produtos = []

const botao = document.querySelector('.bntComprar');
const botoes = document.querySelectorAll('.bntComprar');
console.log(botao)
botoes.forEach(botao => {
    botao.addEventListener('click', inserirProduto);
});

function inserirProduto(){
    
    const livro = this.closest(".item");
    console.log("chegou aqui");
    
    const precoString = livro.querySelector('.preco').textContent.replace("R$", "").replace(",", ".").trim();
    const preco = parseFloat(precoString);
    
    if (!isNaN(preco)) {
        const produto = {
            capa: livro.querySelector('img').getAttribute("src"),
            titulo: livro.querySelector('.tituloLivro').textContent,
            autor: livro.querySelector('.autor').textContent,
            preco: preco,
        }

        bd_produtos = getLocalStorage();
        console.log(bd_produtos);
        bd_produtos.push(produto);
        const quatCar = document.querySelector('.quatCar');
        quatCar.textContent = bd_produtos.length;
        const noti = document.querySelector('.noti');
        noti.style.display = 'block';
        setLocalStorage(bd_produtos);
        updateTeble();
        
    } else {
        console.error("Erro ao converter o preço para número");
    }
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
    
    document.querySelector('#tbProdutos>tbody').textContent=""
}
//------------------------------------------------------------------------------------------------------------
function updateTeble(){
    cleanTable()
    const bd_produtos = getLocalStorage()

    bd_produtos.forEach(newRow)
}

function newRow(produto, index) {
    const line = document.createElement("tr");
  
    line.innerHTML = `  
        <td><img src="${produto.capa}" alt=""></td>
        <td class="infos">
            <span class="informacoes">${produto.titulo}</span>
            <span class="informacoes">${produto.autor}</span>
        <div class="acoes">
            <input type="number" min="1" value="1" id="quantidade">
            <button data-index="${index}" onclick="remove(this)">Delete <i class='bx bx-trash'></i></button>
        </div>
        </td>
        <td class="preco">${produto.preco}</td>        
    `;

    document.querySelector("#tbProdutos>tbody").appendChild(line);
  }



updateTeble()