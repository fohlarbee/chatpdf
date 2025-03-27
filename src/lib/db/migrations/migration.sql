-- Step 1: Create new tables with id as VARCHAR(256)
CREATE TABLE _chats (
    id VARCHAR(256) PRIMARY KEY,
    pdf_name TEXT NOT NULL,
    pdf_url TEXT NOT NULL,
    user_id VARCHAR(256) NOT NULL,
    file_key TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE _messages (
    id VARCHAR(256) PRIMARY KEY,
    chat_id VARCHAR(256) NOT NULL,
    content TEXT NOT NULL,
    role user_system_enum NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Step 2: Insert data from old tables while converting id to text
INSERT INTO _chats (id, pdf_name, pdf_url, user_id, file_key, created_at)
SELECT id::TEXT, pdf_name, pdf_url, user_id, file_key, created_at FROM chats;

INSERT INTO _messages (id, chat_id, content, role, created_at)
SELECT id::TEXT, chat_id::TEXT, content, role, created_at FROM messages;

-- Step 3: Drop the original tables
DROP TABLE messages;
DROP TABLE chats;

-- Step 4: Rename the new tables to replace the old ones
ALTER TABLE _chats RENAME TO chats;
ALTER TABLE _messages RENAME TO messages;

-- Step 5: Re-add foreign key constraint
ALTER TABLE messages ADD CONSTRAINT messages_chat_id_fkey FOREIGN KEY (chat_id) REFERENCES chats(id);
