# AI Music Generation Platform

A full-stack AI-powered music generation platform that creates songs with lyrics and thumbnails using state-of-the-art machine learning models deployed on serverless GPU infrastructure.

## 🎵 Features

- **AI Music Generation**: Create high-quality music tracks from text descriptions
- **Intelligent Lyrics Generation**: Generate contextual lyrics based on descriptions
- **Dynamic Thumbnail Creation**: Auto-generate album cover art for each song
- **Queue Management**: Process music generation requests one at a time using Inngest
- **Cloud Storage**: Store generated music and images on AWS S3
- **User Authentication**: Secure user management with session handling
- **Credit System**: Track and manage user credits for song generation
- **Real-time Status Updates**: Track generation progress in real-time

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

### Environment Variables

#### Frontend (.env.local)
```env
DATABASE_URL="postgresql://..."
BETTER_AUTH_SECRET="your-auth-secret"
BETTER_AUTH_URL="http://localhost:3000"
MODAL_KEY="your-modal-key"
MODAL_SECRET="your-modal-secret"
AWS_ACCESS_KEY_ID="your-aws-key"
AWS_SECRET_ACCESS_KEY_ID="your-aws-secret"
AWS_REGION="us-east-1"
S3_BUCKET_NAME="your-bucket-name"
INNGEST_EVENT_KEY="your-inngest-key"
INNGEST_SIGNING_KEY="your-inngest-signing-key"
```

#### Backend (Modal Secrets)
```env
S3_BUCKET_NAME="your-bucket-name"
AWS_ACCESS_KEY_ID="your-aws-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret"
AWS_DEFAULT_REGION="us-east-1"
```

### Installation

#### Frontend
```bash
cd frontend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

#### Backend
```bash
cd backend
pip install -r requirements.txt
modal setup  # Configure Modal CLI
modal deploy main.py  # Deploy to Modal
```

## 📊 Database Schema

### Core Tables
- **Users**: Authentication and credit management
- **Songs**: Generated music tracks with metadata
- **Categories**: Music genre/style categorization
- **Sessions**: User authentication sessions

### Key Relationships
- Users have many Songs (1:N)
- Songs have many Categories (N:M)
- Songs track generation status and S3 locations

## 🎯 API Endpoints

### Modal Endpoints
- `POST /generate_from_description`: Generate from full song description
- `POST /generate_with_lyrics`: Generate with custom lyrics and prompt
- `POST /generate_with_described_lyrics`: Generate with described lyrics

### Frontend API Routes
- `POST /api/inngest`: Inngest webhook handler
- Server actions for song generation and playback

## 🔧 Key Technologies

### Backend
- **Modal**: Serverless GPU deployment
- **FastAPI**: API framework
- **PyTorch**: Deep learning framework
- **Transformers**: Hugging Face model library
- **Diffusers**: Stable Diffusion pipeline
- **Boto3**: AWS SDK

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Radix UI**: Component library
- **Prisma**: Database ORM
- **Inngest**: Queue management
- **Zustand**: State management

## 🚀 Deployment

### Modal Deployment
```bash
modal deploy backend/main.py
```

### Frontend Deployment
Deploy to Vercel, Netlify, or similar platforms with environment variables configured.

## 📈 Performance Considerations

- **GPU Optimization**: Models use bfloat16 precision for faster inference
- **Caching**: Hugging Face models cached in Modal volumes
- **Queue Management**: Prevents GPU resource conflicts
- **S3 Integration**: Offloads storage from application servers

## 🔒 Security Features

- **Authentication**: Secure user sessions with Better Auth
- **API Keys**: Protected Modal endpoints with API key authentication
- **Pre-signed URLs**: Time-limited S3 access
- **Input Validation**: Pydantic models for request validation

## 🎨 Music Generation Modes

1. **Full Description**: Generate from complete song description
2. **Custom Mode**: Provide both prompt and custom lyrics
3. **Described Lyrics**: Provide prompt and describe desired lyrics

## 📝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [ACE-Step](https://github.com/ace-step/ACE-Step) for the music generation model
- [Qwen](https://huggingface.co/Qwen/Qwen2-7B-Instruct) for lyrics generation
- [Stability AI](https://huggingface.co/stabilityai/sdxl-turbo) for image generation
- Modal for serverless GPU infrastructure
- Inngest for reliable queue management

---

Built with ❤️ using cutting-edge AI and modern web technologies.
