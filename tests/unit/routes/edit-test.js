import { module, test } from 'qunit';
import { setupTest } from 'running-tracker/tests/helpers';

module('Unit | Route | edit', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:edit');
    assert.ok(route);
  });
});
