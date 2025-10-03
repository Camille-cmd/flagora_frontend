# Flagora App Frontend

## Installation

TODO

## Application Overview

### Game Session Management

The application implements a session management to handle various user scenarios:

Session Behavior

- Multi-tab support: Each browser tab creates an independent game session with a unique
  token
- Screen lock persistence: Game sessions survive screen locks and brief interruptions
- Automatic cleanup: Sessions are cleared when users close tabs or navigate away from
  the game

Technical Implementation

- Uses sessionStorage for tab-specific token storage
- Generates unique tokens per tab: crypto.randomUUID()
- Handles browser events (beforeunload, pagehide) for reliable cleanup
- Backend creates/retrieves sessions based on the provided gameToken

This ensures users can:

- Play multiple games simultaneously in different tabs
- Resume games after screen locks or brief network interruptions
- Always start fresh after intentionally closing tabs or navigating away
