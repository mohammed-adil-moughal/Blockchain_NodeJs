const Transaction = require("./transaction");
const Wallet = require("./index");

describe("Transaction", () => {
  let transaction, wallet, recepient, amount;

  beforeEach(() => {
    wallet = new Wallet();
    amount = 50;
    recepient = "r3c3p13nt";
    transaction = Transaction.newTransaction(wallet, recepient, amount);
  });

  it("outputs the amount subtracted from wallet balance", () => {
    expect(
      transaction.outputs.find(output => output.address === wallet.publicKey)
        .amount
    ).toEqual(wallet.balance - amount);
  });

  it("outputs the amount added to the recepient", () => {
    expect(
      transaction.outputs.find(output => output.address === recepient).amount
    ).toEqual(amount);
  });

  it("inputs the balance of the wallet", () => {
    expect(transaction.input.amount).toEqual(wallet.balance);
  });

  it("validates a transaction", () => {
    expect(Transaction.verifyTransaction(transaction)).toBe(true);
  });

  it("invalidates a transaction", () => {
    transaction.outputs[0].amount = 50000;
    expect(Transaction.verifyTransaction(transaction)).toBe(false);
  });

  describe("transactions with amount exceeds balance", () => {
    beforeEach(() => {
      amount = 50000;
      transaction = Transaction.newTransaction(wallet, recepient, amount);
    });

    it("does not create the transaction", () => {
      expect(transaction).toEqual(undefined);
    });
  });
});
