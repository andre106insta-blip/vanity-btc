// check_balance.js
// Автоматическая проверка баланса Bitcoin-адреса через Blockstream API
// Работает с оригинальным репозиторием Joshua-Zou/vanity-btc

(function() {
    // Функция для проверки баланса
    function checkBalance(address) {
        const resultDiv = document.getElementById('result');
        if (!address || address.length < 26) return;

        const apiUrl = `https://blockstream.info/api/address/${address}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const confirmed = data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum;
                const unconfirmed = data.mempool_stats.funded_txo_sum - data.mempool_stats.spent_txo_sum;
                const balanceHTML = `<p><strong>Баланс:</strong> ${confirmed / 1e8} BTC (подтвержденные), ${unconfirmed / 1e8} BTC (неподтвержденные)</p>`;
                
                // Добавляем к существующему выводу
                resultDiv.innerHTML += balanceHTML;
            })
            .catch(err => {
                resultDiv.innerHTML += `<p style="color:red;">Ошибка при проверке баланса: ${err}</p>`;
            });
    }

    // Перехват функции генерации адреса из оригинального репозитория
    const originalGenerate = window.generateVanityAddress;

    if (originalGenerate) {
        window.generateVanityAddress = function() {
            const result = originalGenerate.apply(this, arguments);
            if (result && result.address) {
                checkBalance(result.address);
            }
            return result;
        };
    } else {
        console.warn('Не удалось найти функцию generateVanityAddress. Баланс не будет проверяться автоматически.');
    }
})();
