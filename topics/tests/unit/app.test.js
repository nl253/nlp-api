"use strict";

const app = require("../../app.js");
const chai = require("chai");
const expect = chai.expect;
const context = {};
const event = require("../../event.json");

describe("test topics lambda endpoint", function() {
  it("verifies successful response", async () => {
    const result = await app.handler(event, context);

    expect(result).to.be.an("object");
    expect(result.statusCode).to.equal(200);
    expect(result.body).to.be.an("string");

    const response = JSON.parse(result.body);

    expect(response).to.be.an("array");
  });
});
