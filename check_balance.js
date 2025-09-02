// check_balance.js
// Автоматическая проверка баланса после генерации Vanity-адреса
(function() {
    const resultDiv = document.getElementById('result');
    if (!resultDiv) return;

    // Следим за изменениями в блоке result
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // element node
                        const addr = node.textContent.match(/([13][a-km-zA-HJ-NP-Z1-9]{25,34})/);
                        if (addr) {
                            const address = addr[1];
                            fetch(`https://blockstream.info/api/address/${address}`)
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
                    }
                });
            }
        });
    });

    observer.observe(resultDiv, { childList: true, subtree: true });
})();
