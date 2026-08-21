// ========================================
// TikTokの2つのアカウントを表示
// ========================================

const tiktokButton =
    document.getElementById("tiktok-button");

const tiktokAccounts =
    document.getElementById("tiktok-accounts");


tiktokButton.addEventListener("click", function () {

    tiktokAccounts.classList.toggle("open");

});