"use client"

import React, { useCallback, useRef, useState, useEffect } from 'react'
import ForceGraph3D from 'react-force-graph-3d'
import { ForceGraphMethods } from 'react-force-graph-3d'
import SpriteText from 'three-spritetext'

// Define the node type
interface Node {
  id: string
  name: string
  text: string
  x?: number
  y?: number
  z?: number
}

// Sample data
const data = {
  nodes: [
    { id: '1', name: 'Root', text: 'This is the root node with some long text that will be truncated' },
    { id: '2', name: 'Child 1', text: 'This is child 1 with some more text' },
    { id: '3', name: 'Child 2', text: 'This is child 2 with even more text to show' },
    { id: '4', name: 'Grandchild 1', text: 'This is a grandchild node with lots of text' },
    { id: '5', name: 'Grandchild 2', text: 'Another grandchild with some sample text' },
  ],
  links: [
    { source: '1', target: '2' },
    { source: '1', target: '3' },
    { source: '2', target: '4' },
    { source: '2', target: '5' },
  ],
}

export default function TextBlobGraph() {
  const fgRef = useRef<ForceGraphMethods<Node, { source: string | number | Node; target: string | number | Node }>>()
  const [highlightedNode, setHighlightedNode] = useState<Node | null>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  const handleNodeClick = useCallback((node: Node) => {
    const distance = 40
    const distRatio = 1 + distance / Math.hypot(node.x!, node.y!, node.z!)
    fgRef.current?.cameraPosition(
      { x: node.x! * distRatio, y: node.y! * distRatio, z: node.z! * distRatio },
      node as any,
      2000
    )
  }, [])

  return (
    <div className="h-screen w-full bg-gray-100 touch-none">
      <ForceGraph3D
        ref={fgRef}
        graphData={data}
        nodeRelSize={5}
        nodeVal={1}
        nodeLabel="name"
        nodeColor={() => 'hsl(180, 50%, 50%)'}
        linkColor={() => 'hsl(var(--muted-foreground))'}
        onNodeClick={handleNodeClick}
        onNodeHover={setHighlightedNode}
        width={dimensions.width}
        height={dimensions.height}
        nodeThreeObject={(node: Node) => {
          const sprite = new SpriteText(node.name)
          sprite.color = 'hsl(var(--primary-foreground))'
          sprite.textHeight = 8
          return sprite
        }}
        nodeThreeObjectExtend={true}
        cooldownTicks={100}
        onEngineStop={() => fgRef.current?.zoomToFit(400)}
        d3VelocityDecay={0.3}
      />
      {highlightedNode && (
        <div className="absolute bottom-4 left-4 right-4 bg-white p-4 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-2">{highlightedNode.name}</h3>
          <p className="text-sm">{highlightedNode.text}</p>
        </div>
      )}
    </div>
  )
}