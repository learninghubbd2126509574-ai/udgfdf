/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  category: string;
}

export interface YouTubeResponse {
  videos: YouTubeVideo[];
  nextPageToken?: string;
}

const API_KEY = (import.meta as any).env.VITE_YOUTUBE_API_KEY;
const CHANNEL_ID = (import.meta as any).env.VITE_YOUTUBE_CHANNEL_ID;

export async function fetchChannelVideos(pageToken?: string): Promise<YouTubeResponse> {
  if (!API_KEY || !CHANNEL_ID) {
    console.warn('YouTube API Key or Channel ID missing. Using mock data for development.');
    return { videos: getMockVideos() };
  }

  try {
    const url = new URL('https://www.googleapis.com/youtube/v3/search');
    url.searchParams.append('key', API_KEY);
    url.searchParams.append('channelId', CHANNEL_ID);
    url.searchParams.append('part', 'snippet,id');
    url.searchParams.append('order', 'date');
    url.searchParams.append('maxResults', '12');
    url.searchParams.append('type', 'video');
    if (pageToken) {
      url.searchParams.append('pageToken', pageToken);
    }

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error('Failed to fetch videos from YouTube');
    }

    const data = await response.json();
    const videos = data.items.map((item: any) => {
      const title = item.snippet.title.toLowerCase();
      let category = 'General';
      if (title.includes('video')) category = 'Video Editing';
      else if (title.includes('design') || title.includes('photo')) category = 'Photo Editing';
      else if (title.includes('data') || title.includes('entry')) category = 'Data Entry';
      else if (title.includes('marketing')) category = 'Digital Marketing';
      else if (title.includes('financial') || title.includes('trading')) category = 'Finance';

      return {
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high.url,
        publishedAt: item.snippet.publishedAt,
        category,
      };
    });

    return {
      videos,
      nextPageToken: data.nextPageToken,
    };
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    return { videos: getMockVideos() };
  }
}

function getMockVideos(): YouTubeVideo[] {
  const videoIds = [
    { id: 'v3Rje3agun8', title: 'Unity Earning: Introduction to E-learning', category: 'General' },
    { id: 'R1a7cDaunPw', title: 'Advanced Video Editing Tutorial', category: 'Video Editing' },
    { id: 'GbNmCMCxFsg', title: 'Photo Editing Masterclass', category: 'Photo Editing' },
    { id: 'IXK9Xka_3Jo', title: 'Data Entry Automation Guide', category: 'Data Entry' },
    { id: '8R1UOTW87w4', title: 'Digital Marketing Strategies 2024', category: 'Digital Marketing' },
    { id: 'Mk1pVU1kqio', title: 'Financial Management for Beginners', category: 'Finance' },
    { id: 'vpfZyQJ3HLk', title: 'Professional Video Transitions', category: 'Video Editing' },
    { id: 'p5JoTW0GobQ', title: 'Adobe Photoshop Advanced Tips', category: 'Photo Editing' },
    { id: 'XMgRyYuLhJg', title: 'Excel Data Entry Shortcuts', category: 'Data Entry' },
    { id: '7lztlObR1no', title: 'Social Media Marketing Growth', category: 'Digital Marketing' },
    { id: 'ov68fxZNdqg', title: 'Stock Market Trading Basics', category: 'Finance' },
    { id: 'Iw5_ZPrjGx4', title: 'Premiere Pro Color Grading', category: 'Video Editing' },
    { id: 'bRt5d3H9mjQ', title: 'Lightroom Photo Retouching', category: 'Photo Editing' },
    { id: 'LyYC9BVKkvw', title: 'Database Management Basics', category: 'Data Entry' },
    { id: 'CpQFpVB93tw', title: 'SEO Optimization for Beginners', category: 'Digital Marketing' },
    { id: 'CS4kPOhVr5M', title: 'Investment Planning 101', category: 'Finance' },
    { id: 'vLBXkbNWQcQ', title: 'After Effects Motion Graphics', category: 'Video Editing' },
    { id: 'EXSfoRuheJA', title: 'Graphic Design Theory', category: 'Photo Editing' },
  ];

  return videoIds.map((v, i) => ({
    id: v.id,
    title: v.title,
    description: `This is a comprehensive tutorial on ${v.title.toLowerCase()} provided by Unity Earning E-learning Platform.`,
    thumbnail: `https://img.youtube.com/vi/${v.id}/hqdefault.jpg`,
    publishedAt: new Date(Date.now() - i * 86400000).toISOString(),
    category: v.category,
  }));
}
