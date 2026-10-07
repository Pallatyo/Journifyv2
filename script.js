/* =====================================================
   JOURNIFY
   LOGIN + REGISTER + JOURNAL
   ===================================================== */


/* =====================================================
   STORAGE
   ===================================================== */

const ACCOUNT_KEY = "journifyAccounts";
const CURRENT_USER_KEY = "journifyCurrentUser";


/* =====================================================
   HELPER
   ===================================================== */

function getAccounts() {
    try {
        return JSON.parse(
            localStorage.getItem(ACCOUNT_KEY)
        ) || {};
    } catch (error) {
        return {};
    }
}


function saveAccounts(accounts) {
    localStorage.setItem(
        ACCOUNT_KEY,
        JSON.stringify(accounts)
    );
}


function getCurrentUser() {
    return localStorage.getItem(CURRENT_USER_KEY);
}


function getJournalKey() {
    const username = getCurrentUser();

    if (!username) {
        return null;
    }

    return "journals_" + username;
}


function getJournals() {

    const key = getJournalKey();

    if (!key) {
        return [];
    }

    try {

        return JSON.parse(
            localStorage.getItem(key)
        ) || [];

    } catch (error) {

        return [];

    }
}


function saveJournals(journals) {

    const key = getJournalKey();

    if (!key) {
        return;
    }

    localStorage.setItem(
        key,
        JSON.stringify(journals)
    );
}


/* =====================================================
   LOGIN CHECK
   ===================================================== */

function checkLogin() {

    const currentUser = getCurrentUser();

    /* Kalau sedang berada di login.html */
    if (
        window.location.pathname.endsWith("login.html")
    ) {

        if (currentUser) {
            window.location.href = "index.html";
        }

        return;
    }


    /* Kalau belum login */
    if (!currentUser) {

        window.location.href = "login.html";

        return;
    }


    /* Tampilkan username */

    const usernameDisplay =
        document.getElementById("usernameDisplay");

    if (usernameDisplay) {

        usernameDisplay.textContent =
            currentUser;

    }


    loadJournals();
}


/* =====================================================
   LOGIN
   ===================================================== */

function login(event) {

    event.preventDefault();

    const usernameInput =
        document.getElementById("loginUsername");

    const passwordInput =
        document.getElementById("loginPassword");

    const error =
        document.getElementById("loginError");


    const username =
        usernameInput.value.trim();

    const password =
        passwordInput.value;


    if (!username || !password) {

        error.textContent =
            "Username dan password wajib diisi.";

        return;
    }


    const accounts = getAccounts();


    if (!accounts[username]) {

        error.textContent =
            "Akun tidak ditemukan.";

        return;
    }


    if (accounts[username] !== password) {

        error.textContent =
            "Password salah.";

        return;
    }


    /* LOGIN BERHASIL */

    localStorage.setItem(
        CURRENT_USER_KEY,
        username
    );


    window.location.href = "index.html";
}


/* =====================================================
   REGISTER
   ===================================================== */

function registerAccount() {

    const usernameInput =
        document.getElementById("registerUsername");

    const passwordInput =
        document.getElementById("registerPassword");

    const error =
        document.getElementById("registerError");


    const username =
        usernameInput.value.trim();

    const password =
        passwordInput.value;


    if (username.length < 3) {

        error.textContent =
            "Username minimal 3 karakter.";

        return;
    }


    if (password.length < 4) {

        error.textContent =
            "Password minimal 4 karakter.";

        return;
    }


    const accounts = getAccounts();


    if (accounts[username]) {

        error.textContent =
            "Username tersebut sudah digunakan.";

        return;
    }


    /* BUAT AKUN */

    accounts[username] = password;

    saveAccounts(accounts);


    /* LANGSUNG LOGIN */

    localStorage.setItem(
        CURRENT_USER_KEY,
        username
    );


    window.location.href = "index.html";
}


/* =====================================================
   LOGOUT
   ===================================================== */

function logout() {

    localStorage.removeItem(
        CURRENT_USER_KEY
    );

    window.location.href = "login.html";
}


/* =====================================================
   PASSWORD
   ===================================================== */

function togglePassword(
    inputId,
    button
) {

    const input =
        document.getElementById(inputId);

    if (!input) {
        return;
    }


    if (input.type === "password") {

        input.type = "text";

        button.textContent = "🙈";

    } else {

        input.type = "password";

        button.textContent = "👁️";

    }
}


/* =====================================================
   REGISTER MODAL
   ===================================================== */

