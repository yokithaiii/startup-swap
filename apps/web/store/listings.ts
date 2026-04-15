import { create } from 'zustand'
import { Listing, SearchFilters } from '@/types'

interface ListingsStore {
  listings: Listing[]
  filters: SearchFilters
  isLoading: boolean
  error: string | null
  
  setListings: (listings: Listing[]) => void
  setFilters: (filters: SearchFilters) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  addListing: (listing: Listing) => void
  updateListing: (id: string, data: Partial<Listing>) => void
  removeListing: (id: string) => void
  clearFilters: () => void
}

export const useListingsStore = create<ListingsStore>((set) => ({
  listings: [],
  filters: {},
  isLoading: false,
  error: null,
  
  setListings: (listings) => set({ listings }),
  
  setFilters: (filters) => set({ filters }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
  
  addListing: (listing) => 
    set((state) => ({ listings: [listing, ...state.listings] })),
  
  updateListing: (id, data) =>
    set((state) => ({
      listings: state.listings.map((listing) =>
        listing.id === id ? { ...listing, ...data } : listing
      ),
    })),
  
  removeListing: (id) =>
    set((state) => ({
      listings: state.listings.filter((listing) => listing.id !== id),
    })),
  
  clearFilters: () => set({ filters: {} }),
}))
