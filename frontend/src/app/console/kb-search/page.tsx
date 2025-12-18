"use client";

import React, { useState } from 'react';

const BACKEND_BASE_URL = "https://animated-giggle-v69wjxrvg74gfpwpr-8000.app.github.dev";

export default function KBSearchPage() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query) return;

        setLoading(true);
        try {
            const response = await fetch(`${BACKEND_BASE_URL}/api/v1/knowledge/query`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query }),
            });

            const data = await response.json();
            if (data.success) {
                setResults(data.results);
            } else {
                alert("Search failed: " + data.message);
            }
        } catch (error) {
            console.error("Search Error:", error);
            alert("Could not connect to backend.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Knowledge Base Search</h1>
            
            <form onSubmit={handleSearch} className="mb-8 flex gap-2">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask a question about your knowledge base..."
                    className="flex-1 p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none text-black"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                >
                    {loading ? "Searching..." : "Search"}
                </button>
            </form>

            <div className="space-y-4">
                {results.length === 0 && !loading && (
                    <p className="text-gray-500 italic">No results found yet. Try searching for "password".</p>
                )}
                
                {results.map((res, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-white shadow-sm">
                        <div className="flex justify-between mb-2">
                            <span className="text-xs font-bold uppercase text-blue-600">
                                Chunk {index + 1}
                            </span>
                            <span className="text-xs text-gray-400">
                                Source: {res.metadata.title || "Unknown"}
                            </span>
                        </div>
                        <p className="text-gray-800 leading-relaxed">{res.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}