import expect from "must";

import {append, create, toArray} from "./linkedlist";

describe.only("linked list", () => {

  it("can create a list", () => {
    const list1 = create();
    const list2 = create();

    expect(list1).to.eql(list2);
  });

  it("can export an empty list into an empty array", () => {
    const list1 = create();
    expect(toArray(list1)).to.eql([]);
  });

  it("can append an element to a list", () => {
    const list1 = create();
    const list2 = append(list1, 0);
    expect(toArray(list2)).to.eql([0]);
  });

});
