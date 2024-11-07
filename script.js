let transactions = [];
let balance = 0;

function addTransaction() {
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('type').value;

    if (description && !isNaN(amount)) {
        const transaction = {
            description: description,
            amount: type === 'income' ? amount : -amount,
            type: type
        };

        transactions.push(transaction);
        updateBalance(transaction.amount);
        renderTransactions();
        clearForm();
    } else {
        alert('Please enter a valid description and amount.');
    }
}

function updateBalance(amount) {
    balance += amount;
    document.getElementById('balance-amount').textContent = balance.toFixed(2);
}

function renderTransactions() {
    const transactionsDiv = document.getElementById('transactions');
    transactionsDiv.innerHTML = '';
    transactions.forEach(transaction => {
        const div = document.createElement('div');
        div.className = `transaction ${transaction.type}`;
        div.textContent = `${transaction.description}: $${transaction.amount.toFixed(2)}`;
        transactionsDiv.appendChild(div);
    });
}

function clearForm() {
    document.getElementById('description').value = '';
    document.getElementById('amount').value = '';
}

// Initial render
renderTransactions();
