export interface IClassNode {

}

export abstract class ParentClassNode extends ClassNode {
    // toJSON() {
    //     const obj= {};
    //     const keys = Object.keys(this);
    //
    //     for (const key of keys) {
    //         obj[key] = this[key];
    //     }
    //
    //     return JSON.stringify(obj);
    // }
}

/**
 * A leaf node should not serialize it's parent
 */
export abstract class LeafClassNode extends ClassNode {

    toJSON() {
        const obj= {};
        const keys = Object.keys(this);

        for (const key of keys) {
            const member = this[key];

            // Leaf node should not serialize its parent
            if(member instanceof ParentClassNode) {
                continue;
            }

            obj[key] = this[key];
        }

        return JSON.stringify(obj);
    }
}
