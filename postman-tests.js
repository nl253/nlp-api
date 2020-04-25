const responseTimeMS = 8000;

pm.test("response should return status 200 (OK)", () => pm.response.to.be.success);

pm.test("response should be okay to process", () => pm.response.to.be.ok);

pm.test("response should be not be error", () => pm.response.to.not.be.error);

pm.test("response should be not be error", () => pm.response.to.not.be.error);


if (pm.request.url.path.join('/').indexOf('define') >= 0) {
  pm.test('response should have application/json content-type headers set', () => {
    return pm.response.to.have.header('Content-Type', 'text/plain');
  });
} else {
  pm.test('response should return JSON', () => pm.response.to.have.jsonBody());
  pm.test('response should have application/json content-type headers set', () => {
    return pm.response.to.have.header('Content-Type', 'application/json');
  });
}

pm.test(`response time is less than ${responseTimeMS}ms`, () => {
  pm.expect(pm.response.responseTime).to.be.below(responseTimeMS);
});

pm.test("response should not be empty", () => {
  return pm.expect(pm.response.text()).to.not.be.empty;
});
