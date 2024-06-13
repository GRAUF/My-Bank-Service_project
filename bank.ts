#! /usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';
import Table from 'cli-table3';

class Account {
  constructor(
    public accountId: string,
    public accountHolder: string,
    private balance: number = 0
  ) {}

  deposit(amount: number) {
    this.balance += amount;
    console.log(chalk.greenBright.bold.italic(`Deposited $${amount} to account ${this.accountId}.`));
  }
  
  withdraw(amount: number) {
    if (amount > this.balance) {
      console.log(chalk.greenBright.bold.italic(`Insufficient funds in account ${this.accountId}.`));
      return;
    }
    this.balance -= amount;
    console.log(chalk.whiteBright.bold.italic(`Withdrew $${amount} from account ${this.accountId}.`));
  }


  getBalance() {
    return this.balance;
  }
}

class Bank {
  private accounts: Account[] = [];

  createAccount(accountId: string, accountHolder: string) {
    const account = new Account(accountId, accountHolder);
    this.accounts.push(account);
    console.log(chalk.greenBright.bold.italic(`Account ${accountId} created successfully for ${accountHolder}!`));
  }

  depositToAccount(accountId: string, amount: number) {
    const account = this.accounts.find(acc => acc.accountId === accountId);
    if (account) {
      account.deposit(amount);
    } else {
      console.log(chalk.green.bold.italic(`Account ${accountId} not found!`));
    }
    //console.log(chalk.greenBright.bold.italic(`Deposited $${amount} to account successfully ${accountId}.`));
  }

  withdrawFromAccount(accountId: string, amount: number) {
    const account = this.accounts.find(acc => acc.accountId === accountId);
    if (account) {
      account.withdraw(amount);
    } else {
      console.log(chalk.blueBright.bold.italic(`Account ${accountId} not found!`));
    }
   // console.log(chalk.whiteBright.bold.italic(`Withdrew $${amount} from account successfully ${accountId}.`));
  }

  checkBalance(accountId: string) {
    const account = this.accounts.find(acc => acc.accountId === accountId);
    if (account) {
      console.log(chalk.greenBright.bold.italic(`Account ${accountId} balance: $${account.getBalance()}`));
    } else {
      console.log(chalk.greenBright.bold.italic(`Account ${accountId} not found!`));
    }
  }

  showAllAccounts() {
    if (this.accounts.length === 0) {
      console.log(chalk.yellow('No accounts found!'));
      return;
    }

    const table = new Table({
      head: ['Account ID', 'Account Holder', 'Balance'],
      colWidths: [20, 20, 20]
    });

    this.accounts.forEach(acc => {
      table.push([acc.accountId, acc.accountHolder, `$${acc.getBalance()}`]);
    });

    console.log(table.toString());
  }
}

const bank = new Bank();

async function mainMenu() {
  const choices = [
    'Create Account',
    'Deposit Money',
    'Withdraw Money',
    'Check Balance',
    'Show All Accounts',
    'Exit'
  ];

  const { action } = await inquirer.prompt({
    name: 'action',
    type: 'list',
    message: 'Choose an action:',
    choices
  });

  switch (action) {
    case 'Create Account':
      await createAccount();
      break;
    case 'Deposit Money':
      await depositMoney();
      break;
    case 'Withdraw Money':
      await withdrawMoney();
      break;
    case 'Check Balance':
      await checkBalance();
      break;
    case 'Show All Accounts':
      bank.showAllAccounts();
      break;
    case 'Exit':
      return;
  }

  await mainMenu();
}

async function createAccount() {
  const { accountId, accountHolder } = await inquirer.prompt([
    { name: 'accountId', type: 'input', message: 'Enter account ID:' },
    { name: 'accountHolder', type: 'input', message: 'Enter account holder name:' },
  ]);

  bank.createAccount(accountId, accountHolder);
}

async function depositMoney() {
  const { accountId, amount } = await inquirer.prompt([
    { name: 'accountId', type: 'input', message: 'Enter account ID:' },
    { name: 'amount', type: 'number', message: 'Enter amount to deposit:' },
  ]);

  bank.depositToAccount(accountId, amount);
}

async function withdrawMoney() {
  const { accountId, amount } = await inquirer.prompt([
    { name: 'accountId', type: 'input', message: 'Enter account ID:' },
    { name: 'amount', type: 'number', message: 'Enter amount to withdraw:' },
  ]);

  bank.withdrawFromAccount(accountId, amount);
}

async function checkBalance() {
  const { accountId } = await inquirer.prompt([
    { name: 'accountId', type: 'input', message: 'Enter account ID:' },
  ]);

  bank.checkBalance(accountId);
}

mainMenu().then(() => console.log(chalk.greenBright('Goodbye!come again my bank!tex free bank!!'))).catch(error => console.error(error));
