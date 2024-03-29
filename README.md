# UnCircled

A simple-yet-powerful library for implementing, serializing and deserializing the root-store pattern.
- Also supports a nested root-store pattern.
- Prevents circular reference/max-stack errors when serializing/deserializing class objects. 
- Great for implementing a mobx root-store tree hydrated over SSR e.g Next.JS
- Built with Typescript.

## Why I built this
I have been looking for the best way to easily use mobx with Next.JS (and server side rendering in general) and I 
kept running into circular reference errors when trying to hydrate my store from server side to client side for SSR.
- I didn't want to switch to `mobx-state-tree` because: 
  - it has performance issues as of the time of this writing, and it doesn't seem like it will be solved.
  - I rather not be forced to follow an opinionated pattern.
  - I prefer the store-tree / root-class pattern from **raw mobx** over the **mst** pattern as it is more cognitive and concise.
- I tried `nextjs-mobx-wrapper` but it does absolutely nothing to handle the serialization and deserialization of your mobx stores (talkless of a store tree pattern) down the wire, so I'm confused as to what that library aimed to achieve.

I seemed to be going around in circles so, as is my tendency, I decided to create a helpful library that **uncircled** myself and my stores. 
Hope it solves your SSR issues as well.

## To install
`npm i uncircled` or `yarn add uncircled`.

## Introduction

Uncircled exports 3 Decorators:
- **Deserializer**: A class Decorator. injects the deserialize function into any class. You want this on your root store as that is where deserialization usually begins.
- **@ParentField**: A field Decorator. Put this in front of a field that links to a parent object. Important for preventing circular errors.
- **@DateField**: A field Decorator. Put this in front of a date field for better marshalling. The date field is the only primitive field not natively supported by the JSON schema. 


## How to Use

Consider these classes...
```typescript
import {DateField, ParentField, Deserializer} from 'uncircled';

@Deserializer
class RootStore {
    foo = 'bar';
    childStore: ChildStore;

    constructor() {
        super();
        this.childStore = new ChildStore(this);
    }

    // For typescript's sake, define an empty deserialize function so it knows 
    // that this function that is injected by @Deserializer exists. Future versions of Typescript will allow for smarter
    // detection of decorator-injected properties. Or you can leave this out and simply @ts-suppress each ts warning about store.deserialize not existing, though that is more messy
    deserialize(rawObject: string | any) {
    }
}

// The following classes need not be in the same file.

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

The Root-store pattern is a declarative tree of classes that each know their parents, contents and children.


### Serializing
Any of the field decorators you use in a class, injects that class with a special `toJSON()` function that eliminates circulars (assuming you used the proper field decorators) which is used by 
javascript to automatically serialize any object or to stringify whwnever you call `JSON.stringify`.

We can take our entire store tree implementation from the root and serialize it for transmission i.e turn to string. 
If you were using this with mobx and SSR, you would do this server side 
```typescript
const str = JSON.stringify(store);
```
`str` is now the string representation of your entire store tree.

### Deserializing

Remember that `@Deserialize` decorator? Well it injected a member function into your root class called `deserialize(stringOrObject)`.
It can accept a json string or a fully json parsed javascript object. Either works!

Assuming you have passed in that `str` from the server to the client, you can do this client-side to hydrate the 
contents of the store.

```typescript
store.deserialize(strFromServer);
```

And that's it!

Now your client-side store has been fully hydrated and all values will be the same as you had them in the server.


