'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useSwipeable } from 'react-swipeable'
import { ChevronLeft, ChevronRight, ChevronUp, Plus, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

type PromptNode = {
  id: string
  title: string
  prompt: string
  children: PromptNode[]
  parent: PromptNode | null
}

const createNode = (id: string, title: string, prompt: string, parent: PromptNode | null): PromptNode => ({
  id,
  title,
  prompt,
  children: [],
  parent
})

const findNodeById = (node: PromptNode, id: string): PromptNode | null => {
  if (node.id === id) return node
  for (const child of node.children) {
    const found = findNodeById(child, id)
    if (found) return found
  }
  return null
}

const getPathToNode = (node: PromptNode, targetId: string): PromptNode[] => {
  if (node.id === targetId) return [node]
  for (const child of node.children) {
    const path = getPathToNode(child, targetId)
    if (path.length > 0) return [node, ...path]
  }
  return []
}

export default function PromptTreeEditor() {
  const [tree, setTree] = useState<PromptNode>(() => {
    const root = createNode('root', 'AI Project Assistant', 'This is the root node of our AI project assistant. It contains overall project description and status information.', null)
    
    const research = createNode('research', 'Research', 'Conduct thorough research on AI technologies and methodologies relevant to our project.', root)
    root.children.push(research)
    
    const literatureReview = createNode('literature-review', 'Literature Review', 'Review recent academic papers and articles on AI advancements.', research)
    const marketAnalysis = createNode('market-analysis', 'Market Analysis', 'Analyze current AI products and services in the market.', research)
    research.children.push(literatureReview, marketAnalysis)
    
    const development = createNode('development', 'Development', 'Guide the development process of our AI project.', root)
    root.children.push(development)
    
    const modelArchitecture = createNode('model-architecture', 'Model Architecture', 'Design and implement the AI model architecture.', development)
    const dataPipeline = createNode('data-pipeline', 'Data Pipeline', 'Develop robust data ingestion and preprocessing pipelines.', development)
    development.children.push(modelArchitecture, dataPipeline)
    
    const evaluation = createNode('evaluation', 'Evaluation', 'Set up evaluation metrics and testing procedures for our AI system.', root)
    root.children.push(evaluation)
    
    return root
  })

  const [currentPath, setCurrentPath] = useState<PromptNode[]>([tree])
  const [siblings, setSiblings] = useState<PromptNode[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [currentPath])

  useEffect(() => {
    const currentNode = currentPath[currentPath.length - 1]
    if (currentNode.parent) {
      setSiblings(currentNode.parent.children)
      setCurrentIndex(currentNode.parent.children.findIndex(child => child.id === currentNode.id))
    } else {
      setSiblings([currentNode])
      setCurrentIndex(0)
    }
  }, [currentPath])

  const handlers = useSwipeable({
    onSwipedLeft: () => handleSwipe('next'),
    onSwipedRight: () => handleSwipe('prev'),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  })

  const handleSwipe = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentIndex > 0) {
      updatePath(siblings[currentIndex - 1].id)
    } else if (direction === 'next' && currentIndex < siblings.length - 1) {
      updatePath(siblings[currentIndex + 1].id)
    }
  }

  const updatePath = (id: string) => {
    const newPath = getPathToNode(tree, id)
    if (newPath.length > 0) {
      setCurrentPath(newPath)
    }
  }

  const handleAddChild = () => {
    const currentNode = currentPath[currentPath.length - 1]
    const newNode = createNode(`new-${Date.now()}`, 'New Child Node', 'Enter child prompt here', currentNode)
    
    const updatedNode = { ...currentNode, children: [...currentNode.children, newNode] }
    updateTree(updatedNode)
    updatePath(newNode.id)
  }

  const handleDelete = () => {
    const currentNode = currentPath[currentPath.length - 1]
    if (currentNode.parent) {
      const updatedParent = { ...currentNode.parent }
      updatedParent.children = updatedParent.children.filter(child => child.id !== currentNode.id)
      updateTree(updatedParent)
      updatePath(updatedParent.id)
    }
  }

  const handleNavigateUp = () => {
    if (currentPath.length > 1) {
      setCurrentPath(prevPath => prevPath.slice(0, -1))
    }
  }

  const updateTree = (updatedNode: PromptNode) => {
    const newTree = { ...tree }
    const nodeToUpdate = findNodeById(newTree, updatedNode.id)
    if (nodeToUpdate) {
      Object.assign(nodeToUpdate, updatedNode)
    }
    setTree(newTree)
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentNode = currentPath[currentPath.length - 1]
    const updatedNode = { ...currentNode, title: e.target.value }
    updateTree(updatedNode)
  }

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const currentNode = currentPath[currentPath.length - 1]
    const updatedNode = { ...currentNode, prompt: e.target.value }
    updateTree(updatedNode)
  }

  return (
    <div className="min-h-window bg-black text-white p-4 max-w-sm mx-auto">
      {currentPath.map((node, index) => (
        <Card key={node.id} className="mb-4 bg-black border-magenta-500" {...handlers}>
          <CardContent className="p-4">
            {index === currentPath.length - 1 && (
              <div className="flex flex-col mb-2">
                <Button
                  variant="outline"
                  onClick={handleNavigateUp}
                  className="w-full bg-black text-red-500 border-red-500 hover:bg-red-900"
                  disabled={currentPath.length === 1}
                >
                  <ChevronUp className="h-4 w-4 mr-2" />
                </Button>
              </div>
            )}
            <div className="flex items-center mb-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleSwipe('prev')}
                disabled={currentIndex === 0}
                className="text-indigo-400 bg-black border-indigo-400 hover:bg-indigo-900"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Input
                value={node.title}
                onChange={handleTitleChange}
                className="mx-2 bg-black text-white border-indigo-400"
                disabled={index !== currentPath.length - 1}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleSwipe('next')}
                disabled={currentIndex === siblings.length - 1}
                className="text-indigo-400 bg-black border-indigo-400 hover:bg-indigo-900"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Textarea
              value={node.prompt}
              onChange={handlePromptChange}
              className="mb-2 bg-black text-white border-indigo-400 h-24 resize-none"
              disabled={index !== currentPath.length - 1}
            />
            {index === currentPath.length - 1 && (
              <div className="flex flex-col gap-2">
                
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={handleAddChild}
                    className="flex-1 bg-black mr-2 text-cyan-400 border-cyan-400 hover:bg-cyan-900"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Child
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleDelete}
                    className="flex-1 bg-black text-fuchsia-500 border-fuchsia-500 hover:bg-fuchsia-900"
                    disabled={currentPath.length === 1}
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            )}
            {node.children.length > 0 && index === currentPath.length - 1 && (
              <div className="mt-4">
                <h3 className="text-cyan-400 mb-2">Child Nodes:</h3>
                <div className="flex flex-wrap gap-2">
                  {node.children.map(child => (
                    <Button
                      key={child.id}
                      variant="outline"
                      onClick={() => updatePath(child.id)}
                      className="text-indigo-400 border-indigo-400 hover:bg-indigo-900"
                    >
                      {child.title}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
      <div ref={bottomRef} />
    </div>
  )
}