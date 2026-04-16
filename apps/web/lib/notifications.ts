import { SupabaseClient } from '@supabase/supabase-js'

export type NotificationType =
  | 'offer_received'
  | 'offer_accepted'
  | 'offer_rejected'
  | 'listing_approved'
  | 'listing_rejected'
  | 'new_message'

interface CreateNotificationParams {
  supabase:   SupabaseClient
  userId:     string
  type:       NotificationType
  title:      string
  message:    string
  listingId?: string
  offerId?:   string
  link?:      string
}

export async function createNotification({
  supabase, userId, type, title, message, listingId, offerId, link,
}: CreateNotificationParams) {
  const { error } = await supabase.from('notifications').insert({
    user_id:    userId,
    type,
    title,
    message,
    listing_id: listingId ?? null,
    offer_id:   offerId   ?? null,
    link:       link      ?? null,
    read:       false,
  })
  if (error) {
    console.error('[createNotification] error:', error.message, { userId, type })
  }
}
