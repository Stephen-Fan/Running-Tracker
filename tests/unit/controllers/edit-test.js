import { module, test } from 'qunit';
import { setupTest } from 'project-2-20245117/tests/helpers';

module('Unit | Controller | edit', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    let controller = this.owner.lookup('controller:edit');
    assert.ok(controller);
  });
});
