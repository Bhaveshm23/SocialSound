# SocialSound API

### Overview
SocialSound is a dynamic social media platform designed for managing and sharing audio content. This API facilitates seamless interactions between users and the platform, enabling features like user authentication, audio uploads, and engagement tracking.

---

## Features

- **User Management:** Create, authenticate, and manage user profiles.
- **Audio Content:** Upload, update, delete, and retrieve audio files.
- **Engagement:** Manage likes and view replies for audio content.
- **Security:** Session-based authentication using cookies.

---


## Data Models

### User
| Field           | Type     | Description                     |
|------------------|----------|---------------------------------|
| `userId`         | `string` | Unique identifier for the user.|
| `username`       | `string` | Username of the user.          |
| `email`          | `string` | User's email address.          |
| `bio`            | `string` | Short bio of the user.         |
| `profilePicture` | `string` | Profile picture URL.           |

### Audio
| Field           | Type     | Description                       |
|------------------|----------|-----------------------------------|
| `audioId`        | `integer`| Unique identifier for the audio. |
| `userId`         | `string` | ID of the user who uploaded it.  |
| `parentAudioId`  | `integer`| ID of the parent audio, if any.  |
| `title`          | `string` | Title of the audio file.         |
| `dateUploaded`   | `string` | Upload timestamp (ISO 8601).     |
| `likes`          | `integer`| Number of likes.                 |
| `sound`          | `string` | URL of the audio file.           |

---

## Authentication
This API uses session-based authentication with cookies. To authenticate:
- Include the `SESSIONID` cookie in your requests.

---

## Tools and Technologies
- **Backend Framework:** Flask
- **Database:** PostgreSQL
- **Authentication:** Session-based using `cookieAuth`.
