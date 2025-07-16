'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useEditorStore } from '@/store/useEditorStore';

export default function Node({ id, name, x, y }: { id: string; name: string; x: number; y: number }) {
    const moveNode = useEditorStore((s) => s.moveNode);
    const selectedNode = useEditorStore((s) => s.selectedNode);
    const selectNode = useEditorStore((s) => s.selectNode);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const isSelected = selectedNode === id;

    return (
        <motion.div
            drag
            onClick={() => {
                if (selectedNode && selectedNode !== id) {
                    useEditorStore.getState().connectNodes(selectedNode, id);
                    selectNode(null);
                } else {
                    selectNode(id);
                }
            }}
            onDragEnd={(e, info) => moveNode(id, x + info.offset.x, y + info.offset.y)}
            initial={{ x, y }}
            animate={{ x, y }}
            className={`absolute rounded-lg px-4 py-2 cursor-move shadow-lg transition-colors duration-200 ${isSelected ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'
                }`}
        >
            {name}
        </motion.div>
    );
}
