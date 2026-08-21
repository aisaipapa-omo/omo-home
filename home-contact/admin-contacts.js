
// =========================
// Supabase
// =========================

const SUPABASE_URL =
    "https://ggvlwcvmekxfnvyebthr.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_K6GKq7H5pcofxuSWexmkew_veAQ-b2z";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


// =========================
// 管理者メールアドレス
// =========================

const ADMIN_EMAIL =
    "yuichi.omo@gmail.com";


// =========================
// HTML
// =========================

const adminStatus =
    document.getElementById(
        "admin-status"
    );

const contactList =
    document.getElementById(
        "contact-list"
    );

const countAll =
    document.getElementById(
        "count-all"
    );

const countUnresolved =
    document.getElementById(
        "count-unresolved"
    );

const countResolved =
    document.getElementById(
        "count-resolved"
    );

const countArchived =
    document.getElementById(
        "count-archived"
    );

const searchInput =
    document.getElementById(
        "contact-search-input"
    );

const searchClear =
    document.getElementById(
        "contact-search-clear"
    );


// =========================
// 状態
// =========================

let allContacts = [];

let currentFilter =
    "all";

let currentSearch =
    "";


// =========================
// 管理画面開始
// =========================

async function startAdminPage() {

    const {
        data: {
            user
        },
        error
    } =
        await supabaseClient
            .auth
            .getUser();


    // =========================
    // ログイン確認
    // =========================

    if (
        error ||
        !user
    ) {

        adminStatus.textContent =
            "ログインが必要です。";


        contactList.innerHTML = `

            <p class="not-admin">
                管理者としてログインしてください。
            </p>

        `;

        return;
    }


    // =========================
    // 管理者確認
    // =========================

    if (
        user.email !== ADMIN_EMAIL
    ) {

        adminStatus.textContent =
            "このページは管理者専用です。";


        contactList.innerHTML = `

            <p class="not-admin">
                閲覧権限がありません。
            </p>

        `;

        return;
    }


    // =========================
    // 管理者OK
    // =========================

    adminStatus.textContent =
        "管理者としてログインしています。";


    setupSearch();

    setupFilterButtons();

    setupModalEvents();

    await loadContacts();

}


// =========================
// お問い合わせ取得
// =========================

async function loadContacts() {

    const {
        data: contacts,
        error
    } =
        await supabaseClient
            .from("contacts")
            .select(
                "id, name, email, message, created_at, is_resolved, is_archived, admin_note"
            )
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    // =========================
    // エラー
    // =========================

    if (error) {

        console.error(
            "お問い合わせ取得エラー:",
            error
        );


        contactList.innerHTML = `

            <p class="error">
                お問い合わせを読み込めませんでした。
            </p>

        `;

        return;
    }


    allContacts =
        contacts || [];


    updateCounts();

    renderContacts();

}


// =========================
// 件数更新
// =========================

function updateCounts() {

    const normalContacts =
        allContacts.filter(
            contact =>
                !contact.is_archived
        );


    const archivedContacts =
        allContacts.filter(
            contact =>
                contact.is_archived
        );


    const unresolved =
        normalContacts.filter(
            contact =>
                !contact.is_resolved
        ).length;


    const resolved =
        normalContacts.filter(
            contact =>
                contact.is_resolved
        ).length;


    countAll.textContent =
        normalContacts.length;


    countUnresolved.textContent =
        unresolved;


    countResolved.textContent =
        resolved;


    countArchived.textContent =
        archivedContacts.length;

}


// =========================
// フィルター
// =========================

