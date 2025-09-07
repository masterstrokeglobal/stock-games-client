"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronRight, Users } from "lucide-react";
import React, { useState } from "react";

type HierarchyNode = {
    id?: number;
    operatorId?: number;
    name?: string;
    role?: string;
    children?: HierarchyNode[];
};

type Props = {
    tree?: HierarchyNode | HierarchyNode[] | null;
};

const NodeRow = ({ node, level = 0 }: { node: HierarchyNode; level?: number }) => {
    const [open, setOpen] = useState(false);
    const hasChildren = (node.children?.length ?? 0) > 0;
    const nodeId = node.id ?? node.operatorId;

    return (
        <div className="w-full">
            <div
                className={`flex items-center py-2 px-3 rounded hover:bg-accent cursor-pointer ${
                    level > 0 ? "ml-6" : ""
                }`}
                onClick={() => hasChildren && setOpen((v) => !v)}
            >
                <div className="w-5">
                    {hasChildren ? (open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />) : null}
                </div>
                <div className="flex-1">
                    <div className="text-sm font-medium">{node.name ?? (nodeId ? `#${nodeId}` : '-')}</div>
                    <div className="text-xs text-muted-foreground">{node.role}</div>
                </div>
            </div>
            {open && hasChildren && (
                <div className="space-y-1">
                    {node.children!.map((child) => (
                        <NodeRow key={(child.id ?? child.operatorId) as number} node={child} level={level + 1} />
                    ))}
                </div>
            )}
        </div>
    );
};

const OperatorHierarchyTree = ({ tree }: Props) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Hierarchy
                </CardTitle>
            </CardHeader>
            <CardContent>
                {!tree ? (
                    <div className="text-sm text-muted-foreground">No hierarchy data</div>
                ) : Array.isArray(tree) ? (
                    <div className="space-y-1">
                        {tree.map((n) => (
                            <NodeRow key={(n.id ?? n.operatorId) as number} node={n} />
                        ))}
                    </div>
                ) : (
                    <NodeRow node={tree as HierarchyNode} />
                )}
            </CardContent>
        </Card>
    );
};

export default OperatorHierarchyTree;


