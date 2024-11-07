let transactions = [];
let balance = 0;
let editingIndex = -1;

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
    transactions.forEach((transaction, index) => {
        const div = document.createElement('div');
        div.className = `transaction ${transaction.type}`;
        div.textContent = `${transaction.description}: $${transaction.amount.toFixed(2)}`;
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.onclick = () => editTransaction(index);
        div.appendChild(editButton);
        transactionsDiv.appendChild(div);
    });
}

function editTransaction(index) {
    const transaction = transactions[index];
    document.getElementById('edit-description').value = transaction.description;
    document.getElementById('edit-amount').value = Math.abs(transaction.amount);
    document.getElementById('edit-type').value = transaction.type;
    document.getElementById('edit-form').style.display = 'block';
    editingIndex = index;
}

function updateTransaction() {
    if (editingIndex !== -1) {
        const description = document.getElementById('edit-description').value;
        const amount = parseFloat(document.getElementById('edit-amount').value);
        const type = document.getElementById('edit-type').value;

        if (description && !isNaN(amount)) {
            transactions[editingIndex] = {
                description: description,
                amount: type === 'income' ? amount : -amount,
                type: type
            };
            updateBalance(transactions[editingIndex].amount - transactions[editingIndex].amount);
            renderTransactions();
            cancelEdit();
        } else {
            alert('Please enter a valid description and amount.');
        }
    }
}

function cancelEdit() {
    document.getElementById('edit-form').style.display = 'none';
    editingIndex = -1;
}

function clearForm() {
    document.getElementById('description').value = '';
    document.getElementById('amount').value = '';
}

// Initial render
renderTransactions();