function setupFilterButtons() {

    const buttons =
        document.querySelectorAll(
            ".filter-button"
        );


    buttons.forEach(
        button => {

            button.addEventListener(
                "click",
                function () {

                    currentFilter =
                        this.dataset.filter;


                    buttons.forEach(
                        item => {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    this.classList.add(
                        "active"
                    );


                    renderContacts();

                }
            );

        }
    );

}


// =========================
// 検索
// =========================

function setupSearch() {

    if (
        !searchInput
    ) {

        return;
    }


    // 入力されたら検索

    searchInput.addEventListener(
        "input",
        function () {

            currentSearch =
                this.value
                    .trim()
                    .toLowerCase();


            renderContacts();

        }
    );


    // クリア

    if (
        searchClear
    ) {

        searchClear.addEventListener(
            "click",
            function () {

                searchInput.value =
                    "";

                currentSearch =
                    "";

                renderContacts();

                searchInput.focus();

            }
        );

    }

}


// =========================
// 表示するお問い合わせを作る
// =========================

function getFilteredContacts() {

    let contacts = [];


    // =========================
    // 状態で絞り込み
    // =========================

    if (
        currentFilter === "all"
    ) {

        contacts =
            allContacts.filter(
                contact =>
                    !contact.is_archived
            );

    }


    else if (
        currentFilter === "unresolved"
    ) {

        contacts =
            allContacts.filter(
                contact =>
                    !contact.is_archived &&
                    !contact.is_resolved
            );

    }


    else if (
        currentFilter === "resolved"
    ) {

        contacts =
            allContacts.filter(
                contact =>
                    !contact.is_archived &&
                    contact.is_resolved
            );

    }


    else if (
        currentFilter === "archived"
    ) {

        contacts =
            allContacts.filter(
                contact =>
                    contact.is_archived
            );

    }


    // =========================
    // 検索
    // =========================

    if (
        currentSearch
    ) {

        contacts =
            contacts.filter(
                contact => {

                    const name =
                        String(
                            contact.name || ""
                        ).toLowerCase();


                    const email =
                        String(
                            contact.email || ""
                        ).toLowerCase();


                    const message =
                        String(
                            contact.message || ""
                        ).toLowerCase();


                    const note =
                        String(
                            contact.admin_note || ""
                        ).toLowerCase();


                    return (
                        name.includes(
                            currentSearch
                        ) ||
                        email.includes(
                            currentSearch
                        ) ||
                        message.includes(
                            currentSearch
                        ) ||
                        note.includes(
                            currentSearch
                        )
                    );

                }
            );

    }


    return contacts;

}


// =========================
// お問い合わせ表示
// =========================

function renderContacts() {

    const contacts =
        getFilteredContacts();


    // =========================
    // 該当なし
    // =========================

    if (
        contacts.length === 0
    ) {

        contactList.innerHTML = `

            <p class="no-contacts">
                該当するお問い合わせはありません。
            </p>

        `;

        return;
    }


    contactList.innerHTML =
        "";


    contacts.forEach(
        contact => {

            const date =
                new Date(
                    contact.created_at
                );


            const formattedDate =
                date.toLocaleString(
                    "ja-JP"
                );


            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "contact-card";


            card.dataset.id =
                contact.id;


            // =========================
            // 対応状態
            // =========================

            let statusHTML =
                "";


            if (
                contact.is_resolved
            ) {

                statusHTML = `

                    <span
                        class="resolved-label"
                    >
                        ✓ 対応済み
                    </span>

                    <button
                        type="button"
                        class="resolve-button"
                        data-id="${contact.id}"
                    >
                        未対応に戻す
                    </button>

                `;

            }

            else {

                statusHTML = `

                    <span
                        class="unresolved-label"
                    >
                        未対応
                    </span>

                    <button
                        type="button"
                        class="resolve-button"
                        data-id="${contact.id}"
                    >
                        対応済みにする
                    </button>

                `;

            }


            // =========================
            // メール返信
            // =========================

            const replySubject =
                encodeURIComponent(
                    "お問い合わせありがとうございます"
                );


            const replyBody =
                encodeURIComponent(
                    `${contact.name} 様

お問い合わせありがとうございます。

お問い合わせいただいた内容を確認いたしました。

`
                );


            const replyHTML = `

                <a
                    class="reply-button"
                    href="mailto:${escapeHTML(
                        contact.email
                    )}?subject=${replySubject}&body=${replyBody}"
                >
                    メールで返信
                </a>

            `;


            // =========================
            // アーカイブ
            // =========================

            let archiveHTML =
                "";


            if (
                contact.is_archived
            ) {

                archiveHTML = `

                    <button
                        type="button"
                        class="archive-button"
                        data-id="${contact.id}"
                    >
                        アーカイブから戻す
                    </button>

                `;

            }

            else {

                archiveHTML = `

                    <button
                        type="button"
                        class="archive-button"
                        data-id="${contact.id}"
                    >
                        アーカイブする
                    </button>

                `;

            }


            // =========================
            // メモ表示
            // =========================

            let noteHTML =
                "";


            if (
                contact.admin_note
            ) {

                noteHTML = `

                    <p class="contact-card-note">
                        📝 ${escapeHTML(
                            contact.admin_note
                        )}
                    </p>

                `;

            }


            // =========================
            // カード
            // =========================

            card.innerHTML = `

                <p class="contact-card-date">
                    ${formattedDate}
                </p>


                <h2 class="contact-card-name">
                    ${escapeHTML(
                        contact.name
                    )}
                </h2>


                <p class="contact-card-email">
                    ${escapeHTML(
                        contact.email
                    )}
                </p>


                <p class="contact-card-message">
                    ${escapeHTML(
                        contact.message
                    )}
                </p>


                ${noteHTML}


                <p class="contact-open-hint">
                    クリックして詳細を見る
                </p>


                <div class="contact-card-actions">

                    ${statusHTML}

                    ${replyHTML}

                    ${archiveHTML}

                </div>

            `;


            contactList.appendChild(
                card
            );

        }
    );


    setupResolveButtons();

    setupArchiveButtons();

    setupContactCards();

}


// =========================
// カードクリック
// =========================

function setupContactCards() {

    document
        .querySelectorAll(
            "#contact-list .contact-card"
        )
        .forEach(
            card => {

                card.addEventListener(
                    "click",
                    function (event) {

                        if (
                            event.target.closest(
                                "a, button"
                            )
                        ) {

                            return;
                        }


                        const id =
                            this.dataset.id;


                        const contact =
                            allContacts.find(
                                item =>
                                    String(
                                        item.id
                                    ) ===
                                    String(id)
                            );


                        if (
                            !contact
                        ) {

                            return;
                        }


                        openContactModal(
                            contact
                        );

                    }
                );

            }
        );

}


// =========================
// 詳細モーダル
// =========================

function openContactModal(
    contact
) {

    const modal =
        document.getElementById(
            "contact-modal"
        );


    const modalName =
        document.getElementById(
            "modal-name"
        );


    const modalEmail =
        document.getElementById(
            "modal-email"
        );


    const modalDate =
        document.getElementById(
            "modal-date"
        );


    const modalMessage =
        document.getElementById(
            "modal-message"
        );


    const modalNote =
        document.getElementById(
            "modal-admin-note"
        );


    const noteResult =
        document.getElementById(
            "admin-note-result"
        );


    const modalActions =
        document.getElementById(
            "modal-actions"
        );


    if (
        !modal ||
        !modalName ||
        !modalEmail ||
        !modalDate ||
        !modalMessage ||
        !modalNote ||
        !noteResult ||
        !modalActions
    ) {

        console.error(
            "お問い合わせ詳細HTMLが見つかりません。"
        );

        return;
    }


    // =========================
    // 内容
    // =========================

    const date =
        new Date(
            contact.created_at
        );


    modalName.textContent =
        contact.name || "";


    modalEmail.innerHTML = `

        <a
            href="mailto:${escapeHTML(
                contact.email
            )}"
        >
            ${escapeHTML(
                contact.email
            )}
        </a>

    `;


    modalDate.textContent =
        date.toLocaleString(
            "ja-JP"
        );


    modalMessage.textContent =
        contact.message || "";


    // =========================
    // メモ
    // =========================

    modalNote.value =
        contact.admin_note || "";


    noteResult.textContent =
        "";


    // =========================
    // 返信メール
    // =========================

    const replySubject =
        encodeURIComponent(
            "お問い合わせありがとうございます"
        );


    const replyBody =
        encodeURIComponent(
            `${contact.name} 様

お問い合わせありがとうございます。

お問い合わせいただいた内容を確認いたしました。

`
        );


    // =========================
    // ボタン
    // =========================

    const resolveText =
        contact.is_resolved
            ? "未対応に戻す"
            : "対応済みにする";


    const archiveText =
        contact.is_archived
            ? "アーカイブから戻す"
            : "アーカイブする";


    modalActions.innerHTML = `

        <a
            class="reply-button"
            href="mailto:${escapeHTML(
                contact.email
            )}?subject=${replySubject}&body=${replyBody}"
        >
            メールで返信
        </a>


        <button
            type="button"
            class="modal-resolve-button"
            id="modal-resolve-button"
        >
            ${resolveText}
        </button>


        <button
            type="button"
            class="modal-archive-button"
            id="modal-archive-button"
        >
            ${archiveText}
        </button>

    `;


    // =========================
    // モーダル表示
    // =========================

    modal.classList.add(
        "show"
    );


    // =========================
    // メモ保存
    // =========================

    document
        .getElementById(
            "save-admin-note"
        )
        .onclick =
        async function () {

            const note =
                modalNote.value.trim();


            this.disabled =
                true;


            noteResult.textContent =
                "保存しています...";


            const {
                error
            } =
                await supabaseClient
                    .from("contacts")
                    .update({
                        admin_note:
                            note || null
                    })
                    .eq(
                        "id",
                        contact.id
                    );


            this.disabled =
                false;


            if (
                error
            ) {

                console.error(
                    "メモ保存エラー:",
                    error
                );


                noteResult.textContent =
                    "メモを保存できませんでした。";


                return;
            }


            // メモを画面上のデータにも反映

            contact.admin_note =
                note;


            noteResult.textContent =
                "✓ メモを保存しました。";


            // 一覧側も更新

            setTimeout(
                function () {

                    renderContacts();

                },
                500
            );

        };


    // =========================
    // 対応状態変更
    // =========================

    document
        .getElementById(
            "modal-resolve-button"
        )
        .onclick =
        async function () {

            const newStatus =
                !contact.is_resolved;


            const {
                error
            } =
                await supabaseClient
                    .from("contacts")
                    .update({
                        is_resolved:
                            newStatus
                    })
                    .eq(
                        "id",
                        contact.id
                    );


            if (
                error
            ) {

                console.error(
                    "対応状態変更エラー:",
                    error
                );


                alert(
                    "変更できませんでした。"
                );


                return;
            }


            contact.is_resolved =
                newStatus;


            updateCounts();

            closeContactModal();

            renderContacts();

        };


    // =========================
    // アーカイブ
    // =========================

    document
        .getElementById(
            "modal-archive-button"
        )
        .onclick =
        async function () {

            const newStatus =
                !contact.is_archived;


            const {
                error
            } =
                await supabaseClient
                    .from("contacts")
                    .update({
                        is_archived:
                            newStatus
                    })
                    .eq(
                        "id",
                        contact.id
                    );


            if (
                error
            ) {

                console.error(
                    "アーカイブ変更エラー:",
                    error
                );


                alert(
                    "アーカイブを変更できませんでした。"
                );


                return;
            }


            contact.is_archived =
                newStatus;


            updateCounts();

            closeContactModal();

            renderContacts();

        };

}


// =========================
// 一覧：対応状態変更
// =========================

function setupResolveButtons() {

    document
        .querySelectorAll(
            "#contact-list .resolve-button"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    async function () {

                        const id =
                            this.dataset.id;


                        const contact =
                            allContacts.find(
                                item =>
                                    String(
                                        item.id
                                    ) ===
                                    String(id)
                            );


                        if (
                            !contact
                        ) {

                            return;
                        }


                        const newStatus =
                            !contact.is_resolved;


                        const {
                            error
                        } =
                            await supabaseClient
                                .from("contacts")
                                .update({
                                    is_resolved:
                                        newStatus
                                })
                                .eq(
                                    "id",
                                    id
                                );


                        if (
                            error
                        ) {

                            console.error(
                                "対応状態変更エラー:",
                                error
                            );


                            alert(
                                "変更できませんでした。"
                            );


                            return;
                        }


                        contact.is_resolved =
                            newStatus;


                        updateCounts();

                        renderContacts();

                    }
                );

            }
        );

}


