import { module, test } from 'qunit';
import { setupRenderingTest } from 'project-2-20245117/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | bar-chart', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<BarChart />`);

    assert.dom().hasText('');

    // Template block usage:
    await render(hbs`
      <BarChart>
        template block text
      </BarChart>
    `);

    assert.dom().hasText('template block text');
  });
});
