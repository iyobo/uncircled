
function toJSON() {
    const obj = {};
    const keys = Object.keys(this);

    for (const key of keys) {
        const ignoreCodex = this._$$uncircleIgnoredFields || {};
        if (!ignoreCodex[key]) {
            obj[key] = this[key];
        }
    }

    // let str = JSON.stringify(obj);
    // str = str.replace(/\\/g, '');
    return obj;
}


function deserialize(rawObject: string | any) {

    if(typeof rawObject=== 'string') {
        rawObject = JSON.parse(rawObject);
    }

    console.log('deserialize',this, rawObject);

    const keys = Object.keys(rawObject);

    for (const key of keys) {
        const dateFields = this['_$$uncircleDateFields'] || {};
        const field = rawObject[key];

        if (field ) {
            if( dateFields[key]) {
                this[key] = new Date(field);
            }
            else if( typeof field == 'object' && field.constructor && field.constructor.name !== 'Object') { // raw object, not a class instance
                deserialize.bind(this[key])(field);
            }
            else if(typeof field !== 'function') {
                this[key] = field;
            }
        }
    }
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
    classDef.prototype.toJSON = toJSON;
}

export function Deserializer(classDef: Function) {

    // add deserialize function to prototype
    classDef.prototype.deserialize = deserialize;
}

