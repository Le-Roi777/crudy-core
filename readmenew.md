# ⚡ crudy-core

## Overview
Crudy Core is a lightweight TypeScript library for creating CRUD (Create, Read, Update, Delete) API clients. It provides a simple and flexible way to interact with RESTful APIs by generating resource clients with standardized methods.

---

## 📦 Installation
```bash
npm install crud-core zod
```
> ⚠️ `zod` is required only if you want request/response schema validation.

---

## ✨ Features

🔄 Standardized CRUD interface

🧠 Type-safe via generics (works in TypeScript)

✅ Optional Zod schema validation

🪝 Lifecycle hooks: `onBefore`, `onSuccess`, `onError`

⚡ Framework-agnostic: works with React, Vue.

---

## 🧪 JavaScript Example
```js
import { createResource, createResources } from 'crud-core';

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
const usersList = await api.users.list();
const postsList = await api.posts.list();
```
---

## 🛠 TypeScript Usage

### ✅ With Generics
```ts
import { createResource } from 'crud-core';

type User = { id: number; name: string };
const users = createResource<Omit<User, 'id'>, User>('/api/users');

// Fully typed
await users.create({ name: 'Alice' });
const result: User[] = await users.list();
```
---

### ✅ With Zod Schema Validation
```ts

import { z } from 'zod';
import { createResource } from 'crud-core';

const UserSchema = z.object({
    id: z.number(),
    name: z.string(),
});

const NewUserSchema = UserSchema.omit({ id: true });

const users = createResource('/api/users', {
    schemas: {
        request: {
            create: NewUserSchema,
            update: NewUserSchema,
        },
        response: {
            get: UserSchema,
            list: z.array(UserSchema),
        },
    },
});
```
---

### ✅ With Lifecycle Hooks
```ts

const users = createResource('/api/users', {
    hooks: {
        onBefore: (action, payload) => {
            console.log(`[START] ${action}`, payload);
        },
        onSuccess: (action, response) => {
            console.log(`[SUCCESS] ${action}`, response);
        },
        onError: (action, err) => {
            console.error(`[ERROR] ${action}`, err);
        },
    },
});
```
---

## 🔌API
Each resource has:

```ts
resource.get(id, query?)
resource.list(query?)
resource.create(data)
resource.update(id, data)
resource.delete(id, query?)
```
---

## 🔗 3rd Party Dependencies

<div>
    <table>
        <thead>
            <tr>
                <th>Package</th>
                <th>Used For</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    <a rel="noopener" target="_new" href="https://github.com/colinhacks/zod">
                        <code>zod</code>
                    </a>
                </td>
                <td>Optional schema validation</td>
            </tr>
        </tbody>
    </table>
</div>

---

🪪 License
MIT

---