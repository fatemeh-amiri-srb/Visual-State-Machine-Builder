'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useEditorStore } from '@/store/useEditorStore';
import Node from '@/components/Node';

export default function PreviewPage() {
    const { nodes, connections, setState } = useEditorStore();
    const [mounted, setMounted] = useState(false);
    const searchParams = useSearchParams();

    useEffect(() => {
        const encoded = searchParams.get('data');
        if (encoded) {
            try {
                const decoded = atob(encoded);
                const parsed = JSON.parse(decoded);
                if (parsed.nodes && parsed.connections) {
                    setState(parsed);
                }
            } catch (e) {
                console.error('Invalid preview data');
            }
        }
        setMounted(true);
    }, [searchParams, setState]);

    if (!mounted) return null;

    return (
        <div className="relative w-full h-screen bg-gray-100 overflow-hidden">
            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                {connections.map((conn, idx) => {
                    const fromNode = nodes.find((n) => n.id === conn.from);
                    const toNode = nodes.find((n) => n.id === conn.to);
                    if (!fromNode || !toNode) return null;

                    return (
                        <line
                            key={idx}
                            x1={fromNode.x + 60}
                            y1={fromNode.y + 30}
                            x2={toNode.x + 60}
                            y2={toNode.y + 30}
                            stroke="black"
                            strokeWidth={2}
                            markerEnd="url(#arrow)"
                        />
                    );
                })}
                <defs>
                    <marker id="arrow" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto" markerUnits="strokeWidth">
                        <path d="M0,0 L0,6 L9,3 z" fill="black" />
                    </marker>
                </defs>
            </svg>

            {nodes.map((node) => (
                <Node key={node.id} {...node} />
            ))}

            <div className="absolute bottom-4 left-4 text-sm text-gray-600">Read-only preview mode</div>
        </div>
    );
}
