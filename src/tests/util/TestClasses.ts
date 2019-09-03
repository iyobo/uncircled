import {LeafClassNode, ParentClassNode} from '../../index';

export class BadParentClass {
    cow='moo';
    childStore: BadLeafClass;

    constructor() {
        this.childStore = new BadLeafClass(this);
    }
}

export class GoodParentClass extends ParentClassNode {
    foo='bar';
    childStore: GoodLeafClass;

    constructor() {
        super();
        this.childStore = new GoodLeafClass(this);
    }
}


export class BadLeafClass extends LeafClassNode {
    ab = 'wonton';
    cd = 'faro';
    parent: any;
    constructor(parentNode: any) {
        super();
        this.parent = parentNode;
    }
}

export class GoodLeafClass extends LeafClassNode {
    ab = 'wonton';
    cd = 'faro';
    parent: ParentClassNode;
    constructor(parentNode: ParentClassNode) {
        super();
        this.parent = parentNode;
    }
}
