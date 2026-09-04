# Architecture Diagrams - CrackMyCS AI

This directory contains Mermaid diagram files for the CrackMyCS AI project architecture and flow.

## Available Diagrams

1. **architecture-hld.mmd** - High-Level Design (HLD) architecture diagram showing all system layers
2. **sequence-flow.mmd** - Sequence diagram showing the request-response flow
3. **rag-pipeline-flow.mmd** - Detailed RAG pipeline data flow
4. **data-flow-architecture.mmd** - Data flow architecture showing ingestion and query phases
5. **component-interaction.mmd** - Component interaction matrix

## How to View These Diagrams

### Option 1: Online Mermaid Editor (Easiest)
1. Go to [Mermaid Live Editor](https://mermaid.live/)
2. Copy the content from any `.mmd` file
3. Paste it into the editor
4. The diagram will render automatically
5. You can export as PNG/SVG using the menu

### Option 2: VS Code Extension
1. Install the "Mermaid Preview" extension in VS Code
2. Open any `.mmd` file
3. Right-click and select "Open Preview" or use Ctrl+Shift+V
4. The diagram will render in the preview pane

### Option 3: Command Line (Requires Node.js)
```bash
# Install mermaid-cli
npm install -g @mermaid-js/mermaid-cli

# Convert to PNG
mmdc -i architecture-hld.mmd -o architecture-hld.png

# Convert to SVG
mmdc -i architecture-hld.mmd -o architecture-hld.svg
```

### Option 4: GitHub/GitLab
- Upload these files to GitHub/GitLab
- They will automatically render in the repository viewer
- Works in README.md files, issues, and wikis

### Option 5: Documentation Tools
- **Notion**: Paste mermaid code in a code block with "mermaid" syntax
- **Confluence**: Use Mermaid macro
- **Obsidian**: Built-in Mermaid support
- **Markdown files**: Most markdown editors support Mermaid

## Diagram Descriptions

### architecture-hld.mmd
Shows the complete system architecture with 5 main layers:
- Client Layer (Next.js Frontend)
- API Layer (FastAPI Backend)
- AI/ML Pipeline Layer (LangChain, Pinecone, Groq)
- Data Layer (Knowledge Base, Vector Index)
- Deployment Layer (Vercel, Render)

### sequence-flow.mmd
Shows the step-by-step sequence of a user query from input to response, including all component interactions.

### rag-pipeline-flow.mmd
Detailed flow of the Retrieval-Augmented Generation pipeline, showing how queries are embedded, searched, and enhanced with web results.

### data-flow-architecture.mmd
Shows both the ingestion phase (building the vector index) and query phase (using the index for responses).

### component-interaction.mmd
Component-level interaction matrix showing how individual files and modules interact within the frontend, backend, and AI layers.

## Export Formats
The diagrams can be exported to:
- **PNG** - Raster image for documents/presentations
- **SVG** - Vector image for web/scalable graphics
- **PDF** - For documentation
- **HTML** - Interactive web versions