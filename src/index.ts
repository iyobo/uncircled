
function toJSON() {
    const obj = {};
    const keys = Object.keys(this);

    for (const key of keys) {
        const ignoreCodex = this._$$uncircleIgnoredFields || {};
        if (!ignoreCodex[key]) {
            obj[key] = this[key];
        }
    }

    let str = JSON.stringify(obj);
    str = str.replace(/\\/g, '');
    return str;
}

// @ParentField
/*
Marks a class field as a reference to a parent object.
To prevent circles, we ensure this field does not get serialized.
*/
export function ParentField(target: any, propertyName: string) {
    const classDef = target.constructor;
    classDef.prototype._$$uncircleIgnoredFields = classDef.prototype._$$uncircleIgnoredFields || {'_$$uncircleIgnoredFields': 1};
    classDef.prototype._$$uncircleIgnoredFields[propertyName] = 1;

    // overwrite toJSON
    classDef.prototype.toJSON = toJSON;
}

export function DateField(target: any, propertyName: string) {
    const classDef = target.constructor;
    classDef.prototype._$$uncircleDateFields = classDef.prototype._$$uncircleDateFields || {};
    classDef.prototype._$$uncircleDateFields[propertyName] = 1;

    // overwrite toJSON
    classDef.prototype.toJSON = toJSON.bind(classDef);
}




export abstract class RootNode {

    // @Deserializer
    /*
    Marks a class as a deserialization root class.
    This adds a prototype function (ucDeserialize) that objectifies and marshals the giving json string through out the root class and its nested stores..
    You can have multiple @Deserializer within a tree of classes.

    If using this with mobx strict mode, and you are deserializing observables, I reccomend you create a different function that wraps ucDeserialize in an @action.
    */
    deserialize(rawObject: string | any) {
        
        if(typeof rawObject=== 'string') {
            rawObject = JSON.parse(rawObject);
        }

        const keys = Object.keys(rawObject);

        for (const key of keys) {
            const dateFields = this['_$$uncircleDateFields'] || {};
            const field = rawObject[key];

            if (field ) {
                if( dateFields[key]) {
                    this[key] = new Date(field);
                }
                else if(typeof field == 'function' || typeof field == 'object') {
                    this.deserialize.bind(this[key], field)();
                }
                else {
                    this[key] = field;
                }
            }
        }
    }
}


