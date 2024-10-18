
# ISSUES

get the streaming workin' proper.


# FEATURES

Tool toggles:
- search duck-duck-go
- search archiv
- get weather

I think we aren't looking for `autonomous` agent workflows in this application
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

