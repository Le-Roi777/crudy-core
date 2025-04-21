# ⚡ crudy-core

## Overview
Crudy Core is a lightweight TypeScript library for creating CRUD (Create, Read, Update, Delete) API clients. It provides a simple and flexible way to interact with RESTful APIs by generating resource clients with standardized methods.

---

## 📦 Installation
```bash
npm install crudy-core zod
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

### Single resource client

```js
import { crudyResource } from 'crudy-core';

const users = crudyResource('https://api.example.com/users');

const allUsers = await users.list();
const user = await users.get(1);
const newUser = await users.create({ name: 'John Doe' });
const updatedUser = await users.update(1, { name: 'Jane Doe' });
await users.delete(1);
```
---

### Multiple resource clients

```javascript
import { crudyResources } from 'crudy-core';

const api = crudyResources({
    users: 'https://api.example.com/users',
    posts: 'https://api.example.com/posts',
});

const usersList = await api.users.list();
const postsList = await api.posts.list();
```

---

### Lifecycle hooks

```javascript
const users = crudyResource('/api/users', {
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

## 🛠 TypeScript Example

### ✅ With Generics
```ts
import { crudyResource } from 'crudy-core';

type User = { id: number; name: string };
const users = crudyResource<Omit<User, 'id'>, User>('/api/users');

await users.create({ name: 'Alice' });
const result: User[] = await users.list();
```
---

### ✅ With Zod Schema Validation
```ts
import { z } from 'zod';
import { crudyResource } from 'crudy-core';

const UserSchema = z.object({
    id: z.number(),
    name: z.string(),
});

const NewUserSchema = UserSchema.omit({ id: true });

const users = crudyResource('/api/users', {
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

## 🪪 License

MIT

---