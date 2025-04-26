# REST API Plan

## 1. Resources
- **Users** (`auth.users`)
- **Boxes** (`public.boxes`)
- **Flashcards** (`public.flashcards`)
- **Tags** (`public.tags`)
- **Box Tags** (`public.box_tags`)
- **Generation Logs** (`public.generation_log`)
- **AI Generation** (ephemeral suggestions)
- **Study Sessions** (session orchestration)

## 2. Endpoints

### 2.1 Authentication

### 2.2 Boxes

#### List Boxes
- Method: GET
- URL: /boxes
- Description: Retrieve user's boxes with pagination, sorting, filtering.
- Query Params:
  - page (integer, default=1)
  - per_page (integer, default=20)
  - search (string, min length=2)
- Response JSON:
  ```json
  {
    "items": [ { /* box object */ } ],
    "meta": {"page":1,"per_page":20,"total":50}
  }
  ```
- Success: 200 OK

#### Create Box
- Method: POST
- URL: /boxes
- Request JSON:
  ```json
  {
    "name": "Biology",
    "description": "Cell structure"
  }
  ```
- Success: 201 Created with box object
- Errors: 400 Validation (name required), 409 Conflict (name not unique)

#### Get Box
- Method: GET
- URL: /boxes/{boxId}
- Success: 200 OK with box object
- Errors: 404 Not Found, 403 Forbidden

#### Update Box
- Method: PUT
- URL: /boxes/{boxId}
- Request JSON:
  ```json
  { "name": "New Name", "description": "Updated" }
  ```
- Success: 200 OK with updated box
- Errors: 400 Validation, 403 Forbidden, 404 Not Found

#### Delete Box
- Method: DELETE
- URL: /boxes/{boxId}
- Description: Soft-delete box (is_deleted = true)
- Success: 204 No Content
- Errors: 403 Forbidden, 404 Not Found

### 2.3 Tags

#### List Tags
- Method: GET
- URL: /tags
- Response: list of tags

#### Create Tag
- Method: POST
- URL: /tags
- Request JSON: `{ "name": "Important" }`
- Success: 201 Created
- Errors: 400 Validation, 409 Conflict

#### Delete Tag
- Method: DELETE
- URL: /tags/{tagId}
- Success: 204 No Content

### 2.4 Box Tags

#### List Tags for Box
- Method: GET
- URL: /boxes/{boxId}/tags

#### Add Tag to Box
- Method: POST
- URL: /boxes/{boxId}/tags
- Request JSON: `{ "tag_id": "uuid" }`
- Errors: 400 Validation, 409 Conflict (exists), 400 Too Many Tags

#### Remove Tag from Box
- Method: DELETE
- URL: /boxes/{boxId}/tags/{tagId}
- Success: 204 No Content

### 2.5 Flashcards

#### List Flashcards
- Method: GET
- URL: /boxes/{boxId}/flashcards
- Query Params: page, per_page

#### Create Flashcard (Manual or AI)
- Method: POST
- URL: /boxes/{boxId}/flashcards
- Request JSON (manual):
  ```json
  { "front": "Q?", "back": "A." }
  ```
- Request JSON (AI): include optional:
  ```json
  { "front": "AI Q?", "back": "AI A.", "is_ai_generated": true,
    "generation_info": {...} }
  ```
- Success: 201 Created
- Errors: 400 Validation

#### Get Flashcard
- Method: GET
- URL: /boxes/{boxId}/flashcards/{flashcardId}

#### Update Flashcard
- Method: PUT
- URL: /boxes/{boxId}/flashcards/{flashcardId}
- Request JSON: `{ "front": "...", "back": "..." }`

#### Delete Flashcard
- Method: DELETE
- URL: /boxes/{boxId}/flashcards/{flashcardId}

#### Bulk Create Flashcards
- Method: POST
- URL: /boxes/{boxId}/flashcards/bulk
- Description: Create multiple flashcards in one request.
- Request JSON:
  ```json
  [
    { "front": "Question1", "back": "Answer1" },
    { "front": "Question2", "back": "Answer2", "is_ai_generated": true, "generation_info": {...} }
  ]
  ```
- Response JSON:
  ```json
  [
    { /* created flashcard object */ },
    { /* created flashcard object */ }
  ]
  ```
- Success: 201 Created
- Errors: 400 Validation (if any flashcard fails), 409 Conflict (duplicate content or constraints)

### 2.6 AI Generation

#### Generate Flashcards
- Method: POST
- URL: /ai/flashcards
- Request JSON:
  ```json
  { "text": "source text", "count": 10 }
  ```
- Response JSON:
  ```json
  { "suggestions": [ {"id":"tmp-1","front":"...","back":"...","generation_info":{...}} ] }
  ```
- Errors: 400 (empty text, count out of range), 429 Rate Limit

### 2.7 Generation Logs

#### List User Generation Logs
- Method: GET
- URL: /generation-log

#### Get Single Log
- Method: GET
- URL: /generation-log/{logId}


## 3. Authentication and Authorization
- All non-auth endpoints require `Authorization: Bearer <token>`
- JWT issued by Supabase Auth
- Row-Level Security enforced in DB (see `public.boxes`, `public.flashcards`, etc.)
- Additional server-side checks for ownership

## 4. Validation and Business Logic


### Boxes
- Name: required, unique per user
- Description: optional
- Soft delete: `DELETE` sets `is_deleted = true`
- Flashcard count auto-updated via `update_flashcard_count` trigger
- User ownership enforced by RLS

### Flashcards
- Front: required
- Back: required
- `is_ai_generated`: boolean, default `false`
- Soft delete: `DELETE` sets `is_deleted = true`
- Bulk create: atomic operation, fails completely on any validation error
- Flashcards belong to a box; ownership enforced by RLS

### Tags
- Name: required, unique global (CITEXT, case-insensitive)
- Created_at timestamp auto-set

### Box Tags
- Unique `(box_id, tag_id)` enforced by unique index
- Max 10 tags per box enforced by `trg_box_tags_limit` trigger
- Ownership enforced by RLS

### AI Generation
- Text length: up to 10000 characters
- Count: integer between 1 and 50
- Rate limited (e.g., 10 req/min)
- Suggestions ephemeral until saved to a box

### Generation Logs
- `user_id`: must match auth user
- `flashcard_id`: optional link to flashcard
- `original_front`/`original_back`: stored for audit
- `status`: enum ['accepted','rejected','edited']
- `generation_info`: flexible JSONB metadata
- RLS ensures users only see their own logs

### Study Sessions
- Session `status`: enum ['active','paused','ended']
- Review `difficulty`: integer 1-4
- Progress and review logs persisted in `review_logs`
- Next flashcard selection driven by FSRS algorithm