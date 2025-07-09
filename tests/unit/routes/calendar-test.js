import { module, test } from 'qunit';
import { setupTest } from 'running-tracker/tests/helpers';

module('Unit | Route | calendar', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:calendar');
    assert.ok(route);
  });
});
