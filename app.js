"use strict";

const accountOne = {
  fullname: "Martin Krato",
  transfers: [50000, 2500, -18000, 300, 4400, -5000],
  currency: "CZK",
  locale: "cs",
  password: 1234,
  transfer_dates: [
    "2023-01-20T14:01:16Z",
    "2023-09-25T08:52:27Z",
    "2023-09-08T08:26:07Z",
    "2023-07-25T11:31:07Z",
    "2023-04-06T07:50:42Z",
    "2023-05-22T08:09:11Z",
  ],
};
const accountTwo = {
  fullname: "Susan Boyle",
  transfers: [3000, 100, -700, 150, -69, 333, -10],
  currency: "GBP",
  locale: "en-GB",
  password: "beckham",
  transfer_dates: [
    "2023-02-21T13:47:47Z",
    "2023-04-27T07:38:27Z",
    "2023-08-15T07:44:34Z",
    "2023-07-30T06:32:09Z",
    "2023-02-18T14:47:52Z",
    "2023-05-22T11:33:17Z",
    "2023-08-10T08:15:43Z",
  ],
};
const accountThree = {
  fullname: "David Smith",
  transfers: [6000, 1300, -2200, 277, 70, -870, 3000],
  currency: "USD",
  locale: "en-US",
  password: 1337,
  transfer_dates: [
    "2023-08-09T09:03:27Z",
    "2023-07-14T14:07:02Z",
    "2023-03-23T07:17:57Z",
    "2023-07-09T11:44:18Z",
    "2023-06-10T15:47:48Z",
    "2023-09-06T08:00:32Z",
    "2023-06-29T07:27:00Z",
  ],
};

const ALL_ACCOUNTS = [accountOne, accountTwo, accountThree];

const storagedAccounts = sessionStorage.setItem(
  "ALL_ACCOUNTS",
  JSON.stringify(ALL_ACCOUNTS)
);

const entireAppSegment = document.querySelector(".app");

const loginUsername = document.querySelector(".login__input--username");
const loginPasscode = document.querySelector(".login__input--passcode");
const loginFormSubmit = document.querySelector(".login__segment");
const loginWarning = document.querySelector(".login__warning");

const welcomeUserText = document.querySelector(".balance__welcome--user");
const currentBalance = document.querySelector(".current_balance--value");

const navbar = document.querySelector(".nav__segment");

const logoutButton = document.querySelector(".logout__button");

const transferSegment = document.querySelector(".transfers__segment");
const totalIncoming = document.querySelector(".transfer__total--incoming");
const totalOutgoing = document.querySelector(".transfer__total--outgoings");

const loanForm = document.querySelector(".form__loan");
const loanInput = document.querySelector("#loan");

const transferForm = document.querySelector(".form__transfer");
const transferAmountInput = document.querySelector("#transfer");
const transferAccountInput = document.querySelector("#account");

const cancelAccountForm = document.querySelector(".form__cancel");
const cancelInputUsername = document.querySelector("#cancel");
const cancelInputPassword = document.querySelector("#password");

const countdownText = document.querySelector(".timeout");

const modalWindow = document.querySelector(".modal__window");
const modalWindowClose = document.querySelector(".modal__close");

let currentUser, timer;

const createUsernames = (accounts) => {
  accounts.forEach(
    (acc) =>
      (acc.username = acc.fullname
        .split(" ")
        .reduce((acc, cur) => acc[0] + cur[0])
        .toLowerCase())
  );
};

createUsernames(ALL_ACCOUNTS);

const updateInterface = (account) => {
  // Updating interface after clicking
  balance(account);

  displayAccountBalance(account);

  displayTransfers(account);
};

const formatDate = (date, locale) => {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  }).format(date);
};

const formatCurrency = (value, locale, currency) => {
  return new Intl.NumberFormat(locale, {
    currency: currency,
    style: "currency",
  }).format(value);
};

const toggleFormVisibilityAndText = (text, vis, dis) => {
  loginWarning.textContent = text;
  loginWarning.style.opacity = vis;
  loginFormSubmit.style.display = dis;
};

const toggleAppSegment = (vis) => {
  entireAppSegment.style.opacity = vis;
};

const balance = (account) => {
  account.balance = account.transfers.reduce((acc, trans) => acc + trans, 0);
  currentBalance.textContent = formatCurrency(
    account.balance,
    account.locale,
    account.currency
  );
};

const displayAccountBalance = (account) => {
  const incomings = account.transfers
    .filter((t) => t > 0)
    .reduce((acc, cur) => acc + cur, 0);

  totalIncoming.textContent = `+${formatCurrency(
    incomings,
    account.locale,
    account.currency
  )}`;

  const outgoings = account.transfers
    .filter((t) => t < 0)
    .reduce((acc, cur) => acc + cur, 0);
  totalOutgoing.textContent = `-${formatCurrency(
    outgoings,
    account.locale,
    account.currency
  )}`;
};

