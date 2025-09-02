ApusAI = require('@apus/ai')
local json = require('json')

local m = {}

local dataset = {}

ApusAI_Debug = true

local default_prompt = [[
  You are an AI indexer for the Arweave data lake. Your task is to process any input data (text, JSON, markdown, code, PDF text, blog post, dataset, metadata, etc.) and produce a structured, indexable Lua table that makes the data easily searchable. 

  Steps:  
  1. Detect content type (e.g., text, markdown, json, pdf-extracted text, html, image metadata, audio transcript, code).  
  2. Extract a summary (2–3 sentences for human readability).  
  3. Extract keywords (5–20, lowercase, no duplicates).    
  4. Extract topics (broad domains: e.g., “finance”, “ai research”, “art”, “social media”).  
  5. Generate tags (short, flexible labels for filtering).  
  6. If available, include transaction metadata (e.g., txId, owner, timestamp, contentType).  
  7. Detect primary language of the content and return it as a standard ISO 639-1 code (e.g., "en", "fr", "nl", "zh").  
  8. Perform a safety analysis of the text and classify it under:  
   - category: "safe", "sensitive", or "unsafe"  
   - reasons: short bullet-style reasons for the classification  
   - severity: "low", "medium", or "high"  

  Important: Return only valid Lua code with this schema below.

  {
    id = "string",
    owner = "string",
    timestamp = "string",
    contentType = "string",
    summary = "string",
    language = "string",
    keywords = { "string", "string" },
    topics = { "string", "string" },
    tags = { "string", "string" },
    safety = {
    category = "string",
    reasons = { "string", "string" },
    severity = "low|medium|high"
  }

  Do not include any explanations, comments, code fences, or formatting (no ```lua). 
  Only output the Lua table starting with { and ending with }.
]]


Handlers.add("index-transaction", function(msg)
  local transaction_to_index = msg.Data
  assert(transaction_to_index, "No transaction data provided")

  local prompt = m.generatePrompt(transaction_to_index)
  local options = {
    max_tokens = 30000
  }

  ApusAI.infer(prompt, options, function(err, result)
    if err then
      print("Error during inference: " .. err)
      return
    end
    table.insert(dataset, result.data)
    print(result.data)
  end)
end)

Handlers.add("Search", function(msg)
  assert(msg.Data, "No search query provided")
  local result = m.search_table(msg.Data)
  print(json.encode(result))
end)



function m.generatePrompt(transaction_data)
  return string.format("%s\nInput Data:\n%s", default_prompt, transaction_data)
end


function m.search_table(query)
    local results = {}
    local query_lower = string.lower(query)
    
    for i, entry in ipairs(dataset) do
        local match = false
        local score = 0
        
        local text_fields = {"summary", "contentType", "language"}
        for _, field in ipairs(text_fields) do
            if entry[field] and type(entry[field]) == "string" then
                if string.lower(entry[field]):find(query_lower, 1, true) then
                    match = true
                    score = score + (field == "summary" and 3 or 1)  -- Summary gets higher weight
                end
            end
        end
        
        local array_fields = {"keywords", "topics", "tags"}
        for _, field in ipairs(array_fields) do
            if entry[field] and m.contains_value(entry[field], query) then
                match = true
                score = score + 2  -- Array matches get medium weight
            end
        end
        
        if entry.id and entry.id == query then
            match = true
            score = score + 10  -- Exact ID match gets highest score
        end
        
        if match then
            table.insert(results, {
                index = i,
                entry = entry,
                score = score
            })
        end
    end
    
    -- Sort by relevance score (highest first)
    table.sort(results, function(a, b) return a.score > b.score end)
    
    return results
end

function m.contains_value(array, value)
    if type(array) ~= "table" then return false end
    
    for _, v in ipairs(array) do
        if type(v) == "string" and string.lower(v):find(string.lower(value), 1, true) then
            return true
        end
    end
    return false
end