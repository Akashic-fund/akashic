'use client'

import { useCollection } from '@/contexts/CollectionContext'
import { Card, CardContent, CardHeader, Button, Skeleton, Input } from '@/components/ui'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Plus, Search } from 'lucide-react'
import { useAuth } from "@/contexts";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from '@/hooks/use-toast'

interface PlatformCollection {
    name: string
    id: string
    description?: string
    items?: Array<{
        details?: {
            image?: string
            title?: string
        }
    }>
}

export default function CollectionsPage() {
    const { userCollections, isLoading, refreshCollections } = useCollection()
    const { authenticated, login, address } = useAuth()
    const [searchTerm, setSearchTerm] = useState('')
    const [platformCollections, setPlatformCollections] = useState<PlatformCollection[]>([])
    const [loadingPlatform, setLoadingPlatform] = useState(true)
    const [newCollectionName, setNewCollectionName] = useState('')
    const [isCreatingCollection, setIsCreatingCollection] = useState(false)

    // Fetch platform collections
    useEffect(() => {
        async function fetchPlatformCollections() {
            try {
                setLoadingPlatform(true)
                const response = await fetch('/api/collections/featured')
                if (response.ok) {
                    const data = await response.json()
                    setPlatformCollections(data.collections)
                }
            } catch (error) {
                console.error('Error fetching platform collections:', error)
            } finally {
                setLoadingPlatform(false)
            }
        }

        fetchPlatformCollections()
    }, [])

    const filteredUserCollections = userCollections.filter(collection =>
        collection.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const filteredPlatformCollections = platformCollections.filter((collection: {
        name: string;
        id: string;
        description?: string;
        items?: Array<{
            details?: {
                image?: string;
                title?: string;
            }
        }>;
    }) =>
        collection.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleCreateCollection = async () => {
        if (!newCollectionName.trim()) {
            toast({
                title: "Collection name required",
                description: "Please enter a name for your collection",
                variant: "destructive"
            })
            return
        }

        setIsCreatingCollection(true)
        try {
            const response = await fetch('/api/collections', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: newCollectionName,
                    userAddress: address,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create collection')
            }

            toast({
                title: "Collection created",
                description: `"${newCollectionName}" has been created successfully`,
            })

            setNewCollectionName('')
            refreshCollections()
        } catch (error) {
            toast({
                title: "Failed to create collection",
                description: error instanceof Error ? error.message : 'An error occurred',
                variant: "destructive",
            })
        } finally {
            setIsCreatingCollection(false)
        }
    }

    return (
        <div className="container mx-auto p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <h1 className="text-3xl font-bold">Collections</h1>
                <div className="flex mt-4 md:mt-0 gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Search collections..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    {authenticated && (
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="bg-purple-600 hover:bg-purple-700">
                                    <Plus className="h-4 w-4 mr-2" />
                                    New Collection
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle className="flex justify-between items-center">
                                        <span>Create New Collection</span>
                                        <Image src="/sparkles.png" alt="sparkles" width={24} height={24} />
                                    </DialogTitle>
                                </DialogHeader>
                                <div className="py-4">
                                    <label htmlFor="collectionName" className="block text-sm font-medium text-gray-700 mb-1">
                                        Collection Name
                                    </label>
                                    <Input
                                        id="collectionName"
                                        value={newCollectionName}
                                        onChange={(e) => setNewCollectionName(e.target.value)}
                                        placeholder="Enter collection name"
                                        className="mb-4"
                                    />
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="outline"
                                            onClick={() => setNewCollectionName('')}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            className="bg-purple-600 hover:bg-purple-700"
                                            onClick={handleCreateCollection}
                                            disabled={isCreatingCollection || !newCollectionName.trim()}
                                        >
                                            {isCreatingCollection ? 'Creating...' : 'Create Collection'}
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
            </div>

            {authenticated ? (
                <>
                    <section className="mb-12">
                        <h2 className="text-2xl font-semibold mb-4">Your Collections</h2>
                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(3)].map((_, i) => (
                                    <Card key={i} className="overflow-hidden">
                                        <CardHeader className="p-0">
                                            <Skeleton className="h-[140px] w-full" />
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            <Skeleton className="h-6 w-3/4 mb-2" />
                                            <Skeleton className="h-4 w-full" />
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : userCollections.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredUserCollections.map((collection) => (
                                    <Link href={`/collections/${collection.id}`} key={collection.id}>
                                        <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
                                            <CardHeader className="p-0 h-[140px] bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center">
                                                {collection.stories.length > 0 ? (
                                                    <div className="grid grid-cols-2 gap-1 w-full h-full">
                                                        {collection.stories.slice(0, 4).map((story, idx) => (
                                                            <div key={idx} className="relative w-full h-[70px] overflow-hidden">
                                                                <Image
                                                                    src={story.image || '/images/placeholder.svg'}
                                                                    alt={story.title}
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-white text-center p-4">
                                                        <Image
                                                            src="/sparkles.png"
                                                            alt="Empty collection"
                                                            width={48}
                                                            height={48}
                                                            className="mx-auto mb-2"
                                                        />
                                                        <p>No items yet</p>
                                                    </div>
                                                )}
                                            </CardHeader>
                                            <CardContent className="p-6">
                                                <h3 className="text-xl font-bold mb-1">{collection.name}</h3>
                                                <p className="text-gray-600 text-sm mb-2">
                                                    {collection.stories.length} {collection.stories.length === 1 ? 'item' : 'items'}
                                                </p>
                                                <p className="text-gray-500 text-sm line-clamp-2">
                                                    {collection.description || 'No description'}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-gray-50 rounded-lg p-8 text-center">
                                <Image
                                    src="/sparkles.png"
                                    alt="No collections"
                                    width={64}
                                    height={64}
                                    className="mx-auto mb-4"
                                />
                                <h3 className="text-xl font-semibold mb-2">No collections yet</h3>
                                <p className="text-gray-600 mb-4">
                                    Create your first collection to organize campaigns you&apos;re interested in.
                                </p>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button className="bg-purple-600 hover:bg-purple-700">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Create Collection
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Create New Collection</DialogTitle>
                                        </DialogHeader>
                                        <div className="py-4">
                                            <label htmlFor="newCollectionName" className="block text-sm font-medium text-gray-700 mb-1">
                                                Collection Name
                                            </label>
                                            <Input
                                                id="newCollectionName"
                                                value={newCollectionName}
                                                onChange={(e) => setNewCollectionName(e.target.value)}
                                                placeholder="Enter collection name"
                                                className="mb-4"
                                            />
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    onClick={() => setNewCollectionName('')}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    className="bg-purple-600 hover:bg-purple-700"
                                                    onClick={handleCreateCollection}
                                                    disabled={isCreatingCollection || !newCollectionName.trim()}
                                                >
                                                    {isCreatingCollection ? 'Creating...' : 'Create Collection'}
                                                </Button>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        )}
                    </section>
                </>
            ) : (
                <div className="bg-gray-50 rounded-lg p-8 text-center mb-12">
                    <Image
                        src="/sparkles.png"
                        alt="Collections"
                        width={64}
                        height={64}
                        className="mx-auto mb-4"
                    />
                    <h2 className="text-xl font-semibold mb-2">Sign in to create collections</h2>
                    <p className="text-gray-600 mb-4">
                        You need to sign in to create and manage your own collections.
                    </p>
                    <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => login()}>
                        Sign In
                    </Button>
                </div>
            )}

            <section>
                <h2 className="text-2xl font-semibold mb-4">Featured Collections</h2>
                {loadingPlatform ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, i) => (
                            <Card key={i} className="overflow-hidden">
                                <CardHeader className="p-0">
                                    <Skeleton className="h-[140px] w-full" />
                                </CardHeader>
                                <CardContent className="p-6">
                                    <Skeleton className="h-6 w-3/4 mb-2" />
                                    <Skeleton className="h-4 w-full" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : filteredPlatformCollections.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPlatformCollections.map((collection: {
                            id: string;
                            name: string;
                            description?: string;
                            items?: Array<{
                                details?: {
                                    image?: string;
                                    title?: string;
                                }
                            }>;
                        }) => (
                            <Link href={`/collections/${collection.id}`} key={collection.id}>
                                <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
                                    <CardHeader className="p-0 h-[140px] bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center">
                                        {collection.items && collection.items.length > 0 ? (
                                            <div className="grid grid-cols-2 gap-1 w-full h-full">
                                                {collection.items.slice(0, 4).map((item: {
                                                    details?: {
                                                        image?: string;
                                                        title?: string;
                                                    }
                                                }, idx: number) => (
                                                    <div key={idx} className="relative w-full h-[70px] overflow-hidden">
                                                        <Image
                                                            src={item.details?.image || '/images/placeholder.svg'}
                                                            alt={item.details?.title || 'Collection item'}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-white text-center p-4">
                                                <Image
                                                    src="/sparkles.png"
                                                    alt="Empty collection"
                                                    width={48}
                                                    height={48}
                                                    className="mx-auto mb-2"
                                                />
                                                <p>No items yet</p>
                                            </div>
                                        )}
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <h3 className="text-xl font-bold mb-1">{collection.name}</h3>
                                        <p className="text-gray-600 text-sm mb-2">
                                            {collection.items?.length || 0} {collection.items?.length === 1 ? 'item' : 'items'}
                                        </p>
                                        <p className="text-gray-500 text-sm line-clamp-2">
                                            {collection.description || 'No description'}
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="bg-gray-50 rounded-lg p-8 text-center">
                        <Image
                            src="/sparkles.png"
                            alt="No collections"
                            width={64}
                            height={64}
                            className="mx-auto mb-4"
                        />
                        <h3 className="text-xl font-semibold mb-2">No featured collections available</h3>
                        <p className="text-gray-600">
                            Check back later for curated collections from our team.
                        </p>
                    </div>
                )}
            </section>
        </div>
    )
} 