function showRegister() {

    const modal =
        document.getElementById("registerModal");

    if (!modal) {
        return;
    }

    modal.classList.add("show");


    const username =
        document.getElementById("registerUsername");

    if (username) {
        username.focus();
    }
}


function closeRegister() {

    const modal =
        document.getElementById("registerModal");

    if (!modal) {
        return;
    }

    modal.classList.remove("show");


    const error =
        document.getElementById("registerError");

    if (error) {
        error.textContent = "";
    }
}


/* =====================================================
   JOURNAL MODAL
   ===================================================== */

function openModal() {

    const modal =
        document.getElementById("journalModal");

    if (!modal) {
        return;
    }

    modal.classList.add("show");


    const title =
        document.getElementById("journalTitle");

    if (title) {
        title.focus();
    }
}


function closeModal() {

    const modal =
        document.getElementById("journalModal");

    if (!modal) {
        return;
    }

    modal.classList.remove("show");

    clearJournalForm();
}


function clearJournalForm() {

    const title =
        document.getElementById("journalTitle");

    const text =
        document.getElementById("journalText");

    const mood =
        document.getElementById("journalMood");


    if (title) {
        title.value = "";
    }

    if (text) {
        text.value = "";
    }

    if (mood) {
        mood.selectedIndex = 0;
    }
}


/* =====================================================
   ADD JOURNAL
   ===================================================== */

function addJournal() {

    const titleInput =
        document.getElementById("journalTitle");

    const moodInput =
        document.getElementById("journalMood");

    const textInput =
        document.getElementById("journalText");


    if (
        !titleInput ||
        !moodInput ||
        !textInput
    ) {
        return;
    }


    const title =
        titleInput.value.trim();

    const mood =
        moodInput.value;

    const text =
        textInput.value.trim();


    if (!title) {

        alert("Judul jurnal belum diisi.");

        titleInput.focus();

        return;
    }


    if (!text) {

        alert("Isi jurnal belum diisi.");

        textInput.focus();

        return;
    }


    const journals =
        getJournals();


    const newJournal = {

        id: Date.now(),

        title: title,

        mood: mood,

        text: text,

        date: new Date().toLocaleDateString(
            "id-ID",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        )

    };


    journals.unshift(newJournal);


    saveJournals(journals);


    closeModal();

    loadJournals();
}


/* =====================================================
   LOAD JOURNALS
   ===================================================== */

function loadJournals() {

    const journals =
        getJournals();

    renderJournals(journals);
}


/* =====================================================
   RENDER JOURNALS
   ===================================================== */

function renderJournals(journals) {

    const list =
        document.getElementById("journalList");

    const empty =
        document.getElementById("emptyMessage");

    const count =
        document.getElementById("journalCount");


    if (!list) {
        return;
    }


    list.innerHTML = "";


    /* COUNT */

    if (count) {

        count.textContent =
            journals.length +
            (
                journals.length === 1
                    ? " entry"
                    : " entries"
            );

    }


    /* EMPTY */

    if (journals.length === 0) {

        if (empty) {
            empty.style.display = "block";
        }

        return;
    }


    if (empty) {
        empty.style.display = "none";
    }


    /* CREATE CARD */

    journals.forEach(function(journal) {

        const article =
            document.createElement("article");


        article.className =
            "journal-card";


        article.innerHTML = `

            <div class="journal-card-top">

                <span class="mood">
                    ${escapeHTML(journal.mood)}
                </span>

                <span class="journal-date">
                    ${escapeHTML(journal.date)}
                </span>

            </div>


            <h3>
                ${escapeHTML(journal.title)}
            </h3>


            <p>
                ${escapeHTML(journal.text)}
            </p>


            <button
                type="button"
                class="delete-btn"
                onclick="deleteJournal(${journal.id})"
            >
                Hapus
            </button>

        `;


        list.appendChild(article);

    });
}


/* =====================================================
   DELETE JOURNAL
   ===================================================== */

function deleteJournal(id) {

    const confirmDelete =
        confirm(
            "Yakin ingin menghapus jurnal ini?"
        );


    if (!confirmDelete) {
        return;
    }


    let journals =
        getJournals();


    journals =
        journals.filter(function(journal) {

            return journal.id !== id;

        });


    saveJournals(journals);


    loadJournals();
}


/* =====================================================
   SEARCH
   ===================================================== */

function searchJournal() {

    const input =
        document.getElementById("searchInput");


    if (!input) {
        return;
    }


    const keyword =
        input.value
            .toLowerCase()
            .trim();


    const journals =
        getJournals();


    if (!keyword) {

        renderJournals(journals);

        return;
    }


    const filtered =
        journals.filter(function(journal) {

            return (

                journal.title
                    .toLowerCase()
                    .includes(keyword)

                ||

                journal.text
                    .toLowerCase()
                    .includes(keyword)

                ||

                journal.mood
                    .toLowerCase()
                    .includes(keyword)

            );

        });


    renderJournals(filtered);
}


