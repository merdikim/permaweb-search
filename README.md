# Technical Documentation: Arweave AI Indexer

## Overview
This project implements an **AI-powered indexing system** for the **Arweave data lake**.  
It leverages the `@apus/ai` inference engine to analyze transactions and convert raw content into structured, searchable Lua tables.  

The system is designed to:
- Process transactions (text, JSON, markdown, code, PDF text, blog posts, metadata, etc.).
- Extract summaries, keywords, topics, tags, and language.
- Perform safety classification.
- Store structured results in a dataset.
- Provide search and retrieval capabilities over the indexed dataset.

---

## Key Components

### Dependencies
- `@apus/ai` → AI inference engine.
- `json` → JSON encoding/decoding.
- `Handlers` → Message routing and event handling.
- `Send` → Inter-service communication.

---

### Global Variables
- `ApusAI_Debug = true` → Enables debug logging.
- `dataset = {}` → Stores indexed transaction results.
- `default_prompt` → Instruction set given to the AI model for indexing tasks.

---

### Prompt Schema
The AI is instructed to output a Lua table with the following structure:

```lua
{
  id = "string",
  owner = "string",
  timestamp = "string",
  contentType = "string",
  summary = "string",
  language = "string",
  keywords = { "string", ... },
  topics = { "string", ... },
  tags = { "string", ... },
  safety = {
    category = "safe|sensitive|unsafe",
    reasons = { "string", ... },
    severity = "low|medium|high"
  }
}
