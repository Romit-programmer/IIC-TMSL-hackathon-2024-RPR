document.addEventListener('DOMContentLoaded', () => {
  const loginButton = document.getElementById('login-button');
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const viewReportButton = document.getElementById('view-report');
  const prevPlaceButton = document.getElementById('prev-place');
  const nextPlaceButton = document.getElementById('next-place');
  const places = document.querySelectorAll('.place');
  let currentPlaceIndex = 0;

  if (loginButton) {
    loginButton.addEventListener('click', () => {
      window.location.href = 'login.html';
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Perform login validation here
      window.location.href = 'index.html';
    });
  }

  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Perform signup validation here
      window.location.href = 'index.html';
    });
  }

  if (viewReportButton) {
    viewReportButton.addEventListener('click', () => {
      window.location.href = 'past-travels.html';
    });
  }

  if (prevPlaceButton && nextPlaceButton) {
    prevPlaceButton.addEventListener('click', () => {
      showPlace(currentPlaceIndex - 1);
    });

    nextPlaceButton.addEventListener('click', () => {
      showPlace(currentPlaceIndex + 1);
    });
  }

  function showPlace(index) {
    if (index < 0) {
      currentPlaceIndex = places.length - 1;
    } else if (index >= places.length) {
      currentPlaceIndex = 0;
    } else {
      currentPlaceIndex = index;
    }

    places.forEach((place, i) => {
      place.style.transform = `translateX(${(i - currentPlaceIndex) * 100}%)`;
    });
  }

  showPlace(currentPlaceIndex);

  const expenses = [];
  const expenseList = document.getElementById('expense-list');
  const expenseChartCtx = document.getElementById('expense-chart')?.getContext('2d');

  // Function to add expense
  document.getElementById('add-expense')?.addEventListener('click', () => {
    const amount = prompt('Enter amount:');
    const category = prompt('Enter category (e.g., accommodation, food, transportation):');
    const date = prompt('Enter date (YYYY-MM-DD):');

    if (amount && category && date) {
      const expense = { amount: parseFloat(amount), category, date };
      expenses.push(expense);
      updateExpenseList();
      updateExpenseChart();
    }
  });

  // Function to update expense list
  function updateExpenseList() {
    if (expenseList) {
      expenseList.innerHTML = '';
      expenses.forEach((expense) => {
        const li = document.createElement('li');
        li.textContent = `${expense.date} - ${expense.category}: ₹${expense.amount.toFixed(2)}`;
        expenseList.appendChild(li);
      });
    }
  }

  // Function to update expense chart
  function updateExpenseChart() {
    if (expenseChartCtx) {
      const categories = ['Accommodation', 'Food & Drinks', 'Transportation', 'Entertainment & Activities', 'Miscellaneous'];
      const categoryTotals = categories.map(category => {
        return expenses
          .filter(expense => expense.category === category)
          .reduce((sum, expense) => sum + expense.amount, 0);
      });

      new Chart(expenseChartCtx, {
        type: 'pie',
        data: {
          labels: categories,
          datasets: [{
            data: categoryTotals,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
          }]
        }
      });
    }
  }

  // New code for add-expense.html
  const expenseForm = document.getElementById('expense-form');

  if (expenseForm) {
    expenseForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const travelPlace = document.getElementById('travel-place').value;
      const totalMoney = parseFloat(document.getElementById('total-money').value);
      const expenseDate = document.getElementById('expense-date').value;
      const expenseCategory = document.getElementById('expense-category').value;

      const expense = { travelPlace, totalMoney, expenseDate, expenseCategory };
      expenses.push(expense);
      updateExpenseChart();
    });
  }

  // New code for new-trip.html
  const tripForm = document.getElementById('trip-form');

  if (tripForm) {
    tripForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const startingLocation = document.getElementById('starting-location').value;
      const destinationPlace = document.getElementById('destination-place').value;
      const tripStartDate = document.getElementById('trip-start-date').value;
      const tripEndDate = document.getElementById('trip-end-date').value;

      // Transfer data to present travel section
      // Assuming you have elements to display this data in the present travel section
      document.getElementById('present-starting-location').textContent = startingLocation;
      document.getElementById('present-destination-place').textContent = destinationPlace;
      document.getElementById('present-trip-start-date').textContent = tripStartDate;
      document.getElementById('present-trip-end-date').textContent = tripEndDate;
    });
  }

  // New code for trip-details.html
  const urlParams = new URLSearchParams(window.location.search);
  const destination = urlParams.get('destination');
  const destinationNameElement = document.getElementById('destination-name');
  const expenseListElement = document.getElementById('expense-list');
  const totalMoneyElement = document.getElementById('total-money');
  const expenseChartCtxDetails = document.getElementById('expense-chart')?.getContext('2d');

  if (destination) {
    destinationNameElement.textContent = destination;
  }

  // Sample data for expenses
  const tripExpenses = [
    { category: 'Accommodation', amount: 500 },
    { category: 'Food', amount: 200 },
    { category: 'Transportation', amount: 150 },
    { category: 'Miscellaneous', amount: 100 }
  ];

  // Function to update expense list
  function updateTripExpenseList() {
    let totalMoney = 0;
    expenseListElement.innerHTML = '';
    tripExpenses.forEach((expense) => {
      const li = document.createElement('li');
      li.textContent = `${expense.category}: ₹${expense.amount.toFixed(2)}`;
      expenseListElement.appendChild(li);
      totalMoney += expense.amount;
    });
    totalMoneyElement.textContent = `₹${totalMoney.toFixed(2)}`;
  }

  // Function to update expense chart
  function updateTripExpenseChart() {
    if (expenseChartCtxDetails) {
      const categories = tripExpenses.map(expense => expense.category);
      const amounts = tripExpenses.map(expense => expense.amount);

      new Chart(expenseChartCtxDetails, {
        type: 'pie',
        data: {
          labels: categories,
          datasets: [{
            data: amounts,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
          }]
        }
      });
    }
  }

  updateTripExpenseList();
  updateTripExpenseChart();
});
