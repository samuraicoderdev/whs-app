interface StorageLike {
	getItem(key: string): string | null;
	setItem(key: string, value: string): void;
	removeItem(key: string): void;
}

interface GetAppParamValueOptions {
	defaultValue?: string;
	removeFromUrl?: boolean;
}

interface AppParams {
	appId: string | null | undefined;
	token: string | null | undefined;
	fromUrl: string | null | undefined;
	functionsVersion: string | null | undefined;
	appBaseUrl: string | null | undefined;
}

const isNode: boolean = typeof window === 'undefined';
const windowObj: Window | { localStorage: StorageLike } = isNode
	? { localStorage: new Map() as unknown as StorageLike }
	: window;
const storage: StorageLike = windowObj.localStorage;

const toSnakeCase = (str: string): string => {
	return str.replace(/([A-Z])/g, '_$1').toLowerCase();
}

const getAppParamValue = (
	paramName: string,
	{ defaultValue = undefined, removeFromUrl = false }: GetAppParamValueOptions = {}
): string | null | undefined => {
	if (isNode) {
		return defaultValue;
	}
	const storageKey = `base44_${toSnakeCase(paramName)}`;
	const urlParams = new URLSearchParams(window.location.search);
	const searchParam = urlParams.get(paramName);
	if (removeFromUrl) {
		urlParams.delete(paramName);
		const newUrl = `${window.location.pathname}${urlParams.toString() ? `?${urlParams.toString()}` : ""}
			${window.location.hash}`;
		window.history.replaceState({}, document.title, newUrl);
	}
	if (searchParam) {
		storage.setItem(storageKey, searchParam);
		return searchParam;
	}
	if (defaultValue) {
		storage.setItem(storageKey, defaultValue);
		return defaultValue;
	}
	const storedValue = storage.getItem(storageKey);
	if (storedValue) {
		return storedValue;
	}
	return null;
}

const getAppParams = (): AppParams => {
	if (getAppParamValue("clear_access_token") === 'true') {
		storage.removeItem('base44_access_token');
		storage.removeItem('token');
	}
	return {
		appId: getAppParamValue("app_id", { defaultValue: import.meta.env.VITE_BASE44_APP_ID }),
		token: getAppParamValue("access_token", { removeFromUrl: true }),
		fromUrl: getAppParamValue("from_url", { defaultValue: window.location.href }),
		functionsVersion: getAppParamValue("functions_version", { defaultValue: import.meta.env.VITE_BASE44_FUNCTIONS_VERSION }),
		appBaseUrl: getAppParamValue("app_base_url", { defaultValue: import.meta.env.VITE_BASE44_APP_BASE_URL }),
	}
}

export const appParams: AppParams = {
	...getAppParams(),
}
