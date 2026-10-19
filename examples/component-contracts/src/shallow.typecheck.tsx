import type { ReactNode } from 'react';
import { shallow } from 'shallowly';

// Compiled by both consumer typecheck commands against the package declarations.
const renderNode: (node: ReactNode) => ReturnType<typeof shallow> = shallow;

renderNode('Loading');
shallow('Loading');
shallow('');
shallow(0);
shallow(42);
shallow(42n);
shallow(null);
shallow(undefined);
shallow(false);
shallow(true);
shallow(<span>Loading</span>);
shallow(['Loading', 0, null, <span key="status" />]);

// @ts-expect-error Arbitrary objects are not React nodes.
shallow({ invalid: true });
// @ts-expect-error Component functions must be passed as elements.
shallow(() => <span />);
// @ts-expect-error Symbols are not React nodes.
shallow(Symbol('invalid'));
