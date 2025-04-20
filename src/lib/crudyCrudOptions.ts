import { ZodSchema } from "zod";

type CrudyCrudOptions<TReq = any, TRes = any> = {

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

export type { CrudyCrudOptions };
