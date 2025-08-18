# Chatbot Feature Documentation

## Overview
The chatbot feature provides an AI-powered assistant that allows users to have natural language conversations, share images, and get help with their service-related questions. The chatbot is integrated with OpenAI's GPT-4 for natural language understanding and can analyze images when provided.

## Features

- **Real-time Chat**: Users can have conversations with the AI assistant in real-time.
- **Image Sharing**: Users can upload or take photos to get visual assistance.
- **Conversation History**: All conversations are saved and can be revisited.
- **Responsive Design**: Works on both desktop and mobile devices.
- **Secure Authentication**: Integrated with the existing authentication system.

## Database Schema

The chatbot uses the following database tables:

### `chatbot_conversations`
- `id` (UUID): Primary key
- `user_id` (UUID): Reference to the user who owns the conversation
- `title` (TEXT): Title of the conversation (auto-generated from first message)
- `created_at` (TIMESTAMPTZ): When the conversation was created
- `updated_at` (TIMESTAMPTZ): When the conversation was last updated

### `chatbot_messages`
- `id` (UUID): Primary key
- `conversation_id` (UUID): Reference to the parent conversation
- `role` (ENUM): 'user', 'assistant', or 'system'
- `content` (TEXT): The message content
- `image_urls` (TEXT[]): Array of image URLs attached to the message
- `created_at` (TIMESTAMPTZ): When the message was created

### `chatbot_image_analysis`
- `id` (UUID): Primary key
- `image_url` (TEXT): URL of the analyzed image
- `analysis` (JSONB): Analysis results from OpenAI
- `created_at` (TIMESTAMPTZ): When the analysis was performed
- `expires_at` (TIMESTAMPTZ): When the analysis cache expires

## Environment Variables

Add these to your `.env.local` file:

```
# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## API Endpoints

### `GET /api/chatbot/conversations`
List all conversations for the current user.

### `POST /api/chatbot/conversations`
Create a new conversation.

### `GET /api/chatbot/conversations/:conversationId`
Get a specific conversation with its messages.

### `PATCH /api/chatbot/conversations/:conversationId`
Update a conversation (e.g., change title).

### `DELETE /api/chatbot/conversations/:conversationId`
Delete a conversation and its messages.

### `POST /api/chatbot/conversations/:conversationId/messages`
Send a new message in a conversation.

### `POST /api/chatbot/upload`
Upload an image for analysis.

## Components

### ChatContainer
Main container component that manages the chat state and renders the UI.

### MessageList
Displays the list of messages in a conversation.

### MessageItem
Renders an individual message with proper styling based on the sender.

### ChatInput
Handles user input, including text messages and image uploads.

### CameraPreview
Provides camera access and photo capture functionality.

## Setup Instructions

1. Run the database migrations to create the required tables:
   ```sql
   -- Run this in your Supabase SQL editor
   -- (Content from supabase/migrations/20240612131300_add_chatbot_tables.sql)
   ```

2. Install the required dependencies:
   ```bash
   npm install openai @supabase/supabase-js @supabase/auth-helpers-nextjs @supabase/auth-helpers-react @supabase/supabase-js @types/uuid uuid
   ```

3. Set up the environment variables in `.env.local`.

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Access the chatbot at `/chatbot`.

## Testing

To test the chatbot:

1. Log in to your account.
2. Navigate to the chatbot page.
3. Send a message or upload an image to start a conversation.
4. Verify that messages are saved and can be retrieved after page refresh.

## Future Improvements

1. Implement real-time updates using Supabase Realtime.
2. Add support for more file types (PDFs, documents).
3. Implement rate limiting for API endpoints.
4. Add more sophisticated error handling and user feedback.
5. Implement conversation search functionality.
6. Add support for multiple languages.
7. Implement analytics for conversation quality and user satisfaction.