/* =====================================================
   SHOW ALL
   ===================================================== */

function showAll() {

    const input =
        document.getElementById("searchInput");


    if (input) {
        input.value = "";
    }


    loadJournals();
}


/* =====================================================
   ESCAPE HTML
   ===================================================== */

function escapeHTML(value) {

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");
}


document.addEventListener("DOMContentLoaded", function () {

    /* ================================
       ADMIN PAGE
       ================================ */

    if (
        document.body.classList.contains(
            "admin-page"
        )
    ) {

        loadAdminDashboard();

        return;
    }


    /* ================================
       LOGIN FORM
       ================================ */

    const loginForm =
        document.getElementById(
            "loginForm"
        );


    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            login
        );

    }


    /* ================================
       SEARCH
       ================================ */

    const searchInput =
        document.getElementById(
            "searchInput"
        );


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            searchJournal
        );

    }


    /* ================================
       ESCAPE KEY
       ================================ */

    document.addEventListener(
        "keydown",
        function(event) {

            if (event.key !== "Escape") {
                return;
            }


            closeModal();
            closeRegister();
            closeAdminLogin();

        }
    );


    /* ================================
       CHECK LOGIN
       ================================ */

    if (
        !document.body.classList.contains(
            "login-page"
        )
    ) {

        checkLogin();

    }


    /* ================================
       REDIRECT USER YANG SUDAH LOGIN
       ================================ */

    if (
        document.body.classList.contains(
            "login-page"
        )
    ) {

        const currentUser =
            getCurrentUser();


        if (currentUser) {

            window.location.href =
                "index.html";

        }

    }
    /*
    update tanggal
    */
    updateTodayDate();

});
/* =====================================================
   ADMIN DASHBOARD
   ===================================================== */

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";


/* =====================================================
   ADMIN LOGIN
   ===================================================== */

function showAdminLogin() {

    const modal =
        document.getElementById("adminLoginModal");

    if (!modal) return;

    modal.classList.add("show");

    const username =
        document.getElementById("adminUsername");

    if (username) {
        username.focus();
    }
}


function closeAdminLogin() {

    const modal =
        document.getElementById("adminLoginModal");

    if (!modal) return;

    modal.classList.remove("show");

    const error =
        document.getElementById("adminLoginError");

    if (error) {
        error.textContent = "";
    }
}


function adminLogin() {

    const usernameInput =
        document.getElementById("adminUsername");

    const passwordInput =
        document.getElementById("adminPassword");

    const error =
        document.getElementById("adminLoginError");


    const username =
        usernameInput.value.trim();

    const password =
        passwordInput.value;


    if (!username || !password) {

        error.textContent =
            "Username dan password wajib diisi.";

        return;
    }


    if (
        username === ADMIN_USERNAME &&
        password === ADMIN_PASSWORD
    ) {

        localStorage.setItem(
            "journifyAdmin",
            "true"
        );


        window.location.href =
            "admin.html";

        return;
    }


    error.textContent =
        "Username atau password admin salah.";
}


/* =====================================================
   CEK ADMIN
   ===================================================== */

function checkAdmin() {

    const adminLogin =
        localStorage.getItem(
            "journifyAdmin"
        );


    if (adminLogin !== "true") {

        window.location.href =
            "login.html";

        return false;
    }


    return true;
}


/* =====================================================
   LOAD ADMIN DASHBOARD
   ===================================================== */

function loadAdminDashboard() {

    if (!checkAdmin()) {
        return;
    }


    const accounts =
        getAccounts();


    const usernames =
        Object.keys(accounts);


    let totalJournals = 0;


    /* HITUNG SEMUA JURNAL */

    usernames.forEach(function(username) {

        const key =
            "journals_" + username;


        try {

            const journals =
                JSON.parse(
                    localStorage.getItem(key)
                ) || [];


            totalJournals +=
                journals.length;

        } catch (error) {

            console.log(
                "Data jurnal rusak:",
                username
            );

        }

    });


    /* =================================================
       STATISTIK
       ================================================= */

    const totalUsers =
        document.getElementById(
            "totalUsers"
        );


    const totalJournalsElement =
        document.getElementById(
            "totalJournals"
        );


    if (totalUsers) {

        totalUsers.textContent =
            usernames.length;

    }


    if (totalJournalsElement) {

        totalJournalsElement.textContent =
            totalJournals;

    }


    /* =================================================
       TAMPILKAN DATA
       ================================================= */

    renderAdminUsers(
        usernames
    );


    renderAdminJournals(
        usernames
    );
}


