
# Interface

lots of Panels

Tabs for multiple conversations (dropdown for mobile)

co-panel for artifacts (slide-up drawer for mobile)
- sibling to the chat panel

side panels for prompt browsing, settings, and conversation histories



# ISSUES

get the streaming workin' proper.


# FEATURES

Chat system:
- chats have:
  - conversation history
  - active artifact/document
  - name (gathered after inactivity)
  - summary (gathered after inactivity)
  - current prompt selection
    - this can change between messages, but it's always maintained
- multiple tabs: you can open MULTIPLE CHATS IN MULTIPLE TAAAAABSSSS
- philosophically, this is the core `document` of the app. 
  - This is what the user spends their time creating here with the AI tagging in
  - It's the document, it's 


Artifacts:
- belong to conversations
- they represent the shared "world" between the user and the AI, and the work we're producing
- can have multiple versions logged
  - cache versions on every send-- send==save
  - (maybe make use of a diff for efficiency's sake)
- they send their state in a json blob.
- stretch goals: 
  - AI function calls for this front-end to send edits directly into the editer by way of the diff visualizations in monaco
  - would also cache version iterations that have been sent here. 
- The key though is that the state is always whatever it was *when* the user sends the message.


Tool toggles:
- search duck-duck-go
- search archiv
- get weather

Agents: 
- I think we aren't looking for `autonomous` agent workflows in this application
- but we may want `directed` agent workflows.
  - user can say "give it to this agent, and then to this agent" if, say, you want a second agent to critique the work of the first agent. 
  - prompt sequestration: the "another pair of eyes" effect 


Monaco editor for the artifact interface.
- (toggle for markdown preview)
- save, download, copy, etc
- the data model is 1 per conversation, and it never dissipates 
	- though it can be toggled as to whether you send it to the AI at all
	- this is where a Routing Agent is a GREAT idea for most of these tools.
- provides context: 
  - buffer state
  - current line
  - current highlighted selection
  - [ continue on copying the crap they did in open-canvas ]


Kiln for fucking around(?)

Prompt browser: hierarchical (project prompts) + atomic (mix-in prompts)

hierarchical:
- user defined prompt tree

mix-ins: 
- ad-hoc singletons
- e.g., default will be to have the `vibe: cogmate` and `skill: wiki refrence`


Prompts: 
- name
- prompt
- tool list (?)
- attachments (?)
  - static files you want to show up every time
  - ? how brows pdf?
  - text good tho!
- 




# Philosophies

Project prompts capture a `project/task/workspace space`
blends elements of:
- RAG-- as in, extending the model's reach into concepts by attaching documents, but doing so **manually** and not relying on a fuzzy-search automation to handle it
- Agents-- the USER is the managing agent, and is the one delegating tasks and transferring artifacts between prompts, BUT IN THE SAME CONVERSATION THREAD. 

The human is centered, and the project task space is populated with various "stations" beneficial and tuned to different kinds of work. 


# TECH

Fuse.js - fuzzy search on the frontend, hmm. 

