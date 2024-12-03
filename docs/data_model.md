

MVP:
- user_id
- conversations_data
- current_chat
- prompt_data


Chat:
- history
- prompt_id
- prompt_path
- model_config



UserData:
- user_id: str
- conversations: [Chat]
- current_chat: Chat
- prompts: 
  - prompt_trees: [PromptTree]
  - standalone_prompts: [Prompt]
  - quick_prompts: [QuickPrompt]


AppState:
- prompting_views:
  - prompt_selected: Prompt
- chat_views:
  - current_participant: Participant
  - 



Chat:
- chat_history: [Message]
- artifacts: [Artifact]
- title: str
- participants: [Participant]

Artifact:
- text: str
- undo_history: [str]


Message:
- ai:
  - role: "user" | "assistant" | "system"
  - content: str
  - attachments


Participant: 
- prompt_tree_path: str
- quick_prompts: [QuickPrompt]
- color: color

Prompt:
- name: str
- prompt: str
- siblings: 
- color: color
- emoji: emoji


PromptTree:


PromptTreeNode:

// not totally certain I need this distinction.

    PromptTree: nested hierarchy of cascading prompts for project task decomposition. 
    - prompt_tree: 🌱Prompt 
    - prompt: str // computed from prompt_tree and given prompt_path

    QuickPrompt: small prompts made to be mixed in anywhere. toggles on and off. 
    - prompt: str





AHA! the machine and I have come to a consensus on how to jam this biz. 

```json
{
  "ui": {
    "editor": {
      "currentPath": ["root", "development", "model-architecture"], // IDs that form path
      "isEditing": false,
      "scrollPosition": 0
    }
  },
  "nodes": {
    // Flat storage of all nodes by ID
    "root": {
      "id": "root",
      "title": "Project Assistant",
      "prompt": "This is the root node...",
      "childIds": ["development", "research", "evaluation"]
    },
    "development": {
      "id": "development",
      "title": "Development",
      "prompt": "Guide the development process...",
      "childIds": ["model-architecture", "data-pipeline"],
      "parentId": "root"
    },
    "model-architecture": {
      "id": "model-architecture",
      "title": "Model Architecture",
      "prompt": "Design and implement...",
      "childIds": [],
      "parentId": "development"
    }
  },
  "display": {
    "hierarchyView": {
      "isExpanded": true,
      "height": 250,
      "theme": {
        "current": "text-fuchsia-500",
        "parent": "text-white"
      }
    }
  }
}
```

Workspaces model for adding multiple projects
```json
{
  "workspaces": {
    "activeWorkspaceId": "ws1",
    "byId": {
      "ws1": {
        "id": "ws1",
        "name": "AI Project Assistant",
        "nodes": {
          "root": { /* node data */ },
          "research": { /* node data */ }
        },
        "ui": {
          "currentPath": ["root", "research"]
        }
      },
      "ws2": {
        "id": "ws2",
        "name": "Marketing Prompts",
        "nodes": { /* ... */ }
      }
    }
  }
}
```


Sort of a hybrid:
```json
{
  "nodes": {
    // Flat pool of all nodes
    "ws1-root": {
      "id": "ws1-root",
      "title": "AI Assistant",
      "prompt": "...",
      "childIds": ["node2", "node3"],
      "parentId": null,
      "workspaceId": "ws1"  // Back reference to workspace
    },
    "node2": {
      "id": "node2",
      "parentId": "ws1-root",
      "childIds": [],
      "workspaceId": "ws1"
    },
    "ws2-root": {
      "id": "ws2-root",
      "title": "Marketing Suite",
      "parentId": null,
      "workspaceId": "ws2"
    }
  },
  
  "workspaces": {
    "active": "ws1",
    "byId": {
      "ws1": {
        "id": "ws1",
        "name": "AI Project",
        "rootId": "ws1-root",  // Single root reference
        "ui": {
          "currentPath": ["ws1-root", "node2"],
          "expanded": ["ws1-root"]
        }
      }
    }
  }
}
```

for generating the IDs of nodes. 
```js
// ID generation utilities
const generateNodeId = (workspaceId: string) => {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 7)
  return `${workspaceId}_n_${timestamp}_${random}`
}

const generateWorkspaceId = () => {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 7)
  return `ws_${timestamp}_${random}`
}

// Example IDs:
// Workspace: "ws_lrq4z9_x7c2p"
// Node: "ws_lrq4z9_x7c2p_n_lrq4za_8k3mp"
```

for validating the tree integrity
```js
type ValidationResult = {
  orphanedNodes: string[];
  invalidParentRefs: string[];
  danglingChildren: string[];
}

const validateTreeIntegrity = (nodes: Record<string, PromptNode>): ValidationResult => {
  return {
    orphanedNodes: Object.values(nodes)
      .filter(n => n.parentId && !nodes[n.parentId])
      .map(n => n.id),
    invalidParentRefs: Object.values(nodes)
      .filter(n => n.parentId && !n.id.startsWith(n.parentId.split('_n_')[0]))
      .map(n => n.id),
    danglingChildren: Object.values(nodes)
      .filter(n => n.childIds.some(childId => !nodes[childId]))
      .map(n => n.id)
  }
}
```