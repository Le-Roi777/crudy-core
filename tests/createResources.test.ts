import { createResources } from '../src';

describe("createResources", () => {

    const endpoints = {
        users: "https://api.example.com/users",
        posts: "https://api.example.com/posts",
    };

    let fetchMock: jest.Mock;

    beforeEach(() => {
        fetchMock = jest.fn();
        global.fetch = fetchMock;
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it("should create resources for all endpoints", async () => {

        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValue({ id: 1, name: "John Doe" }),
        });

        const sharedOptions = {

            hooks: {
                onBefore: jest.fn(),
                onSuccess: jest.fn(),
                onError: jest.fn(),
            },

        };

        const resources = createResources(endpoints, sharedOptions);

        // Check if the resource object contains the proper keys
        expect(resources).toHaveProperty("users");
        expect(resources).toHaveProperty("posts");

        // Verify that the `users` resource works correctly
        const userResult = await resources.users.get(1);

        expect(fetchMock).toHaveBeenCalledWith(
            "https://api.example.com/users/1",
            expect.objectContaining({ method: "GET" })
        );

        expect(userResult).toEqual({ id: 1, name: "John Doe" });

        // Verify that the hooks were correctly used
        expect(sharedOptions.hooks!.onBefore).toHaveBeenCalledWith("GET", undefined);

        expect(sharedOptions.hooks!.onSuccess).toHaveBeenCalledWith("GET", {
            id: 1,
            name: "John Doe",
        });

        expect(sharedOptions.hooks!.onError).not.toHaveBeenCalled();

    });

    it("should ensure each resource has independent endpoints", async () => {

        const mockUserResponse = { id: 1, name: "Jane Doe" };
        const mockPostResponse = { id: 101, title: "Test Post" };

        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValue(mockUserResponse),
        }).mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValue(mockPostResponse),
        });

        const resources = createResources(endpoints);
        const userResult = await resources.users.get(1);

        expect(fetchMock).toHaveBeenCalledWith(
            "https://api.example.com/users/1",
            expect.objectContaining({ method: "GET" })
        );

        expect(userResult).toEqual(mockUserResponse);

        const postResult = await resources.posts.get(101);

        expect(fetchMock).toHaveBeenCalledWith(
            "https://api.example.com/posts/101",
            expect.objectContaining({ method: "GET" })
        );

        expect(postResult).toEqual(mockPostResponse);

    });

});
