'use client'
import { useState } from 'react'
import { Search } from 'lucide-react'
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { usePrivy } from '@privy-io/react-auth';
import { CreateCampaign } from '@/components/create-campaign'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dailog"
import { useCollection } from '@/contexts/CollectionContext'
import CampaignList from '@/components/campaign-list';

interface Story {
  id: string
  title: string
  author: string
  location: string
  image: string
  authorImage: string
  excerpt: string
  donations: number
  fundingGoal: number
  donationCount: number
}

interface Category {
  id: string
  name: string
  icon: JSX.Element
}

export function ExploreStories() {
  const [showCreateCampaign, setShowCreateCampaign] = useState(false)
  const [showCollectionModal, setShowCollectionModal] = useState(false)
  const [selectedStory, setSelectedStory] = useState<Story | null>(null)
  const [selectedCollection, setSelectedCollection] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const { addToCollection } = useCollection()

  const categories: Category[] = [
    { id: "visual-arts", name: "Visual Arts", icon: <span className="text-xl">🎨</span> },
    { id: "music-audio", name: "Music & Audio", icon: <span className="text-xl">🎵</span> },
    { id: "film-photography", name: "Film & Photography", icon: <span className="text-xl">📷</span> },
    { id: "crafts-artifacts", name: "Crafts & Artifacts", icon: <span className="text-xl">🏺</span> },
    { id: "literature-writing", name: "Literature & Writing", icon: <span className="text-xl">📚</span> },
    { id: "food-culinary", name: "Food & Culinary Arts", icon: <span className="text-xl">🍳</span> },
    { id: "fashion-textiles", name: "Fashion & Textiles", icon: <span className="text-xl">👕</span> },
    { id: "education-workshops", name: "Education & Workshops", icon: <span className="text-xl">🎓</span> },
    { id: "digital-art-nfts", name: "Digital Art & NFTs", icon: <span className="text-xl">💻</span> },
    { id: "community-goods", name: "Community & Public Goods", icon: <span className="text-xl">🤝</span> },
  ]

  const collections = [
    { id: 1, name: "Collection 1", initial: "1" },
    { id: 2, name: "Collection 2", initial: "2" },
  ]

  const { login, authenticated } = usePrivy();

  return (
    <div className="flex-col min-h-screen bg-gray-50">
  
        <header className="px-4 py-4">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div className="flex items-start gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <Input 
                  className="w-[300px] pl-10 rounded-xl" 
                  placeholder="Search Stories" 
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                className="bg-purple-50 font-semibold text-purple-600 hover:bg-purple-100"
                onClick={login}
              >
                {authenticated ? "Connected" : "Connect Wallet"}
                <Image src="/wallet-icon.png" alt="wallet" width={14} height={14} />
              </Button>
              <Button
                className="bg-emerald-400 font-semibold hover:bg-emerald-500"
                onClick={() => setShowCreateCampaign(true)}
              >
                Create Story
              </Button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-8">
          {showCreateCampaign ? (
            <div className="mb-8">
              <Button
                variant="outline"
                onClick={() => setShowCreateCampaign(false)}
                className="mb-4"
              >
                ← Back to Stories
              </Button>
              <CreateCampaign />
            </div>
          ) : (
            <>
              <div className="text-center">
                <div className="mb-4 text-3xl font-bold">Explore Stories</div>
                <p className="mx-auto mb-8 max-w-3xl text-gray-600">
                  Explore personal memories shared by refugees—each story offers a glimpse into their resilience, hopes, and dreams.
                  By taking in these moments, you help preserve their voices and honor their journeys.
                </p>
              </div>

              <div className="mb-8 flex flex-wrap justify-center gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant="outline"
                    className="flex items-center gap-2 rounded-full bg-white"
                  >
                    {category.icon}
                    {category.name}
                  </Button>
                ))}
              </div>

              <CampaignList searchTerm={searchTerm} />
            </>
          )}
        </main>

      <Dialog
        open={showCollectionModal}
        onOpenChange={(open) => {
          setShowCollectionModal(open)
          if (!open) {
            setSelectedCollection('')
            setSelectedStory(null)
          }
        }}
      >
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span className="text-2xl font-bold">Add to Collection</span>
              <Image src="/sparkles.png" alt="wallet" width={24} height={24} />
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600 mb-4 text-sm">Choose the collection where you&#39;d like to add this story:</p>
            <div className="space-y-2">
              {collections.map((collection) => (
                <div
                  key={collection.id}
                  className={cn(
                    "flex items-center space-x-3 p-3 rounded-lg border hover:bg-green-50 cursor-pointer",
                    selectedCollection === collection.name && "border-emerald-400 bg-green-50"
                  )}
                  onClick={() => setSelectedCollection(collection.name)}
                >
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-lg">
                    {collection.initial}
                  </div>
                  <span className="flex-grow">{collection.name}</span>
                  <div className={cn(
                    "w-6 h-6 rounded-full border-2",
                    selectedCollection === collection.name
                      ? "border-emerald-400 bg-emerald-400"
                      : "border-gray-200"
                  )} />
                </div>
              ))}
              <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer">
                <div className="w-10 h-10 border-2 border-dashed border-purple-400 rounded-lg flex items-center justify-center text-purple-400">
                  +
                </div>
                <span className="text-purple-600">New Collection</span>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <Button
                className="bg-purple-600 hover:bg-purple-700"
                disabled={!selectedCollection || !selectedStory}
                onClick={() => {
                  if (selectedStory && selectedCollection) {
                    addToCollection(selectedStory, selectedCollection)
                    setShowCollectionModal(false)
                    setSelectedCollection('')
                    setSelectedStory(null)
                  }
                }}
              >
                Save
              </Button>
              <Button
                variant="ghost"
                onClick={() => setShowCollectionModal(false)}
              >
                Cancel
              </Button>

            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}