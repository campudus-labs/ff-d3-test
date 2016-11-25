import expect from "must";
import {addDebt, createUser, listDebts, listUsers, resetUsers} from "./main";

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
    });

    it("sums the amounts of debt", () => {
      const user1 = createUser();
      const user2 = createUser();

      addDebt(user1, 7, user2);
      addDebt(user1, 13, user2);

      expect(Object.keys(listDebts(user1)).length).to.eql(1);
      expect(listDebts(user1)).to.eql({[user2.name]: 20});
    });
  });

});
