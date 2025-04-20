import { crudyResource } from '../src';

describe("createResource", () => {

  const resourceUrl = "https://api.example.com/resource";
  let fetchMock: jest.Mock;

  beforeEach(() => {
    fetchMock = jest.fn();
    global.fetch = fetchMock;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should call fetch with correct URL and method for GET operation", async () => {
    const id = 1;
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({ id, name: "example" }),
    });

    const resource = crudyResource(resourceUrl);

    const result = await resource.get(id);

    expect(fetchMock).toHaveBeenCalledWith(`${resourceUrl}/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    expect(result).toEqual({ id, name: "example" });

  });

  it("should call fetch with query parameters for list operation", async () => {

    const query = { page: 1, limit: 10 };

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue([{ id: 1, name: "example" }]),
    });

    const resource = crudyResource(resourceUrl);
    const result = await resource.list(query);

    expect(fetchMock).toHaveBeenCalledWith(
      `${resourceUrl}?page=1&limit=10`,
      expect.objectContaining({
        method: "GET",
      })
    );

    expect(result).toEqual([{ id: 1, name: "example" }]);

  });

  it("should call fetch with correct URL, method, and body for create operation", async () => {

    const newResource = { name: "New Resource" };
    const createdResource = { id: 1, name: "New Resource" };

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(createdResource),
    });

    const resource = crudyResource(resourceUrl);
    const result = await resource.create(newResource);

    expect(fetchMock).toHaveBeenCalledWith(resourceUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newResource),
    });

    expect(result).toEqual(createdResource);

  });

  it("should call fetch with correct URL, method, and body for update operation", async () => {

    const id = 1;
    const updatedResource = { name: "Updated Resource" };

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(updatedResource),
    });

    const resource = crudyResource(resourceUrl);
    const result = await resource.update(id, updatedResource);

    expect(fetchMock).toHaveBeenCalledWith(`${resourceUrl}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedResource),
    });

    expect(result).toEqual(updatedResource);

  });

  it("should call fetch with correct URL and method for delete operation", async () => {

    const id = 1;

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: jest.fn(),
    });

    const resource = crudyResource(resourceUrl);
    await resource.delete(id);

    expect(fetchMock).toHaveBeenCalledWith(`${resourceUrl}/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

  });

  it("should call hooks if provided", async () => {

    const hooks = {
      onBefore: jest.fn(),
      onSuccess: jest.fn(),
      onError: jest.fn(),
    };

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({ id: 1, name: "example" }),
    });

    const resource = crudyResource(resourceUrl, { hooks });

    const id = 1;
    const result = await resource.get(id);

    expect(hooks.onBefore).toHaveBeenCalledWith("GET", undefined);
    expect(hooks.onSuccess).toHaveBeenCalledWith("GET", { id: 1, name: "example" });
    expect(hooks.onError).not.toHaveBeenCalled();

    expect(result).toEqual({ id: 1, name: "example" });

  });

  it("should handle fetch errors and call onError hook", async () => {

    const hooks = {
      onError: jest.fn(),
    };

    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: "Not Found",
    });

    const resource = crudyResource(resourceUrl, { hooks });

    const id = 1;

    await expect(resource.get(id)).rejects.toThrow("HTTP Error: 404 Not Found");

    expect(hooks.onError).toHaveBeenCalledWith("GET", expect.any(Error));

  });

});
