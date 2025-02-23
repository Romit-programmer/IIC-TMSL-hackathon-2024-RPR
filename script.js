document.addEventListener('DOMContentLoaded', function() {
  // Theme switcher functionality
  function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    // Set initial theme from localStorage or default to 'light'
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    console.log('Initial theme:', currentTheme); // Debug log

    themeToggle.addEventListener('click', function() {
      // Toggle theme
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';

      // Apply new theme
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      console.log('Theme switched to:', newTheme); // Debug log

      // Update charts if they exist
      updateChartsTheme(newTheme);
    });
  }

  // Function to update chart themes
  function updateChartsTheme(theme) {
    const charts = document.querySelectorAll('canvas');
    charts.forEach(canvas => {
      try {
        const chart = Chart.getChart(canvas);
        if (chart) {
          chart.options.plugins.legend.labels.color = theme === 'dark' ? '#ffffff' : '#333333';
          chart.update();
        }
      } catch (error) {
        console.log('Chart update skipped:', error);
      }
    });
  }

  // Initialize theme
  initializeTheme();
});

document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signup-form');
  const signupButton = document.getElementById('signup-button');
  const loginForm = document.getElementById('login-form');
  const addExpenseButton = document.getElementById('add-expense-button');
  const places = document.querySelectorAll('.place');
  let currentPlaceIndex = 0;

  // Redirect to signup page
  if (signupButton) {
    signupButton.addEventListener('click', () => {
      window.location.href = 'signup.html';
    });
  }

  // Redirect to add expense page
  if (addExpenseButton) {
    addExpenseButton.addEventListener('click', () => {
      window.location.href = 'add-expense.html';
    });
  }

  // Check if user is logged in
  function isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  // Prompt login if not authenticated
  function requireAuth(callback) {
    if (!isLoggedIn()) {
      alert('Please log in to access this feature.');
      console.log('User not logged in, redirecting to login page.');
      window.location.href = 'login.html';
    } else {
      console.log('User is logged in, proceeding to callback.');
      callback();
    }
  }

  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('signup-email').value;
      const password = document.getElementById('signup-password').value;
      const name = document.getElementById('signup-name').value;
      const occupation = document.getElementById('signup-occupation').value;
      const gender = document.getElementById('signup-gender').value;

      const userData = {
        email,
        password,
        name,
        occupation,
        gender
      };

      localStorage.setItem('user', JSON.stringify(userData));
      window.location.href = 'index.html';
    });
  }

  const expenseList = document.getElementById('expense-list');
  const expenseChartCtx = document.getElementById('expense-chart')?.getContext('2d');

  // Function to update expense list
  function updateExpenseList() {
    if (expenseList) {
      expenseList.innerHTML = '';
      expenses.forEach((expense) => {
        const li = document.createElement('li');
        li.textContent = `${expense.expenseDate} - ${expense.expenseCategory}: ₹${expense.moneySpent.toFixed(2)}`;
        expenseList.appendChild(li);
      });
    }
  }

  // Function to update expense chart
  function updateExpenseChart() {
    if (expenseChartCtx) {
      const categories = expenses.map(expense => expense.expenseCategory);
      const amounts = expenses.map(expense => expense.moneySpent);

      new Chart(expenseChartCtx, {
        type: 'pie',
        data: {
          labels: categories,
          datasets: [{
            data: amounts,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
          }]
        }
      });
    }
  }

  // New code for add-expense.html
  const expenseForm = document.getElementById('expense-form');
  const expenseTableBody = document.getElementById('expense-table').querySelector('tbody');
  const totalExpenseElement = document.getElementById('total-expense');
  const displayBudgetElement = document.getElementById('display-budget');
  const finishTallyButton = document.getElementById('finish-tally-button');
  const exportPdfButton = document.getElementById('export-pdf-button');
  const expenseCategoryChartCtx = document.getElementById('expense-category-chart').getContext('2d');
  const budgetCoverageChartCtx = document.getElementById('budget-coverage-chart').getContext('2d');
  const budgetExceededElement = document.getElementById('budget-exceeded');
  let totalExpense = 0;
  let expenseCount = 0;
  const expenses =[];

  if (expenseForm) {
    expenseForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const travelPlace = document.getElementById('travel-place').value;
      const moneySpent = parseFloat(document.getElementById('money-spent').value);
      const expenseDate = document.getElementById('expense-date').value;
      const expenseCategory = document.getElementById('expense-category').value;
      const budget = parseFloat(document.getElementById('budget').value);

      const expense = { travelPlace, moneySpent, expenseDate, expenseCategory };
      expenses.push(expense);
      addExpenseToTable(expense);
      totalExpense += moneySpent;
      totalExpenseElement.textContent = totalExpense.toFixed(2);
      displayBudgetElement.textContent = budget.toFixed(2);

      resetForm();
    });
  }

  function addExpenseToTable(expense) {
    expenseCount++;
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${expenseCount}</td>
      <td>${expense.travelPlace}</td>
      <td>₹${expense.moneySpent.toFixed(2)}</td>
      <td>${expense.expenseDate}</td>
      <td>${expense.expenseCategory}</td>
    `;
    expenseTableBody.appendChild(row);
  }

  function resetForm() {
    const budgetValue = document.getElementById('budget').value; // Store the budget value
    expenseForm.reset();
    document.getElementById('budget').value = budgetValue; // Restore the budget value
  }

  if (finishTallyButton) {
    finishTallyButton.addEventListener('click', () => {
      const budget = parseFloat(document.getElementById('budget').value);
      if (totalExpense > budget) {
        budgetExceededElement.style.display = 'block';
        document.getElementById('budget-coverage-chart').style.display = 'none';
      } else {
        budgetExceededElement.style.display = 'none';
        document.getElementById('budget-coverage-chart').style.display = 'block';
        generateCharts();
      }
    });
  }

  function generateCharts() {
    const categories = expenses.map(expense => expense.expenseCategory);
    const amounts = expenses.map(expense => expense.moneySpent);

    new Chart(expenseCategoryChartCtx, {
      type: 'pie',
      data: {
        labels: categories,
        datasets: [{
          data: amounts,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
        }]
      }
    });

    const budget = parseFloat(document.getElementById('budget').value);
    new Chart(budgetCoverageChartCtx, {
      type: 'pie',
      data: {
        labels: ['Total Expense', 'Remaining Budget'],
        datasets: [{
          data: [totalExpense, budget - totalExpense],
          backgroundColor: ['#FF6384', '#36A2EB']
        }]
      }
    });
  }

  if (exportPdfButton) {
    exportPdfButton.addEventListener('click', () => {
      console.log('Export to PDF button clicked');
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      // Add "By TripTracker" title
      doc.setFontSize(22);
      doc.setTextColor(0, 102, 204); // Set color to a shade of blue
      doc.text('By TripTracker', 105, 20, null, null, 'center'); // Centered text

      // Check if user details elements exist
      const userNameElement = document.getElementById('user-name');
      const userEmailElement = document.getElementById('user-email');
      const userOccupationElement = document.getElementById('user-occupation');
      const userGenderElement = document.getElementById('user-gender');

      if (userNameElement && userEmailElement && userOccupationElement && userGenderElement) {
        // Capture user details with better formatting
        const userDetails = `
          Name: ${userNameElement.textContent}
          Email: ${userEmailElement.textContent}
          Occupation: ${userOccupationElement.textContent}
          Gender: ${userGenderElement.textContent}
        `;

        const lines = doc.splitTextToSize(userDetails, 180);
        doc.text(lines, 10, 10);
      } else {
        console.error('User details elements not found');
      }

      // Capture table
      html2canvas(document.querySelector('#expense-table')).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        doc.addImage(imgData, 'PNG', 10, 40, 190, 60);

        // Capture charts
        html2canvas(document.querySelector('#charts-container')).then(canvas => {
          const imgData = canvas.toDataURL('image/png');
          doc.addPage();
          doc.addImage(imgData, 'PNG', 10, 10, 190, 100);

          // Save the PDF
          doc.save('expense_report.pdf'); // This line triggers the download
          console.log('PDF saved');
        });
      });
    });
  }
});
