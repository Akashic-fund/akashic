'use client';

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui';
import Image from 'next/image';
import { useCallback, useState, type ChangeEvent } from 'react';
import { useCollection } from '@/contexts/CollectionContext';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { type Campaign } from '@/types/campaign';

export function CollectionAddDialog({
  campaign,
  onClosed,
}: {
  campaign: Campaign;
  onClosed: () => void;
}) {
  const [open, setOpen] = useState<boolean>(true);
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>('');
  const [newCollectionName, setNewCollectionName] = useState('');
  const { addToCollection, userCollections, isLoading } = useCollection();
  const canAdd =
    (selectedCollectionId || newCollectionName) && campaign && !isLoading;
  console.log('canAdd', {
    selectedCollectionId,
    newCollectionName,
    campaign,
    isLoading,
  });
  const onClose = useCallback(() => {
    setSelectedCollectionId('');
    setNewCollectionName('');
    setIsCreatingCollection(false);
    onClosed();
  }, [onClosed]);

  const onAddToCollection = useCallback(
    async (collectionId: string, isNewCollection = false) => {
      console.log('onAddToCollection');
      try {
        if (isNewCollection) {
          console.log(
            `Creating new collection with name: ${newCollectionName}`,
          );
          await addToCollection(campaign, newCollectionName, true);
        } else {
          console.log(`Adding to existing collection with ID: ${collectionId}`);
          await addToCollection(campaign, collectionId, false);
        }

        setOpen(false);
        onClose();

        toast({
          title: 'Success',
          description: isNewCollection
            ? 'Created new collection with your campaign'
            : 'Added campaign to your collection',
        });
      } catch (error) {
        console.error('Error adding to collection:', error);
        toast({
          title: 'Error',
          description: 'Failed to add to collection',
          variant: 'destructive',
        });
      }
    },
    [addToCollection, campaign, newCollectionName, onClose],
  );
  const onAdd = useCallback(() => {
    console.log('onAdd');
    if (!campaign) {
      toast({
        title: 'No campaign selected',
        description: 'Please try again',
        variant: 'destructive',
      });
      return;
    }

    if (isCreatingCollection) {
      if (!newCollectionName.trim()) {
        toast({
          title: 'Collection name required',
          description: 'Please enter a name for your collection',
          variant: 'destructive',
        });
        return;
      }
      onAddToCollection(newCollectionName, true);
    } else {
      if (!selectedCollectionId) {
        toast({
          title: 'Collection required',
          description: 'Please select a collection or create a new one',
          variant: 'destructive',
        });
        return;
      }
      onAddToCollection(selectedCollectionId, false);
    }
  }, [
    campaign,
    onAddToCollection,
    selectedCollectionId,
    isCreatingCollection,
    newCollectionName,
  ]);
  const onCollectionNameChanged = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      setNewCollectionName(event.target.value),
    [setNewCollectionName],
  );
  const onCollectionCreate = useCallback(
    () => setIsCreatingCollection(true),
    [],
  );
  const onCancelCreateCollection = useCallback(() => {
    setIsCreatingCollection(false);
    setNewCollectionName('');
  }, []);
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="text-2xl font-bold">Add to Collection</span>
            <Image src="/sparkles.png" alt="wallet" width={24} height={24} />
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="mb-4 text-sm text-gray-600">
            Choose the collection where you&apos;d like to add this campaign:
          </p>

          {isCreatingCollection ? (
            <div className="mb-4">
              <label
                htmlFor="collectionName"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Collection Name
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="collectionName"
                  value={newCollectionName}
                  onChange={onCollectionNameChanged}
                  className="flex-1 rounded-md border p-2"
                  placeholder="Enter collection name"
                />
                <Button variant="outline" onClick={onCancelCreateCollection}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {userCollections.map((collection) => (
                <div
                  key={collection.id}
                  className={cn(
                    'flex cursor-pointer items-center space-x-3 rounded-lg border p-3 hover:bg-green-50',
                    selectedCollectionId === collection.id &&
                      'border-emerald-400 bg-green-50',
                  )}
                  onClick={() => setSelectedCollectionId(collection.id)}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-lg">
                    {collection.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="flex-grow">{collection.name}</span>
                  <div
                    className={cn(
                      'h-6 w-6 rounded-full border-2',
                      selectedCollectionId === collection.id
                        ? 'border-emerald-400 bg-emerald-400'
                        : 'border-gray-200',
                    )}
                  />
                </div>
              ))}
              <div
                className="flex cursor-pointer items-center space-x-3 rounded-lg border p-3 hover:bg-gray-50"
                onClick={onCollectionCreate}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-dashed border-purple-400 text-purple-400">
                  +
                </div>
                <span className="text-purple-600">New Collection</span>
              </div>
            </div>
          )}

          <div className="mt-6 flex gap-4">
            <Button
              className="bg-purple-600 hover:bg-purple-700"
              disabled={!canAdd}
              onClick={onAdd}
            >
              {isLoading ? 'Saving...' : 'Save!'}
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
