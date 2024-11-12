


export enum Restaurant {
    'BRICK'= 'brick',
    'KUMA' = 'kuma',
    'EIGHT' = 'eight',
}

export const RoleKey = 'Role';
export const RestaurantKey = 'Restaurant';

export const getLocalStorageData = (key: string) => {
    try {
        return JSON.parse(localStorage.getItem(key) || '{}');
    } catch (e) {
        console.log('Local storage not available', e);
    }
}

export const setLocalStorageData = (key: string, data: any) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.log('Local storage saving error: ', e);
    }
}
