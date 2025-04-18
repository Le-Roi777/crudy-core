# crudy-core

## Overview
Crudy Core is a lightweight TypeScript library for creating CRUD (Create, Read, Update, Delete) API clients. It provides a simple and flexible way to interact with RESTful APIs by generating resource clients with standardized methods.

## Usage Example

```typescript
// Create a single resource client
const users = createResource('https://api.example.com/users');

// Use the client to interact with the API
const allUsers = await users.list();
const user = await users.get(1);
const newUser = await users.create({ name: 'John Doe' });
const updatedUser = await users.update(1, { name: 'Jane Doe' });
await users.delete(1);

// Create multiple resource clients
const api = createResources({
  users: 'https://api.example.com/users',
  posts: 'https://api.example.com/posts',
});

// Use the clients
const users = await api.users.list();
const posts = await api.posts.list();
```
