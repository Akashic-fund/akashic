export interface CollectionsWithIdParams {
  params: Promise<{
    id: string;
  }>;
}
export interface PostCollectionsWithIdBody {
  itemId: string;
  itemType: string;
}
export interface DeleteCollectionsWithIdBody {
  itemId: string;
}
export interface PutCollectionsWithIdBody {
  name: string;
  description: string;
}
export interface PostCollectionsBody {
  name: string;
  description: string;
}
