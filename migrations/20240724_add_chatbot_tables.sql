-- Create ENUM type for message role
CREATE TYPE "public"."message_role" AS ENUM (
    'user',
    'assistant',
    'system'
);

-- Table for storing chatbot conversations
CREATE TABLE "public"."chatbot_conversations" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    "title" text NOT NULL,
    "created_at" timestamptz NOT NULL DEFAULT now(),
    "updated_at" timestamptz NOT NULL DEFAULT now()
);
-- Add comments to the table and columns
COMMENT ON TABLE "public"."chatbot_conversations" IS 'Stores ongoing conversations for the chatbot feature.';
COMMENT ON COLUMN "public"."chatbot_conversations"."user_id" IS 'The user who initiated the conversation.';
COMMENT ON COLUMN "public"."chatbot_conversations"."title" IS 'Auto-generated title for the conversation.';

-- Table for storing individual chatbot messages
CREATE TABLE "public"."chatbot_messages" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "conversation_id" uuid NOT NULL REFERENCES public.chatbot_conversations(id) ON DELETE CASCADE,
    "role" message_role NOT NULL,
    "content" text NOT NULL,
    "image_urls" text[],
    "created_at" timestamptz NOT NULL DEFAULT now()
);
-- Add comments to the table and columns
COMMENT ON TABLE "public"."chatbot_messages" IS 'Stores individual messages within a chatbot conversation.';
COMMENT ON COLUMN "public"."chatbot_messages"."conversation_id" IS 'The conversation this message belongs to.';
COMMENT ON COLUMN "public"."chatbot_messages"."role" IS 'The role of the sender (user, assistant, or system).';
COMMENT ON COLUMN "public"."chatbot_messages"."content" IS 'The text content of the message.';
COMMENT ON COLUMN "public"."chatbot_messages"."image_urls" IS 'Array of URLs for any images attached to the message.';

-- Table for storing analysis of images from the chatbot
CREATE TABLE "public"."chatbot_image_analysis" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "image_url" text NOT NULL,
    "analysis" jsonb,
    "created_at" timestamptz NOT NULL DEFAULT now(),
    "expires_at" timestamptz
);
-- Add comments to the table and columns
COMMENT ON TABLE "public"."chatbot_image_analysis" IS 'Stores the results of image analysis from OpenAI.';
COMMENT ON COLUMN "public"."chatbot_image_analysis"."image_url" IS 'The URL of the analyzed image.';
COMMENT ON COLUMN "public"."chatbot_image_analysis"."analysis" IS 'The JSON response from the analysis service.';
COMMENT ON COLUMN "public"."chatbot_image_analysis"."expires_at" IS 'When the cached analysis expires.';

-- Add indexes for faster queries
CREATE INDEX "chatbot_conversations_user_id_idx" ON "public"."chatbot_conversations"("user_id");
CREATE INDEX "chatbot_messages_conversation_id_idx" ON "public"."chatbot_messages"("conversation_id"); 