import { NextResponse } from 'next/server';

export interface CommunityComment {
  id: string;
  authorName: string;
  authorRole?: string;
  text: string;
  createdAt: string;
}

export interface CommunityPost {
  id: string;
  author: {
    id: string;
    name: string;
    role: string;
    city: string;
    avatarUrl?: string;
  };
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  likes: string[]; // user IDs or identifiers
  comments: CommunityComment[];
  createdAt: string;
}

// In-memory persistent store for development/runtime
let communityPosts: CommunityPost[] = [
  {
    id: 'post-1',
    author: {
      id: 'usr-1',
      name: 'विकास शुक्ला',
      role: 'नागरिक पत्रकार',
      city: 'सुल्तानपुर',
    },
    content: 'सुल्तानपुर-कुड़वार मुख्य मार्ग पर आज स्थानीय प्रशासन द्वारा जलभराव की समस्या का निरीक्षण किया गया। उम्मीद है इस सप्ताह में नाला सफाई का कार्य पूरा कर लिया जाएगा।',
    likes: ['usr-2', 'usr-3', 'usr-kanika'],
    comments: [
      {
        id: 'c-1',
        authorName: 'अमित कुमार सिंह',
        authorRole: 'सामान्य पाठक',
        text: 'बहुत सराहनीय रिपोर्ट। बरसात के समय यह समस्या बहुत गंभीर हो जाती है।',
        createdAt: '30 Sep 2026, 04:30 PM'
      }
    ],
    createdAt: '30 Sep 2026, 02:15 PM'
  },
  {
    id: 'post-2',
    author: {
      id: 'usr-2',
      name: 'मो० रिज़वान खान',
      role: 'नागरिक पत्रकार',
      city: 'लखनऊ',
    },
    content: 'हज़रतगंज और विधान सभा मार्ग पर आज शाम यातायात व्यवस्था सुगम रही। स्वर्णिम दस्तावेज़ के सभी साथी पत्रकारों को नमस्कार! आप सभी अपने ज़िले की ताज़ा अपडेट ज़रूर साझा करें।',
    likes: ['usr-1', 'usr-kanika'],
    comments: [],
    createdAt: '30 Sep 2026, 06:00 PM'
  },
  {
    id: 'post-3',
    author: {
      id: 'usr-3',
      name: 'कनिका अग्रवाल',
      role: 'नागरिक पत्रकार',
      city: 'सुल्तानपुर',
    },
    content: 'हरिद्वार महाकुंभ और गंगा आरती के विशेष दर्शन की ग्राउंड रिपोर्ट तैयार कर रही हूँ। संपादक जी के सुझाव अनुसार और तथ्य जोड़े जा रहे हैं।',
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
    likes: ['usr-1', 'usr-2'],
    comments: [
      {
        id: 'c-2',
        authorName: 'विकास शुक्ला',
        authorRole: 'नागरिक पत्रकार',
        text: 'शानदार पहल कनिका जी, हम सभी को आपकी रिपोर्ट का इंतज़ार रहेगा।',
        createdAt: '30 Sep 2026, 07:10 PM'
      }
    ],
    createdAt: '30 Sep 2026, 06:45 PM'
  }
];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: communityPosts
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    // 1. Toggle Like
    if (action === 'like') {
      const { postId, userId } = body;
      if (!postId || !userId) {
        return NextResponse.json({ success: false, message: 'Invalid data' }, { status: 400 });
      }

      const post = communityPosts.find((p) => p.id === postId);
      if (!post) {
        return NextResponse.json({ success: false, message: 'Post not found' }, { status: 404 });
      }

      const idx = post.likes.indexOf(userId);
      if (idx > -1) {
        post.likes.splice(idx, 1);
      } else {
        post.likes.push(userId);
      }

      return NextResponse.json({ success: true, data: post });
    }

    // 2. Add Comment
    if (action === 'comment') {
      const { postId, authorName, authorRole, text } = body;
      if (!postId || !authorName || !text?.trim()) {
        return NextResponse.json({ success: false, message: 'Invalid comment data' }, { status: 400 });
      }

      const post = communityPosts.find((p) => p.id === postId);
      if (!post) {
        return NextResponse.json({ success: false, message: 'Post not found' }, { status: 404 });
      }

      const newComment: CommunityComment = {
        id: `c-${Date.now()}`,
        authorName: authorName.trim(),
        authorRole: authorRole || 'नागरिक पत्रकार',
        text: text.trim(),
        createdAt: 'अभी (Just now)'
      };

      post.comments.push(newComment);
      return NextResponse.json({ success: true, data: post });
    }

    // 3. Create New Post
    const { author, content, imageUrl, videoUrl } = body;
    if (!content?.trim()) {
      return NextResponse.json({ success: false, message: 'पोस्ट सामग्री अनिवार्य है' }, { status: 400 });
    }

    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      author: {
        id: author?.id || `usr-${Date.now()}`,
        name: author?.name || 'नागरिक पत्रकार',
        role: author?.role || 'नागरिक पत्रकार',
        city: author?.city || 'उत्तर प्रदेश',
        avatarUrl: author?.avatarUrl
      },
      content: content.trim(),
      imageUrl: imageUrl || undefined,
      videoUrl: videoUrl || undefined,
      likes: [],
      comments: [],
      createdAt: 'अभी (Just now)'
    };

    communityPosts.unshift(newPost);
    return NextResponse.json({ success: true, data: newPost });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || 'Error processing request' }, { status: 500 });
  }
}
