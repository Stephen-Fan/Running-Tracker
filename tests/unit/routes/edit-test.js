import { module, test } from 'qunit';
import { setupTest } from 'project-2-20245117/tests/helpers';

module('Unit | Route | edit', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:edit');
    assert.ok(route);
  });
});
