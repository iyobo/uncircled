# UnCircled

A simple-yet-powerful library for implementing, serializing and deserializing the root-store pattern.
- Also supports a nested root-store pattern.
- Prevents circular reference/max-stack errors when serializing/deserializing class objects. 
- Great for implementing a mobx root-store tree hydrated over SSR e.g Next.JS
- Built with Typescript.

## To install
`npm i uncircled`

## Introduction

Uncircled exports 3 things: 2 decorators and 1 abstract class.
- **AbstractRootNode**: Abstract class that your root class node should inherit.
- **@ParentField**: Decorator. Put this in front of a field that links to a parent object. Important for preventing circular errors.
- **@DateField**: Decorator. Put this in front of a date field for better marshalling. The date field is the only primitive field not natively supported by the JSON schema. 


## How to Use

Consider this root classes
```$xslt
import {DateField, ParentField, AbstractRootNode} from 'uncircled';

class RootStore extends AbstractRootNode {
    foo = 'bar';
    childStore: ChildStore;

    constructor() {
        super();
        this.childStore = new ChildStore(this);
    }
}

class ChildStore {
    ab = 'wonton';
    @DateField myDate = new Date(1000000);
    @ParentField parent: RootStore;

    child: NestedLeafStore;

    constructor(parentNode: RootStore) {
        this.parent = parentNode;
        this.child = new NestedLeafStore(this);
    }
}

class NestedLeafStore {
    mn = 'Fiery';
    op = 'jutsu';
    @ParentField parent: ChildStore;

    constructor(parentNode: ChildStore) {
        this.parent = parentNode;
    }
}

// initialize the whole store tree.
const store = new RootStore();
```

### Serializing
If you were using this with mobx and SSR, you would do this server side 
```$xslt
const str = JSON.stringify(store);
```
`str` is now the string representation of your entire store tree.

### Deserializing

Assuming you have passed in that `str` from the server to the client, _you can do this client-side_to hydrate the root tree as it existed in the server.
```$xslt
store.deserialize(strFromServer);
```

Now your client-side store has been fully hydrated and all values will be the same as you had them in the server.

The `deserialize(...)` member function is added to your rootnode from inheriting `AbstractRootNode`. 
It can accept a json string or a fully json parsed object. Either works!
