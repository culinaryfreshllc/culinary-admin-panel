"use client";

import React, { useState } from "react";
import { useStore, Tag } from "../../context/StoreContext";
import { TagForm } from "./TagForm";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Edit2, Trash2, Tag as TagIcon, Plus } from "lucide-react";

export default function TagList() {
    const { tags, deleteTag } = useStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTag, setEditingTag] = useState<Tag | undefined>(undefined);

    const handleEdit = (tag: Tag) => {
        setEditingTag(tag);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setEditingTag(undefined);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this tag?")) {
            deleteTag(id);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <TagIcon size={20} className="text-primary" />
                    All Tags
                </h2>
                <Button onClick={handleAdd} icon={<Plus size={16} />}>Add Tag</Button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-medium">
                        <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Slug</th>
                            <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {tags.map((tag) => (
                            <tr key={tag.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900">{tag.name}</td>
                                <td className="px-6 py-4 text-gray-500 font-mono text-xs bg-gray-50 inline-block rounded px-2 py-1 mt-3 mx-6">{tag.slug}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => handleEdit(tag)}
                                            className="p-2 text-primary bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(tag.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {tags.length === 0 && (
                    <div className="p-8 text-center text-gray-400">
                        No tags found. Add one to get started.
                    </div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingTag ? "Edit Tag" : "Add New Tag"}
            >
                <TagForm
                    initialData={editingTag}
                    onClose={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
}
