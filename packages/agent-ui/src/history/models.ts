/** Host projections preserve the source conversation identity and captured display metadata. */
export type ConversationLocation = { scopeDir: string; conversationId: string };
export type ConversationListEntry = {
  location: ConversationLocation;
  metadata?: { title: string; updatedAt: string; status: string };
  preview?: string;
  unavailableReason?: string;
};
