export default function transformNullToEmptyString(obj: any): any {
    if (obj === null) {
        return "";
    }

    if (typeof obj !== 'object' || obj === undefined) {
        return obj;
    }

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            obj[key] = transformNullToEmptyString(obj[key]);
        }
    }

    return obj;
}