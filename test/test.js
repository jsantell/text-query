var expect = require("chai").expect;
var Query = require("../");

describe("simple query", function () {
  it("ORs queries with spaces", function () {
    var q = new Query("cats dogs fish");
    expect(q.matches("cats rocks dolphin")).to.be.equal(true);
    expect(q.matches("rocks dogs dolphin")).to.be.equal(true);
    expect(q.matches("rocks dogs cats")).to.be.equal(true);
    expect(q.matches("fish rocks")).to.be.equal(true);
    expect(q.matches("rocks dolphin fireworks")).to.be.equal(false);
  });

  it("ORs queries with spaces with double quotes", function () {
    var q = new Query("cats dogs 'fish sticks'");
    expect(q.matches("cats rocks dolphin")).to.be.equal(true);
    expect(q.matches("rocks dogs dolphin")).to.be.equal(true);
    expect(q.matches("rocks fish sticks")).to.be.equal(true);
    expect(q.matches("dogs fish sticks")).to.be.equal(true);
    expect(q.matches("fish rocks")).to.be.equal(false);
    expect(q.matches("meatsticks")).to.be.equal(false);
  });

  it("ANDs queries with commas", function () {
    var q = new Query("cats, dogs, rocks");
    expect(q.matches("cats rocks dolphin")).to.be.equal(false);
    expect(q.matches("rocks dogs dolphin")).to.be.equal(false);
    expect(q.matches("rocks dogs cats")).to.be.equal(true);
    expect(q.matches("rocks volcano dogs cats")).to.be.equal(true);
  });

  it("ANDs queries with commas, allowing children OR operators", function () {
    var q = new Query("cats dogs, beast");
    expect(q.matches("cats rocks dogs dolphin")).to.be.equal(false);
    expect(q.matches("rocks dogs dolphin")).to.be.equal(false);
    expect(q.matches("dogs beast champions")).to.be.equal(true);
    expect(q.matches("beast champions cats")).to.be.equal(true);
  });

  it("ANDs queries with commas, allowing children OR operators with double quotes", function () {
    var q = new Query("cats dogs, \"beast wars\", cupcakes");
    expect(q.matches("cats cupcakes-beast wars")).to.be.equal(true);
    expect(q.matches("cupcakes-beast wars dogs")).to.be.equal(true);
    expect(q.matches("cats beast cupcake wars")).to.be.equal(false);
    expect(q.matches("beast champions cats")).to.be.equal(false);
  });
});
