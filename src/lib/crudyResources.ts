import { crudyResource } from "./crudyResource";
import { CrudyCrudOptions} from "./crudyCrudOptions";

function crudyResources<TReq = any, TRes = any>(
    endpoints: Record<string, string>,
    sharedOptions?: CrudyCrudOptions<TReq, TRes>
) {

    const resources: Record<string, ReturnType<typeof crudyResource<TReq, TRes>>> = {};

    for (const [name, url] of Object.entries(endpoints)) {
        resources[name] = crudyResource<TReq, TRes>(url, sharedOptions);
    }

    return resources;

}

export { crudyResources };
