let transactions = [];
let balance = 0;
let editingIndex = -1;
let weeklyExpenses = 0;
let weeklyIncome = 0;

function saveToLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
    localStorage.setItem('balance', balance);
    localStorage.setItem('weeklyExpenses', weeklyExpenses);
    localStorage.setItem('weeklyIncome', weeklyIncome);
}

function loadFromLocalStorage() {
    const storedTransactions = localStorage.getItem('transactions');
    const storedBalance = localStorage.getItem('balance');
    const storedWeeklyExpenses = localStorage.getItem('weeklyExpenses');
    const storedWeeklyIncome = localStorage.getItem('weeklyIncome');
    if (storedTransactions) {
        transactions = JSON.parse(storedTransactions);
        balance = parseFloat(storedBalance) || 0;
        weeklyExpenses = parseFloat(storedWeeklyExpenses) || 0;
        weeklyIncome = parseFloat(storedWeeklyIncome) || 0;
        document.getElementById('balance-amount').textContent = balance.toFixed(2);
        renderTransactions();
        renderWeeklyOverview();
    }
}

function addTransaction() {
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const date = new Date();

    if (description && !isNaN(amount)) {
        const transaction = {
            description: description,
            amount: category === 'income' ? amount : -amount,
            category: category,
            date: date
        };

        transactions.push(transaction);
        updateBalance(transaction.amount);
        if (category === 'income') {
            updateWeeklyIncome(amount);
        } else {
            updateWeeklyExpenses(Math.abs(transaction.amount));
        }
        renderTransactions();
        renderWeeklyOverview();
        clearForm();
        saveToLocalStorage();
    } else {
        alert('Please enter a valid description and amount.');
    }
}

function updateBalance(amount) {
    balance += amount;
    document.getElementById('balance-amount').textContent = balance.toFixed(2);
}

function updateWeeklyExpenses(amount) {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));

    if (transactions.some(t => t.category !== 'income' && t.date >= startOfWeek && t.date <= endOfWeek)) {
        weeklyExpenses += amount;
    } else {
        weeklyExpenses = amount;
    }
}

function updateWeeklyIncome(amount) {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));

    if (transactions.some(t => t.category === 'income' && t.date >= startOfWeek && t.date <= endOfWeek)) {
        weeklyIncome += amount;
    } else {
        weeklyIncome = amount;
    }
}

function renderTransactions() {
    const transactionsDiv = document.getElementById('transactions');
    transactionsDiv.innerHTML = '';
    transactions.forEach((transaction, index) => {
        const div = document.createElement('div');
        div.className = `transaction ${transaction.category === 'income' ? 'income' : 'expense'}`;
        const transactionInfo = document.createElement('div');
        transactionInfo.className = 'transaction-info';
        transactionInfo.textContent = `${transaction.description}: $${transaction.amount.toFixed(2)} - ${transaction.category}`;
        div.appendChild(transactionInfo);
        const buttons = document.createElement('div');
        buttons.className = 'buttons';
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = 'edit-button';
        editButton.onclick = () => editTransaction(index);
        buttons.appendChild(editButton);
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-button';
        deleteButton.onclick = () => deleteTransaction(index);
        buttons.appendChild(deleteButton);
        div.appendChild(buttons);
        transactionsDiv.appendChild(div);
    });
}

function editTransaction(index) {
    const transaction = transactions[index];
    document.getElementById('edit-description').value = transaction.description;
    document.getElementById('edit-amount').value = Math.abs(transaction.amount);
    document.getElementById('edit-category').value = transaction.category;
    document.getElementById('edit-form').style.display = 'block';
    editingIndex = index;
}

function updateTransaction() {
    if (editingIndex !== -1) {
        const description = document.getElementById('edit-description').value;
        const amount = parseFloat(document.getElementById('edit-amount').value);
        const category = document.getElementById('edit-category').value;

        if (description && !isNaN(amount)) {
            const oldAmount = transactions[editingIndex].amount;
            transactions[editingIndex] = {
                description: description,
                amount: category === 'income' ? amount : -amount,
                category: category,
                date: transactions[editingIndex].date
            };
            updateBalance(transactions[editingIndex].amount - oldAmount);
            if (transactions[editingIndex].category === 'income') {
                updateWeeklyIncome(amount - oldAmount);
            } else {
                updateWeeklyExpenses(Math.abs(amount) - Math.abs(oldAmount));
            }
            renderTransactions();
            renderWeeklyOverview();
            cancelEdit();
            saveToLocalStorage();
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

function renderWeeklyOverview() {
    const weeklyExpensesDiv = document.getElementById('weekly-expenses');
    const weeklyIncomeDiv = document.getElementById('weekly-income');
    weeklyExpensesDiv.innerHTML = '';
    weeklyIncomeDiv.innerHTML = '';

    const weeklyExpensesOverview = document.createElement('p');
    weeklyExpensesOverview.textContent = `Total Expenses this Week: $${weeklyExpenses.toFixed(2)}`;
    weeklyExpensesDiv.appendChild(weeklyExpensesOverview);

    const weeklyIncomeOverview = document.createElement('p');
    weeklyIncomeOverview.textContent = `Total Income this Week: $${weeklyIncome.toFixed(2)}`;
    weeklyIncomeDiv.appendChild(weeklyIncomeOverview);
}

function deleteTransaction(index) {
    const transaction = transactions[index];
    if (transaction.category === 'income') {
        updateWeeklyIncome(-transaction.amount);
    } else {
        updateWeeklyExpenses(-Math.abs(transaction.amount));
    }
    updateBalance(-transaction.amount);
    transactions.splice(index, 1);
    renderTransactions();
    renderWeeklyOverview();
    saveToLocalStorage();
}

function resetWeeklyExpenses() {
    weeklyExpenses = 0;
    weeklyIncome = 0;
    renderWeeklyOverview();
    saveToLocalStorage();
}

// Initial render
loadFromLocalStorage();
renderTransactions();
renderWeeklyOverview();