// =========================
// 一覧：アーカイブ
// =========================

function setupArchiveButtons() {

    document
        .querySelectorAll(
            "#contact-list .archive-button"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    async function () {

                        const id =
                            this.dataset.id;


                        const contact =
                            allContacts.find(
                                item =>
                                    String(
                                        item.id
                                    ) ===
                                    String(id)
                            );


                        if (
                            !contact
                        ) {

                            return;
                        }


                        const newStatus =
                            !contact.is_archived;


                        const {
                            error
                        } =
                            await supabaseClient
                                .from("contacts")
                                .update({
                                    is_archived:
                                        newStatus
                                })
                                .eq(
                                    "id",
                                    id
                                );


                        if (
                            error
                        ) {

                            console.error(
                                "アーカイブ変更エラー:",
                                error
                            );


                            alert(
                                "アーカイブを変更できませんでした。"
                            );


                            return;
                        }


                        contact.is_archived =
                            newStatus;


                        updateCounts();

                        renderContacts();

                    }
                );

            }
        );

}


// =========================
// モーダル操作
// =========================

function setupModalEvents() {

    const modal =
        document.getElementById(
            "contact-modal"
        );


    const closeButton =
        document.getElementById(
            "contact-modal-close"
        );


    if (
        !modal ||
        !closeButton
    ) {

        return;
    }


    // ×ボタン

    closeButton.addEventListener(
        "click",
        closeContactModal
    );


    // 背景クリック

    modal.addEventListener(
        "click",
        function (event) {

            if (
                event.target === modal
            ) {

                closeContactModal();

            }

        }
    );


    // ESCキー

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape"
            ) {

                closeContactModal();

            }

        }
    );

}


// =========================
// モーダルを閉じる
// =========================

function closeContactModal() {

    const modal =
        document.getElementById(
            "contact-modal"
        );


    if (
        !modal
    ) {

        return;
    }


    modal.classList.remove(
        "show"
    );

}


// =========================
// HTMLエスケープ
// =========================

function escapeHTML(
    value
) {

    return String(
        value ?? ""
    )

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


// =========================
// 実行
// =========================

startAdminPage();
