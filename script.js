document.addEventListener("DOMContentLoaded", () => {
    const campos = ["nome", "telefone", "email", "investida", "horario", "localizacao", "hostname"];
    const gerarBtn = document.getElementById("gerar");
    const limparBtn = document.getElementById("limpar");
    const salvarBtn = document.getElementById("salvarNomeado");
    const excluirBtn = document.getElementById("excluirTemplate");
    const carregarBtn = document.getElementById("carregarTemplate");
    const limparListaBtn = document.getElementById("limparLista"); // Botão a ser corrigido
    const editarNomeTemplateBtn = document.getElementById("editarNomeTemplate");
    const copiarTemplateGeradoBtn = document.getElementById("copiarTemplateGerado");

    const templateArea = document.getElementById("template");
    const nomeInput = document.getElementById("nomeTemplate");
    const seletorTemplates = document.getElementById("templateSelecionado");

    const gerenciarTemplatesHeader = document.getElementById("gerenciarTemplatesHeader");
    const gerenciarTemplatesContent = document.getElementById("gerenciarTemplatesContent");

    const carregarTemplates = () => JSON.parse(localStorage.getItem("templatesNomeados")) || {};

    const salvarTemplate = (nome, conteudo) => {
        const templates = carregarTemplates();
        if (templates[nome]) {
            const sobrescrever = confirm(`Já existe um template com o nome "${nome}". Deseja sobrescrever?`);
            if (!sobrescrever) return;
        }
        templates[nome] = conteudo;
        localStorage.setItem("templatesNomeados", JSON.stringify(templates));
        popularSeletor();
    };

    const excluirTemplate = (nome) => {
        const templates = carregarTemplates();
        if (templates[nome]) {
            const confirmar = confirm(`Tem certeza que deseja excluir o template "${nome}"?`);
            if (confirmar) {
                delete templates[nome];
                localStorage.setItem("templatesNomeados", JSON.stringify(templates));
                popularSeletor();
                templateArea.value = "";
                nomeInput.value = "";
            }
        }
    };

    const renomearTemplate = (nomeAntigo, novoNome) => {
        const templates = carregarTemplates();
        if (!templates[nomeAntigo]) {
            alert("Template não encontrado para renomear.");
            return;
        }
        if (novoNome === nomeAntigo) {
            alert("O novo nome é igual ao antigo.");
            return;
        }
        if (templates[novoNome]) {
            const sobrescrever = confirm(`Já existe um template com o nome "${novoNome}". Deseja sobrescrevê-lo?`);
            if (!sobrescrever) return;
        }

        const conteudo = templates[nomeAntigo];
        delete templates[nomeAntigo];
        templates[novoNome] = conteudo;
        localStorage.setItem("templatesNomeados", JSON.stringify(templates));
        popularSeletor();
        nomeInput.value = novoNome;
        alert(`Template "${nomeAntigo}" renomeado para "${novoNome}" com sucesso!`);
    };

    const popularSeletor = () => {
        const templates = carregarTemplates();
        seletorTemplates.innerHTML = "<option value=''>-- Selecionar template salvo --</option>";
        const nomesEmOrdemAdicao = Object.keys(templates).reverse();

        nomesEmOrdemAdicao.forEach(nome => {
            const option = document.createElement("option");
            option.value = nome;
            option.textContent = nome;
            seletorTemplates.appendChild(option);
        });
    };

    const gerarTemplate = () => {
        const dados = {};
        campos.forEach(id => dados[id] = document.getElementById(id).value);
        return `
==============
Dados do usuário
==============

Nome do usuário: ${dados.nome || 'Não informado'}
Telefone: ${dados.telefone || 'Não informado'}
E-mail: ${dados.email || 'Não informado'}
Investida: ${dados.investida || 'Não informado'}
Horário: ${dados.horario || 'Não informado'}
Localização (endereço, prédio, andar): ${dados.localizacao || 'Não informado'}
Hostname: ${dados.hostname || 'Não informado'}`.trim();
    };

    // Lógica para o Acordeão
    gerenciarTemplatesHeader.addEventListener("click", () => {
        gerenciarTemplatesContent.classList.toggle("expanded");
        gerenciarTemplatesHeader.classList.toggle("expanded");
        gerenciarTemplatesHeader.classList.toggle("collapsed");
    });

    // Inicia a seção "Gerenciar Templates" como colapsada
    gerenciarTemplatesHeader.classList.add("collapsed");

    gerarBtn.addEventListener("click", () => {
        templateArea.value = gerarTemplate();
    });

    limparBtn.addEventListener("click", () => {
        campos.forEach(id => document.getElementById(id).value = "");
        templateArea.value = "";
        nomeInput.value = "";
        seletorTemplates.selectedIndex = 0;
    });

    salvarBtn.addEventListener("click", () => {
        const nome = nomeInput.value.trim();
        const conteudo = templateArea.value.trim();
        if (!nome) return alert("Digite um nome para o template.");
        if (!conteudo) return alert("Gere um template antes de salvar.");
        salvarTemplate(nome, conteudo);
        alert("Template salvo com sucesso!");
    });

    seletorTemplates.addEventListener("change", () => {
        const nome = seletorTemplates.value;
        if (!nome) {
            nomeInput.value = "";
            return;
        }
        nomeInput.value = nome;
    });

    carregarBtn.addEventListener("click", () => {
        const nome = seletorTemplates.value;
        const templates = carregarTemplates();
        if (!nome || !templates[nome]) {
            alert("Selecione um template válido para carregar.");
            return;
        }
        templateArea.value = templates[nome];
        nomeInput.value = nome;
    });

    excluirBtn.addEventListener("click", () => {
        const nome = seletorTemplates.value;
        if (!nome) return alert("Selecione um template para excluir.");
        excluirTemplate(nome);
    });

    editarNomeTemplateBtn.addEventListener("click", () => {
        const nomeAntigo = seletorTemplates.value;
        if (!nomeAntigo) {
            alert("Selecione um template para editar o nome.");
            return;
        }
        const novoNome = prompt(`Digite o novo nome para o template "${nomeAntigo}":`);
        if (novoNome && novoNome.trim() !== "") {
            renomearTemplate(nomeAntigo, novoNome.trim());
        } else if (novoNome !== null) {
            alert("O nome do template não pode ser vazio.");
        }
    });

    // CORREÇÃO AQUI: Apenas limpa a seleção e o campo de nome
    limparListaBtn.addEventListener("click", () => {
        seletorTemplates.selectedIndex = 0; // Desseleciona o item na lista
        nomeInput.value = ""; // Limpa o campo de nome
        // templateArea.value NÃO É LIMPO aqui
    });

    copiarTemplateGeradoBtn.addEventListener("click", async () => {
        const contentToCopy = templateArea.value.trim();
        if (!contentToCopy) {
            return alert("Não há conteúdo para copiar no campo 'Template Gerado'.");
        }

        try {
            await navigator.clipboard.writeText(contentToCopy);
            alert("Conteúdo do template copiado para a área de transferência!");
        } catch (err) {
            console.error('Falha ao copiar o template:', err);
            alert("Não foi possível copiar o template automaticamente. Por favor, copie-o manualmente da caixa de texto.");
        }
    });

    popularSeletor();
});
