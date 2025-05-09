'use client';

import { useCollection } from '@/contexts/CollectionContext';
import {
  Card,
  CardContent,
  CardHeader,
  Button,
  Skeleton,
  Input,
} from '@/components/ui';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

interface PlatformCollection {
  name: string;
  id: string;
  description?: string;
  items?: Array<{
    details?: {
      image?: string;
      title?: string;
    };
  }>;
}

export default function CollectionsPage() {
  const { userCollections, isLoading, refreshCollections } = useCollection();
  const { authenticated, login, address } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [platformCollections, setPlatformCollections] = useState<
    PlatformCollection[]
  >([]);
  const [loadingPlatform, setLoadingPlatform] = useState(true);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);

  // Fetch platform collections
  useEffect(() => {
    async function fetchPlatformCollections() {
      try {
        setLoadingPlatform(true);
        const response = await fetch('/api/collections/featured');
        if (response.ok) {
          const data = await response.json();
          setPlatformCollections(data.collections);
        }
      } catch (error) {
        console.error('Error fetching platform collections:', error);
      } finally {
        setLoadingPlatform(false);
      }
    }

    fetchPlatformCollections();
  }, []);

  const filteredUserCollections = userCollections.filter((collection) =>
    collection.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredPlatformCollections = platformCollections.filter(
    (collection: {
      name: string;
      id: string;
      description?: string;
      items?: Array<{
        details?: {
          image?: string;
          title?: string;
        };
      }>;
    }) => collection.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleCreateCollection = async () => {
    if (!newCollectionName.trim()) {
      toast({
        title: 'Collection name required',
        description: 'Please enter a name for your collection',
        variant: 'destructive',
      });
      return;
    }

    setIsCreatingCollection(true);
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
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create collection');
      }

      toast({
        title: 'Collection created',
        description: `"${newCollectionName}" has been created successfully`,
      });

      setNewCollectionName('');
      refreshCollections();
    } catch (error) {
      toast({
        title: 'Failed to create collection',
        description:
          error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsCreatingCollection(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 flex flex-col items-start justify-between md:flex-row md:items-center">
        <h1 className="text-3xl font-bold">Collections</h1>
        <div className="mt-4 flex w-full gap-2 md:mt-0 md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
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
                  <Plus className="mr-2 h-4 w-4" />
                  New Collection
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center justify-between">
                    <span>Create New Collection</span>
                    <Image
                      src="/sparkles.png"
                      alt="sparkles"
                      width={24}
                      height={24}
                    />
                  </DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <label
                    htmlFor="collectionName"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
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
                      disabled={
                        isCreatingCollection || !newCollectionName.trim()
                      }
                    >
                      {isCreatingCollection
                        ? 'Creating...'
                        : 'Create Collection'}
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
            <h2 className="mb-4 text-2xl font-semibold">Your Collections</h2>
            {isLoading ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <CardHeader className="p-0">
                      <Skeleton className="h-[140px] w-full" />
                    </CardHeader>
                    <CardContent className="p-6">
                      <Skeleton className="mb-2 h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : userCollections.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredUserCollections.map((collection) => (
                  <Link
                    href={`/collections/${collection.id}`}
                    key={collection.id}
                  >
                    <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
                      <CardHeader className="flex h-[140px] items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-600 p-0">
                        {collection.stories.length > 0 ? (
                          <div className="grid h-full w-full grid-cols-2 gap-1">
                            {collection.stories
                              .slice(0, 4)
                              .map((story, idx) => (
                                <div
                                  key={idx}
                                  className="relative h-[70px] w-full overflow-hidden"
                                >
                                  <Image
                                    src={
                                      story.image || '/images/placeholder.svg'
                                    }
                                    alt={story.title}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              ))}
                          </div>
                        ) : (
                          <div className="p-4 text-center text-white">
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
                        <h3 className="mb-1 text-xl font-bold">
                          {collection.name}
                        </h3>
                        <p className="mb-2 text-sm text-gray-600">
                          {collection.stories.length}{' '}
                          {collection.stories.length === 1 ? 'item' : 'items'}
                        </p>
                        <p className="line-clamp-2 text-sm text-gray-500">
                          {collection.description || 'No description'}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-lg bg-gray-50 p-8 text-center">
                <Image
                  src="/sparkles.png"
                  alt="No collections"
                  width={64}
                  height={64}
                  className="mx-auto mb-4"
                />
                <h3 className="mb-2 text-xl font-semibold">
                  No collections yet
                </h3>
                <p className="mb-4 text-gray-600">
                  Create your first collection to organize campaigns you&apos;re
                  interested in.
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Collection
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Collection</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                      <label
                        htmlFor="newCollectionName"
                        className="mb-1 block text-sm font-medium text-gray-700"
                      >
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
                          disabled={
                            isCreatingCollection || !newCollectionName.trim()
                          }
                        >
                          {isCreatingCollection
                            ? 'Creating...'
                            : 'Create Collection'}
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
        <div className="mb-12 rounded-lg bg-gray-50 p-8 text-center">
          <Image
            src="/sparkles.png"
            alt="Collections"
            width={64}
            height={64}
            className="mx-auto mb-4"
          />
          <h2 className="mb-2 text-xl font-semibold">
            Sign in to create collections
          </h2>
          <p className="mb-4 text-gray-600">
            You need to sign in to create and manage your own collections.
          </p>
          <Button
            className="bg-purple-600 hover:bg-purple-700"
            onClick={() => login()}
          >
            Sign In
          </Button>
        </div>
      )}

      <section>
        <h2 className="mb-4 text-2xl font-semibold">Featured Collections</h2>
        {loadingPlatform ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="p-0">
                  <Skeleton className="h-[140px] w-full" />
                </CardHeader>
                <CardContent className="p-6">
                  <Skeleton className="mb-2 h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredPlatformCollections.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPlatformCollections.map(
              (collection: {
                id: string;
                name: string;
                description?: string;
                items?: Array<{
                  details?: {
                    image?: string;
                    title?: string;
                  };
                }>;
              }) => (
                <Link
                  href={`/collections/${collection.id}`}
                  key={collection.id}
                >
                  <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
                    <CardHeader className="flex h-[140px] items-center justify-center bg-gradient-to-r from-blue-500 to-teal-500 p-0">
                      {collection.items && collection.items.length > 0 ? (
                        <div className="grid h-full w-full grid-cols-2 gap-1">
                          {collection.items.slice(0, 4).map(
                            (
                              item: {
                                details?: {
                                  image?: string;
                                  title?: string;
                                };
                              },
                              idx: number,
                            ) => (
                              <div
                                key={idx}
                                className="relative h-[70px] w-full overflow-hidden"
                              >
                                <Image
                                  src={
                                    item.details?.image ||
                                    '/images/placeholder.svg'
                                  }
                                  alt={item.details?.title || 'Collection item'}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ),
                          )}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-white">
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
                      <h3 className="mb-1 text-xl font-bold">
                        {collection.name}
                      </h3>
                      <p className="mb-2 text-sm text-gray-600">
                        {collection.items?.length || 0}{' '}
                        {collection.items?.length === 1 ? 'item' : 'items'}
                      </p>
                      <p className="line-clamp-2 text-sm text-gray-500">
                        {collection.description || 'No description'}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ),
            )}
          </div>
        ) : (
          <div className="rounded-lg bg-gray-50 p-8 text-center">
            <Image
              src="/sparkles.png"
              alt="No collections"
              width={64}
              height={64}
              className="mx-auto mb-4"
            />
            <h3 className="mb-2 text-xl font-semibold">
              No featured collections available
            </h3>
            <p className="text-gray-600">
              Check back later for curated collections from our team.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
