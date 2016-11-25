let userCount = 0;
let users = {};

export function createUser(name = `User${userCount}`) {
  if (!!users[name]) {
    throw new Error(`username ${name} already taken.`);
  }

  userCount++;
  users[name] = {
    name,
    debts: {}
  };
  return users[name];
}

export function listUsers() {
  return Object.keys(users);
}

export function resetUsers() {
  userCount = 0;
  users = {};
}

export function addDebt(userA, amount, userB) {
  if (userA === userB) {
    throw new Error(`${userA.name} cannot owe something to itself`);
  }

  const oldA2B = users[userA.name].debts[userB.name] || 0;
  users[userA.name].debts[userB.name] = oldA2B + amount;

  const oldB2A = users[userB.name].debts[userA.name] || 0;
  users[userB.name].debts[userA.name] = oldB2A - amount;

}

export function listDebts(user) {
  if (!user) {
    throw new Error("user not found");
  }

  return user.debts;
}

export function getBalance(user) {
  return Object.values(user.debts).reduce((balance, amount) => balance + amount, 0);
}

export function listAllDebts() {
  return Object.values(users).reduce((allDebts, user) => {
    allDebts[user.name] = Object.keys(user.debts).reduce((ds, key) => {
      const amount = user.debts[key];
      if (amount > 0) {
        ds.push({
          to: users[key],
          amount
        });
      }
      return ds;
    }, []);
    return allDebts;
  }, {});
}

export function simplifyDebts() {
  Object.keys(users).forEach(name => users[name].debts = []);
}
