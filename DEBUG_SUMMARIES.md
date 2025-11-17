# Debugging Summaries Not Showing

## Changes Made

1. **Fixed date format**: Changed from ISO strings to `YYYY-MM-DD` format that the backend expects
2. **Fixed date range calculation**: Now correctly calculates last 3 days from selected date
3. **Added error handling**: Better error handling and logging
4. **Added debugging**: Console logs to help identify issues

## How to Debug

1. **Open browser DevTools** (F12 or Cmd+Option+I)
2. **Go to Console tab**
3. **Navigate to Summaries page**
4. **Check console logs** for:
   - `User channels:` - Should show array of channels
   - `Posts for channel X:` - Should show number of posts per channel
   - `Filtered summaries:` - Should show number of channels with posts
   - Any error messages

## Common Issues

### No Channels Found
**Symptom:** Console shows "No channels found for user: X"

**Fix:** 
- User needs to add channels via the bot first
- Check if user has channels in database
- Verify `telegram_id` is correct

### API Errors
**Symptom:** Console shows API errors (404, 500, CORS, etc.)

**Fix:**
- Check `VITE_API_BASE_URL` is set correctly in `.env`
- Verify backend is running
- Check CORS settings in backend
- Check network tab for actual error response

### No Posts for Selected Date
**Symptom:** Channels show but no posts

**Fix:**
- Try selecting different dates (yesterday, 2 days ago)
- Check if posts exist in database for those dates
- Verify date filtering logic

### Empty State Showing
**Symptom:** "No summaries" message

**Possible causes:**
1. User has no channels
2. No posts for selected date range
3. Date filtering too strict
4. API returning empty results

## Testing Steps

1. **Check if user has channels:**
   ```javascript
   // In browser console
   const telegramId = localStorage.getItem('telegram_id')
   fetch(`${API_BASE_URL}/api/channels/user/id/${telegramId}/`)
     .then(r => r.json())
     .then(console.log)
   ```

2. **Check if posts exist:**
   ```javascript
   // Replace CHANNEL_ID with actual channel ID
   fetch(`${API_BASE_URL}/api/posts/channel/CHANNEL_ID/?start_date=2024-01-01&end_date=2024-01-31`)
     .then(r => r.json())
     .then(console.log)
   ```

3. **Check API base URL:**
   ```javascript
   console.log(import.meta.env.VITE_API_BASE_URL)
   ```

## Next Steps

After checking console logs:
1. If no channels: User needs to add channels via bot
2. If API errors: Fix backend/CORS configuration
3. If no posts: Check database for posts in date range
4. If date filtering issue: Adjust date range logic

