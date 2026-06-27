export type RelationshipType = 'waalid' | 'walaal' | 'saaxib' | 'ehel' | 'macallin' | 'jaar';

export interface GreetingMessage {
  id: string;
  guest_name: string;
  relationship: RelationshipType;
  message_text: string;
  created_at: string;
  is_approved: boolean;
}

export const RELATIONSHIP_LABELS: Record<RelationshipType, string> = {
  waalid: 'Waalid (Parent)',
  walaal: 'Walaal (Sibling)',
  saaxib: 'Saaxib (Friend)',
  ehel: 'Ehel (Relative / Connection)',
  macallin: 'Macallin (Teacher)',
  jaar: 'Jaar (Neighbor)',
};

export const RELATIONSHIP_SHORT_LABELS: Record<RelationshipType, string> = {
  waalid: 'WAALID',
  walaal: 'WALAAL',
  saaxib: 'SAAXIIB',
  ehel: 'EHEL',
  macallin: 'MACALLIN',
  jaar: 'JAAR',
};
