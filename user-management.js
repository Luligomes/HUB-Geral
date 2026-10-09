(function () {
    const tableBody = document.getElementById("users-table-body");
    const filters = {
        name: document.getElementById("user-name-filter"), email: document.getElementById("user-email-filter"),
        job: document.getElementById("user-job-filter"), costCenter: document.getElementById("user-cost-center-filter"),
        level: document.getElementById("user-level-filter"), contract: document.getElementById("user-contract-filter"),
        operation: document.getElementById("user-operation-filter")
    };
    const statusFilter = document.getElementById("user-status-filter");
    let users = [];
    let catalog = null;
    let importPayload = null;

    const roleLabels = {
        cco: "CCO — Administrador", diretoria: "Diretoria", gerente_geral: "Gerente Geral",
        gerente: "Gerente", coordenador: "Coordenador", supervisor: "Supervisor", analista: "Analista"
    };
    const menuLabels = { all: "Visão Geral", processos: "Processos", pessoas: "Pessoas", inventario: "Inventário", sms: "SMS", gestao: "Gestão" };
    const menuDescriptions = {
        all: "Página inicial e visão consolidada", processos: "Indicadores operacionais dos contratos",
        pessoas: "Indicadores e programas de pessoas", inventario: "Painéis e controles de inventário",
        sms: "Segurança, meio ambiente e ocorrências", gestao: "Indicadores estratégicos de gestão"
    };
    const contractLabels = {
        acelen:"Acelen",cbo:"CBO",cli:"CLI",enelCE:"ENEL CE",enelRJ:"ENEL RJ",equatorial:"Equatorial",globo:"Globo",light:"Light",metrorio:"MetrôRio",modec:"Modec",motivaMobilidade:"Motiva Mobilidade",motivaRodovias:"Motiva Rodovias",petrobras:"Petrobras",rumo:"Rumo",valeMG:"Vale MG",valePA:"Vale PA"
    };

    function inferAccessLevel(jobTitle) {
        const normalized = String(jobTitle || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        if (/\bdiretor(a|ia)?\b/.test(normalized)) return "diretoria";
        if (/\bgerente\s+geral\b/.test(normalized)) return "gerente_geral";
        if (/\bgerente\b/.test(normalized)) return "gerente";
        if (/\bcoordenador(a)?\b/.test(normalized)) return "coordenador";
        if (/\bsupervisor(a)?\b/.test(normalized)) return "supervisor";
        return "analista";
    }

    function escapeHtml(value) {
        return String(value ?? "").replace(/[&<>'"]/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "'":"&#39;", '"':"&quot;" }[char]));
    }
    function normalizeArray(value) {
        if (Array.isArray(value)) return value;
        if (typeof value !== "string" || value === "{}" || !value.trim()) return [];
        if (value.startsWith("{") && value.endsWith("}")) {
            return value.slice(1, -1).split(",").map(item => item.replace(/^"|"$/g, "").trim()).filter(Boolean);
        }
        return [];
    }
    function normalizeObject(value) {
        if (value && typeof value === "object" && !Array.isArray(value)) return value;
        if (typeof value === "string") {
            try { return JSON.parse(value); }
            catch { return {}; }
        }
        return {};
    }
    function normalizeUser(user) {
        return {
            ...user,
            contracts: normalizeArray(user.contracts),
            operations: normalizeArray(user.operations),
            menu_overrides: normalizeObject(user.menu_overrides),
            indicator_overrides: normalizeObject(user.indicator_overrides)
        };
    }
    function formatDate(value) { return value ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(value)) : "Nunca"; }
    function listText(values, labels = {}) { return (values || []).map(value => value === "*" ? "Todos" : (labels[value] || value)).join(", ") || "—"; }

    async function ensureCatalog() {
        if (!catalog) catalog = await HubAPI("catalog");
        return catalog;
    }

    async function loadUsers() {
        await ensureCatalog();
        let result = await HubAPI("users");
        users = result.users.map(normalizeUser);
        const pendingUserUpdates = users.map(user => {
            const inferredLevel = user.access_level === "analista" ? inferAccessLevel(user.job_title) : user.access_level;
            const inferredContracts = !user.contracts.length && user.operations.length
                ? contractsForSelectedOperations(user.operations)
                : user.contracts;
            const needsUpdate = inferredLevel !== user.access_level || inferredContracts.length !== user.contracts.length;
            return needsUpdate ? { user, inferredLevel, inferredContracts } : null;
        }).filter(Boolean);
        for (const { user, inferredLevel, inferredContracts } of pendingUserUpdates) {
            await HubAPI("save-user", { method: "POST", body: {
                id: user.id, name: user.name, email: user.email, costCenter: user.cost_center,
                jobTitle: user.job_title, accessLevel: inferredLevel, status: user.status,
                contracts: inferredContracts, operations: user.operations,
                menuOverrides: user.menu_overrides, indicatorOverrides: user.indicator_overrides
            }});
        }
        if (pendingUserUpdates.length) {
            result = await HubAPI("users");
            users = result.users.map(normalizeUser);
        }
        const currentOperation = filters.operation.value;
        const operations = [...new Set(users.flatMap(user => user.operations).filter(value => value !== "*"))].sort();
        filters.operation.innerHTML = `<option value="">Todas as operações</option>${operations.map(value => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join("")}`;
        filters.operation.value = currentOperation;
        renderUsers();
    }

    function renderUsers() {
        const status = statusFilter.value;
        const visible = users.filter(user => {
            const includes = (value, filter) => String(value || "").toLowerCase().includes(filter.value.trim().toLowerCase());
            return includes(user.name, filters.name) && includes(user.email, filters.email) &&
                includes(user.job_title, filters.job) && includes(user.cost_center, filters.costCenter) &&
                (!filters.level.value || user.access_level === filters.level.value) &&
                (!filters.contract.value || user.contracts.includes(filters.contract.value) || user.contracts.includes("*")) &&
                (!filters.operation.value || user.operations.includes(filters.operation.value) || user.operations.includes("*")) &&
                (!status || user.status === status);
        });
        tableBody.innerHTML = visible.length ? visible.map(user => `
            <tr>
                <td><strong>${escapeHtml(user.name)}</strong></td>
                <td>${escapeHtml(user.email)}</td>
                <td>${escapeHtml(user.job_title)}</td>
                <td>${escapeHtml(roleLabels[user.access_level] || user.access_level)}</td>
                <td>${escapeHtml(user.cost_center)}</td>
                <td>${escapeHtml(listText(user.contracts, contractLabels))}</td>
                <td>${escapeHtml(listText(user.operations))}</td>
                <td><span class="status-pill ${user.status}">${user.status}</span></td>
                <td>${formatDate(user.last_access_at)}</td>
                <td><div class="table-actions">
                    <button class="table-action" data-action="view" data-id="${user.id}">Visualizar</button>
                    <button class="table-action" data-action="edit" data-id="${user.id}">Editar</button>
                    <button class="table-action" data-action="permissions" data-id="${user.id}">Permissões</button>
                    <button class="table-action" data-action="reset" data-id="${user.id}">Redefinir senha</button>
                    <button class="table-action" data-action="status" data-id="${user.id}">${user.status === "ativo" ? "Inativar" : "Reativar"}</button>
                </div></td>
            </tr>`).join("") : `<tr><td colspan="10">Nenhum usuário encontrado.</td></tr>`;
    }

    function multiOptions(items, selected, labels = {}) {
        return [`<option value="*" ${(selected || []).includes("*") ? "selected" : ""}>Todos</option>`, ...items.map(item => `<option value="${item}" ${(selected || []).includes(item) ? "selected" : ""}>${escapeHtml(labels[item] || item)}</option>`)].join("");
    }

    function contractsForSelectedOperations(operations) {
        if (!catalog || !Array.isArray(operations)) return [];
        if (operations.includes("*")) return ["*"];
        return [...new Set(catalog.indicators
            .filter(item => item.contract && item.operation && operations.includes(item.operation))
            .map(item => item.contract))];
    }

    function overrideControl(type, key, value, label) {
        const selected = value === true ? "true" : value === false ? "false" : "";
        const attribute = type === "menu" ? "data-menu-override" : "data-indicator-override";
        return `<div class="permission-segment" role="group" aria-label="Permissão para ${escapeHtml(label)}">
            <input type="hidden" ${attribute}="${escapeHtml(key)}" value="${selected}">
            <button type="button" data-permission-value="" class="${selected === "" ? "active" : ""}" aria-pressed="${selected === ""}">Padrão</button>
            <button type="button" data-permission-value="true" class="allow ${selected === "true" ? "active" : ""}" aria-pressed="${selected === "true"}">Permitir</button>
            <button type="button" data-permission-value="false" class="deny ${selected === "false" ? "active" : ""}" aria-pressed="${selected === "false"}">Bloquear</button>
        </div>`;
    }

    function indicatorTitle(id) {
        const card = document.querySelector(`[data-id="${CSS.escape(id)}"] .card-title`);
        return card?.textContent || id.replaceAll("-", " ");
    }

    async function openUserForm(user = null, focusPermissions = false) {
        await ensureCatalog();
        const current = user || { status:"ativo",access_level:"analista",contracts:[],operations:[],menu_overrides:{},indicator_overrides:{} };
        const indicatorGroups = Object.entries(catalog.indicators.reduce((groups, item) => {
            (groups[item.menu] ||= []).push(item); return groups;
        }, {})).map(([menu, items]) => `<details class="permission-group" data-indicator-group="${menu}" ${focusPermissions && menu === "processos" ? "open" : ""}>
            <summary><span><strong>${escapeHtml(menuLabels[menu] || menu)}</strong><small>${items.length} indicador${items.length === 1 ? "" : "es"}</small></span><span class="permission-chevron">⌄</span></summary>
            <div class="permission-group-toolbar">
                <span>Aplicar ao grupo:</span>
                <button type="button" data-group-value="">Padrão</button><button type="button" data-group-value="true">Permitir</button><button type="button" data-group-value="false">Bloquear</button>
            </div>
            <div class="indicator-permission-list">${items.map(item => {
                const title = indicatorTitle(item.id);
                return `<div class="indicator-permission-row" data-search="${escapeHtml(`${title} ${item.id}`.toLowerCase())}"><span title="${escapeHtml(item.id)}">${escapeHtml(title)}</span>${overrideControl("indicator", item.id, current.indicator_overrides?.[item.id], title)}</div>`;
            }).join("")}</div>
        </details>`).join("");
        const menuCards = catalog.menus.map(menu => `<div class="menu-permission-card">
            <div><strong>${escapeHtml(menuLabels[menu])}</strong><small>${escapeHtml(menuDescriptions[menu] || "")}</small></div>
            ${overrideControl("menu", menu, current.menu_overrides?.[menu], menuLabels[menu])}
        </div>`).join("");
        HubModal.open(`
            <h2 class="modal-title" id="modal-title">${user ? "Editar usuário" : "Novo usuário"}</h2>
            <p class="modal-description">Configure os dados, o escopo contratual e as exceções de acesso em uma única tela.</p>
            <form id="user-form" class="user-editor">
                <input type="hidden" id="form-user-id" value="${escapeHtml(current.id || "")}">
                <div class="user-editor-tabs" role="tablist">
                    <button type="button" data-user-form-tab="profile" class="${focusPermissions ? "" : "active"}" role="tab">1. Dados e escopo</button>
                    <button type="button" data-user-form-tab="permissions" class="${focusPermissions ? "active" : ""}" role="tab">2. Permissões</button>
                </div>
                <section class="user-editor-panel ${focusPermissions ? "" : "active"}" data-user-form-panel="profile" role="tabpanel">
                    <div class="editor-section-heading"><div><h3>Dados do usuário</h3><p>Informações usadas no cadastro e na definição do nível padrão.</p></div></div>
                    <div class="form-grid">
                        <label>Nome completo<input class="form-control" id="form-name" value="${escapeHtml(current.name || "")}" required></label>
                        <label>E-mail<input class="form-control" id="form-email" type="email" value="${escapeHtml(current.email || "")}" required></label>
                        <label>Centro de custo<input class="form-control" id="form-cost-center" value="${escapeHtml(current.cost_center || "")}" required></label>
                        <label>Cargo<input class="form-control" id="form-job-title" value="${escapeHtml(current.job_title || "")}" required></label>
                        <label>Nível de acesso<select class="form-control" id="form-access-level">${catalog.roles.map(role => `<option value="${role}" ${current.access_level === role ? "selected" : ""}>${escapeHtml(roleLabels[role] || role)}</option>`).join("")}</select><small class="field-hint">Define as permissões padrão.</small></label>
                        <label>Status<select class="form-control" id="form-status"><option value="ativo" ${current.status === "ativo" ? "selected" : ""}>Ativo</option><option value="inativo" ${current.status === "inativo" ? "selected" : ""}>Inativo</option></select></label>
                    </div>
                    <div class="editor-divider"></div>
                    <div class="editor-section-heading"><div><h3>Escopo de acesso</h3><p>Escolha os contratos cujos indicadores ficarão disponíveis para o usuário.</p></div></div>
                    <div class="form-grid scope-grid scope-grid-contracts">
                        <label>Contratos<select class="form-control" id="form-contracts" multiple size="7">${multiOptions(catalog.contracts, current.contracts, contractLabels)}</select><small class="field-hint">Use Ctrl para selecionar mais de um. “Todos” libera os indicadores de todos os contratos.</small></label>
                    </div>
                    <div class="editor-next"><button class="btn-primary" type="button" data-go-permissions>Continuar para permissões</button></div>
                </section>
                <section class="user-editor-panel ${focusPermissions ? "active" : ""}" data-user-form-panel="permissions" id="permissions-section" role="tabpanel">
                    <div class="permission-overview">
                        <div><span>Nível</span><strong id="permission-summary-level">—</strong></div>
                        <div><span>Contratos</span><strong id="permission-summary-contracts">—</strong></div>
                        <div><span>Personalizações</span><strong id="permission-summary-custom">Nenhuma</strong></div>
                    </div>
                    <div class="editor-section-heading"><div><h3>Menus</h3><p>“Padrão” usa a regra do nível. “Permitir” cria uma exceção e libera os indicadores do menu dentro do escopo selecionado.</p></div></div>
                    <div class="menu-permission-grid">${menuCards}</div>
                    <div class="editor-divider"></div>
                    <div class="editor-section-heading indicator-heading"><div><h3>Exceções por indicador</h3><p>Use apenas quando um indicador precisar de uma regra diferente do menu.</p></div><input class="form-control permission-search" id="indicator-permission-search" type="search" placeholder="Buscar indicador"></div>
                    <div class="permission-groups">${indicatorGroups}</div>
                </section>
                <p class="form-error" id="user-form-error"></p>
                <div class="form-actions editor-actions"><button class="btn-secondary" type="button" id="cancel-user-form">Cancelar</button><button class="btn-primary" type="submit">Salvar alterações</button></div>
            </form>`);
        const form = document.getElementById("user-form");
        const contractSelect = document.getElementById("form-contracts");
        const activateTab = name => {
            form.querySelectorAll("[data-user-form-tab]").forEach(button => {
                const active = button.dataset.userFormTab === name;
                button.classList.toggle("active", active); button.setAttribute("aria-selected", String(active));
            });
            form.querySelectorAll("[data-user-form-panel]").forEach(panel => panel.classList.toggle("active", panel.dataset.userFormPanel === name));
            form.closest(".app-modal-card")?.scrollTo({ top: 0, behavior: "smooth" });
        };
        const setPermissionValue = (input, value) => {
            input.value = value;
            input.closest(".permission-segment").querySelectorAll("[data-permission-value]").forEach(button => {
                const active = button.dataset.permissionValue === value;
                button.classList.toggle("active", active); button.setAttribute("aria-pressed", String(active));
            });
        };
        const updatePermissionSummary = () => {
            const level = document.getElementById("form-access-level").value;
            const contracts = selectedValues(contractSelect);
            const menuCount = [...form.querySelectorAll("[data-menu-override]")].filter(input => input.value !== "").length;
            const indicatorCount = [...form.querySelectorAll("[data-indicator-override]")].filter(input => input.value !== "").length;
            document.getElementById("permission-summary-level").textContent = roleLabels[level] || level;
            document.getElementById("permission-summary-contracts").textContent = listText(contracts, contractLabels);
            document.getElementById("permission-summary-custom").textContent = menuCount || indicatorCount ? `${menuCount} menu(s) · ${indicatorCount} indicador(es)` : "Nenhuma";
        };
        form.addEventListener("click", event => {
            const tab = event.target.closest("[data-user-form-tab]"); if (tab) activateTab(tab.dataset.userFormTab);
            if (event.target.closest("[data-go-permissions]")) activateTab("permissions");
            const permissionButton = event.target.closest("[data-permission-value]");
            if (permissionButton) { setPermissionValue(permissionButton.closest(".permission-segment").querySelector("input"), permissionButton.dataset.permissionValue); updatePermissionSummary(); }
            const groupButton = event.target.closest("[data-group-value]");
            if (groupButton) { groupButton.closest(".permission-group").querySelectorAll("[data-indicator-override]").forEach(input => setPermissionValue(input, groupButton.dataset.groupValue)); updatePermissionSummary(); }
        });
        form.querySelectorAll("[data-user-form-tab]").forEach(button => button.setAttribute("aria-selected", String(button.classList.contains("active"))));
        contractSelect.addEventListener("change", updatePermissionSummary);
        document.getElementById("form-access-level").addEventListener("change", updatePermissionSummary);
        document.getElementById("indicator-permission-search").addEventListener("input", event => {
            const query = event.target.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
            form.querySelectorAll(".permission-group").forEach(group => {
                let visible = 0;
                group.querySelectorAll(".indicator-permission-row").forEach(row => {
                    const searchable = row.dataset.search.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    const match = !query || searchable.includes(query); row.hidden = !match; if (match) visible++;
                });
                group.hidden = visible === 0; if (query && visible) group.open = true;
            });
        });
        updatePermissionSummary();
        form.addEventListener("invalid", () => activateTab("profile"), true);
        document.getElementById("cancel-user-form").addEventListener("click", HubModal.close);
        form.addEventListener("submit", saveUserForm);
    }

    function selectedValues(element) { return [...element.selectedOptions].map(option => option.value); }
    function collectOverrides(selector, key) {
        const result = {};
        document.querySelectorAll(selector).forEach(select => { if (select.value !== "") result[select.dataset[key]] = select.value === "true"; });
        return result;
    }
    async function saveUserForm(event) {
        event.preventDefault();
        const error = document.getElementById("user-form-error");
        try {
            await HubAPI("save-user", { method:"POST", body: {
                id: document.getElementById("form-user-id").value || undefined,
                name: document.getElementById("form-name").value,
                email: document.getElementById("form-email").value,
                costCenter: document.getElementById("form-cost-center").value,
                jobTitle: document.getElementById("form-job-title").value,
                accessLevel: document.getElementById("form-access-level").value,
                status: document.getElementById("form-status").value,
                contracts: selectedValues(document.getElementById("form-contracts")),
                menuOverrides: collectOverrides("[data-menu-override]", "menuOverride"),
                indicatorOverrides: collectOverrides("[data-indicator-override]", "indicatorOverride")
            }});
            HubModal.close(); await loadUsers();
        } catch (err) { error.textContent = err.message; }
    }

    function viewUser(user) {
        HubModal.open(`<h2 class="modal-title" id="modal-title">${escapeHtml(user.name)}</h2><p class="modal-description">${escapeHtml(user.email)}</p>
            <div class="form-grid"><div><strong>Cargo</strong><p>${escapeHtml(user.job_title)}</p></div><div><strong>Nível</strong><p>${escapeHtml(roleLabels[user.access_level] || user.access_level)}</p></div><div><strong>Centro de custo</strong><p>${escapeHtml(user.cost_center)}</p></div><div><strong>Status</strong><p>${escapeHtml(user.status)}</p></div><div><strong>Contratos</strong><p>${escapeHtml(listText(user.contracts, contractLabels))}</p></div><div><strong>Operações</strong><p>${escapeHtml(listText(user.operations))}</p></div></div>`);
    }

    async function openImport() {
        importPayload = null;
        HubModal.open(`<h2 class="modal-title" id="modal-title">Importar usuários</h2><p class="modal-description">Selecione um arquivo .xlsx. Colunas obrigatórias: Nome, E-mail, Centro de Custo e Cargo. A coluna Contrato é opcional: use “Todos” para liberar todos, deixe em branco para nenhum ou separe vários contratos por vírgula. Contratos ainda não cadastrados serão ignorados.</p>
            <input class="form-control" id="import-file" type="file" accept=".xlsx"><p class="form-error" id="import-error"></p><div id="import-preview"></div>
            <div class="form-actions"><button class="btn-primary" id="preview-import" type="button">Pré-visualizar</button></div>`);
        document.getElementById("preview-import").addEventListener("click", previewImport);
    }
    function fileAsBase64(file) { return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(file); }); }
    async function previewImport() {
        const file = document.getElementById("import-file").files[0];
        const error = document.getElementById("import-error");
        if (!file) { error.textContent = "Selecione um arquivo."; return; }
        try {
            importPayload = await fileAsBase64(file);
            const result = await HubAPI("import-preview", { method:"POST", body:{ fileBase64:importPayload } });
            document.getElementById("import-preview").innerHTML = `<div class="summary-cards">${Object.entries(result.summary).map(([key,value]) => `<div class="summary-card"><strong>${value}</strong>${key}</div>`).join("")}</div>
                <div class="admin-table-wrap"><table class="import-table"><thead><tr><th>Linha</th><th>Nome</th><th>E-mail</th><th>Centro de custo</th><th>Cargo</th><th>Contrato informado</th><th>Nível identificado</th><th>Resultado</th></tr></thead><tbody>${result.rows.map(row => `<tr><td>${row.row}</td><td>${escapeHtml(row.name)}</td><td>${escapeHtml(row.email)}</td><td>${escapeHtml(row.costCenter)}</td><td>${escapeHtml(row.jobTitle)}</td><td>${escapeHtml(row.contractText || "—")}</td><td>${escapeHtml(roleLabels[row.accessLevel] || row.accessLevel)}</td><td>${escapeHtml(row.errors.join(", ") || row.state)}</td></tr>`).join("")}</tbody></table></div>
                <label class="check-option"><input id="update-existing" type="checkbox" checked> Atualizar dados dos usuários existentes</label>
                <div class="form-actions"><button class="btn-primary" id="commit-import" type="button" ${result.summary.erro ? "disabled" : ""}>Confirmar importação</button></div>`;
            document.getElementById("commit-import").addEventListener("click", commitImport);
        } catch (err) { error.textContent = err.message; }
    }
    async function commitImport() {
        try {
            const result = await HubAPI("import-commit", { method:"POST", body:{ fileBase64:importPayload, updateExisting:document.getElementById("update-existing").checked } });
            HubModal.close(); await loadUsers(); window.alert(`Importação concluída: ${result.created} novo(s), ${result.updated} atualizado(s).`);
        } catch (err) { document.getElementById("import-error").textContent = err.message; }
    }

    async function openAudit() {
        const result = await HubAPI("audit");
        HubModal.open(`<h2 class="modal-title" id="modal-title">Histórico de alterações</h2><p class="modal-description">Últimos 300 eventos registrados.</p><div class="audit-list">${result.entries.map(item => `<div class="audit-item"><strong>${escapeHtml(item.actor_name || "Sistema")} — ${escapeHtml(item.action.replaceAll("_", " "))}</strong><span>${escapeHtml(item.target_name || "")}</span><small>${formatDate(item.created_at)}</small></div>`).join("") || "Nenhum registro."}</div>`);
    }

    tableBody.addEventListener("click", async event => {
        const button = event.target.closest("[data-action]"); if (!button) return;
        const user = users.find(item => item.id === button.dataset.id); if (!user) return;
        if (button.dataset.action === "view") viewUser(user);
        if (button.dataset.action === "edit") openUserForm(user);
        if (button.dataset.action === "permissions") openUserForm(user, true);
        if (button.dataset.action === "reset" && confirm(`Redefinir a senha de ${user.name} para a senha temporária?`)) { await HubAPI("reset-password", { method:"POST", body:{id:user.id} }); alert("Senha redefinida para senhamro."); }
        if (button.dataset.action === "status" && confirm(`${user.status === "ativo" ? "Inativar" : "Reativar"} ${user.name}?`)) { await HubAPI("user-status", { method:"POST", body:{id:user.id,status:user.status === "ativo" ? "inativo" : "ativo"} }); await loadUsers(); }
    });
    Object.values(filters).forEach(filter => filter.addEventListener("input", renderUsers));
    statusFilter.addEventListener("change", renderUsers);
    document.getElementById("btn-new-user").addEventListener("click", () => openUserForm());
    document.getElementById("btn-import-users").addEventListener("click", openImport);
    document.getElementById("btn-audit").addEventListener("click", openAudit);
    document.addEventListener("hub:open-user-management", () => loadUsers().catch(error => alert(error.message)));
    filters.contract.innerHTML += Object.entries(contractLabels).map(([value,label]) => `<option value="${value}">${label}</option>`).join("");
})();
