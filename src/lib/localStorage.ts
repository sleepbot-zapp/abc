// Local storage utilities for Architect's Society
export interface User {
  id: string;
  username: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  profession?: string;
  experience_years?: number;
  created_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  content: string;
  image_url?: string;
  category: 'feed' | 'suggestion' | 'improvement' | 'question';
  tags?: string[];
  created_at: string;
  updated_at: string;
  likes: string[]; // Array of user IDs who liked
  comments: Comment[];
}

export interface Comment {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  created_by: string;
  created_at: string;
  members: string[]; // Array of user IDs
  category: string;
}

export interface Game {
  id: string;
  name: string;
  description: string;
  icon_name: string;
  plays_count: number;
  high_scores: GameScore[];
  created_at: string;
}

export interface GameScore {
  id: string;
  user_id: string;
  score: number;
  created_at: string;
}

// Storage keys
const STORAGE_KEYS = {
  USERS: 'architect_society_users',
  POSTS: 'architect_society_posts',
  COMMUNITIES: 'architect_society_communities',
  GAMES: 'architect_society_games',
  CURRENT_USER: 'architect_society_current_user'
};

// Generic storage functions
const getFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage for key ${key}:`, error);
    return defaultValue;
  }
};

const saveToStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to localStorage for key ${key}:`, error);
  }
};

// User management
export const getCurrentUser = (): User | null => {
  return getFromStorage<User | null>(STORAGE_KEYS.CURRENT_USER, null);
};

export const setCurrentUser = (user: User | null): void => {
  saveToStorage(STORAGE_KEYS.CURRENT_USER, user);
};

export const getUsers = (): User[] => {
  return getFromStorage<User[]>(STORAGE_KEYS.USERS, []);
};

export const saveUser = (user: User): void => {
  const users = getUsers();
  const existingIndex = users.findIndex(u => u.id === user.id);
  
  if (existingIndex >= 0) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }
  
  saveToStorage(STORAGE_KEYS.USERS, users);
};

export const createUser = (userData: Omit<User, 'id' | 'created_at'>): User => {
  const user: User = {
    ...userData,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString()
  };
  
  saveUser(user);
  return user;
};

export const signIn = (email: string, password: string): User | null => {
  const users = getUsers();
  const user = users.find(u => u.email === email);
  
  if (user) {
    setCurrentUser(user);
    return user;
  }
  
  return null;
};

export const signOut = (): void => {
  setCurrentUser(null);
};

// Posts management
export const getPosts = (): Post[] => {
  return getFromStorage<Post[]>(STORAGE_KEYS.POSTS, []);
};

export const savePosts = (posts: Post[]): void => {
  saveToStorage(STORAGE_KEYS.POSTS, posts);
};

export const createPost = (postData: Omit<Post, 'id' | 'created_at' | 'updated_at' | 'likes' | 'comments'>): Post => {
  const posts = getPosts();
  const post: Post = {
    ...postData,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    likes: [],
    comments: []
  };
  
  posts.unshift(post);
  savePosts(posts);
  return post;
};

export const toggleLike = (postId: string, userId: string): void => {
  const posts = getPosts();
  const postIndex = posts.findIndex(p => p.id === postId);
  
  if (postIndex >= 0) {
    const post = posts[postIndex];
    const likeIndex = post.likes.indexOf(userId);
    
    if (likeIndex >= 0) {
      post.likes.splice(likeIndex, 1);
    } else {
      post.likes.push(userId);
    }
    
    post.updated_at = new Date().toISOString();
    savePosts(posts);
  }
};

export const addComment = (postId: string, userId: string, content: string): void => {
  const posts = getPosts();
  const postIndex = posts.findIndex(p => p.id === postId);
  
  if (postIndex >= 0) {
    const comment: Comment = {
      id: crypto.randomUUID(),
      user_id: userId,
      content,
      created_at: new Date().toISOString()
    };
    
    posts[postIndex].comments.push(comment);
    posts[postIndex].updated_at = new Date().toISOString();
    savePosts(posts);
  }
};

// Communities management
export const getCommunities = (): Community[] => {
  return getFromStorage<Community[]>(STORAGE_KEYS.COMMUNITIES, []);
};

export const saveCommunities = (communities: Community[]): void => {
  saveToStorage(STORAGE_KEYS.COMMUNITIES, communities);
};

export const createCommunity = (communityData: Omit<Community, 'id' | 'created_at' | 'members'>): Community => {
  const communities = getCommunities();
  const community: Community = {
    ...communityData,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    members: [communityData.created_by]
  };
  
  communities.push(community);
  saveCommunities(communities);
  return community;
};

export const joinCommunity = (communityId: string, userId: string): void => {
  const communities = getCommunities();
  const communityIndex = communities.findIndex(c => c.id === communityId);
  
  if (communityIndex >= 0 && !communities[communityIndex].members.includes(userId)) {
    communities[communityIndex].members.push(userId);
    saveCommunities(communities);
  }
};

// Games management
export const getGames = (): Game[] => {
  return getFromStorage<Game[]>(STORAGE_KEYS.GAMES, []);
};

export const saveGames = (games: Game[]): void => {
  saveToStorage(STORAGE_KEYS.GAMES, games);
};

export const incrementGamePlays = (gameId: string): void => {
  const games = getGames();
  const gameIndex = games.findIndex(g => g.id === gameId);
  
  if (gameIndex >= 0) {
    games[gameIndex].plays_count += 1;
    saveGames(games);
  }
};

export const addGameScore = (gameId: string, userId: string, score: number): void => {
  const games = getGames();
  const gameIndex = games.findIndex(g => g.id === gameId);
  
  if (gameIndex >= 0) {
    const gameScore: GameScore = {
      id: crypto.randomUUID(),
      user_id: userId,
      score,
      created_at: new Date().toISOString()
    };
    
    games[gameIndex].high_scores.push(gameScore);
    games[gameIndex].high_scores.sort((a, b) => b.score - a.score);
    games[gameIndex].high_scores = games[gameIndex].high_scores.slice(0, 10); // Keep top 10
    saveGames(games);
  }
};

// Initialize default data
export const initializeDefaultData = (): void => {
  // Initialize default communities if none exist
  if (getCommunities().length === 0) {
    const defaultCommunities = [
      {
        name: "Sustainable Architecture",
        description: "Discussing eco-friendly and sustainable building practices",
        category: "Environment",
        created_by: "system"
      },
      {
        name: "Urban Planning",
        description: "City design, zoning, and urban development strategies",
        category: "Planning",
        created_by: "system"
      },
      {
        name: "Modern Design Trends",
        description: "Latest trends in contemporary architecture and design",
        category: "Design",
        created_by: "system"
      }
    ];

    defaultCommunities.forEach(community => createCommunity(community));
  }

  // Initialize default games if none exist
  if (getGames().length === 0) {
    const defaultGames: Omit<Game, 'id' | 'created_at'>[] = [
      {
        name: "Blueprint Challenge",
        description: "Test your architectural knowledge with design challenges",
        icon_name: "target",
        plays_count: 0,
        high_scores: []
      },
      {
        name: "Structure Builder",
        description: "Build stable structures with limited materials",
        icon_name: "zap",
        plays_count: 0,
        high_scores: []
      },
      {
        name: "Design Quiz",
        description: "Quiz on architectural history and famous buildings",
        icon_name: "trophy",
        plays_count: 0,
        high_scores: []
      }
    ];

    const games = defaultGames.map(game => ({
      ...game,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString()
    }));

    saveGames(games);
  }
};