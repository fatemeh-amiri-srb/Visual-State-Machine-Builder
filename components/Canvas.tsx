'use client';
import { useEffect, useState } from 'react';
import { useEditorStore } from '@/store/useEditorStore';
import Node from './Node';
import { v4 as uuid } from 'uuid';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Canvas() {
    const {
        nodes,
        connections,
        addNode,
        setState,
        undo,
        redo,
        historyIndex,
        history,
    } = useEditorStore();

    const [mounted, setMounted] = useState(false);
    const [json, setJson] = useState('');
    const router = useRouter();
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
                console.error('Invalid share data');
            }
        }
    }, [searchParams, setState]);

    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem('state-machine');
        if (saved && !searchParams.get('data')) {
            try {
                const data = JSON.parse(saved);
                if (data.nodes && data.connections) {
                    setState(data);
                }
            } catch { }
        }
    }, [setState, searchParams]);

    useEffect(() => {
        if (mounted) {
            localStorage.setItem('state-machine', JSON.stringify({ nodes, connections }));
        }
    }, [nodes, connections, mounted]);

    const handleAdd = () => {
        const id = uuid();
        addNode({ id, name: `State ${nodes.length + 1}`, x: 100, y: 100 });
    };

    const handleExport = () => {
        const machine: Record<string, { on: Record<string, string> }> = {};
        nodes.forEach((node) => {
            machine[node.name] = { on: {} };
        });
        connections.forEach((conn) => {
            const fromNode = nodes.find((n) => n.id === conn.from);
            const toNode = nodes.find((n) => n.id === conn.to);
            if (fromNode && toNode) {
                machine[fromNode.name].on[conn.label || 'event'] = toNode.name;
            }
        });
        setJson(JSON.stringify(machine, null, 2));
    };

    const handleShare = () => {
        const data = JSON.stringify({ nodes, connections });
        const encoded = btoa(data);
        router.push(`/?data=${encoded}`);
    };

    const handleClear = () => {
        const confirmClear = window.confirm('Are you sure you want to clear all states and connections?');
        if (confirmClear) {
            setState({ nodes: [], connections: [] });
            setJson('');
        }
    };

    if (!mounted) return null;

    return (
        <div className="relative w-full h-screen bg-gray-100 overflow-hidden">
            <div className="absolute top-2 left-2 z-10 flex flex-wrap gap-2 p-2 bg-white rounded shadow-sm">
                <button onClick={handleAdd} className="bg-black text-white px-3 py-1 rounded text-sm">
                    Add State
                </button>
                <button onClick={handleExport} className="bg-green-600 text-white px-3 py-1 rounded text-sm">
                    Export JSON
                </button>
                <button onClick={handleShare} className="bg-indigo-600 text-white px-3 py-1 rounded text-sm">
                    Share Link
                </button>
                <button onClick={handleClear} className="bg-red-600 text-white px-3 py-1 rounded text-sm">
                    Clear All
                </button>
                <button
                    onClick={undo}
                    disabled={historyIndex <= 0}
                    className="bg-yellow-500 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
                >
                    Undo
                </button>
                <button
                    onClick={redo}
                    disabled={historyIndex >= history.length - 1}
                    className="bg-yellow-700 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
                >
                    Redo
                </button>
            </div>

            {json && (
                <textarea
                    value={json}
                    readOnly
                    className="absolute top-20 left-4 w-[90vw] max-w-xl h-64 p-2 border rounded bg-white text-sm font-mono"
                />
            )}

            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                {connections.map((conn, idx) => {
                    const fromNode = nodes.find((n) => n.id === conn.from);
                    const toNode = nodes.find((n) => n.id === conn.to);
                    if (!fromNode || !toNode) return null;

                    const x1 = fromNode.x + 60;
                    const y1 = fromNode.y + 30;
                    const x2 = toNode.x + 60;
                    const y2 = toNode.y + 30;
                    const labelX = (x1 + x2) / 2;
                    const labelY = (y1 + y2) / 2 - 10;

                    return (
                        <g key={idx}>
                            <line
                                x1={x1}
                                y1={y1}
                                x2={x2}
                                y2={y2}
                                stroke="black"
                                strokeWidth={2}
                                markerEnd="url(#arrow)"
                            />
                            {conn.label && (
                                <text x={labelX} y={labelY} textAnchor="middle" className="fill-black text-xs">
                                    {conn.label}
                                </text>
                            )}
                        </g>
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
        </div>
    );
}
