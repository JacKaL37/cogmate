"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, ChevronDown, Plus, Download, Upload, Search, Terminal, FileText } from "lucide-react"

interface Prompt {
  id: string
  name: string
  content: string
  children: Prompt[]
}

const initialPrompts: Prompt = {
  id: "root",
  name: "Root",
  content: "Root content",
  children: [
    {
      id: "global",
      name: "Coolguy",
      content: "You are a cool guy.",
      children: [
        {
          id: "sub1",
          name: "Gottadance",
          content: "And you gotta dance.",
          children: [
            {
              id: "sub3",
              name: "Buns land",
              content: "Welcome to buns land!",
              children: []
            }
          ]
        },
        {
          id: "sub2",
          name: "HairOnFire",
          content: "And your hair is on fire.",
          children: []
        },
        {
          id: "sub4",
          name: "Hair everywhere!",
          content: "There's hair all over the place!",
          children: []
        }
      ]
    }
  ]
}

export default function Component() {
  const [prompts, setPrompts] = useState<Prompt>(initialPrompts)
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null)
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(["root"]))
  const [searchTerm, setSearchTerm] = useState("")

  const toggleNode = (id: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const renderPromptTree = (prompt: Prompt, depth = 0) => {
    const isExpanded = expandedNodes.has(prompt.id)
    if (!prompt.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return null
    }
    return (
      <div key={prompt.id} className={depth === 0 ? "" : "ml-6"}>
        <div 
          className={`flex items-center cursor-pointer p-1 ${selectedPrompt?.id === prompt.id ? 'bg-purple-700' : 'hover:bg-purple-800'}`}
          onClick={() => setSelectedPrompt(prompt)}
        >
          {prompt.children.length > 0 && (
            <span onClick={(e) => { e.stopPropagation(); toggleNode(prompt.id) }}>
              {isExpanded ? <ChevronDown className="h-4 w-4 text-cyan-500" /> : <ChevronRight className="h-4 w-4 text-cyan-500" />}
            </span>
          )}
          <FileText className="h-4 w-4 text-fuchsia-500 ml-1 mr-2" />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="ml-1 text-white truncate max-w-[150px]">{prompt.name}</span>
              </TooltipTrigger>
              <TooltipContent>
                <p>{prompt.name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        {isExpanded && prompt.children.map(child => renderPromptTree(child, depth + 1))}
      </div>
    )
  }

  const addPrompt = () => {
    if (selectedPrompt) {
      const newPrompt: Prompt = {
        id: Date.now().toString(),
        name: "New Prompt",
        content: "",
        children: []
      }
      setPrompts(updatePromptTree(prompts, selectedPrompt.id, prompt => ({
        ...prompt,
        children: [...prompt.children, newPrompt]
      })))
      setSelectedPrompt(newPrompt)
      setExpandedNodes(prev => new Set([...prev, selectedPrompt.id]))
    }
  }

  const updatePromptTree = (root: Prompt, id: string, updateFn: (prompt: Prompt) => Prompt): Prompt => {
    if (root.id === id) {
      return updateFn(root)
    }
    return {
      ...root,
      children: root.children.map(child => updatePromptTree(child, id, updateFn))
    }
  }

  const updateSelectedPrompt = (field: 'name' | 'content', value: string) => {
    if (selectedPrompt) {
      setPrompts(updatePromptTree(prompts, selectedPrompt.id, prompt => ({
        ...prompt,
        [field]: value
      })))
      setSelectedPrompt({ ...selectedPrompt, [field]: value })
    }
  }

  const exportPrompts = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(prompts))
    const downloadAnchorNode = document.createElement('a')
    downloadAnchorNode.setAttribute("href", dataStr)
    downloadAnchorNode.setAttribute("download", "prompts.json")
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
  }

  const importPrompts = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result
        if (typeof content === 'string') {
          try {
            const importedPrompts = JSON.parse(content)
            setPrompts(importedPrompts)
          } catch (error) {
            console.error("Error parsing JSON:", error)
          }
        }
      }
      reader.readAsText(file)
    }
  }

  const getPromptPath = (prompt: Prompt): Prompt[] => {
    const path: Prompt[] = []
    const findPath = (node: Prompt, targetId: string): boolean => {
      path.push(node)
      if (node.id === targetId) {
        return true
      }
      for (const child of node.children) {
        if (findPath(child, targetId)) {
          return true
        }
      }
      path.pop()
      return false
    }
    findPath(prompts, prompt.id)
    return path
  }

  const getCurrentPrompt = (prompt: Prompt): string => {
    const path = getPromptPath(prompt)
    return path.map(p => `---\n**${p.name}**: ${p.content}\n`).join('')
  }

  const outputCurrentPrompt = () => {
    if (selectedPrompt) {
      const hierarchicalPrompt = getCurrentPrompt(selectedPrompt)
      console.log("===============\nHierarchical Prompts:\n" + hierarchicalPrompt + "===============")
    }
  }

  const getChildPrompts = (prompt: Prompt): Prompt[] => {
    return prompt.children
  }

  return (
    <div className="flex h-screen bg-black text-white">
      <div className="w-1/3 p-4 bg-indigo-900 bg-opacity-50 backdrop-blur-lg overflow-auto">
        <h2 className="text-xl font-bold mb-4 text-cyan-500">Prompt Browser</h2>
        <div className="relative mb-4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search prompts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 bg-purple-800 text-white border-purple-700 focus:border-fuchsia-500"
          />
        </div>
        {renderPromptTree(prompts)}
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={addPrompt} disabled={!selectedPrompt} className="bg-fuchsia-600 hover:bg-fuchsia-700">
            <Plus className="h-4 w-4" />
          </Button>
          <Button onClick={exportPrompts} className="bg-cyan-600 hover:bg-cyan-700">
            <Download className="h-4 w-4" />
          </Button>
          <Button onClick={() => document.getElementById('file-input')?.click()} className="bg-indigo-600 hover:bg-indigo-700">
            <Upload className="h-4 w-4" />
          </Button>
          <Button onClick={outputCurrentPrompt} disabled={!selectedPrompt} className="bg-purple-600 hover:bg-purple-700">
            <Terminal className="h-4 w-4" />
          </Button>
          <input
            id="file-input"
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            onChange={importPrompts}
          />
        </div>
      </div>
      <div className="w-2/3 p-4 bg-purple-900 bg-opacity-50 backdrop-blur-lg overflow-auto">
        <h2 className="text-xl font-bold mb-4 text-fuchsia-500">Prompt Editor</h2>
        {selectedPrompt ? (
          <Card className="bg-purple-800 border-purple-700">
            <CardContent className="p-4">
              <div className="mb-4 flex flex-wrap gap-2">
                {getPromptPath(selectedPrompt).map((prompt, index) => (
                  <Badge
                    key={prompt.id}
                    variant="outline"
                    className="cursor-pointer hover:bg-purple-700"
                    onClick={() => setSelectedPrompt(prompt)}
                  >
                    {prompt.name}
                  </Badge>
                ))}
              </div>
              <Input
                value={selectedPrompt.name}
                onChange={(e) => updateSelectedPrompt('name', e.target.value)}
                placeholder="Prompt Name"
                className="mb-4 bg-purple-900 text-white border-purple-700 focus:border-fuchsia-500"
              />
              <Textarea
                value={selectedPrompt.content}
                onChange={(e) => updateSelectedPrompt('content', e.target.value)}
                placeholder="Enter your prompt here..."
                className="h-64 mb-4 bg-purple-900 text-white border-purple-700 focus:border-fuchsia-500"
              />
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2 text-cyan-500">Child Prompts</h3>
                <div className="flex flex-wrap gap-2">
                  {getChildPrompts(selectedPrompt).map((childPrompt) => (
                    <Badge
                      key={childPrompt.id}
                      variant="outline"
                      className="cursor-pointer hover:bg-purple-700"
                      onClick={() => setSelectedPrompt(childPrompt)}
                    >
                      {childPrompt.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <p className="text-cyan-400">Select a prompt to edit</p>
        )}
      </div>
    </div>
  )
}