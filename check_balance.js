// check_balance.js
(function() {
    function checkBalance(address) {
        const resultDiv = document.getElementById('result');
        if (!address || address.length < 26) return;

        const apiUrl = `https://blockstream.info/api/address/${address}`;

        fetch(apiUrl)
            .then(res => res.json())
            .then(data => {
                const confirmed = data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum;
                const unconfirmed = data.mempool_stats.funded_txo_sum - data.mempool_stats.spent_txo_sum;
                const html = `<p><strong>Баланс:</strong> ${confirmed/1e8} BTC (подтвержденные), ${unconfirmed/1e8} BTC (неподтвержденные)</p>`;
                resultDiv.innerHTML += html;
            })
            .catch(err => {
                resultDiv.innerHTML += `<p style="color:red;">Ошибка при проверке баланса: ${err}</p>`;
            });
    }

    // Отслеживаем добавление нового адреса в #result
    const resultDiv = document.getElementById('result');
    if (!resultDiv) return;

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) { // element
                    const addrMatch = node.textContent.match(/([13][a-km-zA-HJ-NP-Z1-9]{25,34})/);
                    if (addrMatch) {
                        checkBalance(addrMatch[1]);
                    }
                }
            });
        });
    });

    observer.observe(resultDiv, { childList: true, subtree: true });
})();
