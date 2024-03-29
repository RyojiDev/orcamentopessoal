class Despesas {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano;
        this.mes = mes;
        this.dia = dia;
        this.tipo = tipo;
        this.descricao = descricao;
        this.valor = valor;
    }

    validarDados() {
        for (let i in this) {
            if (this[i] == undefined || this[i] == '' || this[i] == null) {
                return false;
            }
        }
        return true;
    }
}

class Bd {

    constructor() {
        let id = localStorage.getItem('id');

        if (id === null) {
            localStorage.setItem('id', 0);
        }


    }

    getProximoId() {
        let proximoId = localStorage.getItem('id'); // null
        return parseInt(proximoId) + 1;
    }
    gravar(d) {

        let id = this.getProximoId();
        localStorage.setItem(id, JSON.stringify(d));
        localStorage.setItem('id', id);
    }

    recuperarTodosRegistros() {

        let despesas = Array();

        console.log('estamos chegando ate aqui');
        let id = localStorage.getItem('id');

        //recupera todas as despesas cadastradas em localStorage

        for (let i = 1; i <= id; i++) {
            let despesa = JSON.parse(localStorage.getItem(i));
            //recuperar a despesa

            //exoste a possibilidade de haver indices que foram pulados/removidos
            //nestes cados nos vamos pular esses indices

            if (despesa == null) {
                continue;
            }
            despesa.id = i;
            despesas.push(despesa);
        }

        return despesas;
    }

    pesquisar(despesa) {
        console.log(despesa)
        let despesasFiltradas = Array();
        despesasFiltradas = this.recuperarTodosRegistros();

        console.log(despesasFiltradas);

        // ano


        if (despesa.ano != '') {
            console.log('filtro de ano');
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano);
        }

        //mes

        if (despesa.mes != '') {
            console.log('filtro de mes');
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)

            console.log(despesasFiltradas);
        }


        //dia

        if (despesa.dia != '') {
            console.log('filtro de dia');
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia);
            console.log(despesasFiltradas);
        }

        //tipo

        if (despesa.tipo != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo);

            console.log(despesasFiltradas);
        }

        //descricao

        if (despesa.descricao != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao);
        }
        //valor

        if (despesa.valor != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor);
        }

        return despesasFiltradas;
    }

    remover(id) {
        localStorage.removeItem(id);
    }
}

let bd = new Bd();

function cadastrarDespesa() {

    let ano = document.getElementById('ano');

    let mes = document.getElementById('mes');

    let dia = document.getElementById('dia');

    let tipo = document.getElementById('tipo');

    let descricao = document.getElementById('descricao');

    let valor = document.getElementById('valor');

    // console.log(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value);

    let despesa = new Despesas(
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value);

    let mensagem_t = document.getElementById("mensagem_title");

    let mensagem_b = document.getElementById("mensagem_body");
    let btn_mudar = document.getElementById('btn_mudar');
    if (despesa.validarDados()) {
        //dialog de sucesso
        bd.gravar(despesa);
        mensagem_t.innerHTML = "Despesa cadastrada com sucesso!";
        mensagem_t.classList.remove('text-danger');
        mensagem_t.classList.add('text-success');
        mensagem_b.innerHTML = "Registro Inserido com sucesso!";
        btn_mudar.innerHTML = 'Voltar';
        btn_mudar.classList.remove('btn-danger');
        btn_mudar.classList.add('btn-succeess');

        ano.value = '';
        dia.value = '';
        mes.value = '';
        tipo.value = '';
        descricao.value = '';
        valor.value = '';



        console.log('dados validos');

        $("#modalRegistraDespesa").modal('show');
    } else {
        //dialog de erro
        mensagem_t.innerHTML = "Erro na gravação";
        mensagem_t.classList.remove('text-success');
        mensagem_t.classList.add('text-danger');
        btn_mudar.innerHTML = "Voltar e corrigir";
        btn_mudar.classList.remove('btn-success');
        btn_mudar.classList.add('btn-danger');

        mensagem_b.innerHTML = "Existem Campos obrigatórios que não foram preenchidos!";
        $('#modalRegistraDespesa').modal("show");
    }


}

function carregaListaDespesas(despesas = Array(), filtro = false) {
    if (despesas.length == 0 && filtro == false) {
        despesas = bd.recuperarTodosRegistros();
    }
    //selecionando elemento tbody da tabela
    let listaDespesas = document.getElementById('listaDespesas');
    listaDespesas.innerHTML = '';
    console.log(despesas);

    //percorrer o array despesas, listando cada despesa de forma dinamica

    despesas.forEach(function(d) {
        //criando a linha (tr)
        linha = listaDespesas.insertRow()

        //criar as colunas (td)
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`;

        // ajustar o tipo
        switch (d.tipo) {
            case '1':
                d.tipo = 'Alimentação';
                break;
            case '2':
                d.tipo = 'Educação';
                break;
            case '3':
                d.tipo = 'Lazer';
                break;
            case '4':
                d.tipo = 'Saúde';
                break;
            case '5':
                d.tipo = 'Transporte';
                break;
        }
        linha.insertCell(1).innerHTML = `${d.tipo}`;


        linha.insertCell(2).innerHTML = `${d.descricao}`;
        linha.insertCell(3).innerHTML = `${d.valor}`;

        // criar o botão de exclusão

        let btn = document.createElement("button");
        btn.className = 'btn btn-danger';
        btn.innerHTML = '<i class="fas fa-times"></i>';
        btn.id = `id_despesa_${d.id}`;
        btn.onclick = function() {
            let id = this.id.replace('id_despesa_', '');
            bd.remover(id);

            window.location.reload();
        }
        linha.insertCell(4).append(btn);

        console.log(d);
    });
}

function pesquisarDespesa() {
    let ano = document.getElementById('ano').value;
    let mes = document.getElementById('mes').value;
    let dia = document.getElementById('dia').value;
    let tipo = document.getElementById('tipo').value;
    let descricao = document.getElementById('descricao').value;
    let valor = document.getElementById('valor').value;

    let despesa = new Despesas(ano, mes, dia, tipo, descricao, valor);
    console.log(despesa);

    despesas = bd.pesquisar(despesa);

    console.log(despesas);

    carregaListaDespesas(despesas, true);
}