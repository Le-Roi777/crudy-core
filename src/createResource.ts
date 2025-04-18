import { ZodSchema } from 'zod';

type CRUDOptions<TReq = any, TRes = any> = {

    fetcher?: typeof fetch;
    serializer?: (data: TReq) => any;
    deserializer?: (data: any) => TRes;

    hooks?: {
        onBefore?: (operation: string, payload?: TReq) => void;
        onSuccess?: (operation: string, response: TRes) => void;
        onError?: (operation: string, error: any) => void;
    };

    schemas?: {
        request?: {
            create?: ZodSchema<TReq>;
            update?: ZodSchema<TReq>;
        };
        response?: {
            get?: ZodSchema<TRes>;
            list?: ZodSchema<TRes[]>;
            create?: ZodSchema<TRes>;
            update?: ZodSchema<TRes>;
        };
    };

};

// Util: Build query string from an object
const queryString = (query?: Record<string, any>) =>
    query ? `?${new URLSearchParams(query).toString()}` : '';

export function createResource<TReq = any, TRes = any>(
    baseUrl: string,
    options: CRUDOptions<TReq, TRes> = {}
) {

    const {
        fetcher = fetch,
        serializer = (x) => x,
        deserializer = (x) => x,
        hooks = {},
        schemas,
    } = options;

    const handle = async <TResp>(
        method: string,
        url: string,
        body?: TReq,
        schemaKey?: keyof NonNullable<NonNullable<CRUDOptions<TReq, TRes>['schemas']>['response']>
    ): Promise<TResp> => {

        hooks.onBefore?.(method, body);

        try {

            // Validate request body
            if (body && schemas?.request && schemaKey && schemaKey in schemas.request) {
                schemas.request[schemaKey as keyof typeof schemas.request]?.parse(body);
            }

            const response = await fetcher(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: body ? JSON.stringify(serializer(body)) : undefined,
            });

            // Handle HTTP errors
            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
            }

            const json = await response.json();
            let data = deserializer(json);

            // Validate response body
            if (schemaKey && schemas?.response && schemaKey in schemas.response) {
                data = schemas.response[schemaKey as keyof typeof schemas.response]?.parse(data);
            }

            hooks.onSuccess?.(method, data);

            return data;

        } catch (error) {
            hooks.onError?.(method, error);
            throw error;
        }

    };

    return {

        get: (id: string | number, query?: Record<string, any>) =>
            handle<TRes>('GET', `${baseUrl}/${id}${queryString(query)}`, undefined, 'get'),

        list: (query?: Record<string, any>) =>
            handle<TRes[]>('GET', `${baseUrl}${queryString(query)}`, undefined, 'list'),

        create: (data: TReq) =>
            handle<TRes>('POST', baseUrl, data, 'create'),

        update: (id: string | number, data: TReq) =>
            handle<TRes>('PUT', `${baseUrl}/${id}`, data, 'update'),

        delete: (id: string | number, query?: Record<string, any>) =>
            handle<void>('DELETE', `${baseUrl}/${id}${queryString(query)}`),

    };

}

export function createResources<TReq = any, TRes = any>(
    endpoints: Record<string, string>,
    sharedOptions?: CRUDOptions<TReq, TRes>
) {

    const resources: Record<string, ReturnType<typeof createResource<TReq, TRes>>> = {};

    for (const [name, url] of Object.entries(endpoints)) {
        resources[name] = createResource<TReq, TRes>(url, sharedOptions);
    }

    return resources;

}
