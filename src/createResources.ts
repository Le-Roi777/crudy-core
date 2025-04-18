import { CRUDOptions, createResource } from "./createResource";

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
