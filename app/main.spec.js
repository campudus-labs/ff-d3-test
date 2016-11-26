import expect from "must";
import {addDebt, createUser, getBalance, listAllDebts, listDebts, listUsers, resetUsers, simplifyDebts} from "./main";

describe("debt app", () => {

  afterEach(() => {
    resetUsers();
  });

  it("can create new users", () => {
    expect(() => createUser()).not.to.throw();
  });

  it("creates a new user with a name", () => {
    const user = createUser();
    expect(user).to.be.an.object();
    expect(user).to.own("name");
  });

  it("will not create the same user twice", () => {
    const user1 = createUser();
    const user2 = createUser();
    expect(user1.name).not.to.eql(user2.name);
  });

  it("can create a user with a name", () => {
    const user = createUser("tester");
    expect(user.name).to.eql("tester");
  });

  it("does not allow the same name twice", () => {
    createUser("tester");
    expect(() => createUser("tester")).to.throw(/.*username.*taken/i);
  });

  it("can list the initially empty list of users", () => {
    expect(() => listUsers()).not.to.throw();
    expect(listUsers()).to.eql([]);
  });

  it("can reset the users", () => {
    expect(() => resetUsers()).not.to.throw();
  });

  it("can list the current users (one for each createUser call)", () => {
    expect(listUsers().length).to.be(0);
    createUser();
    expect(listUsers().length).to.be(1);
    createUser();
    expect(listUsers().length).to.be(2);
  });

  describe("debts", () => {

    it("may let user1 owe user2 money", () => {
      const user1 = createUser();
      const user2 = createUser();

      expect(() => addDebt(user1, 10, user2)).not.to.throw();
    });

    it("cannot let a user owe themselves", () => {
      const user1 = createUser();
      expect(() => addDebt(user1, 10, user1)).to.throw(/.*owe.*itself.*/i);
    });

    it("needs a user to show their debt", () => {
      expect(() => listDebts()).to.throw(/.*user.*/i);
    });

    it("shows no debts if it has none", () => {
      const user1 = createUser();
      expect(listDebts(user1)).to.eql({});
    });

    it("shows debts if it has some", () => {
      const user1 = createUser();
      const user2 = createUser();

      addDebt(user1, 10, user2);

      expect(Object.keys(listDebts(user1)).length).to.eql(1);
      expect(listDebts(user1)).to.eql({[user2.name]: 10});
      expect(listDebts(user2)).to.eql({[user1.name]: -10});
    });

    it("sums the amounts of debt per user", () => {
      const user1 = createUser();
      const user2 = createUser();

      addDebt(user1, 7, user2);
      addDebt(user1, 13, user2);

      expect(Object.keys(listDebts(user1)).length).to.eql(1);
      expect(listDebts(user1)).to.eql({[user2.name]: 20});
      expect(listDebts(user2)).to.eql({[user1.name]: -20});
    });

    it("user a owes user b. user b owes user a -> changes debt", () => {
      const userA = createUser();
      const userB = createUser();

      addDebt(userA, 40, userB);
      addDebt(userB, 30, userA);

      expect(listDebts(userA)).to.eql({[userB.name]: 10});
      expect(listDebts(userB)).to.eql({[userA.name]: -10});
    });

    it("user b can owe user a more. user b owes user a -> changes debt", () => {
      const userA = createUser();
      const userB = createUser();

      addDebt(userA, 40, userB);
      addDebt(userB, 50, userA);

      expect(listDebts(userA)).to.eql({[userB.name]: -10});
      expect(listDebts(userB)).to.eql({[userA.name]: 10});
    });

    it("show balance of a user", () => {
      const userA = createUser();
      const userB = createUser();
      const userC = createUser();

      addDebt(userA, 40, userB);
      addDebt(userB, 50, userA);
      addDebt(userB, 25, userA);
      addDebt(userC, 15, userA);

      expect(getBalance(userB)).to.eql(35);
      expect(getBalance(userA)).to.eql(-50);
      expect(getBalance(userC)).to.eql(15);
    });

    it("show all debts of all users", () => {
      const userA = createUser();
      const userB = createUser();
      const userC = createUser();

      addDebt(userA, 10, userB);
      addDebt(userA, 20, userC);
      addDebt(userB, 20, userC);

      const expectedDebtObject = {
        [userA.name]: [
          {
            to: userB,
            amount: 10
          },
          {
            to: userC,
            amount: 20
          }
        ],
        [userB.name]: [
          {
            to: userC,
            amount: 20
          }
        ],
        [userC.name]: []
      };

      expect(listAllDebts()).to.eql(expectedDebtObject);
    });

    it("shows all users without debts in the beginning", () => {
      const userA = createUser();
      const userB = createUser();
      const userC = createUser();

      expect(listAllDebts()).to.eql({
        [userA.name]: [],
        [userB.name]: [],
        [userC.name]: []
      });
    });

    it("can resolve cycles", () => {
      const userA = createUser();
      const userB = createUser();
      const userC = createUser();

      addDebt(userA, 10, userB);
      addDebt(userB, 10, userC);
      addDebt(userC, 10, userA);

      expect(getBalance(userA)).to.eql(0);
      expect(getBalance(userB)).to.eql(0);
      expect(getBalance(userC)).to.eql(0);

      simplifyDebts();

      expect(listAllDebts()).to.eql({
        [userA.name]: [],
        [userB.name]: [],
        [userC.name]: []
      });
    });

    it("can resolve more difficult cycles", () => {
      const userA = createUser();
      const userB = createUser();
      const userC = createUser();

      addDebt(userA, 10, userB);
      addDebt(userB, 20, userC);
      addDebt(userC, 30, userA);

      expect(getBalance(userA)).to.eql(-20);
      expect(getBalance(userB)).to.eql(10);
      expect(getBalance(userC)).to.eql(10);

      simplifyDebts();

      expect(listAllDebts()).to.eql({
        [userA.name]: [],
        [userB.name]: [
          {
            to: userA,
            amount: 10
          }
        ],
        [userC.name]: [
          {
            to: userA,
            amount: 10
          }
        ]
      });
    });

  });

});
