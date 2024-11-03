Flourishes: Colorful gradient decline of prompts, so the Root is fuchsia and it shifts toward cyan with each passing pill, and into Cerise when you get a bit too deep, lol. 

Add an atomic prompt browser sub-panel attached to the prompt browser.  So the hierarchical one is on top, and they can sort of accordion stack, however that works, but on the bottom: the atomic prompting mix-ins. Uncategorized, non-hieararchical. 

All prompts should get tags. For Project Prompts, this is convenient. For mix-in, toggleable prompts, this is the primary mode of interaction-- filtering by tags, and a decent search function. 

Make the prompt body have a carriage return after "**name:**" from the title, instead of a space. 

Squunch the chevron to overlap with the page icon in the browser-- the icon needs to be icon-width. 

Need a delete button for a given prompt. 


Prompts can be added to a chat as a discussant:
- by default, 1 ai and 1 user discussant
- the prompt chosen is displayed above the input box in pill-scroll format
  - now the user can select which discussant will reply to the next message


Three types of prompts: 
- Base prompts (only 1 can be selected at a time), displayed like a file tree
  - Project Prompts, which inherit project prompts 
  - Single Prompts, which use a single prompt
  - might keep these separate on the interface, I dunno
- Mix-in Prompts, which are all appended to the system prompt additively. 
  - using a searchable checkbox system (tags and search, blah blah) 
    - ^ should be able to specify order... 
  - e.g.: "Values: socratic yadda yadda", "Personality: you're a yadda yadda", "Current Task: work with the user to yadda yadda"




Agents are given "workspaces" in the form of a filetree:
- file folders in the user's filespace (i.e., database)
- for each user and each conversation:
  - they follow the same structure as the project prompts
    - this is where agents can download or create files for use in case of file-writing prompts.
    - and those folders can also be where the agents' attachments are stored


Evolving prompts into agents:
- add tools
  - tools are inherited in project prompts
- add context providers
  - from whatever systems are available /shrug 
- Human User is left to be the one wielding the agents every step of the conversation. 
  - Human-In-Loop-Optimization, baby. 



Icon ideas:
- Prompts with children, closed
- Prompts with children, open
- Prompts without children

current: [chevron-right, chevron-down, nothing at all]

lucide options:
closed: 
- book-text, book-open-text, file-text