/* =====================================================
   ADMIN USERS
   ===================================================== */

function renderAdminUsers(usernames) {

    const container =
        document.getElementById(
            "userList"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (usernames.length === 0) {

        container.innerHTML = `
            <p class="admin-empty">
                Belum ada pengguna.
            </p>
        `;

        return;
    }


    usernames.forEach(function(username) {

        const key =
            "journals_" + username;


        let journals = [];


        try {

            journals =
                JSON.parse(
                    localStorage.getItem(key)
                ) || [];

        } catch (error) {

            journals = [];

        }


        const card =
            document.createElement(
                "div"
            );


        card.className =
            "admin-user-card";


        card.innerHTML = `

            <div>

                <div class="admin-user-name">
                    👤 ${escapeHTML(username)}
                </div>

                <div class="admin-user-journals">
                    ${journals.length} jurnal
                </div>

            </div>

        `;


        container.appendChild(card);

    });
}


/* =====================================================
   ADMIN JOURNALS
   ===================================================== */

function renderAdminJournals(usernames) {

    const container =
        document.getElementById(
            "adminJournalList"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    let allJournals = [];


    /* AMBIL JURNAL DARI SEMUA USER */

    usernames.forEach(function(username) {

        const key =
            "journals_" + username;


        let journals = [];


        try {

            journals =
                JSON.parse(
                    localStorage.getItem(key)
                ) || [];

        } catch (error) {

            journals = [];

        }


        journals.forEach(function(journal) {

            allJournals.push({

                ...journal,

                username: username

            });

        });

    });


    /* BELUM ADA JURNAL */

    if (allJournals.length === 0) {

        container.innerHTML = `
            <p class="admin-empty">
                Belum ada jurnal.
            </p>
        `;

        return;
    }


    /* URUTKAN TERBARU */

    allJournals.sort(
        function(a, b) {

            return b.id - a.id;

        }
    );


    /* TAMPILKAN JURNAL */

    allJournals.forEach(
        function(journal) {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "admin-journal-card";


            card.innerHTML = `

                <div class="admin-journal-top">

                    <span class="mood">
                        ${escapeHTML(
                            journal.mood
                        )}
                    </span>

                    <span class="admin-journal-user">
                        👤 ${escapeHTML(
                            journal.username
                        )}
                    </span>

                </div>


                <h3>
                    ${escapeHTML(
                        journal.title
                    )}
                </h3>


                <p>
                    ${escapeHTML(
                        journal.text
                    )}
                </p>


                <small>
                    ${escapeHTML(
                        journal.date
                    )}
                </small>


                <br>


                <button
                    type="button"
                    class="admin-delete-btn"
                    onclick="adminDeleteJournal(
                        '${escapeHTML(
                            journal.username
                        )}',
                        ${journal.id}
                    )"
                >
                    Hapus jurnal
                </button>

            `;


            container.appendChild(
                card
            );

        }
    );
}


/* =====================================================
   ADMIN DELETE JOURNAL
   ===================================================== */

function adminDeleteJournal(
    username,
    journalId
) {

    const confirmed =
        confirm(
            "Yakin ingin menghapus jurnal ini?"
        );


    if (!confirmed) {
        return;
    }


    const key =
        "journals_" + username;


    let journals = [];


    try {

        journals =
            JSON.parse(
                localStorage.getItem(key)
            ) || [];

    } catch (error) {

        journals = [];

    }


    journals =
        journals.filter(
            function(journal) {

                return journal.id !== journalId;

            }
        );


    localStorage.setItem(
        key,
        JSON.stringify(journals)
    );


    /* REFRESH DASHBOARD */

    loadAdminDashboard();
}


/* =====================================================
   ADMIN LOGOUT
   ===================================================== */

function adminLogout() {

    localStorage.removeItem(
        "journifyAdmin"
    );


    window.location.href =
        "login.html";
}


function updateTodayDate() {

    const today = new Date();

    const day =
        String(today.getDate()).padStart(2, "0");

    const months = [
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEP",
        "OCT",
        "NOV",
        "DEC"
    ];

    const month =
        months[today.getMonth()];


    const dayElement =
        document.getElementById("todayDay");

    const monthElement =
        document.getElementById("todayMonth");


    if (dayElement) {
        dayElement.textContent = day;
    }

    if (monthElement) {
        monthElement.textContent = month;
    }
}