const welcomeUser = (name) => {
  const firstBasis = name.fullname.split(" ")[0];
  welcomeUserText.textContent = `Welcome Back, ${firstBasis}!`;
};

const displayTransfers = (account, sort = false) => {
  transferSegment.innerHTML = "";

  const sorting = sort
    ? account.transfers.sort((a, b) => a - b)
    : account.transfers;

  sorting.forEach((t, i) => {
    const transferType = t > 0 ? "incoming" : "outgoing";
    const dates = new Date(account.transfer_dates[i]);
    const formatDates = formatDate(dates, account.locale);
    const transferCurrencyFormat = formatCurrency(
      t,
      account.locale,
      account.currency
    );

    const transferRow = `
    <div class="transfers__row transfer__row--border-bottom">
            <div class="transfers__type_date">
              <div class="transfer_type transfer__type--${transferType}">
                <p><span>${i + 1}</span>${transferType}</p>
              </div>
              <p class="transfer__date">${formatDates}</p>
            </div>
            <div class="transfer__amount">
              <span class="transfer__amount--value">${transferCurrencyFormat}</span>
            </div>
          </div>`;

    transferSegment.insertAdjacentHTML("afterbegin", transferRow);
  });
};

welcomeUser(ALL_ACCOUNTS[0]);

loginFormSubmit.addEventListener("submit", (e) => {
  e.preventDefault();

  const usernameValue = loginUsername.value;
  const passwordValue = loginPasscode.value;

  currentUser = ALL_ACCOUNTS.find((n) => n.username === usernameValue);

  if (
    currentUser &&
    usernameValue !== "" &&
    passwordValue !== "" &&
    currentUser.password.toString() === passwordValue
  ) {
    toggleAppSegment("1");
    loginFormSubmit.style.display = "none";
    loginUsername.value = loginPasscode.value = "";
    logoutButton.style.display = "block";
    if (logoutButton.style.display === "block") {
      navbar.style.justifyContent = "space-around";
    }
    welcomeUser(currentUser);
    updateInterface(currentUser);
  } else {
    toggleFormVisibilityAndText("!Wrong Username or Password!", "1", null);
    return false;
  }

  if (timer) clearInterval(timer);
  timer = countdownTimer();
});

function countdownTimer() {
  const countdown = () => {
    const minutes = Math.floor(time / 60);
    const seconds = time - minutes * 60;

    countdownText.textContent = `You will be logged out in: ${
      minutes < 10 ? `0${minutes}` : `${minutes}`
    } : ${seconds < 10 ? `0${seconds}` : `${seconds}`}`;

    if (time < 10) {
      countdownText.style.color = "rgb(155, 35, 53)";
    }

    if (time === 0) {
      clearInterval(timer);
      logOutUser();
    }

    time--;
  };

  let time = 300;

  countdown();

  const timer = setInterval(countdown, 1000);
  return timer;
}

const logOutUser = () => {
  toggleAppSegment(0);
  loginFormSubmit.style.display = "flex";
  logoutButton.style.display = "none";
  updateInterface(currentUser);
  clearInterval(timer);
  toggleFormVisibilityAndText(null);
};

loanForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const loanValue = +loanInput.value;

  if (loanValue > 0 && currentUser) {
    setTimeout(() => {
      currentUser.transfers.push(loanValue);
      currentUser.transfer_dates.push(new Date().toISOString());

      updateInterface(currentUser);

      clearInterval(timer);
      timer = countdownTimer();
    }, 1500);
  }
  loanInput.value = "";
});

transferForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const usernameValue = transferAccountInput.value;
  const amountValue = +transferAmountInput.value;

  const receiverAccount = ALL_ACCOUNTS.find(
    (acc) => acc.username === usernameValue
  );

  if (
    amountValue > 0 &&
    amountValue !== null &&
    amountValue <= currentUser.balance &&
    receiverAccount &&
    receiverAccount !== currentBalance.username
  ) {
    setTimeout(() => {
      currentUser.transfers.push(-amountValue);
      receiverAccount.transfers.push(amountValue);
      currentUser.transfer_dates.push(new Date().toISOString());
      receiverAccount.transfer_dates.push(new Date().toISOString());

      updateInterface(currentUser);
      clearInterval(timer);
      timer = countdownTimer();
    }, 1500);
  } else {
  }
  transferAccountInput.value = transferAmountInput.value = "";
});

cancelAccountForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const usernameValue = cancelInputUsername.value;
  const passwordValue = cancelInputPassword.value;

  if (
    currentUser.username === usernameValue &&
    currentUser.password.toString() === passwordValue
  ) {
    const index = ALL_ACCOUNTS.findIndex(
      (account) => account.username === usernameValue
    );
    ALL_ACCOUNTS.splice(index, 1);

    logOutUser();
  }
});

logoutButton.addEventListener("click", logOutUser);
