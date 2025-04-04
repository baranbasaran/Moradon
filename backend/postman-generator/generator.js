const fs = require("fs");
const path = require("path");

// Read application.properties
const properties = fs.readFileSync(
  path.join(__dirname, "../src/main/resources/application.properties"),
  "utf8"
);
const port = properties.match(/server\.port=(\d+)/)[1];
const baseUrl = `http://localhost:${port}`;

// Collection template
const collection = {
  info: {
    name: "CheaperBook API",
    schema:
      "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
  },
  variable: [
    {
      key: "baseUrl",
      value: baseUrl,
      type: "string",
    },
  ],
  item: [
    {
      name: "Auth",
      item: [
        {
          name: "Login",
          request: {
            method: "POST",
            header: [
              {
                key: "Content-Type",
                value: "application/json",
              },
            ],
            url: {
              raw: "{{baseUrl}}/v1/auth/login",
              host: ["{{baseUrl}}"],
              path: ["v1", "auth", "login"],
            },
            body: {
              mode: "raw",
              raw: JSON.stringify({
                identifier: "test@example.com",
                password: "password123",
              }),
            },
          },
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  'pm.test("Status code is 200", function () {',
                  "    pm.response.to.have.status(200);",
                  "});",
                  "",
                  'console.log("Raw response body:", pm.response.text());',
                  "",
                  'pm.test("Parse and store tokens", function () {',
                  "    var jsonData = pm.response.json();",
                  '    console.log("Full response object:", JSON.stringify(jsonData, null, 2));',
                  "",
                  "    // Check response structure",
                  "    pm.expect(jsonData).to.be.an('object');",
                  '    console.log("Response structure:", Object.keys(jsonData));',
                  "",
                  "    // Store tokens - try different possible response structures",
                  "    var token, refreshToken;",
                  "    if (jsonData.data && jsonData.data.token) {",
                  "        token = jsonData.data.token;",
                  "        refreshToken = jsonData.data.refreshToken;",
                  "    } else if (jsonData.token) {",
                  "        token = jsonData.token;",
                  "        refreshToken = jsonData.refreshToken;",
                  "    }",
                  "",
                  '    console.log("Found token:", token);',
                  '    console.log("Found refreshToken:", refreshToken);',
                  "",
                  "    if (token && refreshToken) {",
                  '        pm.environment.set("token", token);',
                  '        pm.environment.set("refreshToken", refreshToken);',
                  '        console.log("Tokens stored in environment");',
                  "    } else {",
                  '        console.error("Could not find tokens in response");',
                  "    }",
                  "});",
                ],
                type: "text/javascript",
              },
            },
          ],
        },
        {
          name: "Register",
          request: {
            method: "POST",
            header: [
              {
                key: "Content-Type",
                value: "application/json",
              },
            ],
            url: {
              raw: "{{baseUrl}}/v1/auth/signup",
              host: ["{{baseUrl}}"],
              path: ["v1", "auth", "signup"],
            },
            body: {
              mode: "raw",
              raw: JSON.stringify({
                username: "test@example.com",
                password: "password123",
                email: "test@example.com",
                name: "Test User",
                birthDate: "1990-01-01",
              }),
            },
          },
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  'pm.test("Status code is 200", function () {',
                  "    pm.response.to.have.status(200);",
                  "});",
                  "",
                  'pm.test("Response has token and refreshToken", function () {',
                  "    var jsonData = pm.response.json();",
                  "    pm.expect(jsonData).to.have.property('token');",
                  "    pm.expect(jsonData).to.have.property('refreshToken');",
                  "});",
                ],
                type: "text/javascript",
              },
            },
          ],
        },
        {
          name: "Refresh Token",
          request: {
            method: "POST",
            header: [
              {
                key: "Authorization",
                value: "Bearer {{token}}",
              },
              {
                key: "Content-Type",
                value: "application/json",
              },
            ],
            url: {
              raw: "{{baseUrl}}/v1/auth/refresh",
              host: ["{{baseUrl}}"],
              path: ["v1", "auth", "refresh"],
            },
            body: {
              mode: "raw",
              raw: JSON.stringify({
                refreshToken: "{{refreshToken}}",
              }),
            },
          },
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  'console.log("Raw response body:", pm.response.text());',
                  "",
                  'pm.test("Status code should be 200 or handled gracefully", function () {',
                  "    if (pm.response.code === 500) {",
                  '        console.log("Server error:", pm.response.text());',
                  "    }",
                  "    pm.response.to.have.status(200);",
                  "});",
                  "",
                  'pm.test("Response has new token and refreshToken", function () {',
                  "    var jsonData = pm.response.json();",
                  '    console.log("Response data:", JSON.stringify(jsonData, null, 2));',
                  "    pm.expect(jsonData.data).to.have.property('token');",
                  "    pm.expect(jsonData.data).to.have.property('refreshToken');",
                  "});",
                  "",
                  'pm.test("Save new tokens", function () {',
                  "    var jsonData = pm.response.json();",
                  '    pm.environment.set("token", jsonData.data.token);',
                  '    pm.environment.set("refreshToken", jsonData.data.refreshToken);',
                  '    console.log("New tokens saved in environment:", {',
                  '        token: pm.environment.get("token"),',
                  '        refreshToken: pm.environment.get("refreshToken")',
                  "    });",
                  "});",
                ],
                type: "text/javascript",
              },
            },
          ],
        },
        {
          name: "Logout",
          request: {
            method: "POST",
            header: [
              {
                key: "Authorization",
                value: "Bearer {{token}}",
              },
            ],
            url: {
              raw: "{{baseUrl}}/v1/auth/logout",
              host: ["{{baseUrl}}"],
              path: ["v1", "auth", "logout"],
            },
          },
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  'pm.test("Status code is 200", function () {',
                  "    pm.response.to.have.status(200);",
                  "});",
                ],
                type: "text/javascript",
              },
            },
          ],
        },
      ],
    },
    {
      name: "Users",
      item: [
        {
          name: "Get All Users",
          request: {
            method: "GET",
            header: [
              {
                key: "Authorization",
                value: "Bearer {{token}}",
              },
            ],
            url: {
              raw: "{{baseUrl}}/v1/users?page=0&size=10",
              host: ["{{baseUrl}}"],
              path: ["v1", "users"],
              query: [
                {
                  key: "page",
                  value: "0",
                },
                {
                  key: "size",
                  value: "10",
                },
              ],
            },
          },
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  'pm.test("Status code is 200", function () {',
                  "    pm.response.to.have.status(200);",
                  "});",
                  "",
                  'pm.test("Response has pagination data", function () {',
                  "    var jsonData = pm.response.json();",
                  "    pm.expect(jsonData.data).to.have.property('content');",
                  "    pm.expect(jsonData.data).to.have.property('totalElements');",
                  "    pm.expect(jsonData.data).to.have.property('totalPages');",
                  "});",
                ],
                type: "text/javascript",
              },
            },
          ],
        },
        {
          name: "Get User by ID",
          request: {
            method: "GET",
            header: [
              {
                key: "Authorization",
                value: "Bearer {{token}}",
              },
            ],
            url: {
              raw: "{{baseUrl}}/v1/users/1",
              host: ["{{baseUrl}}"],
              path: ["v1", "users", "1"],
            },
          },
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  'pm.test("Status code is 200", function () {',
                  "    pm.response.to.have.status(200);",
                  "});",
                  "",
                  'pm.test("Response has user data", function () {',
                  "    var jsonData = pm.response.json();",
                  "    pm.expect(jsonData.data).to.have.property('id');",
                  "    pm.expect(jsonData.data).to.have.property('username');",
                  "    pm.expect(jsonData.data).to.have.property('email');",
                  "});",
                ],
                type: "text/javascript",
              },
            },
          ],
        },
        {
          name: "Create User",
          request: {
            method: "POST",
            header: [
              {
                key: "Authorization",
                value: "Bearer {{token}}",
              },
              {
                key: "Content-Type",
                value: "application/json",
              },
            ],
            url: {
              raw: "{{baseUrl}}/v1/users",
              host: ["{{baseUrl}}"],
              path: ["v1", "users"],
            },
            body: {
              mode: "raw",
              raw: JSON.stringify({
                username: "newuser",
                email: "newuser@example.com",
                password: "password123",
              }),
            },
          },
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  'pm.test("Status code is 201", function () {',
                  "    pm.response.to.have.status(201);",
                  "});",
                  "",
                  'pm.test("Response has created user data", function () {',
                  "    var jsonData = pm.response.json();",
                  "    pm.expect(jsonData.data).to.have.property('id');",
                  "    pm.expect(jsonData.data).to.have.property('username');",
                  "    pm.expect(jsonData.data).to.have.property('email');",
                  "});",
                ],
                type: "text/javascript",
              },
            },
          ],
        },
        {
          name: "Update User",
          request: {
            method: "PUT",
            header: [
              {
                key: "Authorization",
                value: "Bearer {{token}}",
              },
              {
                key: "Content-Type",
                value: "application/json",
              },
            ],
            url: {
              raw: "{{baseUrl}}/v1/users/1",
              host: ["{{baseUrl}}"],
              path: ["v1", "users", "1"],
            },
            body: {
              mode: "raw",
              raw: JSON.stringify({
                username: "updateduser",
                email: "updated@example.com",
              }),
            },
          },
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  'pm.test("Status code is 200", function () {',
                  "    pm.response.to.have.status(200);",
                  "});",
                  "",
                  'pm.test("Response has updated user data", function () {',
                  "    var jsonData = pm.response.json();",
                  "    pm.expect(jsonData.data).to.have.property('id');",
                  "    pm.expect(jsonData.data).to.have.property('username');",
                  "    pm.expect(jsonData.data).to.have.property('email');",
                  "});",
                ],
                type: "text/javascript",
              },
            },
          ],
        },
        {
          name: "Delete User",
          request: {
            method: "DELETE",
            header: [
              {
                key: "Authorization",
                value: "Bearer {{token}}",
              },
            ],
            url: {
              raw: "{{baseUrl}}/v1/users/1",
              host: ["{{baseUrl}}"],
              path: ["v1", "users", "1"],
            },
          },
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  'pm.test("Status code is 204", function () {',
                  "    pm.response.to.have.status(204);",
                  "});",
                ],
                type: "text/javascript",
              },
            },
          ],
        },
      ],
    },
    {
      name: "Books",
      item: [
        {
          name: "Get Book by ISBN",
          request: {
            method: "GET",
            header: [
              {
                key: "Authorization",
                value: "Bearer {{token}}",
              },
            ],
            url: {
              raw: "{{baseUrl}}/v1/books/isbn/978-0-13-149505-0",
              host: ["{{baseUrl}}"],
              path: ["v1", "books", "isbn", "978-0-13-149505-0"],
            },
          },
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  'pm.test("Status code is 200", function () {',
                  "    pm.response.to.have.status(200);",
                  "});",
                  "",
                  'pm.test("Response has book data", function () {',
                  "    var jsonData = pm.response.json();",
                  "    pm.expect(jsonData.data).to.have.property('id');",
                  "    pm.expect(jsonData.data).to.have.property('title');",
                  "    pm.expect(jsonData.data).to.have.property('author');",
                  "    pm.expect(jsonData.data).to.have.property('isbn');",
                  "});",
                ],
                type: "text/javascript",
              },
            },
          ],
        },
        {
          name: "Get User's Books",
          request: {
            method: "GET",
            header: [
              {
                key: "Authorization",
                value: "Bearer {{token}}",
              },
            ],
            url: {
              raw: "{{baseUrl}}/v1/books",
              host: ["{{baseUrl}}"],
              path: ["v1", "books"],
            },
          },
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  'pm.test("Status code is 200", function () {',
                  "    pm.response.to.have.status(200);",
                  "});",
                  "",
                  'pm.test("Response is an array of books", function () {',
                  "    var jsonData = pm.response.json();",
                  "    pm.expect(jsonData.data).to.be.an('array');",
                  "});",
                ],
                type: "text/javascript",
              },
            },
          ],
        },
        {
          name: "Create Book",
          request: {
            method: "POST",
            header: [
              {
                key: "Authorization",
                value: "Bearer {{token}}",
              },
              {
                key: "Content-Type",
                value: "application/json",
              },
            ],
            url: {
              raw: "{{baseUrl}}/v1/books",
              host: ["{{baseUrl}}"],
              path: ["v1", "books"],
            },
            body: {
              mode: "raw",
              raw: JSON.stringify({
                title: "Sample Book",
                author: "Sample Author",
                isbn: "978-0-13-149505-0",
                description: "Sample Description",
              }),
            },
          },
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  'pm.test("Status code is 201", function () {',
                  "    pm.response.to.have.status(201);",
                  "});",
                  "",
                  'pm.test("Response has created book data", function () {',
                  "    var jsonData = pm.response.json();",
                  "    pm.expect(jsonData.data).to.have.property('id');",
                  "    pm.expect(jsonData.data).to.have.property('title');",
                  "    pm.expect(jsonData.data).to.have.property('author');",
                  "    pm.expect(jsonData.data).to.have.property('isbn');",
                  "});",
                ],
                type: "text/javascript",
              },
            },
          ],
        },
        {
          name: "Get Book by ID",
          request: {
            method: "GET",
            header: [
              {
                key: "Authorization",
                value: "Bearer {{token}}",
              },
            ],
            url: {
              raw: "{{baseUrl}}/v1/books/1",
              host: ["{{baseUrl}}"],
              path: ["v1", "books", "1"],
            },
          },
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  'pm.test("Status code is 200", function () {',
                  "    pm.response.to.have.status(200);",
                  "});",
                  "",
                  'pm.test("Response has book data", function () {',
                  "    var jsonData = pm.response.json();",
                  "    pm.expect(jsonData.data).to.have.property('id');",
                  "    pm.expect(jsonData.data).to.have.property('title');",
                  "    pm.expect(jsonData.data).to.have.property('author');",
                  "});",
                ],
                type: "text/javascript",
              },
            },
          ],
        },
        {
          name: "Update Book",
          request: {
            method: "PUT",
            header: [
              {
                key: "Authorization",
                value: "Bearer {{token}}",
              },
              {
                key: "Content-Type",
                value: "application/json",
              },
            ],
            url: {
              raw: "{{baseUrl}}/v1/books/1",
              host: ["{{baseUrl}}"],
              path: ["v1", "books", "1"],
            },
            body: {
              mode: "raw",
              raw: JSON.stringify({
                title: "Updated Book Title",
                author: "Updated Author",
                description: "Updated Description",
              }),
            },
          },
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  'pm.test("Status code is 200", function () {',
                  "    pm.response.to.have.status(200);",
                  "});",
                  "",
                  'pm.test("Response has updated book data", function () {',
                  "    var jsonData = pm.response.json();",
                  "    pm.expect(jsonData.data).to.have.property('id');",
                  "    pm.expect(jsonData.data).to.have.property('title');",
                  "    pm.expect(jsonData.data).to.have.property('author');",
                  "});",
                ],
                type: "text/javascript",
              },
            },
          ],
        },
        {
          name: "Delete Book",
          request: {
            method: "DELETE",
            header: [
              {
                key: "Authorization",
                value: "Bearer {{token}}",
              },
            ],
            url: {
              raw: "{{baseUrl}}/v1/books/1",
              host: ["{{baseUrl}}"],
              path: ["v1", "books", "1"],
            },
          },
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  'pm.test("Status code is 204", function () {',
                  "    pm.response.to.have.status(204);",
                  "});",
                ],
                type: "text/javascript",
              },
            },
          ],
        },
      ],
    },
    {
      name: "Posts",
      item: [
        {
          name: "Create Post",
          request: {
            method: "POST",
            header: [
              {
                key: "Authorization",
                value: "Bearer {{token}}",
              },
            ],
            body: {
              mode: "formdata",
              formdata: [
                {
                  key: "content",
                  value: "Sample post content",
                  type: "text",
                },
                {
                  key: "mediaFile",
                  type: "file",
                  src: [],
                },
              ],
            },
            url: {
              raw: "{{baseUrl}}/v1/posts",
              host: ["{{baseUrl}}"],
              path: ["v1", "posts"],
            },
          },
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  'pm.test("Status code is 201", function () {',
                  "    pm.response.to.have.status(201);",
                  "});",
                  "",
                  'pm.test("Response has post data", function () {',
                  "    var jsonData = pm.response.json();",
                  "    pm.expect(jsonData).to.have.property('id');",
                  "    pm.expect(jsonData).to.have.property('content');",
                  "    pm.expect(jsonData).to.have.property('createdAt');",
                  "});",
                ],
                type: "text/javascript",
              },
            },
          ],
        },
        {
          name: "Get Post by ID",
          request: {
            method: "GET",
            header: [
              {
                key: "Authorization",
                value: "Bearer {{token}}",
              },
            ],
            url: {
              raw: "{{baseUrl}}/v1/posts/1",
              host: ["{{baseUrl}}"],
              path: ["v1", "posts", "1"],
            },
          },
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  'pm.test("Status code is 200", function () {',
                  "    pm.response.to.have.status(200);",
                  "});",
                  "",
                  'pm.test("Response has post data", function () {',
                  "    var jsonData = pm.response.json();",
                  "    pm.expect(jsonData).to.have.property('id');",
                  "    pm.expect(jsonData).to.have.property('content');",
                  "    pm.expect(jsonData).to.have.property('createdAt');",
                  "});",
                ],
                type: "text/javascript",
              },
            },
          ],
        },
        {
          name: "Get Posts by User",
          request: {
            method: "GET",
            header: [
              {
                key: "Authorization",
                value: "Bearer {{token}}",
              },
            ],
            url: {
              raw: "{{baseUrl}}/v1/posts/user/1?page=0&size=10",
              host: ["{{baseUrl}}"],
              path: ["v1", "posts", "user", "1"],
              query: [
                {
                  key: "page",
                  value: "0",
                },
                {
                  key: "size",
                  value: "10",
                },
              ],
            },
          },
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  'pm.test("Status code is 200", function () {',
                  "    pm.response.to.have.status(200);",
                  "});",
                  "",
                  'pm.test("Response has pagination data", function () {',
                  "    var jsonData = pm.response.json();",
                  "    pm.expect(jsonData).to.have.property('content');",
                  "    pm.expect(jsonData).to.have.property('totalElements');",
                  "    pm.expect(jsonData).to.have.property('totalPages');",
                  "});",
                ],
                type: "text/javascript",
              },
            },
          ],
        },
        {
          name: "Get All Posts",
          request: {
            method: "GET",
            header: [
              {
                key: "Authorization",
                value: "Bearer {{token}}",
              },
            ],
            url: {
              raw: "{{baseUrl}}/v1/posts?page=0&size=10",
              host: ["{{baseUrl}}"],
              path: ["v1", "posts"],
              query: [
                {
                  key: "page",
                  value: "0",
                },
                {
                  key: "size",
                  value: "10",
                },
              ],
            },
          },
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  'pm.test("Status code is 200", function () {',
                  "    pm.response.to.have.status(200);",
                  "});",
                  "",
                  'pm.test("Response has pagination data", function () {',
                  "    var jsonData = pm.response.json();",
                  "    pm.expect(jsonData).to.have.property('content');",
                  "    pm.expect(jsonData).to.have.property('totalElements');",
                  "    pm.expect(jsonData).to.have.property('totalPages');",
                  "});",
                ],
                type: "text/javascript",
              },
            },
          ],
        },
        {
          name: "Delete Post",
          request: {
            method: "DELETE",
            header: [
              {
                key: "Authorization",
                value: "Bearer {{token}}",
              },
            ],
            url: {
              raw: "{{baseUrl}}/v1/posts/1",
              host: ["{{baseUrl}}"],
              path: ["v1", "posts", "1"],
            },
          },
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  'pm.test("Status code is 204", function () {',
                  "    pm.response.to.have.status(204);",
                  "});",
                ],
                type: "text/javascript",
              },
            },
          ],
        },
        {
          name: "Like Post",
          request: {
            method: "POST",
            header: [
              {
                key: "Authorization",
                value: "Bearer {{token}}",
              },
            ],
            url: {
              raw: "{{baseUrl}}/v1/posts/1/like",
              host: ["{{baseUrl}}"],
              path: ["v1", "posts", "1", "like"],
            },
          },
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  'pm.test("Status code is 200", function () {',
                  "    pm.response.to.have.status(200);",
                  "});",
                  "",
                  'pm.test("Response has updated like count", function () {',
                  "    var jsonData = pm.response.json();",
                  "    pm.expect(jsonData).to.have.property('likes');",
                  "});",
                ],
                type: "text/javascript",
              },
            },
          ],
        },
        {
          name: "Unlike Post",
          request: {
            method: "POST",
            header: [
              {
                key: "Authorization",
                value: "Bearer {{token}}",
              },
            ],
            url: {
              raw: "{{baseUrl}}/v1/posts/1/unlike",
              host: ["{{baseUrl}}"],
              path: ["v1", "posts", "1", "unlike"],
            },
          },
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  'pm.test("Status code is 200", function () {',
                  "    pm.response.to.have.status(200);",
                  "});",
                  "",
                  'pm.test("Response has updated like count", function () {',
                  "    var jsonData = pm.response.json();",
                  "    pm.expect(jsonData).to.have.property('likes');",
                  "});",
                ],
                type: "text/javascript",
              },
            },
          ],
        },
        {
          name: "Repost",
          request: {
            method: "POST",
            header: [
              {
                key: "Authorization",
                value: "Bearer {{token}}",
              },
            ],
            url: {
              raw: "{{baseUrl}}/v1/posts/1/repost",
              host: ["{{baseUrl}}"],
              path: ["v1", "posts", "1", "repost"],
            },
          },
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  'pm.test("Status code is 200", function () {',
                  "    pm.response.to.have.status(200);",
                  "});",
                  "",
                  'pm.test("Response has repost data", function () {',
                  "    var jsonData = pm.response.json();",
                  "    pm.expect(jsonData).to.have.property('id');",
                  "    pm.expect(jsonData).to.have.property('content');",
                  "    pm.expect(jsonData).to.have.property('repostCount');",
                  "});",
                ],
                type: "text/javascript",
              },
            },
          ],
        },
        {
          name: "Get Post Comments",
          request: {
            method: "GET",
            header: [
              {
                key: "Authorization",
                value: "Bearer {{token}}",
              },
            ],
            url: {
              raw: "{{baseUrl}}/v1/posts/1/comments",
              host: ["{{baseUrl}}"],
              path: ["v1", "posts", "1", "comments"],
            },
          },
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  'pm.test("Status code is 200", function () {',
                  "    pm.response.to.have.status(200);",
                  "});",
                  "",
                  'pm.test("Response is an array of comments", function () {',
                  "    var jsonData = pm.response.json();",
                  "    pm.expect(jsonData).to.be.an('array');",
                  "});",
                ],
                type: "text/javascript",
              },
            },
          ],
        },
      ],
    },
    {
      name: "Comments",
      item: [
        {
          name: "Create Comment",
          request: {
            method: "POST",
            header: [
              {
                key: "Authorization",
                value: "Bearer {{token}}",
              },
              {
                key: "Content-Type",
                value: "application/json",
              },
            ],
            url: {
              raw: "{{baseUrl}}/v1/comments",
              host: ["{{baseUrl}}"],
              path: ["v1", "comments"],
            },
            body: {
              mode: "raw",
              raw: JSON.stringify({
                postId: 1,
                content: "Sample comment",
                parentCommentId: null,
              }),
            },
          },
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  'pm.test("Status code is 200", function () {',
                  "    pm.response.to.have.status(200);",
                  "});",
                  "",
                  'pm.test("Response has comment data", function () {',
                  "    var jsonData = pm.response.json();",
                  "    pm.expect(jsonData).to.have.property('id');",
                  "    pm.expect(jsonData).to.have.property('content');",
                  "    pm.expect(jsonData).to.have.property('createdAt');",
                  "});",
                ],
                type: "text/javascript",
              },
            },
          ],
        },
        {
          name: "Get Comments by Post ID",
          request: {
            method: "GET",
            header: [
              {
                key: "Authorization",
                value: "Bearer {{token}}",
              },
            ],
            url: {
              raw: "{{baseUrl}}/v1/comments/post/1",
              host: ["{{baseUrl}}"],
              path: ["v1", "comments", "post", "1"],
            },
          },
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  'pm.test("Status code is 200", function () {',
                  "    pm.response.to.have.status(200);",
                  "});",
                  "",
                  'pm.test("Response is an array of comments", function () {',
                  "    var jsonData = pm.response.json();",
                  "    pm.expect(jsonData).to.be.an('array');",
                  "});",
                ],
                type: "text/javascript",
              },
            },
          ],
        },
        {
          name: "Delete Comment",
          request: {
            method: "DELETE",
            header: [
              {
                key: "Authorization",
                value: "Bearer {{token}}",
              },
            ],
            url: {
              raw: "{{baseUrl}}/v1/comments/1",
              host: ["{{baseUrl}}"],
              path: ["v1", "comments", "1"],
            },
          },
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  'pm.test("Status code is 204", function () {',
                  "    pm.response.to.have.status(204);",
                  "});",
                ],
                type: "text/javascript",
              },
            },
          ],
        },
      ],
    },
  ],
};

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, "output");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Write the collection to a file
fs.writeFileSync(
  path.join(outputDir, "CheaperBook.postman_collection.json"),
  JSON.stringify(collection, null, 2)
);

console.log("Postman collection has been generated successfully!");
console.log(
  `Collection file location: ${path.join(
    outputDir,
    "CheaperBook.postman_collection.json"
  )}`
);
