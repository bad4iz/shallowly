const assert = require('node:assert/strict');
const React = require('react');
const { shallow } = require('shallowly');

function Child() {
  throw new Error('The child must remain unrendered');
}

function Parent({ label, onSave }) {
  return React.createElement('section', null, React.createElement(Child, { label, onSave }));
}

let saves = 0;
const wrapper = shallow(
  React.createElement(Parent, {
    label: 'Save',
    onSave: () => {
      saves += 1;
    },
  }),
);

assert.equal(wrapper.textInline(), '<section><Child /></section>');
assert.equal(wrapper.find(Child).prop('label'), 'Save');
assert.equal(wrapper.find(Child).exists(), true);
wrapper.find(Child).prop('onSave')();
assert.equal(saves, 1);
assert.equal(wrapper.find('button').exists(), false);

for (const node of ['Loading', '', 0, 42, 42n, null, undefined, false, true]) {
  const scalarWrapper = shallow(node);
  assert.equal(scalarWrapper.render(), node);
  assert.equal(scalarWrapper.textInline(), String(node));
}
console.log(`CommonJS package entry works with React ${React.version}`);
