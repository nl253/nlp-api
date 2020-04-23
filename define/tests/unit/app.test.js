"use strict";

const app = require("../../app.js");
const chai = require("chai");
const expect = chai.expect;
const context = {};
const event = require("../../event.json");

describe("test define lambda endpoint", () => {
  it("verifies successful response", async () => {
    const result = await app.handler(event, context);
    expect(result).to.be.an("object");
    expect(result.statusCode).to.equal(200);
    expect(result.body).to.be.an("string");
  });
});
