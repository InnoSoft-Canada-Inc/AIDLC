# Support Guide: Real-Time Inventory Sync

**Unit ID**: INVENTORY-SYNC-001
**Domain**: integration
**Created**: 2026-03-04

---

## Customer-Facing Description

**What is this feature?**
Real-Time Inventory Sync automatically keeps your stock levels accurate across all your sales channels (Shopify, Amazon, eBay, etc.). When an item sells on one platform, inventory updates instantly on all other platforms.

**Who is it for?**
Multi-channel sellers who sell the same products across multiple platforms and want to prevent overselling.

**Why was it built?**
To eliminate the manual work of updating inventory across platforms and prevent overselling when stock levels get out of sync.

---

## How to Use

**Step-by-step for customers**:

1. Connect your sales channels in Settings > Integrations (one-time setup)
2. Enable Real-Time Inventory Sync toggle for each channel
3. Map your products across channels (system auto-suggests matches based on SKU)
4. Inventory now syncs automatically — no further action needed

**Prerequisites** (what customers need first):
- Active sales channels (Shopify, Amazon, WooCommerce, eBay, etc.)
- Products must have SKUs assigned
- Admin access to connected platforms

**Access requirements**:
- Professional plan or higher
- Admin or Inventory Manager role

---

## Common Questions

### Q: How fast is "real-time"? Is there any delay?
**A**: Inventory updates typically complete in 1-3 seconds. The moment a sale happens on one channel, stock updates on all other channels within seconds (not minutes or hours).

### Q: What happens if two customers buy the last item at exactly the same time on different channels?
**A**: Our conflict resolution system processes the first transaction that reaches our servers and immediately locks inventory. The second transaction is rejected as "out of stock." One customer gets the item, the other sees it's unavailable — no overselling.

### Q: Does this work with our physical store's POS system?
**A**: Yes, if your POS system integrates with our platform. We support 50+ POS systems including Square, Clover, Shopify POS, and Lightspeed. Check Settings > Integrations to see if yours is listed.

### Q: Can I turn off sync for specific products?
**A**: Yes, you can exclude products from auto-sync in Product Settings. This is useful for products sold exclusively on one channel or custom/made-to-order items.

---

## Known Issues

**What might not work as expected**:

| Issue | Workaround | ETA for Fix |
|-------|-----------|-------------|
| Amazon sync may delay 10-15 seconds during high-volume sales events | This is an Amazon API limitation, not our platform | Investigating alternative sync methods (Q2 2026) |
| Manual inventory adjustments in external platforms take 5-10 seconds to sync back | Refresh the inventory page to see updated counts immediately | Implementing webhook listeners (Q1 2026) |

---

## Troubleshooting

### Problem: Inventory not syncing between channels
**Symptoms**: Item sells on Shopify but stock level doesn't update on Amazon
**Cause**: Channel connection may have been interrupted or API credentials expired
**Solution**:
1. Go to Settings > Integrations
2. Check connection status for affected channel (look for red warning icon)
3. Click "Reconnect" and re-authorize the channel
4. Verify sync is working by making a test inventory adjustment

### Problem: Stock levels are incorrect after enabling sync
**Symptoms**: Inventory counts don't match reality after turning on real-time sync
**Cause**: Initial sync uses stock levels from the primary channel (usually Shopify) as source of truth
**Solution**:
1. Before enabling sync, manually verify stock counts are accurate in your primary channel
2. Enable sync — it will propagate these counts to other channels
3. If counts are already wrong, disable sync, correct counts in primary channel, then re-enable

### Problem: "Conflict detected" error when processing order
**Symptoms**: Customer sees error message during checkout saying "This item is no longer available"
**Cause**: Item was purchased on another channel at nearly the same time
**Solution**:
1. Apologize to customer — this is rare but prevents overselling
2. Offer alternative: backorder, similar product, or discount on next purchase
3. This is working as designed to prevent overselling

---

## Escalation Criteria

**When to escalate to engineering**:
- Sync stops working for more than 10 minutes across all channels
- Customer reports overselling despite sync being enabled
- Inventory counts are decreasing when no sales are happening (phantom transactions)

**What information to collect before escalating**:
- Customer account ID and affected sales channels
- Screenshots of inventory discrepancies (product page from each channel)
- Timestamp when issue was first noticed
- Recent orders that may have triggered the issue

---

## Limitations

**What this feature does NOT do** (set customer expectations):
- Does not sync historical sales data from before sync was enabled (only works going forward)
- Does not forecast future inventory needs or suggest reorder quantities (see Inventory Planning feature for this)
- Does not sync product descriptions, prices, or images (only stock quantities)

**Planned enhancements** (if customers ask "when will you add X?"):
- Automatic low-stock alerts and reorder triggers (Q3 2026)
- Sync product prices across channels (Q4 2026)

---

## Related Features

**Works with**:
- Inventory Planning — uses real-time sync data to forecast reorder needs
- Multi-Channel Dashboard — visualize inventory levels across all channels in one view

**Replaces** (if applicable):
- Manual CSV inventory exports/imports — no longer needed with automatic sync

---

## Quick Reference

**One-sentence description**: Automatically sync inventory across all sales channels in real-time to prevent overselling
**Documentation link**: [Help Center: Real-Time Inventory Sync Setup Guide]
**Internal notes**: Common false alarm: customers think sync is broken when Amazon delays 10-15 seconds during Prime Day — this is Amazon's API throttling, not our bug.

---

**Source**: This guide is derived from the technical feature documentation at `aidlc-docs/integration/INVENTORY-SYNC-001/documentation/feature-doc.md`.
