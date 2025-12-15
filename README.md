# Run postgres container

```bash
docker run -d \
--name my-postgres \
-e POSTGRES_USER=myuser \
-e POSTGRES_PASSWORD=mypassword \
-e POSTGRES_DB=social \
-p 5432:5432 \
-v /home/gourab/postgres_data:/var/lib/postgresql/data \
postgres:13-trixie


docker start my-postgres


psql "postgresql://myuser:mypassword@localhost:5432/social"

```

## endpoints

| Action                     | Method          | Path                 | Notes                                                          |
| -------------------------- | --------------- | -------------------- | -------------------------------------------------------------- |
| Create post                | **POST**        | `/api/posts`         | Auth required (Clerk)                                          |
| Get all posts              | **GET**         | `/api/posts`         | For now public to logged-in users; later can restrict to admin |
| Get current user’s posts   | **GET**         | `/api/user/posts`    | Uses Clerk user, no path params                                |
| Delete a post              | **DELETE**      | `/api/posts/:postId` | Auth required; checks ownership                                |
| Update a post _(optional)_ | **PATCH / PUT** | `/api/posts/:postId` | (If you add edit later)                                        |

| Method     | Path          | What it does                                                                 |
| ---------- | ------------- | ---------------------------------------------------------------------------- |
| **POST**   | `/api/follow` | Authenticated user follows another user (requires `targetUserId` in body).   |
| **DELETE** | `/api/follow` | Authenticated user unfollows another user (requires `targetUserId` in body). |

| Method  | Path        | What it does                                                                            |
| ------- | ----------- | --------------------------------------------------------------------------------------- |
| **GET** | `/api/feed` | Returns a personalized feed of posts for the logged-in user (based on who they follow). |



user_34MnDOpG7Ps1pG18qFRK3UIsKTa