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

  const oldAmount = users[userA.name].debts[userB.name] || 0;
  users[userA.name].debts[userB.name] = oldAmount + amount;
}

export function listDebts(user) {
  if (!user) {
    throw new Error("user not found");
  }

  return user.debts;
}
