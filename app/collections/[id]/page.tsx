'use client';

import { useParams } from 'next/navigation';
import { useCollection as useCollectionQuery } from '@/lib/hooks/useCollections';
import { useAuth } from '@/contexts';
import { CollectionDetailLoading } from '@/components/collection/detail-loading';
import { CollectionDetailNoAuth } from '@/components/collection/detail-noauth';
import { CollectionDetailNotFound } from '@/components/collection/detail-not-found';
import { CollectionDetailActions } from '@/components/collection/detail-actions';
import { CollectionItemList } from '@/components/collection/item-list';

export default function CollectionDetailsPage() {
  const params = useParams();
  const { id } = params as { id: string };
  const { authenticated } = useAuth();

  const { data: collection, isPending: loading } = useCollectionQuery(id);

  if (loading) {
    return <CollectionDetailLoading />;
  }

  if (!authenticated) {
    return <CollectionDetailNoAuth />;
  }

  if (!collection) {
    return <CollectionDetailNotFound />;
  }

  return (
    <div className="container mx-auto p-6">
      <CollectionDetailActions collection={collection} />
      {collection.description && (
        <p className="mb-8 max-w-3xl text-gray-600">{collection.description}</p>
      )}
      <CollectionItemList collection={collection} />
    </div>
  );
}
