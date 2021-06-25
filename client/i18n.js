import intl from 'react-intl-universal';

export const locales = {
    "zh-CN": require('./locales/zh-CN.json'),
    "en-US": require('./locales/en-US.json')
};

export const availableLng = Object.keys(locales);

export const defaultLng = availableLng[0];

const keyName = 'lang';

let currentLocale = intl.determineLocale({
    urlLocaleKey: keyName,
    cookieLocaleKey: keyName
  }) || defaultLng;


export function getLocale(){
    return currentLocale;
}

export function switchLng(lng){
    window.document.cookie = `${keyName}=${lng};expires=${new Date(Date.now()+ 1000 * 60 * 60 * 240).toUTCString()};path=/`;
    // todo: change path
    currentLocale = lng;
    return intl.init({
        currentLocale: lng, // TODO: determine locale here
        locales
    });
}

export function init(){
    return switchLng(getLocale());
}

init()
