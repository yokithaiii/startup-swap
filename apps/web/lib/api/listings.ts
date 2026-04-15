import { ListingFormData } from '@/lib/schemas/listing'

export async function createListing(data: ListingFormData) {
  const res = await fetch('/api/listings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error ?? 'Ошибка создания')
  return json.listing
}

export async function updateListing(id: string, data: Partial<ListingFormData>) {
  const res = await fetch(`/api/listings/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error ?? 'Ошибка обновления')
  return json.listing
}

export async function deleteListing(id: string) {
  const res = await fetch(`/api/listings/${id}`, { method: 'DELETE' })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error ?? 'Ошибка удаления')
  return json
}

export async function publishListing(id: string) {
  const res = await fetch(`/api/listings/${id}/publish`, { method: 'POST' })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error ?? 'Ошибка публикации')
  return json.listing
}

export async function delistListing(id: string) {
  const res = await fetch(`/api/listings/${id}/publish`, { method: 'DELETE' })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error ?? 'Ошибка снятия')
  return json.listing
}

export async function getMyListings() {
  const res = await fetch('/api/listings/my')
  const json = await res.json()
  if (!res.ok) throw new Error(json.error ?? 'Ошибка загрузки')
  return json.listings
}

export async function getListings(params?: Record<string, string>) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : ''
  const res = await fetch(`/api/listings${qs}`)
  const json = await res.json()
  if (!res.ok) throw new Error(json.error ?? 'Ошибка загрузки')
  return json
}
