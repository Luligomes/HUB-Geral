(function () {
    const loginScreen = document.getElementById("login-screen");
    const loginForm = document.getElementById("login-form");
    const loginError = document.getElementById("login-error");
    const modal = document.getElementById("app-modal");
    const modalContent = document.getElementById("modal-content");
    const modalClose = document.getElementById("modal-close");
    let modalLocked = false;

    async function api(action, options = {}) {
        const query = options.query ? `&${new URLSearchParams(options.query)}` : "";
        let response;
        try {
            response = await fetch(`/api?action=${encodeURIComponent(action)}${query}`, {
                method: options.method || "GET",
                credentials: "same-origin",
                headers: options.body ? { "Content-Type": "application/json" } : undefined,
                body: options.body ? JSON.stringify(options.body) : undefined
            });
        } catch {
            throw new Error("Servidor de autenticação indisponível. Para testar localmente, execute npm start e acesse http://localhost:3000.");
        }
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            const error = new Error(data.error || "Não foi possível concluir a operação.");
            error.status = response.status;
            throw error;
        }
        return data;
    }

    function openModal(html, locked = false) {
        modalLocked = locked;
        modalContent.innerHTML = html;
        modalClose.hidden = locked;
        modal.hidden = false;
    }

    function closeModal() {
        if (modalLocked) return;
        modal.hidden = true;
        modalContent.innerHTML = "";
    }

    function requirePasswordChange() {
        openModal(`
            <h2 class="modal-title" id="modal-title">Crie uma nova senha</h2>
            <p class="modal-description">Por segurança, a senha temporária deve ser substituída antes de acessar o sistema.</p>
            <form id="change-password-form">
                <div class="form-grid">
                    <label class="form-span-2">Nova senha<input class="form-control" id="new-password" type="password" minlength="8" autocomplete="new-password" required></label>
                    <label class="form-span-2">Confirmar nova senha<input class="form-control" id="confirm-password" type="password" minlength="8" autocomplete="new-password" required></label>
                </div>
                <p class="form-error" id="password-error"></p>
                <div class="form-actions"><button class="btn-primary" type="submit">Salvar nova senha</button></div>
            </form>`, true);
        document.getElementById("change-password-form").addEventListener("submit", async event => {
            event.preventDefault();
            const password = document.getElementById("new-password").value;
            const confirmation = document.getElementById("confirm-password").value;
            const error = document.getElementById("password-error");
            if (password !== confirmation) { error.textContent = "As senhas não coincidem."; return; }
            try {
                const result = await api("change-password", { method: "POST", body: { password } });
                modalLocked = false;
                closeModal();
                applyUser(result.user);
            } catch (err) { error.textContent = err.message; }
        });
    }

    function applyUser(user) {
        window.CURRENT_USER = user;
        document.body.classList.remove("auth-pending");
        document.body.classList.add("authenticated");
        loginScreen.style.display = "none";
        document.getElementById("session-user-name").textContent = user.name;
        document.getElementById("session-user-role").textContent = user.accessLevel.replaceAll("_", " ");
        const adminNav = document.getElementById("nav-user-management");
        adminNav.hidden = !user.access.manageUsers;
        applyAccessContext(user.access);
        if (user.mustChangePassword) requirePasswordChange();
        document.dispatchEvent(new CustomEvent("hub:user-ready", { detail: user }));
    }

    async function restoreSession() {
        try {
            const result = await api("me");
            applyUser(result.user);
        } catch {
            document.body.classList.remove("auth-pending", "authenticated");
            loginScreen.style.display = "grid";
        }
    }

    loginForm.addEventListener("submit", async event => {
        event.preventDefault();
        loginError.textContent = "";
        try {
            const result = await api("login", {
                method: "POST",
                body: { email: document.getElementById("login-email").value, password: document.getElementById("login-password").value }
            });
            loginForm.reset();
            applyUser(result.user);
        } catch (error) { loginError.textContent = error.message; }
    });

    document.getElementById("btn-logout").addEventListener("click", async () => {
        try { await api("logout", { method: "POST" }); } finally { location.reload(); }
    });
    modalClose.addEventListener("click", closeModal);
    modal.addEventListener("click", event => { if (event.target === modal) closeModal(); });

    document.querySelectorAll(".nav-button[data-category]").forEach(button => {
        button.addEventListener("click", () => { document.getElementById("user-management-viewport").hidden = true; });
    });
    document.getElementById("btn-user-management").addEventListener("click", () => {
        if (!window.CURRENT_USER?.access?.manageUsers) return;
        document.querySelectorAll(".nav-button").forEach(button => button.classList.remove("active"));
        document.getElementById("btn-user-management").classList.add("active");
        dashboardViewport.style.display = "none";
        iframeViewport.style.display = "none";
        document.getElementById("user-management-viewport").hidden = false;
        document.dispatchEvent(new CustomEvent("hub:open-user-management"));
    });

    window.HubAPI = api;
    window.HubModal = { open: openModal, close: closeModal };
    document.addEventListener("DOMContentLoaded", restoreSession);
})();
