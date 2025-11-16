# How Telegram Login Works

## Current Implementation Flow

### 1. User Clicks Login Button

When user clicks "Login" on the web app:

```typescript
// In Login.vue
const handleLogin = () => {
  login() // Calls useAuth().login()
}
```

### 2. Redirect to Telegram Bot

The app redirects to your Telegram bot:

```typescript
// In useAuth.ts
const login = (): void => {
  if (BOT_REDIRECT_URL) {
    window.location.href = BOT_REDIRECT_URL  // e.g., https://t.me/your_bot
  }
}
```

**What happens:**
- User is redirected to `https://t.me/your_bot_username`
- Opens Telegram app (or web.telegram.org)
- User starts a chat with your bot

---

### 3. Bot Authentication (Needs Implementation)

**Currently, the bot needs to handle this:**

The bot should:
1. Detect when user starts the bot (via `/start` command)
2. Authenticate the user (they're already logged into Telegram)
3. Get their `telegram_id` from the Telegram update
4. Redirect back to the web app with authentication data

**Expected redirect format:**
```
https://your-web-app.netlify.app/?telegram_id=123456789&hash=auth_hash
```

---

### 4. Web App Handles Callback

When user returns to web app with URL parameters:

```typescript
// In App.vue (on mount)
handleAuthCallback()

// In useAuth.ts
const handleAuthCallback = (): void => {
  const urlParams = new URLSearchParams(window.location.search)
  const telegramId = urlParams.get('telegram_id')
  const authHash = urlParams.get('hash')
  
  if (telegramId && authHash) {
    loadUser(telegramId)  // Fetch user data from API
    // Clean URL (remove query params)
    window.history.replaceState({}, '', window.location.pathname)
  }
}
```

**What happens:**
- Extracts `telegram_id` from URL
- Calls API: `GET /api/users/check/{telegram_id}/`
- Stores `telegram_id` in `localStorage`
- Loads user data into app state

---

### 5. User Data Loading

```typescript
const loadUser = async (telegramId: string): Promise<void> => {
  const userData = await apiService.getUser(telegramId)
  user.value = userData
  localStorage.setItem('telegram_id', telegramId)
}
```

**API Call:**
- Endpoint: `GET /api/users/check/{telegram_id}/`
- Returns: User information (name, username, subscription, etc.)

---

### 6. Session Persistence

**On app load:**
```typescript
// In App.vue
initAuth()  // Checks localStorage for existing telegram_id

// In useAuth.ts
const initAuth = (): void => {
  const telegramId = localStorage.getItem('telegram_id')
  if (telegramId) {
    loadUser(telegramId)  // Auto-login if telegram_id exists
  }
}
```

**What this means:**
- User stays logged in across browser sessions
- No need to login again until they logout or clear browser data

---

## Complete Flow Diagram

```
User clicks "Login"
    ↓
Web app redirects to: https://t.me/your_bot
    ↓
Telegram opens, user chats with bot
    ↓
Bot authenticates user (gets telegram_id from Telegram)
    ↓
Bot redirects back: https://your-app.netlify.app/?telegram_id=123&hash=abc
    ↓
Web app extracts telegram_id from URL
    ↓
Web app calls API: GET /api/users/check/123/
    ↓
API returns user data
    ↓
Web app stores telegram_id in localStorage
    ↓
User is logged in! ✅
```

---

## What Needs to Be Implemented in Bot

Your Telegram bot needs to handle the redirect back. Here's what it should do:

### Option 1: Simple Redirect (Current Expectation)

```python
# In your bot handler
async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    telegram_id = user.id
    
    # Generate auth hash (optional, for security)
    # For now, you can skip hash verification
    
    # Web app URL (from environment variable)
    web_app_url = os.getenv('WEB_APP_URL', 'https://your-app.netlify.app')
    
    # Redirect URL
    redirect_url = f"{web_app_url}?telegram_id={telegram_id}"
    
    # Send message with button that opens web app
    keyboard = [[InlineKeyboardButton(
        "Open Web App",
        url=redirect_url
    )]]
    
    await update.message.reply_text(
        "Click the button to open the web app:",
        reply_markup=InlineKeyboardMarkup(keyboard)
    )
```

### Option 2: Using Telegram Web App Button

```python
# Better approach - use Telegram's Web App feature
from telegram import InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo

async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    web_app_url = os.getenv('WEB_APP_URL', 'https://your-app.netlify.app')
    
    keyboard = [[InlineKeyboardButton(
        "Open Web App",
        web_app=WebAppInfo(url=web_app_url)
    )]]
    
    await update.message.reply_text(
        "Click to open the web app:",
        reply_markup=InlineKeyboardMarkup(keyboard)
    )
```

### Option 3: Deep Link with Start Parameter

```python
# When user clicks login, redirect with start parameter
# https://t.me/your_bot?start=web_login

async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    args = context.args  # Gets start parameter
    
    if args and args[0] == 'web_login':
        telegram_id = user.id
        web_app_url = os.getenv('WEB_APP_URL', 'https://your-app.netlify.app')
        redirect_url = f"{web_app_url}?telegram_id={telegram_id}"
        
        # Send button or redirect
        keyboard = [[InlineKeyboardButton(
            "Continue to Web App",
            url=redirect_url
        )]]
        
        await update.message.reply_text(
            "Opening web app...",
            reply_markup=InlineKeyboardMarkup(keyboard)
        )
```

---

## Security Considerations

### Current Implementation
- ✅ `telegram_id` is stored in localStorage (persistent)
- ✅ API validates user exists before returning data
- ⚠️ No hash verification (could be added)
- ⚠️ No expiration (user stays logged in forever)

### Recommended Improvements

1. **Add Hash Verification:**
```typescript
// Generate hash on bot side using secret
const hash = generateHash(telegram_id, secret_key)

// Verify on web app side
const isValid = verifyHash(telegram_id, hash, secret_key)
```

2. **Add Token Expiration:**
```typescript
// Store with expiration
localStorage.setItem('telegram_id', telegramId)
localStorage.setItem('auth_expires', Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
```

3. **Use Secure Storage:**
- Consider using httpOnly cookies (requires backend)
- Or sessionStorage instead of localStorage (clears on tab close)

---

## Testing the Flow

### Manual Test:

1. **Start web app locally:**
```bash
cd web-app
npm run dev
```

2. **Click "Login" button**
   - Should redirect to `https://t.me/your_bot`

3. **In Telegram bot:**
   - Bot should send a button/link
   - Link should be: `http://localhost:5173/?telegram_id=YOUR_ID`

4. **Click the link**
   - Should return to web app
   - Should automatically log you in
   - Should redirect to `/app/profile`

---

## Current Status

✅ **Web App Side:** Fully implemented
- Login button redirects to bot
- Handles callback with telegram_id
- Loads user data from API
- Persists session in localStorage

⚠️ **Bot Side:** Needs implementation
- Bot should handle `/start` command
- Bot should redirect back with telegram_id
- Bot should generate auth hash (optional)

---

## Quick Bot Implementation Example

Add this to your bot's handlers:

```python
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ContextTypes

WEB_APP_URL = os.getenv('WEB_APP_URL', 'https://your-app.netlify.app')

async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    telegram_id = user.id
    
    # Create redirect URL
    redirect_url = f"{WEB_APP_URL}?telegram_id={telegram_id}"
    
    # Send button
    keyboard = [[InlineKeyboardButton(
        "🚀 Open Web App",
        url=redirect_url
    )]]
    
    await update.message.reply_text(
        "Welcome! Click the button below to access the web app:",
        reply_markup=InlineKeyboardMarkup(keyboard)
    )
```

Then register the handler in your bot's main file.

---

## Summary

**How it works:**
1. User clicks login → Redirects to Telegram bot
2. Bot authenticates → Gets user's telegram_id
3. Bot redirects back → Web app URL with telegram_id parameter
4. Web app extracts ID → Calls API to get user data
5. User logged in → Session stored in localStorage

**What you need:**
- Bot handler that redirects back to web app with `telegram_id`
- Web app URL configured in bot's environment variables

