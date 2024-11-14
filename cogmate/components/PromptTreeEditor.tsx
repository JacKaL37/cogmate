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

type Tree = {
  root: PromptNode
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
  const [tree, setTree] = useState<Tree>(() => {
    // Base System Context
    const root = createNode('root', 'System Context', 
      'You are assisting with a scientific research project on corticospinal tract pathology. ' +
      'Grant #NSF-2024-123. Budget: $2.5M. Duration: 3 years. ' +
      'Multi-center study across 3 hospitals. IRB approval: #2024-45-NEU.', null)

    // Project Overview
    const overview = createNode('overview', 'Project Scope',
      'Investigation of corticospinal tract biomarkers in neurodegenerative disorders. ' +
      'Aims: 1) Establish imaging protocols 2) Validate clinical correlations 3) Develop diagnostic criteria. ' +
      'Target enrollment: 200 patients, 50 controls.', root)
    root.children.push(overview)

    // Methods & Approach
    const methods = createNode('methods', 'Methodology',
      'Combined multimodal imaging and clinical assessment approach. ' +
      'Primary: 3T MRI with DTI protocol. Secondary: TMS, EMG studies. ' +
      'Longitudinal follow-up at 0, 6, 12 months.', root)
    root.children.push(methods)

    // Data Collection
    const data = createNode('data', 'Data Collection',
      'Standardized protocols for: 1) MRI acquisition 2) Clinical assessments 3) Biospecimen collection. ' +
      'RedCap database implementation. Quality control procedures.', methods)
    methods.children.push(data)

    // Analysis Framework
    const analysis = createNode('analysis', 'Analysis Framework',
      'Mixed methods: Quantitative imaging metrics, clinical scores, biomarker levels. ' +
      'Statistical approach: Linear mixed models, machine learning classification.', methods)
    methods.children.push(analysis)

    // Expected Outcomes
    const outcomes = createNode('outcomes', 'Expected Outcomes',
      'Primary: Validated imaging biomarkers. Secondary: Clinical prediction models. ' +
      'Deliverables: Standardized protocols, public dataset, diagnostic criteria.', root)
    root.children.push(outcomes)

    return { root }
  })

  const [currentPath, setCurrentPath] = useState<PromptNode[]>([tree.root])
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
    preventScrollOnSwipe: true,
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
    const newPath = getPathToNode(tree.root, id)
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
    const nodeToUpdate = findNodeById(newTree.root, updatedNode.id)
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

  const getHierarchyString = (path: PromptNode[]): string => {
    return path
      .slice(0, -1)
      .map(node => `---\n${node.title}\n---\n${node.prompt}\n\n`)
      .join('')
  }

  const getCurrentString = (path: PromptNode[]): string => {
    const node = path[path.length - 1]
    return `---\n${node.title}\n---\n${node.prompt}\n`
  }

  return (
    <div className="min-h-window bg-black text-white p-4 max-w-md mx-auto">
      {currentPath.length > 1 && (
      <Card className="mb-4 bg-black border-magenta-500 h-[250px]"> {/* Set fixed height */}
        <CardContent className="p-4 h-full overflow-y-auto flex flex-col-reverse"> {/* Enable scroll and reverse column */}
          <div className="text-fuchsia-500 whitespace-pre-wrap font-mono">
            {getCurrentString(currentPath)}
          </div>
          <div className="text-white whitespace-pre-wrap font-mono">
            {getHierarchyString(currentPath)}
          </div>
        </CardContent>
      </Card>
    )}
      <Card key={currentPath[currentPath.length - 1].id} className="mb-4 bg-black border-magenta-500" {...handlers}>
        <CardContent className="p-4">
          {currentPath.length > 1 && (
            <>
              <div className="flex flex-col mb-2">
                <Button
                  variant="outline"
                  onClick={handleNavigateUp}
                  className="w-full text-red-500 bg-red-950 border-none hover:bg-red-900"
                >
                  <ChevronUp className="h-4 w-4 mr-2" />
                </Button>
              </div>
              <div className="flex items-center mb-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleSwipe('prev')}
                  disabled={currentIndex === 0}
                  className="text-indigo-400 bg-indigo-950 border-none hover:bg-indigo-900"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Input
                  value={currentPath[currentPath.length - 1].title}
                  onChange={handleTitleChange}
                  className="mx-2 bg-black text-white border-indigo-400"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleSwipe('next')}
                  disabled={currentIndex === siblings.length - 1}
                  className="text-indigo-400 bg-indigo-950 border-none hover:bg-indigo-900"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
          {currentPath.length === 1 && (
            <Input
              value={currentPath[currentPath.length - 1].title}
              onChange={handleTitleChange}
              className="mb-2 bg-black text-white border-indigo-400"
            />
          )}
          <Textarea
            value={currentPath[currentPath.length - 1].prompt}
            onChange={handlePromptChange}
            className="mb-2 bg-black text-white border-indigo-400 h-24 resize-none"
          />
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
          {currentPath[currentPath.length - 1].children.length > 0 && (
            <div className="mt-4">
              <h3 className="text-cyan-400 mb-2">Child Nodes:</h3>
              <div className="flex flex-wrap gap-2">
                {currentPath[currentPath.length - 1].children.map(child => (
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
      <div ref={bottomRef} />
    </div>
  )
}