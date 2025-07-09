import { module, test } from 'qunit';
import { setupTest } from 'running-tracker/tests/helpers';

module('Unit | Controller | calendar', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    let controller = this.owner.lookup('controller:calendar');
    assert.ok(controller);
  });
});
