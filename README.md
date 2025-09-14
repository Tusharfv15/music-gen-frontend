# AI Music Generation Platform

A full-stack AI-powered music generation platform that creates songs with lyrics and thumbnails using state-of-the-art machine learning models deployed on serverless GPU infrastructure.

<!-- TODO: Add hero image/demo GIF showing the complete music generation process -->
<img width="1853" height="768" alt="image" src="https://github.com/user-attachments/assets/40d512d0-fd59-4b5b-ae97-6356523a9e3e" />


## 🎵 Features

- **AI Music Generation**: Create high-quality music tracks from text descriptions
- **Intelligent Lyrics Generation**: Generate contextual lyrics based on descriptions
- **Dynamic Thumbnail Creation**: Auto-generate album cover art for each song
- **Queue Management**: Process music generation requests one at a time using Inngest
- **Cloud Storage**: Store generated music and images on AWS S3
- **User Authentication**: Secure user management with session handling


## 🏗️ Architecture

### Backend (Python/Modal)
- **FastAPI endpoints** deployed on Modal serverless GPU infrastructure
- **Three specialized AI models** running on L40S GPUs:
  1. **ACE-Step** for music generation
  2. **Qwen2-7B-Instruct** for lyrics generation
  3. **SDXL-Turbo** for thumbnail generation

### Frontend (Next.js)
- **React-based web interface** with TypeScript
- **Inngest queue system** for processing music generation (1 request at a time per user)
- **AWS S3 integration** for media storage and retrieval
- **Prisma ORM** for database management
- **Better Auth** for user authentication

### Infrastructure
- **Modal**: Serverless GPU deployment platform
  <img width="1884" height="868" alt="image" src="https://github.com/user-attachments/assets/9ead93ef-9723-4830-b26c-bf56f6db13b2" />

- **AWS S3**: Object storage for music files and thumbnails
- **Inngest**: Queue management and background job processing
- **PostgreSQL**: Primary database (via Prisma)

## 🚀 AI Models

### 1. Music Generation - ACE-Step
- **Repository**: [ace-step/ACE-Step](https://github.com/ace-step/ACE-Step)
- **Purpose**: Generates high-quality music from text prompts and lyrics
- **Features**:
  - Supports instrumental and lyrical music
  - Configurable audio duration (up to 180 seconds)
  - Advanced guidance scale and inference steps
  - Multiple scheduler options (Flow Match Euler, Heun, PingPong)

### 2. Lyrics Generation - Qwen2-7B-Instruct
- **Model**: `Qwen/Qwen2-7B-Instruct`
- **Purpose**: Generates structured song lyrics from descriptions
- **Output Format**: Structured lyrics with `[verse]`, `[chorus]`, `[bridge]` tags
- **Features**: Context-aware lyric generation with proper song structure

### 3. Thumbnail Generation - SDXL-Turbo
- **Model**: `stabilityai/sdxl-turbo`
- **Purpose**: Creates album cover art for generated songs
- **Features**:
  - Fast generation (2 inference steps)
  - High-quality images optimized for album covers
  - Prompt-based artistic style generation

## 🔄 Queue System (Inngest)

<img width="1590" height="682" alt="image" src="https://github.com/user-attachments/assets/4636df84-030c-4789-a6ec-02e5a3f345eb" />


The platform implements a sophisticated queue system using Inngest to ensure reliable music generation:

### Features
- **Concurrency Control**: Limits to 1 concurrent generation per user
- **Error Handling**: Automatic failure detection and status updates
- **Step-by-Step Processing**:
  1. Credit verification
  2. Status updates (processing → processed/failed)
  3. Modal API calls for music generation
  4. S3 upload and database updates
  5. Credit deduction on successful completion

### Queue Flow
```typescript
User Request → Queue Song → Check Credits → Generate Music → Upload to S3 → Update Status → Deduct Credits
```

## 🗄️ AWS S3 Integration

### Storage Structure
- **Music Files**: `.wav` format with UUID naming
- **Thumbnails**: `.png` format with UUID naming
- **Access**: Pre-signed URLs for secure, time-limited access

### Features
- **Automatic Upload**: Generated content uploaded immediately after creation
- **Pre-signed URLs**: Secure access with 1-hour expiration
- **Error Handling**: Robust file upload and cleanup procedures

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- Python 3.9+
- PostgreSQL
- AWS Account with S3 bucket
- Modal account and API keys
- Inngest account

## 🎨 Music Generation Modes

1. **Full Description**: Generate from complete song description
2. **Custom Mode**: Provide both prompt and custom lyrics
3. **Described Lyrics**: Provide prompt and describe desired lyrics

## 🙏 Acknowledgments

- [ACE-Step](https://github.com/ace-step/ACE-Step) for the music generation model
- [Qwen](https://huggingface.co/Qwen/Qwen2-7B-Instruct) for lyrics generation
- [Stability AI](https://huggingface.co/stabilityai/sdxl-turbo) for image generation
- Modal for serverless GPU infrastructure
- Inngest for reliable queue management

---

Built with ❤️ using cutting-edge AI and modern web technologies.
