# Interruption Handling — Behavior Per Option

> Loaded on-demand when a second "Using AI-DLC..." trigger fires while a unit is active.

---

## Option A — Close current unit first
- Run proportionate documentation exit for active track (full for Full Track, targeted for Lightweight, one-paragraph for Hotfix)
- Mark unit complete in backlog
- Begin Inception for new unit in same session

## Option B — Pause current unit
- Write mid-pause checkpoint to current unit's session-summary.md
- Set "Exact Next Step" field precise enough that future session can resume without other context
- Set unit status in domain backlog to "⏸ Paused"
- Set Session Status field to "Paused"
- Begin Inception for new unit
- Paused unit resumes when future trigger references it, or when interrupting unit closes

## Option C — Continue current unit
- Treat new prompt as next action within active unit
- Do NOT create new unit folder or backlog entry
- Update session summary to reflect expanded scope if needed

## Option D — Stay with current unit
- Acknowledge new request but do not act on it
- Remind developer they can open new session to handle it independently
- Continue with active unit
