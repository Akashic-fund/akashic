'use client'
import { useState } from 'react'
import { Search } from 'lucide-react'
import Image from "next/image"
import { useAuth } from "@/contexts";
import { CreateCampaign } from '@/components/create-campaign'
import {
  Button,
  Input,
} from "@/components/ui"
import CampaignList from '@/components/campaign-list';
import { categories } from '@/lib/constant';

export function ExploreStories() {
  const [showCreateCampaign, setShowCreateCampaign] = useState(false)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const { login, authenticated } = useAuth();

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
              <Button
                key="all"
                variant="outline"
                className={`flex items-center gap-2 rounded-full ${!selectedCategory ? 'bg-purple-100 text-purple-600' : 'bg-white'}`}
                onClick={() => setSelectedCategory(null)}
              >
                <div className="text-2xl">🌟</div>
                All Categories
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant="outline"
                  className={`flex items-center gap-2 rounded-full ${selectedCategory === category.id ? 'bg-purple-100 text-purple-600' : 'bg-white'}`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <div className="text-2xl">{category.icon}</div>
                  {category.name}
                </Button>
              ))}
            </div>

            <CampaignList searchTerm={searchTerm} categoryFilter={selectedCategory} />
          </>
        )}
      </main>
    </div>
  )
}